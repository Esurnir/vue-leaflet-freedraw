declare module '@vue-leaflet/vue-leaflet' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  type VueComponent = DefineComponent<{}, {}, any>;
  export const LMap: VueComponent;
  export const LTileLayer: VueComponent;
  export const LControl: VueComponent;
}
