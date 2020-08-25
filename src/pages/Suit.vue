<template>
  <q-page class="flex">
    <div class="q-pa-md">
      <div class="q-gutter-y-md column" style="max-width: 600px">
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
      </div>
      <q-markup-table style="margin-top: 20px">
        <thead>
        <tr>
          <td>Body surface area (BSA)</td>
        </tr>
        </thead>
        <tr>
          <td style="text-align: right">{{ bsaMosteller.toFixed(2) }} (m<sup>2</sup>)</td>
        </tr>
      </q-markup-table>

      <q-select
        @input="addOption"
        v-model="optionToAdd"
        :options="options"
        placeholder="Add new piece" />

      <q-markup-table style="margin-top: 20px">
        <thead>
          <tr>
            <td>Type</td>
            <td>Thickness</td>
            <td>Condition</td>
            <td></td>
          </tr>
        </thead>
          <tr v-for="(item, idx) in selectedItems" :key="idx">
            <td>
              {{ item.label }}
            </td>
            <td>
              <q-input
                :value="item.thickness"
                @input="setThickness(idx, $event)"
                type="number"
                dense
                style="max-width: 150px"
                side
              />
            </td>
            <td>
              <q-select
                v-model="item.neopreneDensity"
                :options="neopreneDensity" />
            </td>
            <td>
              <q-btn size="12px" flat dense round icon="delete" @click="deleteIdx(idx)" />
            </td>
          </tr>
        <tfoot>
          <tr>
            <td>
              Total volume
            </td>
            <td>

            </td>

          </tr>
        </tfoot>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script>
import * as math from '../math';

/**
 * The porosities of the 5 mm and 12 mm thick foam
 neoprene samples measured at each incremental pressure stop
 are within 1% of each other, and it can be seen that equation (3)
 accurately models the porosity variation with pressure. The
 porosity is about 74% at atmospheric pressure and decreases
 to 19% at 1.2 MPa (107 msw). Although the porosity is
 approximately the same for both thicknesses at all pressures,
 the overall density of the 12 mm foam neoprene samples is
 greater due to the pure neoprene rubber having a greater
 density. As the pressure increases and the porosity decreases,
 the overall density will approach the density of pure neoprene
 rubber.

 Table 5, https://www.researchgate.net/publication/230971354_Thermal_conductivity_and_compressive_strain_of_foam_neoprene_insulation_under_hydrostatic_pressure/link/542da9c00cf277d58e8d106d/download
 Thermal conductivity and compressive strain of foam neoprene insulation under hydrostatic pressure

 Proposed model:
 - Neoprene rubber weighs 1000kg / m3.
 - New suits contain 75% air = 250kg / m3 rubber
 - Used suits contain 50% air = 250kg / m3 rubber per 750/ml = 75% percent thickness
 - Old suits contain 25% air = 250kg / m3 rubber per 500/ml = 50% percent thickness
 */

export default {
  name: 'PageSuit',
  data() {
    return {
      age: 35,
      height: 169,
      weight: 76,
      fatPercentage: 24,
      gender: 'female',
      selectedItems: [],
      totalWeight: 0,
      totalVolume: 0,
      optionToAdd: 'none',
      neopreneDensity: [
        {
          label: 'New',
          value: 250,
        },
        {
          label: 'Used',
          value: 200,
        },
        {
          label: 'Old',
          value: 150,
        },
      ],
      options: [
        {
          label: 'Full Body',
          value: 'fullBody',
        },
        {
          label: 'Full Body (Hooded)',
          value: 'fullBodyHoodie',
        },
        {
          label: 'Shorty',
          value: 'shorty',
        },
        {
          label: 'Shorty (Hooded)',
          value: 'shortyHooded',
        },
        {
          label: 'Cap',
          value: 'cap',
        },
        {
          label: 'Gloves',
          value: 'gloves',
        },

        {
          label: 'Shoes',
          value: 'shoes',
        },
        {
          label: 'Sleeveless Shirt',
          value: 'sleevelessShirt',
        },
        {
          label: 'Short Sleeved Shirt',
          value: 'shortSleeveShirt',
        },
        {
          label: 'Long Sleeved Shirt',
          value: 'longSleeveShirt',
        },
        {
          label: 'Shorts',
          value: 'Shorts',
        },
        {
          label: 'Pants',
          value: 'pants',
        },
      ],
    };
  },
  computed: {
    bsaDubois() {
      return math.CalculateBSADubois(this.height, this.weight);
    },
    bsaMosteller() {
      return math.CalculateBSADubois(this.height, this.weight);
    },
    bsaSlichMale() {
      return math.CalculateBSASchlichMale(this.height, this.weight);
    },
    bsaSlichFemale() {
      return math.CalculateBSASchlichFemale(this.height, this.weight);
    },
  },
  methods: {
    addOption(item) {
      this.selectedItems.push({
        type: item.value,
        label: item.label,
        thickness: 7,
      });
    },
    setThickness(idx, value) {
      this.selectedItems[idx].thickness = value;
    },
    setState(idx, value) {
      this.selectedItems[idx].state = value;
    },
    deleteIdx(idx) {
      this.selectedItems.splice(idx, 1);
    },
  },
  watch: {
    selectedItems: {
      deep: true,
      handler() {
        console.log('updated!');
      },
    },
  },
};
</script>
