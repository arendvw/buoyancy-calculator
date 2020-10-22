<template>
  <q-card-section class="tank-card" v-if="tank !== undefined">
    <div class="input-row">
      <q-select
        label="Material"
        :dense="dense"
          class="max-width-300"
          filled
          @input="setMaterial(index, $event)"
          :value="tank.material"
          :options="materialOptions"
          map-options
      />
    </div>
    <div class="input-row">
      <input-spinner
          label="Volume"
          :dense="dense"
          class="max-width-300"
          :value="tank.volume"
          @input="setVolume(index, $event)"
          :decimals="1"
          suffix="ℓ"
          :minimum="0"
      />
    </div>
    <div class="input-row">
      <input-spinner
        label="Weight"
        :dense="dense"
          class="max-width-300"
          :value="tank.weight"
          @input="setWeight(index, $event)"
          :decimals="1"
          :step="0.5"
          suffix="kg"
          :minimum="0"
      ></input-spinner>
    </div>
    <div class="input-row">
      <input-spinner
          label="Working pressure"
          :dense="dense"
          class="max-width-300"
          :value="tank.workingPressure"
          @input="setWorkingPressure(index, $event)"
          :decimals="0"
          :step="10"
          suffix="bar"
          :minimum="0"
      ></input-spinner>
    </div>
    <div class="input-row">
      <q-select
        label="Gas mixture"
        class="max-width-300"
          :dense="dense"
          filled
          @input="setGas(index, $event)"
          :value="tank.gasMixture"
          :options="gasses"
          map-options
      />
    </div>
    <div class="input-row">
      <q-select
          label="Configuration"
          :dense="dense"
          class="max-width-300"
          filled
          @input="setIsDouble(index, $event)"
          :value="tank.isDouble"
          :options="doubleOptions"
          map-options
      />
    </div>
    <div class="input-row">
      <label class="first-column"> </label>
      <q-checkbox
          :value="tank.includeValve"
          @input="setIncludeValve(index, $event)"
          color="primary"
          :label="valveLabel(tank.isDouble)"
      />
    </div>
  </q-card-section>
</template>
<script>
import InputSpinner from 'components/InputSpinner';
import * as math from 'src/math';

export default {
  name: 'EditTank',
  components: { InputSpinner },
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  methods: {
    valveLabel(isDouble) {
      if (isDouble) {
        return `Include valves and manifold (${math.ManifoldWeight.toFixed(1)} kg steel)`;
      }
      return `Include valve (${math.ValveWeight.toFixed(1)} kg steel)`;
    },
    setMaterial(idx, { value }) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        material: value,
      });
    },
    setGas(idx, { value }) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        gasMixture: value,
      });
    },
    setVolume(idx, value) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        volume: parseFloat(value),
      });
    },
    setWeight(idx, value) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        weight: parseFloat(value),
      });
    },
    setWorkingPressure(idx, value) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        workingPressure: parseFloat(value),
        configuredPressure: parseFloat(value),
      });
    },
    setIsDouble(idx, { value }) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        isDouble: value,
      });
    },
    setIncludeValve(idx, value) {
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        includeValve: value,
      });
    },
  },
  computed: {
    tank() {
      return this.$store.state.buoyancy.tanks[this.index];
    },
    materialOptions() {
      return Object.keys(math.Materials).map((key) => ({
        label: math.Materials[key].name,
        value: key,
      }));
    },
    gasses() {
      return Object.keys(math.GasMixtures).map((key) => ({
        label: math.GetGasLabel(key),
        value: key,
      }));
    },
    doubleOptions() {
      return [
        {
          value: false,
          label: 'Single tank',
        },
        {
          value: true,
          label: 'Double tanks',
        },
      ];
    },
  },
};
</script>
<style lang="scss">
.tank-card {
  .input-row {
    margin-top: 5px;
  }
}
</style>
