<template>
  <span class="weight" v-if="isMetric">
    {{ Math.round(depth) }}&nbsp;m
  </span>
  <span class="weight" v-else>
    {{ Math.round(valueFeet) }}&nbsp;ft
  </span>
</template>

<script>
import * as units from '../units';

export default {
  props: {
    depth: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isMetric() {
      return this.$store.state.buoyancy.isMetric;
    },
    valueFeet() {
      return this.depth / units.feetToMeter;
    },
  },
};
</script>
