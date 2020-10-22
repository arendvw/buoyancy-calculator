<template>
  <div class="input-salinity">
    <q-btn-toggle
      toggle-text-color="primary"
      toggle-color="white"
      :value="$store.state.buoyancy.salinity"
      @input="setSalinity"
      size="sm"
      class="q-ml-lg"
      :options="options"
    />
  </div>
</template>

<script>
export default {
  methods: {
    setSalinity(salinity) {
      console.log(salinity);
      this.$store.dispatch('buoyancy/updateSalinity', salinity);
    },
  },
  computed: {
    options() {
      return [
        { label: 'Fresh water', value: 'fresh' },
        { label: 'Salt water', value: 'salt' },
      ];
    },
  },
};
</script>
