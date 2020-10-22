<template>
  <q-page class="flex">
    <div class="q-pa-md full-width page-width">
      <div class="q-gutter-y-md column" style="max-width: 400px;">
        <div class="q-gutter-s q-pl-xl q-ml-sm">
          <q-radio v-model="gender" val="female" label="Female" />
          <q-radio v-model="gender" val="male" label="Male" />
        </div>
        <input-spinner
          v-model="age"
          label="Your age (years)"
          suffix="y"
          :minimum="18"
          :maximum="70"
        >
        </input-spinner>
        <input-spinner
          v-model="height"
          label="Your height (cm)"
          suffix="cm"
        >
        </input-spinner>
        <input-spinner
          v-model="weight"
          label="Your weight (kg)"
          suffix="kg"
        >
        </input-spinner>
        <input-spinner
          v-model="fatPercentage"
          label="Fat percentage (%)"
          suffix="%"
        >
        </input-spinner>
      </div>
      <div class="q-mt-lg">
        <q-markup-table>
          <thead>
          <tr>
            <th>
            </th>
            <th>Lung volume</th>
            <th>Buoyancy</th>
          </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fully inhaled</td>
              <td class="text-right">
                {{ lungCapacityFullyInhaled.toFixed(1) }} &ell;</td>
              <td class="text-right">
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
        <q-card class="my-card q-mt-lg">
          <q-card-section>
            <p>
              <br/>
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
import * as math from '../math';

export default {
  name: 'PagePerson',
  components: { InputSpinner, Buoyancy },
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
    gender: {
      get() {
        return this.$store.state.buoyancy.gender;
      },
      set(value) {
        return this.$store.dispatch('buoyancy/setPersonProperty', { gender: value });
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
