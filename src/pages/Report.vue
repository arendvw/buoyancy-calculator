<template>
  <q-page class="page-container">
    <div class="column-container">
      <div class="row q-mb-md flex justify-end" v-if="$q.screen.width <= 500">
        <input-salinity :is-headline="false"></input-salinity>
      </div>
        <div>

        <q-markup-table
          :dense="isDense"
          wrap-cells
          class="full-width report-table"
        >
          <thead>
          <tr>
            <th>Name</th>
            <th>Buoyancy</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr :class="{ rowDisabled: !$store.state.buoyancy.enabled }">
            <td>Personal buoyancy</td>
            <td  class="text-right" v-if="$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](true)"/>
            </td>
            <td  class="text-right" v-if="!$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](false)"/>
            </td>
            <td class="text-right"><q-toggle
              :value="$store.state.buoyancy.enabled"
              @input="enablePerson"
            /></td>
          </tr>
          <tr
            v-for="(suitItem, index) in suits"
            :key="'suit'+index"
            :class="{ rowDisabled: !suitItem.enabled }">
            <td>{{ suitItem.label }}</td>
            <td class="text-right">
              <buoyancy
                v-if="suitItem.enabled"
                :buoyancy="calculateSuitBuoyancy(suitItem)" /></td>
            <td class="text-right"><q-toggle
              :value="suitItem.enabled"
              @input="enableSuitItem(index, $event)"
            /></td>
          </tr>
          <tr
            v-for="(tank, index) in tanks"
            :key="'tank'+index"
            :class="{ rowDisabled: !tank.enabled }"
          >
            <td style="padding-top: 10px">
              <template v-if="$store.state.buoyancy.isMetric">
                {{ math.GetTankFullLabel(tank) }}, {{ math.GetGasLabel(tank.gasMixture) }}
              </template>
              <template v-else>
                {{ math.GetTankFullImperialLabel(tank) }}, {{ math.GetGasLabel(tank.gasMixture) }}
              </template>
              <div
                v-if="tank.enabled && !isVeryDense"
                class="q-mt-md" style="display: flex; justify-content: end">
                <input-spinner
                  style="min-width: 130px; max-width: 150px"
                  dense
                  :value="tank.configuredPressure"
                  :minimum="0"
                  @input="updateConfiguredPressure(index, $event)"
                  :suffix="pressureUnit"
                  :converter="pressureConverter"
                  :step="pressureStep"
                />
              </div>
              <div v-if="isDense && tank.enabled && false">
              <q-toggle
                v-if="isDense && tank.enabled"
                indeterminate-value="null"
                :value="getTankIsFull(tank)"
                @input="updateConfiguredPressureFromBoolean(index, tank, $event)"
                dense
                :label="getTankPressureLabel(tank)" />
              </div>
            </td>

            <td class="text-right"><buoyancy
              v-if="tank.enabled"
              :buoyancy="calculateTankBuoyancy(tank)" /></td>
            <td class="text-right"><q-toggle
              :value="tank.enabled"
              @input="enableTank(index, $event)"
            /></td>          </tr>
          <tr
            v-for="(weightItem, index) in weights"
            :class="{ rowDisabled: !weightItem.enabled }"
            :key="'weight'+index"
              style="cursor: pointer">
            <td>{{ weightItem.name }} ({{ weightItem.material }})
              <div
                v-if="weightItem.enabled && !isVeryDense"
                class="q-mt-md" style="display: flex; justify-content: end">
              <input-spinner
                style="min-width: 130px; max-width: 150px"
                v-if="weightItem.material === 'lead'"
                :dense="true"
                :value="weightItem.weight"
                @input="setFromWeight(index, $event)"
                :decimals="1"
                :step="weightStep"
                :suffix="weightUnit"
                :minimum="0.01"
                :converter="weightConverter"
              ></input-spinner>
              </div>
            </td>
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'fresh'">
              <buoyancy
                v-if="weightItem.enabled"
                :buoyancy="weightItem.buoyancyFreshWater"/>
            </td>
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'salt'">
              <buoyancy
                v-if="weightItem.enabled"
                :buoyancy="weightItem.buoyancySaltWater"/>
            </td>
            <td class="text-right">
              <q-toggle
                :value="weightItem.enabled"
                @input="enableWeightItem(index, $event)"
              />
            </td>
          </tr>
          <tr style="border-top: 2px solid black">
            <td></td>
            <td class="text-right"><strong><buoyancy :buoyancy="total" /></strong></td>
          </tr>
          </tbody>
          <tfoot>

          </tfoot>
        </q-markup-table>
        <q-btn-toggle
          v-if="$store.state.buoyancy.tanks.some(tank => tank.enabled === true)"
          class="q-mt-lg"
          size="sm"
          :value="allTanksFull"
          toggle-color="grey-8"
          :options="[
            {label: 'Full tanks', value: true},
            {label: 'Empty tanks', value: false},
          ]"
          @input="updateAllConfiguredPressureFromBoolean($event)"
        />
        <input-spinner
          dense
          style="max-width: 350px"
          v-if="hasNeoprene"
          v-model="depth"
          label="depth (for neoprene buoyancy)"
          :minimum="0"
          :step="3"
          class="max-width-500 q-mt-lg"
          suffix="m" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
import InputSalinity from 'components/InputSalinity';
import * as math from '../math';

