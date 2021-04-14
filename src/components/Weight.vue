<template>
  <span class="weight" v-if="isMetric">
    {{ weight.toFixed(1) }}&nbsp;kg
  </span>
  <span class="weight" v-else>
    {{ valuePounds.toFixed(1) }}&nbsp;lbs
  </span>
</template>

<script>
import * as units from '../units';

export default {
  props: {
    weight: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isMetric() {
      return this.$store.state.buoyancy.isMetric;
    },
    valuePounds() {
      return this.weight * units.poundsToKg;
    },
  },
};
</script>
