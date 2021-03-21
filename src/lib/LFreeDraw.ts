import { defineComponent, h, ref } from 'vue';

import {
  props as freeDrawProps,
  setup as freeDrawSetup,
} from './freedraw-functions';
import type FreeDraw from 'leaflet-freedraw';

export default defineComponent({
  name: 'LFreeDraw',
  props: freeDrawProps,
  setup(props, context) {
    const freeDrawRef = ref<FreeDraw>();
    return freeDrawSetup(props, freeDrawRef, context);
  },
  render() {
    return h('div');
  },
});
