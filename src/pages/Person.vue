<template>
  <q-page class="page-container">
    <div class="column-container">
      <div class="row q-mb-md flex justify-end" v-if="$q.screen.width <= 500">
        <input-salinity :is-headline="false"></input-salinity>
      </div>
      <div class="q-gutter-y-md column help-margin">
        <q-select
          filled
          label="Gender"
          v-model="gender"
          :options="[{ label: 'Female', value: 'female' }, { label: 'Male', value: 'male' }]"
          map-options
          :dense="isDense"
        >
        </q-select>
        <input-spinner
          v-model="age"
          label="Your age (years)"
          suffix="y"
          :minimum="18"
          :maximum="70"
          help
          :dense="isDense"
        >
          <template v-slot:help-title>
            Age
          </template>
          <template v-slot:help>
            Your age is used to estimate:
            <ul>
              <li>your lung capacity</li>
              <li>fat percentage</li>
            </ul>
          </template>
        </input-spinner>
        <input-spinner
          v-model="height"
          label="Your height (cm)"
          suffix="cm"
          :minimum="120"
          :maximum="250"
          help
          :dense="isDense"
        >
          <template v-slot:help-title>
            Height
          </template>
          <template v-slot:help>
            Your height is used to estimate your
            <ul>
              <li>lung capacity</li>
              <li>volume</li>
              <li>surface area</li>
            </ul>
          </template>
        </input-spinner>
        <input-spinner
          v-model="weight"
          label="Your weight (kg)"
          suffix="kg"
          help
          :dense="isDense"
        >
          <template v-slot:help-title>
            Weight
          </template>
          <template v-slot:help>
            Your weight is used to estimate your
            <ul>
              <li>volume</li>
              <li>surface area</li>
              <li>density</li>
              <li>apparent weight</li>
            </ul>
          </template>
        </input-spinner>
        <q-checkbox label="I know my fat percentage"
          v-model="fatPercentageManual"
                    :dense="isDense"
        >
        </q-checkbox>
        <input-spinner
          v-model="fatPercentage"
          label="Fat percentage (%)"
          suffix="%"
          help
          :disable="!fatPercentageManual"
          :dense="isDense"
        >
          <template v-slot:help-title>
            Fat percentage
          </template>
          <template v-slot:help>
            Fatty tissues float more than other tissues.
            <template v-if="fatPercentageTable">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th style="text-align: center"

                        colspan="4">Fat percentage for
                  <template v-if="gender === 'male'">men</template>
                  <template v-else>women</template>
                  <br/>
                  {{ fatPercentageTable.ageMin }} - {{ fatPercentageTable.ageMax }} year</th></tr>
                </thead>
                <tr><td>Low</td><td></td><td>&lt;</td>
                  <td>{{ fatPercentageTable.low }} %</td></tr>
                <tr><td>Healthy</td><td>{{ fatPercentageTable.low }} %</td>
                  <td>-</td>
                  <td>{{ fatPercentageTable.healthy }} %</td></tr>
                <tr>
                  <td>High</td>
                  <td>{{ fatPercentageTable.healthy }} %</td>
                  <td> - </td>
                  <td>{{ fatPercentageTable.high }} %</td>
                </tr>
                <tr>
                  <td>Very high</td>
                  <td></td>
                  <td> > </td>
                  <td>{{ fatPercentageTable.high }} %</td>
                </tr>
              </table>
              <br />
              Based on your age, weight and height we estimate your
              fat percentage to be
              <strong>{{ fatPercentageFromBsi.toFixed(0)  }}%</strong>
              <br /><br/>

              You can improve the accuraccy of these estimations by measuring your fat percentage.
              <ul>
                <li>
                  <a href="https://fellrnr.com/wiki/Body_Fat_Scales" target="_blank">
                    Using Body Fat Scales (BIA)
                  </a>
                </li>
                <li>
                  <a href="https://www.omnicalculator.com/health/army-body-fat"
                     target="_blank">
                    Using the US Army Body Fat Calculator
                  </a>
                </li>
                <li>
                  <a href="https://fellrnr.com/wiki/Skinfold_Calipers" target="_blank">
                    Using skinfold calipers
                  </a>
                </li>
              </ul>
            </template>
          </template>
        </input-spinner>

      </div>
      <div class="q-mt-lg">
        <q-markup-table :dense="$q.screen.lt.sm">
          <thead>
          <tr>
            <th colspan="2" class="text-right">Lung volume <help-button>
              <template v-slot:help-title>
                Lung volume
              </template>
              <template v-slot:help>
                Lung volume is estimated using <a href="https://erj.ersjournals.com/content/6/Suppl_16/5">Quanjer, P. H. et al. (1993) </a><br/>
