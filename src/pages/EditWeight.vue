<template>
  <q-card-section class="weight-card" v-if="weightItem !== undefined">
    <div class="input-row">
      <q-input
        filled
        label="Name"
        :dense="dense"
        :value="weightItem.name"
        @input="setName(index, $event)"
        ></q-input>
    </div>
    <div class="input-row">
      <input-spinner
        label="Weight"
        :dense="dense"
        :value="weightItem.weight"
        @input="setFromWeight(index, $event)"
        :decimals="1"
        :step="0.5"
        suffix="kg"
        :minimum="0"
      ></input-spinner>
    </div>
    <div class="input-row q-mt-lg">
      <input-select
        label="Buoyancy"
        :options="[
          {
            label: 'Calculate from material',
            value: 'material'
          },
          {
            label: 'Calculate from density',
            value: 'density',
          },
          {
            label: 'Calculate from Volume',
            value: 'volume',
          },
          {
            label: 'Calculate from buoyancy',
            value: 'buoyancy',
          },
        ]"
        map-options
        emit-value
        :dense="dense"
        :value="weightItem.mode"
        @input="setMode(index, $event)"
      >
      </input-select>
    </div>
    <q-tabs
      v-if="false"
      :value="weightItem.mode"
      @input="setMode(index, $event)"
      dense
      class="text-grey q-mt-md"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="material" label="Material" />
      <q-tab name="density" label="Density" />
      <q-tab name="volume" label="Volume" />
      <q-tab name="buoyancy" label="Buoyancy" />
    </q-tabs>
    <div class="input-row" v-if="weightItem.mode === 'volume'">
      <input-spinner
        label="Volume"
        :dense="dense"
        :value="weightItem.volume"
        @input="setFromVolume(index, $event)"
        :decimals="1"
        suffix="ℓ"
        :minimum="0.01"
        :step="0.1"
      />
    </div>
    <div class="input-row" v-if="weightItem.mode === 'material'">
      <q-select
        label="Material"
        :dense="dense"
          filled
          @input="setFromMaterial(index, $event.value)"
          :value="weightItem.material"
          :options="materialOptions"
          map-options
      />
    </div>
    <div class="input-row" v-if="weightItem.mode === 'density'">
      <input-spinner
        label="Density"
        :dense="dense"
        :value="weightItem.density"
        @input="setFromDensity(index, $event)"
        :decimals="2"
        :step="0.1"
        suffix="kg/ℓ"
        :minimum="0.1"
        :maximum="25"
      />
    </div>
    <div class="input-row" v-if="weightItem.mode === 'buoyancy'
      && $store.state.buoyancy.salinity === 'fresh'">
      <input-spinner
        label="Buoyancy (fresh water)"
        :dense="dense"
        :value="weightItem.buoyancyFreshWater"
        @input="setFromBuoyancy(index, $event, true)"
        :step="0.1"
        :decimals="1"
        suffix="kg"
        :minimum="-weightItem.weight+0.1"
      />
    </div>
    <div class="input-row" v-if="$store.state.buoyancy.salinity === 'salt'">
      <input-spinner
        label="Buoyancy (salt water)"
        :dense="dense"
        :value="weightItem.buoyancySaltWater"
        @input="setFromBuoyancy(index, $event, false)"
        :step="0.1"
        :decimals="1"
        suffix="kg"
        :minimum="-weightItem.weight+0.1"
      />
    </div>
    <q-markup-table flat class="q-mt-sm" wrap-cells>
      <tbody>
      <tr v-if="weightItem.mode === 'buoyancy'">
        <td colspan="2">
          Positive buoyancy floats, negative buoyancy sinks
        </td>
      <tr v-if="weightItem.mode !== 'buoyancy' && $store.state.buoyancy.salinity === 'salt'">
        <td>Buoyancy (salt water)</td>
        <td><buoyancy :buoyancy="weightItem.buoyancySaltWater" /></td></tr>
      <tr v-if="weightItem.mode !== 'buoyancy' && $store.state.buoyancy.salinity === 'fresh'">
        <td>Buoyancy (fresh water)</td>
        <td><buoyancy :buoyancy="weightItem.buoyancyFreshWater" /></td></tr>
      </tbody>
    </q-markup-table>
  </q-card-section>
</template>
<script>
import InputSpinner from 'components/InputSpinner';
import * as math from 'src/math';
import Buoyancy from 'components/Buoyancy';
import InputSelect from 'components/InputSelect';

