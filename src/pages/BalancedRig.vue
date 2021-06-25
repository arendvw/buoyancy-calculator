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
            <th>BCD Loss <help-button>
              <template v-slot:help-title>
                BCD failure with full tanks at maximum depth
              </template>
              <template v-slot:help>
                <p>
                  You should be able to swim to the surface in case of a full BCD failure: <br/>
                  weigh less than <template v-if="$store.state.buoyancy.isMetric"><buoyancy :buoyancy="-5"/></template>
                  <template v-else><buoyancy :buoyancy="-10/$units.poundsToKg"/></template> after dropping all droppable weights.
                </p>
                <p>
                  <strong>OR</strong>
                </p>
                <p>
                  Have a backup buoyancy system (drysuit).
                </p>
                <p>
                  You can enable/disable droppable weights for this scenario using the <q-icon name="settings" /> settings button.
                </p>
              </template>
            </help-button><br/>
              at <depth :depth="depthStart" />

            </th>
            <th>Empty tanks <help-button>
              <template v-slot:help-title>
                Controlled ascent with empty tanks
              </template>
              <template v-slot:help>
                <p>
                  With (near) empty tanks you should be neutral or slightly negatively buoyant.
                </p>
              </template>
            </help-button><br/>
              at <depth :depth="depthEnd" />
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="$store.state.buoyancy.enabled" :class="{ rowDisabled: !$store.state.buoyancy.enabled }">
            <td>Personal buoyancy</td>
            <template v-if="!configure">
            <td class="text-right" v-if="$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled && $store.state.buoyancy.enabledBalancedStart"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](true)"/>
            </td>
            <td class="text-right" v-if="!$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled && $store.state.buoyancy.enabledBalancedStart"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](false)"/>
            </td>
            <td class="text-right" v-if="$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled && $store.state.buoyancy.enabledBalancedEnd"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](true)"/>
            </td>
            <td class="text-right" v-if="!$store.getters['buoyancy/isSalinityFresh']">
              <buoyancy
                v-if="$store.state.buoyancy.enabled && $store.state.buoyancy.enabledBalancedEnd"
                :buoyancy="$store.getters['buoyancy/personalBuoyancy'](false)"/>
            </td>
            </template>
            <template v-else>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.enabledBalancedStart"
                  @input="enablePersonBalanced(true, $event)"
                />
              </td>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.enabledBalancedEnd"
                  @input="enablePersonBalanced(false, $event)"
                />
              </td>
            </template>
          </tr>
          <template
            v-for="(suitItem, index) in suits"
            :class="{ rowDisabled: !suitItem.enabled }"
          >
            <tr v-if="suitItem.enabled" :key="'suit'+index">
            <td>{{ suitItem.label }}</td>
            <template v-if="!configure">
              <td class="text-right">
                <buoyancy
                  v-if="suitItem.enabled && suitItem.enabledBalancedStart"
                  :buoyancy="calculateSuitBuoyancy(suitItem, true)"/>
              </td>
              <td class="text-right">
                <buoyancy
                  v-if="suitItem.enabled && suitItem.enabledBalancedEnd"
                  :buoyancy="calculateSuitBuoyancy(suitItem, false)"/>
              </td>
            </template>
            <template v-else>
              <td>
              <q-toggle
                :value="suitItem.enabledBalancedStart"
                @input="enableSuitItemBalanced(index, true, $event)"></q-toggle>
              </td>
              <td>
              <q-toggle
                :value="suitItem.enabledBalancedEnd"
                @input="enableSuitItemBalanced(index, false, $event)"></q-toggle>
              </td>
            </template>
            </tr>
          </template>
          <template
            v-for="(tank, index) in tanks"
          >
            <tr
              :key="'tank'+index" v-if="tank.enabled"
              :class="{ rowDisabled: !tank.enabled }">
            <td style="padding-top: 10px">
              <template v-if="$store.state.buoyancy.isMetric">
                {{ math.GetTankFullLabel(tank) }}, {{ math.GetGasLabel(tank.gasMixture) }}
              </template>
              <template v-else>
                {{ math.GetTankFullImperialLabel(tank) }}, {{ math.GetGasLabel(tank.gasMixture) }}
              </template>
            </td>

            <template v-if="!configure">
              <td class="text-right">
                <buoyancy
                  v-if="tank.enabled && tank.enabledBalancedStart"
                  :buoyancy="calculateTankBuoyancy(tank, true)"/>
              </td>
              <td class="text-right">
                <buoyancy
                  v-if="tank.enabled && tank.enabledBalancedEnd"
                  :buoyancy="calculateTankBuoyancy(tank, false)"/>
              </td>
            </template>
            <template v-else>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.tanks[index].enabledBalancedStart"
                  @input="enableTankBalanced(index, true, $event)"
                />
              </td>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.tanks[index].enabledBalancedEnd"
                  @input="enableTankBalanced(index, false, $event)"
                />
              </td>
            </template>
            </tr>
          </template>
          <tr
            v-for="(weightItem, index) in weights"
            :class="{ rowDisabled: !weightItem.enabled }"
            :key="'weight'+index"
            style="cursor: pointer">
            <td>{{ weightItem.name }} ({{ weightItem.material }})
              <div
                v-if="weightItem.enabled && !isVeryDense && weightItem.material === 'lead'"
                class="q-mt-md" style="display: flex; justify-content: end">
                <input-spinner
                  style="min-width: 130px; max-width: 150px"
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
            <template v-if="!configure">
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'fresh'">
              <buoyancy
                v-if="weightItem.enabled && weightItem.enabledBalancedStart"
                :buoyancy="weightItem.buoyancyFreshWater"/>
            </td>
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'salt'">
              <buoyancy
                v-if="weightItem.enabled && weightItem.enabledBalancedStart"
                :buoyancy="weightItem.buoyancySaltWater"/>
            </td>
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'fresh'">
              <buoyancy
                v-if="weightItem.enabled && weightItem.enabledBalancedEnd"
                :buoyancy="weightItem.buoyancyFreshWater"/>
            </td>
            <td class="text-right" v-if="$store.state.buoyancy.salinity === 'salt'">
              <buoyancy
                v-if="weightItem.enabled && weightItem.enabledBalancedEnd"
                :buoyancy="weightItem.buoyancySaltWater"/>
            </td>
            </template>
            <template v-else>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.weightItems[index].enabledBalancedStart"
                  @input="enableWeightItemBalanced(index, true, $event)"
                />
              </td>
              <td>
                <q-toggle
                  :value="$store.state.buoyancy.weightItems[index].enabledBalancedEnd"
                  @input="enableWeightItemBalanced(index, false, $event)"
                />
              </td>
            </template>
          </tr>
          <tr style="border-top: 2px solid black">
            <td></td>
            <td class="text-right"><strong>
              <buoyancy :buoyancy="total(true)" v-if="!configure"/>
            </strong></td>
            <td class="text-right"><strong>
              <buoyancy :buoyancy="total(false)" v-if="!configure"/>
            </strong></td>

          </tr>
          </tbody>
          <tfoot>

          </tfoot>
        </q-markup-table>
        <template v-if="configure === true">
          <div class="input-row q-mt-md">
          <input-spinner
            :dense="isDense"
            v-model="depthStart"
            label="depth at start"
            :converter="distanceConverter"
            :minimum="0"
            :step="distanceStep"
            :suffix="distanceUnit"
            help
          >
            <template v-slot:help-title>
              Depth at start of dive
            </template>
            <template v-slot:help>
              This is the depth used to calculate the buoyancy of neoprene for the first scenario ('bcd loss').
            </template>
          </input-spinner>
          </div>
          <div class="input-row q-mt-md">
          <input-spinner
            :dense="isDense"
            v-model="depthEnd"
            label="depth at end"
            :converter="distanceConverter"
            :minimum="0"
            :step="distanceStep"
            :suffix="distanceUnit"
            help
          >
            <template v-slot:help-title>
              Depth at end of dive
            </template>
            <template v-slot:help>
              This is the depth used to calculate the buoyancy of neoprene for the second scenario ('empty tanks').
            </template>
          </input-spinner>
          </div>
          <div class="input-row q-mt-md">
            <input-spinner
              label="empty pressure"
              :dense="isDense"
              v-model="emptyPressure"
              :decimals="0"
              :step="pressureStep"
              :suffix="pressureUnit"
              :minimum="0"
              :converter="pressureConverter"
              help
            >
              <template v-slot:help-title>
                Empty pressure
              </template>
              <template v-slot:help>
                This is the fill pressure of the tanks used to calculate the second scenario: empty tanks.
                0 bar/psi is the default value.
              </template>
            </input-spinner>
          </div>
        </template>
        <div class="flex justify-end q-pt-lg">
        <q-btn color="blue-grey-4" size="md" icon="settings" v-if="configure === false" @click="configure = true">
        </q-btn>
        <q-btn color="blue-grey-4" size="md" icon="check" v-if="configure === true" @click="configure = false"></q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