<br/>
                The used equations are applicable to:
                <ul>
                  <li>a height range of 1.55 – 1.95m in men</li>
                  <li>a height range of 1.45 – 1.80m in women</li>
                  <li>ages 18 – 70 yrs</li>
                </ul>
              </template>
            </help-button></th>
            <th>Buoyancy <help-button>
              <template v-slot:help-title>
                Buoyancy
              </template>
              <template v-slot:help>
                Negative numbers sink, positive numbers float. <br /><br />

                <strong>Also known as:</strong><br />
                The apparent weight, apparent immersed weight, or weight underwater. <br/><br/>
                <a href="https://en.wikipedia.org/wiki/Buoyancy">Wikipedia on Buoynacy</a>
              </template>
            </help-button></th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td class="buoyancy-table-name">Fully inhaled</td>
              <td class="text-right buoyancy-table-lung volume">
                {{ lungCapacityFullyInhaled.toFixed(1) }} &ell;</td>
              <td class="text-right buoyancy-table-lung buoyancy">
                <buoyancy :buoyancy="calculateBodyWeight(lungCapacityFullyInhaled,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy></td>
            </tr>
            <tr>
              <td>Normally inhaled</td>
              <td class="text-right">
                {{ lungCapacityNormallyInhaled.toFixed(1) }} &ell;</td>
              <td class="text-right">
                <buoyancy :buoyancy="calculateBodyWeight(lungCapacityNormallyInhaled,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy></td>
            </tr>
            <tr>
              <td>Normally exhaled</td>
              <td class="text-right">
                {{ lungCapacityNormallyExhaled.toFixed(1) }} &ell;</td>
              <td class="text-right">
                <buoyancy :buoyancy="calculateBodyWeight(lungCapacityNormallyExhaled,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy></td>
            </tr>
            <tr>
              <td>Fully exhaled</td>
              <td class="text-right">
                {{ lungCapacityFullyExhaled.toFixed(1) }} &ell;</td>
              <td class="text-right">
                <buoyancy :buoyancy="calculateBodyWeight(lungCapacityFullyExhaled,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy></td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card class="my-card q-mt-lg" :dense="isDense">
          <q-card-section>
            <p>
            In <strong>{{ $store.state.buoyancy.salinity }} water</strong>
            your personal buoyancy is approximately
            <strong><buoyancy :buoyancy="calculateBodyWeight(lungCapacityNormallyInhaled,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy></strong>
              ({{ getBuoyancyDescription(calculateBodyWeight(lungCapacityNormallyInhaled,
              $store.getters['buoyancy/currentWaterDensity'])) }})
            </p>
            <p>
            <template v-if="$store.state.buoyancy.salinity === 'fresh'">
              Your personal buoyancy is
              <strong>{{ (calculateBodyWeight(lungCapacityNormallyInhaled,
              math.DensitySaltwater) -
            calculateBodyWeight(lungCapacityNormallyInhaled,
              math.DensityFreshWater)).toFixed(1) }} kg more</strong> in salt water.
            </template>
            <template v-if="$store.state.buoyancy.salinity === 'salt'">
              Your personal buoyancy is
              <strong>
              {{ (calculateBodyWeight(lungCapacityNormallyInhaled,
              math.DensitySaltwater) -
            calculateBodyWeight(lungCapacityNormallyInhaled,
              math.DensityFreshWater)).toFixed(1) }} kg less</strong> in fresh water.
            </template>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
import HelpButton from 'components/Help/HelpButton';
import InputSalinity from 'components/InputSalinity';
import * as math from '../math';

