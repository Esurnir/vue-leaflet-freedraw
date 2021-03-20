declare module '@vue-leaflet/vue-leaflet' {
  import { DefineComponent } from 'vue';
  type VueComponent = DefineComponent<{}, {}, any>;
  export const LMap: VueComponent;
  export const LTileLayer: VueComponent;
  export const LControl: VueComponent;
}