import InputSalinity from 'components/InputSalinity';
import Depth from 'components/Depth';
import HelpButton from 'components/Help/HelpButton';
import * as math from '../math';

export default {
  data() {
    return {
      allTanksFull: true,
      depthStart: this.$store.state.buoyancy.isMetric ? 30 : this.$units.feetToMeter * 100,
      depthEnd: this.$store.state.buoyancy.isMetric ? 3 : this.$units.feetToMeter * 10,
      configure: false,
      emptyPressure: 0,
    };
  },
  components: {
    HelpButton,
    Depth,
    InputSalinity,
    InputSpinner,
    Buoyancy,
  },
  computed: {
    distanceUnit() {
      return this.$store.state.buoyancy.isMetric ? 'm' : 'ft';
    },
    distanceStep() {
      return this.$store.state.buoyancy.isMetric ? 3 : this.$units.feetToMeter * 10;
    },
    distanceConverter() {
      return this.$store.state.buoyancy.isMetric ? null : 'distance';
    },
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
  },
  methods: {
    total(isStart) {
      const enabledName = isStart ? 'enabledBalancedStart' : 'enabledBalancedEnd';
      let subtotal = 0;
      if (this.$store.state.buoyancy.enabled && this.$store.state.buoyancy[enabledName] === true) {
        subtotal += this.$store.getters['buoyancy/personalBuoyancy'](this.$store.getters['buoyancy/isSalinityFresh']);
      }
      const self = this;
      this.suits
        .filter((item) => item.enabled && item[enabledName] === true)
        .forEach((item) => {
          subtotal += self.calculateSuitBuoyancy(item, isStart);
        });

      this.weights
        .filter((item) => item.enabled && item[enabledName] === true)
        .forEach((item) => {
          if (this.$store.getters['buoyancy/isSalinityFresh']) {
            subtotal += item.buoyancyFreshWater;
          } else {
            subtotal += item.buoyancyFreshWater;
          }
        });

      this.tanks
        .filter((item) => item.enabled && item[enabledName] === true)
        .forEach((item) => {
          subtotal += self.calculateTankBuoyancy(item, isStart);
        });
      return subtotal;
    },
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
    calculateSuitBuoyancy(suit, isStart) {
      const depth = isStart ? this.depthStart : this.depthEnd;
      const {
        mass,
        volume,
      } = math.CalculateSuit(suit, 1 + (depth / 10));
      return math.CalculateUnderwaterWeight(mass, volume, this.$store.getters['buoyancy/currentWaterDensity']);
    },
    calculateTankBuoyancy(tank, isFull) {
      const pressure = isFull ? tank.workingPressure : this.emptyPressure;
      return math.CalculateTankBuoyancy(tank,
        pressure,
        this.$store.getters['buoyancy/currentWaterDensity']);
    },
    enablePersonBalanced(isStart, value) {
      if (isStart) {
        this.$store.dispatch('buoyancy/setPersonProperty', {
          enabledBalancedStart: value,
        });
      } else {
        this.$store.dispatch('buoyancy/setPersonProperty', {
          enabledBalancedEnd: value,
        });
      }
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
    enableSuitItemBalanced(index, isStart, value) {
      if (isStart) {
        this.$store.dispatch('buoyancy/updateWetsuitPiece', {
          index,
          enabledBalancedStart: value,
        });
      } else {
        this.$store.dispatch('buoyancy/updateWetsuitPiece', {
          index,
          enabledBalancedEnd: value,
        });
      }
    },
    enableTankBalanced(index, isStart, value) {
      if (isStart) {
        this.$store.dispatch('buoyancy/updateTank', {
          index,
          enabledBalancedStart: value,
        });
      } else {
        this.$store.dispatch('buoyancy/updateTank', {
          index,
          enabledBalancedEnd: value,
        });
      }
    },
    enableWeightItemBalanced(index, isStart, value) {
      if (isStart) {
        this.$store.dispatch('buoyancy/updateWeightItem', {
          index,
          enabledBalancedStart: value,
        });
      } else {
        this.$store.dispatch('buoyancy/updateWeightItem', {
          index,
          enabledBalancedEnd: value,
        });
      }
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
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
</style>
