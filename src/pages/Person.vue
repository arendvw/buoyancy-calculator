<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div class="q-gutter-y-md column" style="max-width: 600px">
        <div class="q-gutter-sm">
          <q-radio v-model="gender" val="female" label="Female" />
          <q-radio v-model="gender" val="male" label="Male" />
        </div>
        <q-input
          v-model.number="age"
          type="number"
          filled
          label="Your age"
        />
        <q-input
          v-model.number="height"
          type="number"
          filled
          label="Your height (cm)"
        />
        <q-input
          v-model.number="weight"
          type="number"
          filled
          label="Your weight (kg)"
        />
        <q-input
          v-model.number="fatPercentage"
          type="number"
          filled
          label="Fat percentage (%)"
        />
        <q-markup-table>
          <thead>
          <tr>
            <th>
            </th>
            <th></th>
            <th colspan="2">Underwater weight</th>
          </tr>
          <tr>
            <th>
            </th>
            <th>Lung volume</th>
            <th>Fresh</th>
            <th>Salt</th>
          </tr>
          </thead>
          <tr>
            <td>Fully inhaled</td>
            <td>{{ lungCapacityFullyInhaled.toFixed(1) }} &ell;</td>
            <td>{{ calculateBodyWeight(lungCapacityFullyInhaled, false).toFixed(1)}} kg</td>
            <td>{{ calculateBodyWeight(lungCapacityFullyInhaled, true).toFixed(1)}} kg</td>
          </tr>
          <tr>
            <td>Normally inhaled</td>
            <td>{{ lungCapacityNormallyInhaled.toFixed(1) }} &ell;</td>
            <td>{{ calculateBodyWeight(lungCapacityNormallyInhaled, false).toFixed(1) }} kg</td>
            <td>{{ calculateBodyWeight(lungCapacityNormallyInhaled, true).toFixed(1) }} kg</td>
          </tr>
          <tr>
            <td>Normally exhaled</td>
            <td>{{ lungCapacityNormallyExhaled.toFixed(1) }} &ell;</td>
            <td>{{ calculateBodyWeight(lungCapacityNormallyExhaled, false).toFixed(1) }} kg</td>
            <td>{{ calculateBodyWeight(lungCapacityNormallyExhaled, true).toFixed(1) }} kg</td>
          </tr>
          <tr>
            <td>Fully exhaled</td>
            <td>{{ lungCapacityFullyExhaled.toFixed(1) }} &ell;</td>
            <td>{{ calculateBodyWeight(lungCapacityFullyExhaled, false).toFixed(1) }} kg</td>
            <td>{{ calculateBodyWeight(lungCapacityFullyExhaled, true).toFixed(1) }} kg</td>
          </tr>
        </q-markup-table>
      </div>
    </div>
  </q-page>
</template>

<script>

import * as math from '../math';

export default {
  name: 'PagePerson',
  data() {
    return {
    };
  },
  computed: {
    age: {
      get() {
        return this.$store.state.buoyancy.age;
      },
      set(value) {
        return this.$store.dispatch('buoyancy/setPersonProperty', { age: value });
      },
    },
    height: {
      get() {
        return this.$store.state.buoyancy.height;
      },
      set(value) {
        return this.$store.dispatch('buoyancy/setPersonProperty', { height: value });
      },
    },
    weight: {
      get() {
        return this.$store.state.buoyancy.weight;
      },
      set(value) {
        return this.$store.dispatch('buoyancy/setPersonProperty', { weight: value });
      },
    },
    fatPercentage: {
      get() {
        return this.$store.state.buoyancy.fatPercentage;
      },
      set(value) {
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
    calculateBodyWeight(lungVolume, isSalt) {
      return math.CalculateWeightFromFatPercentage(
        this.weight,
        this.fatPercentage / 100,
        lungVolume,
        isSalt ? math.DensitySaltwater : math.DensityFreshWater,
      );
    },
  },
};
</script>
