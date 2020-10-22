<template>
  <q-page class="flex">
    <div class="full-width page-width">
      <div class="q-pa-md q-gutter-y-md column">

        <q-markup-table
          class="full-width"
        >
          <thead>
          <tr>
            <th>Name</th>
            <th style="width: 200px"></th>
            <th v-if="$store.state.buoyancy.salinity === 'fresh'">Buoyancy (fresh water)</th>
            <th v-if="$store.state.buoyancy.salinity === 'salt'">Buoyancy (fresh water)</th>
            <th style="width: 40px;"></th>
          </tr>
          </thead>
          <tbody>
          <tr :class="{ rowDisabled: !$store.state.buoyancy.enabled }">
            <td>Personal buoyancy</td>
            <td></td>
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
            <td class="text-center"><q-toggle
              :value="$store.state.buoyancy.enabled"
              @input="enablePerson"
            /></td>
          </tr>
          <tr
            v-for="(suitItem, index) in suits"
            :key="'suit'+index"
            :class="{ rowDisabled: !suitItem.enabled }">
            <td>{{ suitItem.label }}</td>
            <td></td>
            <td class="text-right">
              <buoyancy
                v-if="suitItem.enabled"
                :buoyancy="calculateSuitBuoyancy(suitItem)" /></td>
            <td class="text-center" style="width: 40px"><q-toggle
              :value="suitItem.enabled"
              @input="enableSuitItem(index, $event)"
            /></td>
          </tr>
          <tr
            v-for="(tank, index) in tanks"
            :key="'tank'+index"
            :class="{ rowDisabled: !tank.enabled }"
          >
            <td>{{ math.GetTankFullLabel(tank) }}, {{ math.GetGasLabel(tank.gasMixture) }}</td>
            <td class="text-right">
              <input-spinner
                v-if="tank.enabled"
                dense
                :value="tank.configuredPressure"
                :minimum="0"
                :step="10"
                @input="updateConfiguredPressure(index, $event)"
                suffix="bar" />
            </td>
            <td class="text-right"><buoyancy
              v-if="tank.enabled"
              :buoyancy="calculateTankBuoyancy(tank)" /></td>
            <td class="text-center"><q-toggle
              :value="tank.enabled"
              @input="enableTank(index, $event)"
            /></td>          </tr>
          <tr
            v-for="(weightItem, index) in weights"
            :class="{ rowDisabled: !weightItem.enabled }"
            :key="'weight'+index"
              style="cursor: pointer">
            <td>{{ weightItem.name }} ({{ weightItem.material }})</td>
            <td></td>
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
            <td></td>
            <td class="text-right"><strong><buoyancy :buoyancy="total" /></strong></td>
          </tr>
          </tbody>
          <tfoot>

          </tfoot>
        </q-markup-table>
        <input-spinner
          v-if="hasNeoprene"
          v-model="depth"
          label="depth (for neoprene buoyancy)"
          :minimum="0"
          :step="3"
          class="max-width-500"
          suffix="m" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
import * as math from '../math';

export default {
  name: 'PageReport',
  data() {
    return {
      depth: 0,
    };
  },
  components: { InputSpinner, Buoyancy },
  computed: {
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
      this.$store.dispatch('buoyancy/updateTank', {
        index,
        configuredPressure: parseFloat(value),
      });
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
</style>
