<template>
  <div>
    <q-btn-toggle
      :toggle-text-color="isHeadline ? 'primary' : 'white'"
      :toggle-color="isHeadline ? 'white' : 'primary'"
      :value="$store.state.buoyancy.salinity"
      @input="setSalinity"
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
    setSalinity(salinity) {
      this.$store.dispatch('buoyancy/updateSalinity', salinity);
    },
  },
  computed: {
    options() {
      return [
        {
          label: 'Fresh water',
          value: 'fresh',
        },
        {
          label: 'Salt water',
          value: 'salt',
        },
      ];
    },
  },
};
</script>