export default {
  name: 'PagePerson',
  components: {
    InputSalinity, HelpButton, InputSpinner, Buoyancy,
  },
  data() {
    return {
    };
  },
  computed: {
    math() {
      return math;
    },
    age: {
      get() {
        return this.$store.state.buoyancy.age;
      },
      set(value) {
        value = Math.max(parseFloat(value), 0);
        return this.$store.dispatch('buoyancy/setPersonProperty', { age: value });
      },
    },
    height: {
      get() {
        return this.$store.state.buoyancy.height;
      },
      set(value) {
        value = Math.max(parseFloat(value), 0);
        return this.$store.dispatch('buoyancy/setPersonProperty', { height: value });
      },
    },
    weight: {
      get() {
        return this.$store.state.buoyancy.weight;
      },
      set(value) {
        value = Math.max(parseFloat(value), 0);
        return this.$store.dispatch('buoyancy/setPersonProperty', { weight: value });
      },
    },
    fatPercentage: {
      get() {
        return this.$store.state.buoyancy.fatPercentage;
      },
      set(value) {
        value = Math.max(parseFloat(value), 0);
        return this.$store.dispatch('buoyancy/setPersonProperty', { fatPercentage: value });
      },
    },
    fatPercentageManual: {
      get() {
        return this.$store.state.buoyancy.fatPercentageManual;
      },
      set(value) {
        this.$store.dispatch('buoyancy/setPersonProperty', { fatPercentageManual: value });
      },
    },
    gender: {
      get() {
        return this.$store.state.buoyancy.gender;
      },
      set(value) {
        return this.$store.dispatch('buoyancy/setPersonProperty', { gender: value.value });
      },
    },
    lungCapacity() {
      return math.CalculateLungCapacity(this.gender === 'male', this.age, this.height / 100.0);
    },

    lungCapacityFullyInhaled() {
      const obj = math.CalculateLungCapacity(this.gender === 'male', this.age, this.height / 100.0);
      return obj.totalLungCapacity;
    },
    lungCapacityNormallyInhaled() {
      const obj = math.CalculateLungCapacity(this.gender === 'male', this.age, this.height / 100.0);
      return obj.functionalResidualCapacity + math.TidalVolume;
    },
    lungCapacityNormallyExhaled() {
      const obj = math.CalculateLungCapacity(this.gender === 'male', this.age, this.height / 100.0);
      return obj.functionalResidualCapacity;
    },
    lungCapacityFullyExhaled() {
      const obj = math.CalculateLungCapacity(this.gender === 'male', this.age, this.height / 100.0);
      return obj.residualVolume;
    },
    fatPercentageFromBsi() {
      return math.CalculateFatPercentageBasedOnBmi(this.gender === 'male',
        this.age,
        this.height / 100,
        this.weight);
    },
    fatPercentageTable() {
      return math.GetFatPercentageForGenderAndAge(this.gender === 'male', this.age);
    },
    isDense() {
      return this.$q.screen.lt.sm;
    },
  },
  watch: {
    fatPercentageFromBsi(value) {
      if (!this.fatPercentageManual) {
        value = Math.max(parseFloat(value), 0);
        this.$store.dispatch('buoyancy/setPersonProperty', { fatPercentage: value });
      }
    },
    fatPercentageManual(value) {
      if (!value) {
        this.$store.dispatch('buoyancy/setPersonProperty',
          { fatPercentage: this.fatPercentageFromBsi });
      }
    },
  },
  methods: {
    getBuoyancyDescription(buoyancy) {
      if (buoyancy >= -0.3 && buoyancy < 0.3) {
        return 'neutral';
      }
      if (buoyancy >= -1.0 && buoyancy < -0.3) {
        return 'slightly negative';
      }
      if (buoyancy < -1.0) {
        return 'negative';
      }
      if (buoyancy >= 0.3 && buoyancy < 1.0) {
        return 'slightly positive';
      }
      return 'positive';
    },
    calculateBodyWeight(lungVolume, waterDensity) {
      return math.CalculateWeightFromFatPercentage(
        this.weight,
        this.fatPercentage / 100,
        lungVolume,
        waterDensity,
      );
    },
  },
};
</script>
<style lang="scss">
.page-person-responsive {
  max-width: 550px;
  .input-salinity-page {
    display: flex;
    align-content: end;
    margin-bottom: 16px;
  }

  @media (max-width: 600px) {
    .stepper .help-button {
      right: -35px;
    }
    .help-margin {
      max-width: calc(100% - 35px);
    }
    .buoyancy-table-name {
      width: 50px;
    }
  }
}

</style>
