<template>
  <l-map v-if="initialCoordinates" :center="initialCoordinates" :zoom="12">
    <l-control position="topleft">
      <button @click="flipActive">
        {{ isActive ? 'Deactivate' : 'Activate' }}
      </button>
      <button @click="hide = !hide">
        {{ hide ? 'Show' : 'Hide' }}
      </button>
    </l-control>
    <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
    <l-freedraw
      v-if="!hide"
      v-model="polygons"
      :mode="mode"
      @markers="markerHandler"
    />
  </l-map>
  <div v-else></div>
</template>

<script lang="ts">
import 'leaflet/dist/leaflet.css';
import { defineComponent, onBeforeMount, ref } from 'vue';
import { LMap, LTileLayer, LControl } from '@vue-leaflet/vue-leaflet';
import type { LatLng } from 'leaflet';
import LFreedraw from './lib/LFreeDraw';
import type { MarkerEvent } from 'leaflet-freedraw';

export default defineComponent({
  name: 'App',
  components: {
    LMap,
    LTileLayer,
    LControl,
    LFreedraw,
  },
  setup() {
    const initialCoordinates = ref<LatLng>();
    const polygons = ref<LatLng[][]>();
    const mode = ref<15 | 0>(0);
    onBeforeMount(async () => {
      const { latLng } = await import('leaflet/dist/leaflet-src.esm');
      initialCoordinates.value = latLng(48.8566, 2.3522);
    });
    const isActive = ref(false);
    function flipActive() {
      isActive.value = !isActive.value;
      if (isActive.value) {
        mode.value = 15;
      } else {
        mode.value = 0;
      }
    }

    const hide = ref(false);

    function markerHandler(markerEvent: MarkerEvent) {
      console.log(markerEvent.latLngs);
    }

    return {
      initialCoordinates,
      isActive,
      flipActive,
      polygons,
      mode,
      markerHandler,
      hide,
    };
  },
});
</script>

<style>
#app {
  position: absolute;
  height: 100%;
  width: 100%;
}
.map {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
