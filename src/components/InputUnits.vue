<template>
  <div>
    <q-btn-toggle
      :toggle-text-color="isHeadline ? 'grey-6' : 'white'"
      :toggle-color="isHeadline ? 'white' : 'grey-6'"
      :value="$store.state.buoyancy.isMetric"
      @input="setUnits"
      size="sm"
      :options="options"
    />
  </div>
</template>

<script>
export default {
  props: {
    isHeadline: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    setUnits(isMetric) {
      this.$store.dispatch('buoyancy/setPersonProperty', { isMetric });
    },
  },
  computed: {
    options() {
      return [
        {
          label: 'Metric',
          value: true,
        },
        {
          label: 'Imperial',
          value: false,
        },
      ];
    },
  },
};
</script>
