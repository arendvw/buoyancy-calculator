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
    <div class="input-row" v-if="!$store.state.buoyancy.isMetric">
      <input-spinner
        label="Empty weight"
        :dense="dense"
        class="max-width-300"
        :value="tank.weight"
        @input="setWeight(index, $event)"
        converter="weight"
        :decimals="1"
        :step="1/$units.poundsToKg"
        suffix="lbs"
        :minimum="0"
      ></input-spinner>
    </div>
    <div class="input-row" v-if="$store.state.buoyancy.isMetric">
      <input-spinner
          label="Water capacity"
          :dense="dense"
          class="max-width-300"
          :value="tank.volume"
          @input="setVolume(index, $event)"
          :decimals="1"
          suffix="ℓ"
          :minimum="0"
          :hint="waterCapacityHint(tank.volume)"
      />
    </div>
    <div class="input-row" v-if="!$store.state.buoyancy.isMetric">
      <input-spinner
        label="Working pressure"
        :dense="dense"
        class="max-width-300"
        :value="tank.workingPressure"
        @input="setWorkingPressureAndVolume(index, $event)"
        :decimals="0"
        :step="100/$units.psiToBar"
        suffix="psi"
        :minimum="0"
        converter="pressure"
      ></input-spinner>
    </div>
    <div class="input-row" v-if="!$store.state.buoyancy.isMetric">
      <input-spinner
        label="Air capacity"
        :dense="dense"
        class="max-width-300"
        :value="airCapacityCuft"
        @input="setVolumeFromAirCapacity(index, $event)"
        :decimals="1"
        suffix="cuft"
        :minimum="0"
      />
    </div>

    <div class="input-row" v-if="$store.state.buoyancy.isMetric">
      <input-spinner
        label="Empty weight"
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

    <div class="input-row" v-if="$store.state.buoyancy.isMetric">
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
    <div class="input-row" v-if="!$store.state.buoyancy.isMetric">
      <input-spinner
        label="Water capacity"
        :dense="dense"
        class="max-width-300"
        :value="tank.volume"
        @input="setVolume(index, $event)"
        :decimals="1"
        suffix="ℓ"
        :minimum="0"
        :hint="waterCapacityHint(tank.volume)"
      />
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
          :option-disable="opt => opt.disabled"
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
import * as units from 'src/units';

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
    setVolumeFromAirCapacity(idx, value) {
      const capacityLitersAtSurface = parseFloat(value) * this.$units.cuftToLiter * this.$units.barToAtmosphere;
      // if you update the air capacity: only change the water volume, keep the working pressure constant
      const newVolume = (capacityLitersAtSurface / this.tank.workingPressure);
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        volume: newVolume,
      });
    },
    setWorkingPressureAndVolume(idx, value) {
      // if you update the air capacity: only change the water volume, keep the working pressure and total volume constant
      const newWorkingPressure = parseFloat(value);
      const currentAirCapacityLiters = math.CalculateTankFreeLiters(this.tank);
      const newWaterVolume = currentAirCapacityLiters / newWorkingPressure;

      if (newWaterVolume < 0.01) {
        return;
      }
      this.$store.dispatch('buoyancy/updateTank', {
        index: idx,
        workingPressure: newWorkingPressure,
        volume: newWaterVolume,
      });
    },
    waterCapacityHint(value) {
      if (this.$store.state.buoyancy.isMetric) {
        return undefined;
      }
      return `≈ ${Math.round(value / units.cuinToLiter)} cu inch, ≈ ${(value / units.lbsToLiter).toFixed(1)} lbs`;
    },
  },
  computed: {
    airCapacityCuft() {
      return this.$math.CalculateTankFreeLiters(this.tank) / this.$units.cuftToLiter;
    },
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
      const groups = {
        common: 'Common',
        trimix: 'Trimix',
      };
      const output = [];
      Object.keys(groups).forEach((group) => {
        if (group !== 'common') {
          output.push({
            label: groups[group],
            disabled: true,
          });
        }
        Object.keys(math.GasMixtures).forEach((key) => {
          if (math.GasMixtures[key].group !== group) {
            return;
          }
          output.push({
            label: math.GetGasLabel(key),
            value: key,
          });
        });
      });
      return output;
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