export default {
  name: 'PageReport',
  data() {
    return {
      allTanksFull: true,
      depth: 0,
    };
  },
  components: { InputSalinity, InputSpinner, Buoyancy },
  computed: {
    weightStep() {
      return this.$store.state.buoyancy.isMetric ? 0.5 : 1 / this.$units.poundsToKg;
    },
    weightUnit() {
      return this.$store.state.buoyancy.isMetric ? 'kg' : 'lbs';
    },
    weightConverter() {
      return this.$store.state.buoyancy.isMetric ? undefined : 'weight';
    },
    weightItem() {
      return this.$store.state.buoyancy.weightItems[this.index];
    },
    pressureUnit() {
      if (this.isDense) {
        return '';
      }
      return this.$store.state.buoyancy.isMetric ? 'bar' : 'psi';
    },
    pressureConverter() {
      return this.$store.state.buoyancy.isMetric ? undefined : 'pressure';
    },
    pressureStep() {
      return this.$store.state.buoyancy.isMetric ? 10 : 100 / this.$units.psiToBar;
    },
    isDense() {
      return this.$q.screen.lt.sm;
    },
    isVeryDense() {
      return this.$q.screen.width < 350;
    },
    hasNeoprene() {
      return this.$store.state.buoyancy.wetsuitPieces.some((item) => item.hasNeoprene);
    },
    math() {
      return math;
    },
    weights() {
      return this.$store.state.buoyancy.weightItems;
    },
    suits() {
      return this.$store.state.buoyancy.wetsuitPieces;
    },
    tanks() {
      return this.$store.state.buoyancy.tanks;
    },
    total() {
      let subtotal = 0;
      if (this.$store.state.buoyancy.enabled) {
        subtotal += this.$store.getters['buoyancy/personalBuoyancy'](this.$store.getters['buoyancy/isSalinityFresh']);
      }
      const self = this;
      this.suits
        .filter((item) => item.enabled)
        .forEach((item) => {
          subtotal += self.calculateSuitBuoyancy(item);
        });

      this.weights
        .filter((item) => item.enabled)
        .forEach((item) => {
          if (this.$store.getters['buoyancy/isSalinityFresh']) {
            subtotal += item.buoyancyFreshWater;
          } else {
            subtotal += item.buoyancyFreshWater;
          }
        });

      this.tanks
        .filter((item) => item.enabled)
        .forEach((item) => {
          subtotal += self.calculateTankBuoyancy(item);
        });
      return subtotal;
    },
  },
  methods: {
    setFromWeight(index, weight) {
      const weightItem = this.$store.state.buoyancy.weightItems[index];
      const obj = {
        index,
        weight,
        density: weightItem.density,
        volume: weight / weightItem.density,
      };
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
      this.$store.dispatch('buoyancy/updateWeightItem', obj);
    },
    getTankPressureLabel(tank) {
      if (this.$store.state.buoyancy.isMetric) {
        return `${Math.round(tank.configuredPressure)} bar`;
      }
      return `${Math.round(tank.configuredPressure * this.$units.psiToBar)} psi`;
    },
    getTankIsFull(tank) {
      if (tank.configuredPressure === 0) {
        return false;
      }
      if (tank.configuredPressure === tank.workingPressure) {
        return true;
      }
      return null;
    },
    calculateSuitBuoyancy(suit) {
      const { mass, volume } = math.CalculateSuit(suit, 1 + (this.depth / 10));
      return math.CalculateUnderwaterWeight(mass, volume, this.$store.getters['buoyancy/currentWaterDensity']);
    },
    calculateTankBuoyancy(tank) {
      return math.CalculateTankBuoyancy(tank,
        tank.configuredPressure,
        this.$store.getters['buoyancy/currentWaterDensity']);
    },
    enablePerson(value) {
      this.$store.dispatch('buoyancy/setPersonProperty', {
        enabled: value,
      });
    },
    updateConfiguredPressure(index, value) {
      this.allTanksFull = null;
      this.$store.dispatch('buoyancy/updateTank', {
        index,
        configuredPressure: parseFloat(value),
      });
    },
    updateConfiguredPressureFromBoolean(index, tank, value) {
      let newPressure = tank.workingPressure;
      if (!value) {
        newPressure = 0;
      }
      this.$store.dispatch('buoyancy/updateTank', {
        index,
        configuredPressure: newPressure,
      });
    },
    updateAllConfiguredPressureFromBoolean(value) {
      this.$store.state.buoyancy.tanks.forEach((tank, index) => {
        let newPressure = tank.workingPressure;
        if (!value) {
          newPressure = 0;
        }
        this.$store.dispatch('buoyancy/updateTank', {
          index,
          configuredPressure: newPressure,
        });
      });
      this.allTanksFull = value;
    },
    enableSuitItem(index, value) {
      this.$store.dispatch('buoyancy/updateWetsuitPiece', {
        index,
        enabled: value,
      });
    },
    enableTank(index, value) {
      this.$store.dispatch('buoyancy/updateTank', {
        index,
        enabled: value,
      });
    },
    enableWeightItem(index, value) {
      this.$store.dispatch('buoyancy/updateWeightItem', {
        index,
        enabled: value,
      });
    },
  },
};
</script
>
<style lang="scss">
tr.rowDisabled {
  //background-color: $grey-3;
  color: $grey-8;
}
.report-table {
  tr td:first-child {
    max-width: 400px;
    white-space: normal;
    overflow: hidden;
  }
}
</style>
