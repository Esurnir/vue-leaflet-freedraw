import {
  props as layerProps,
  setup as layerSetup,
  LayerProps,
} from '@vue-leaflet/vue-leaflet/src/functions/layer';
import type { LatLng } from 'leaflet';
import {
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  Ref,
  SetupContext,
  watch,
} from 'vue';
import type FreeDraw from 'leaflet-freedraw';
import type { MarkerEvent } from 'leaflet-freedraw';
import { debounce, isEqual } from 'lodash-es';
import remapEvent from './utils';

const ALL = 15;

export const props = {
  ...layerProps,
  mode: {
    type: Number,
    default: ALL,
    validator: (value: number): boolean => value >= 0 && value < 16,
  },
  modelValue: {
    type: Array as PropType<LatLng[][]>,
    default: (): LatLng[][] => [],
  },
  debounce: {
    type: Boolean,
    default: true,
  },
};

interface FreeDrawProps extends LayerProps {
  mode: number;
  modelValue: LatLng[][];
  debounce: boolean;
}

export const setup = (
  props: FreeDrawProps,
  freeDrawRef: Ref<FreeDraw | undefined>,
  context: SetupContext,
): { leafletObject: Ref<FreeDraw | undefined>; ready: Ref<boolean> } => {
  const { methods: layerMethods } = layerSetup(props, freeDrawRef, context);
  const options = {
    ...props.options,
    mode: props.mode,
  };
  const ready = ref(false);
  const addLayer = inject('addLayer');

  let lastSetPolygons: LatLng[][] = [];
  watch(
    () => props.modelValue,
    (newPolygons) => {
      if (!newPolygons) {
        lastSetPolygons = [];
        if (freeDrawRef.value) {
          freeDrawRef.value.clear();
        }
      } else if (!isEqual(newPolygons, lastSetPolygons)) {
        lastSetPolygons = newPolygons;
        if (freeDrawRef.value) {
          freeDrawRef.value.clear();
          newPolygons.forEach((polygon) => {
            if (freeDrawRef.value) {
              freeDrawRef.value.create(polygon);
            }
          });
        }
      }
    },
  );
  watch(
    () => props.mode,
    (newMode) => {
      if (freeDrawRef.value) {
        freeDrawRef.value.mode(newMode);
      }
    },
  );

  function markerHandler(event: MarkerEvent) {
    const newPolygons = event.latLngs;
    if (!isEqual(lastSetPolygons, newPolygons)) {
      context.emit('update:modelValue', newPolygons);
      lastSetPolygons = newPolygons;
    }
  }

  watch(
    () => props.debounce,
    (newDebounce) => {
      if (freeDrawRef.value) {
        if (newDebounce) {
          freeDrawRef.value.off('markers');
          const debouncedHandler = debounce(markerHandler, 100);
          freeDrawRef.value.on('markers', debouncedHandler);
        } else {
          freeDrawRef.value.off('markers');
          freeDrawRef.value.on('markers', markerHandler);
        }
      }
    },
  );

  onMounted(async () => {
    const { freeDraw } = await import('leaflet-freedraw');
    const freeDrawInstance = freeDraw(options);
    if (props.modelValue) {
      props.modelValue.forEach((poly) => {
        freeDrawInstance.create(poly);
      });
    }
    if (props.debounce) {
      freeDrawInstance.on('markers', debounce(markerHandler, 100));
    } else {
      freeDrawInstance.on('markers', markerHandler);
    }
    const events = remapEvent(context.attrs);
    freeDrawInstance.on(events);
    freeDrawRef.value = freeDrawInstance;
    if (addLayer && typeof addLayer === 'function') {
      addLayer({
        ...props,
        ...layerMethods,
        leafletObject: freeDrawInstance,
      });
      nextTick(() => {
        context.emit('ready', freeDrawRef.value);
        ready.value = true;
      });
    }
  });

  onBeforeUnmount(() => {
    if (freeDrawRef.value) {
      freeDrawRef.value.off();
      freeDrawRef.value.off('markers');
      freeDrawRef.value.clear();
      freeDrawRef.value.mode(0);
      freeDrawRef.value.remove();
    }
  });

  return {
    leafletObject: freeDrawRef,
    ready,
  };
};
