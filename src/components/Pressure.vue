<template>
  <span class="pressure" v-if="isMetric">
    {{ Math.round(pressure) }}&nbsp;bar
  </span>
  <span class="pressure" v-else>
    {{ Math.round(valuePsi)  }}&nbsp;psi
  </span>
</template>

<script>
import * as units from '../units';

export default {
  props: {
    pressure: {
      type: Number,
      required: true,
    },
  },
  computed: {
    isMetric() {
      return this.$store.state.buoyancy.isMetric;
    },
    valuePsi() {
      return this.pressure * units.psiToBar;
    },
  },
};
</script>
