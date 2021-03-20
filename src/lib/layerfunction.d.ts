declare module '@vue-leaflet/vue-leaflet/src/functions/layer' {
  import type { Ref, SetupContext } from 'vue';
  interface LayerPropsDefinition {
    options: {
      type: typeof Object;
      default: () => Record<string, unknown>;
    };
    pane: {
      type: typeof String;
      default: 'overlayPane';
    };
    attribution: {
      type: typeof String;
      default: null;
    };
    name: {
      type: typeof String;
      custom: true;
      default: undefined;
    };
    layerType: {
      type: typeof String;
      custom: true;
      default: undefined;
    };
    visible: {
      type: typeof Boolean;
      custom: true;
      default: true;
    };
  }
  export interface LayerProps {
    options: Record<string, unknown>;
    pane: string;
    attribution: string | null;
    name?: string;
    layerType?: string;
    visible: boolean;
  }

  export const props: LayerPropsDefinition;

  interface LayerSetupReturn {
    options: Record<string, unknown>;
    methods: Record<string, (...args: unknown[]) => void>;
  }

  type LayerSetup = (
    props: LayerProps,
    leafletRef: Ref<unknown>,
    context: SetupContext,
  ) => LayerSetupReturn;
  export const setup: LayerSetup;
}