export default {
  components: { InputSelect, Buoyancy, InputSpinner },
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
    setFromMaterial(index, materialName) {
      const { density } = math.WeightItemMaterials[materialName];
      const { weight } = this.weightItem;
      let obj = {
        index,
        weight,
        density,
        mode: 'material',
        volume: weight / density,
        material: materialName,
      };
      obj = this.updateBuoyancyCalculation(obj);
      this.$store.dispatch('buoyancy/updateWeightItem', obj);
    },
    updateBuoyancyCalculation(obj) {
      obj.buoyancyFreshWater = math.CalculateUnderwaterWeight(
        obj.weight,
        obj.volume,
        math.DensityFreshWater,
      );
      obj.buoyancySaltWater = math.CalculateUnderwaterWeight(
        obj.weight,
        obj.volume,
        math.DensitySaltwater,
      );
      return obj;
    },
    setFromDensity(index, density) {
      const { weight } = this.weightItem;
      let obj = {
        index,
        weight,
        density: parseFloat(density.toFixed(2)),
        mode: 'density',
        material: 'custom',
      };
      obj.volume = obj.weight / obj.density;
      obj = this.updateBuoyancyCalculation(obj);
      this.$store.dispatch('buoyancy/updateWeightItem', obj);
    },
    setFromVolume(index, volume) {
      const { weight } = this.weightItem;
      let obj = {
        index,
        weight,
        volume,
        mode: 'volume',
        material: 'custom',
      };
      obj.density = obj.weight / obj.volume;
      obj = this.updateBuoyancyCalculation(obj);
      this.$store.dispatch('buoyancy/updateWeightItem', obj);
    },
    setFromBuoyancy(index, buoyancy, isFresh) {
      const { weight } = this.weightItem;
      const volume = math.CalculateVolume(weight, -buoyancy,
        isFresh ? math.DensityFreshWater : math.DensitySaltwater);
      const obj = {
        index,
        weight,
        volume,
        mode: 'buoyancy',
        material: 'custom',
      };
      obj.density = obj.weight / obj.volume;
      if (isFresh) {
        obj.buoyancySaltWater = math.CalculateUnderwaterWeight(
          obj.weight,
          obj.volume,
          math.DensitySaltwater,
        );
        obj.buoyancyFreshWater = buoyancy;
      } else {
        obj.buoyancyFreshWater = math.CalculateUnderwaterWeight(
          obj.weight,
          obj.volume,
          math.DensityFreshWater,
        );
        obj.buoyancySaltWater = buoyancy;
      }
      this.$store.dispatch('buoyancy/updateWeightItem', obj);
    },
    setFromWeight(index, weight) {
      if (this.weightItem.mode === 'material' || this.weightItem.mode === 'density') {
        let obj = {
          index,
          weight,
          density: this.weightItem.density,
          volume: weight / this.weightItem.density,
        };
        obj = this.updateBuoyancyCalculation(obj);
        this.$store.dispatch('buoyancy/updateWeightItem', obj);
      }
      if (this.weightItem.mode === 'volume') {
        let obj = {
          index,
          weight,
          density: weight / this.weightItem.volume,
          volume: this.weightItem.volume,
        };
        obj = this.updateBuoyancyCalculation(obj);
        this.$store.dispatch('buoyancy/updateWeightItem', obj);
      }
      if (this.weightItem.mode === 'buoyancy') {
        const obj = {
          index,
          weight,
        };
        if (this.$store.state.buoyancy.salinity === 'fresh') {
          const buoyancyFresh = Math.max(-weight + 0.1, this.weightItem.buoyancyFreshWater);
          obj.volume = math.CalculateVolume(weight,
            -buoyancyFresh,
            math.DensityFreshWater);
          obj.buoyancySaltWater = math.CalculateUnderwaterWeight(
            obj.weight,
            obj.volume,
            math.DensitySaltwater,
          );
          obj.density = obj.weight / obj.volume;
          obj.buoyancyFreshWater = buoyancyFresh;
          this.$store.dispatch('buoyancy/updateWeightItem', obj);
        } else {
          const buoyancySalt = Math.max(-weight + 0.1, this.weightItem.buoyancySaltWater);
          obj.volume = math.CalculateVolume(weight,
            -buoyancySalt,
            math.DensitySaltwater);
          obj.buoyancyFreshWater = math.CalculateUnderwaterWeight(
            obj.weight,
            obj.volume,
            math.DensityFreshWater,
          );
          obj.density = obj.weight / obj.volume;
          obj.buoyancySaltWater = buoyancySalt;
          this.$store.dispatch('buoyancy/updateWeightItem', obj);
        }
      }
    },
    setMaterial(idx, { value }) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index: idx,
        material: value,
      });
    },
    setVolume(idx, value) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index: idx,
        volume: parseFloat(value),
      });
    },
    setWeight(idx, value) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index: idx,
        weight: parseFloat(value),
      });
    },
    setName(idx, value) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index: idx,
        name: value,
      });
    },
    setMode(idx, value) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index: idx,
        mode: value,
      });
    },
  },
  computed: {
    weightItem() {
      return this.$store.state.buoyancy.weightItems[this.index];
    },
    materialOptions() {
      return Object.keys(math.WeightItemMaterials).map((key) => ({
        label: math.WeightItemMaterials[key].name,
        value: key,
      }));
    },
    gasses() {
      return Object.keys(math.GasMixtures).map((key) => ({
        label: math.GetGasLabel(key),
        value: key,
      }));
    },
  },
};
</script>
<style lang="scss">
.weight-card {
  .input-row {
    margin-top: 5px;
  }
}
</style>
