<template>
  <q-page class="flex">
    <div class="q-pa-md full-width page-width flex-center">
      <q-markup-table class="q-mt-md" v-if="false">
        <thead>
          <tr>
            <th colspan="2">Input values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Your height</td>
            <td style="text-align: right">{{ height }} cm</td>
          </tr>
          <tr>
            <td>Your weight</td>
            <td style="text-align: right">{{ weight }} kg</td>
          </tr>
          <tr>
            <td>Body surface area (BSA)</td>
            <td style="text-align: right">{{ bsaMosteller.toFixed(2) }} m<sup>2</sup>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="q-mt-sm">
      <q-select
        filled
        label="Add new piece"
        @input="addOption"
        :value="null"
        :options="options"
        placeholder="Add new piece" />
      </div>

      <q-markup-table style="margin-top: 20px; width: 100%" v-if="pieces.length > 0">
        <thead>
          <tr>
            <th>Type</th>
            <th>Thickness</th>
            <th>Underwear</th>
            <th>Condition (insulation, flexibility)</th>
            <th>Buoyancy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pieces" :key="idx">
            <td>
              {{ item.label }}
            </td>
            <td>
              <input-spinner
                v-if="item.hasNeoprene"
                suffix="mm"
                :value="item.thickness"
                @input="setThickness(idx, $event)"
                :step="0.5"
                :decimals="1"
                :minimum="0"
                :maximum="20"
                :dense="true"
              >
              </input-spinner>
            </td>
            <td>
              <input-spinner
                v-if="item.isDry"
                suffix="mm"
                :value="item.underwearThickness"
                @input="setUnderwearThickness(idx, $event)"
                :step="0.5"
                :decimals="1"
                :minimum="0"
                :maximum="40"
                :dense="true"
              >
              </input-spinner>
            </td>
            <td>
              <q-rating
                filled
                v-if="item.hasNeoprene"
                :value="item.agePercentage/20"
                @input="setAgePercentage(idx,$event*20)"
                size="2em"
                color="green-5"
                icon="star_border"
                icon-selected="star"
              />
            </td>
            <td class="text-right">
              <buoyancy :buoyancy="computeItemAtPressure(1,
              $store.getters['buoyancy/currentWaterDensity'],
              idx)" />
            </td>
            <td>
              <q-btn size="12px" flat dense round icon="delete" @click="deleteIdx(idx)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-markup-table class="q-mt-lg buoyancy-depth-table" v-if="pieces.length > 0">
        <thead>
        <tr>
          <th>
            Depth (m)
          </th>
          <th>
            Buoyancy
          </th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(depth, idx) in depths" :key="idx">
            <td class="text-right">
              {{ depth }} m
            </td>
            <td>
              <buoyancy :buoyancy="computeAtPressure(1+depth/10,
                $store.getters['buoyancy/currentWaterDensity'])"></buoyancy>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>

<script>
import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
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

 1.2MPA = 12 ata / 12 bar

 Table 5, https://www.researchgate.net/publication/230971354_Thermal_conductivity_and_compressive_strain_of_foam_neoprene_insulation_under_hydrostatic_pressure/link/542da9c00cf277d58e8d106d/download
 Thermal conductivity and compressive strain of foam neoprene insulation under hydrostatic pressure

 Some anecdotal evidence for neoprene loss of insulation: https://www.scubaboard.com/community/threads/how-exactly-does-neoprene-compress-permanently-and-a-couple-other-detaily-questions.211811/
 The loss of air.

 Proposed model:
 - Neoprene rubber weighs 1000kg / m3. (± 100g/m³)
 - New suits contain 75% air = 250kg / m³ rubber
 - The model is: older suits loose air.
  - A 7mm suit contains 75% air when it's new, but loses volume over time.
  - Meaning that its density changes and it's weight under water,
    but it's weight above water does not. (The amount of rubber stays the same)
 */

export default {
  name: 'PageWetsuit',
  components: { InputSpinner, Buoyancy },
  data() {
    return {
      optionToAdd: null,
      depths: [
        0, 6, 12, 18, 24, 30,
      ],
      options: [
        {
          label: 'Add new piece..',
          value: null,
        },
        {
          label: 'Trilaminate (drysuit)',
          value: 'fullBodyTrilaminate',
        },
        {
          label: 'Neoprene (drysuit)',
          value: 'fullBodyNeopreneDrysuit',
        },
        {
          label: 'Neoprene full body (wet)',
          value: 'fullBody',
        },
        {
          label: 'Neoprene full body hooded (wet)',
          value: 'fullBodyHoodie',
        },
        {
          label: 'Neoprene shorty (wet)',
          value: 'shorty',
        },
        {
          label: 'Neoprene shorty hooded (wet)',
          value: 'shortyHooded',
        },
        {
          label: 'Neoprene cap (wet)',
          value: 'cap',
        },
        {
          label: 'Neoprene gloves (wet)',
          value: 'gloves',
        },

        {
          label: 'Neoprene shoes (wet)',
          value: 'shoes',
        },
        {
          label: 'Neoprene sleeveless shirt (wet)',
          value: 'sleevelessShirt',
        },
        {
          label: 'Neoprene short sleeved shirt (wet)',
          value: 'shortSleeveShirt',
        },
        {
          label: 'Neoprene long sleeved Shirt (wet)',
          value: 'longSleeveShirt',
        },
        {
          label: 'Neoprene shorts (wet)',
          value: 'shorts',
        },
        {
          label: 'Neoprene long pants (wet)',
          value: 'pants',
        },
      ],
    };
  },
  computed: {
    height() {
      return this.$store.state.buoyancy.height;
    },
    weight() {
      return this.$store.state.buoyancy.weight;
    },
    bsaMosteller() {
      return math.CalculateBSAMosteller(this.height, this.weight);
    },
    math() {
      return math;
    },
    pieces() {
      return this.$store.state.buoyancy.wetsuitPieces;
    },
  },
  methods: {
    addOption(item) {
      if (item.value === null) {
        return;
      }

      const ruleOfNinesArea = math.RuleOfNines(this.bsaMosteller);
      // check if item is a drysuit..
      if (item.value === 'fullBodyTrilaminate') {
        const drysuit = {
          type: item.value,
          label: item.label,
          isDry: true,
          hasNeoprene: false,
          maxAirPercentage: 0.01,
          minAirPercentage: 0.01,
          thickness: 0.0001,
          underwearThickness: 2,
          agePercentage: 100,
          // look up total area of the name of the item..
          area: ruleOfNinesArea.fullBody + ruleOfNinesArea.shoes,
        };
        this.$store.dispatch('buoyancy/addWetsuitPiece', drysuit);
        return;
      }

      if (item.value === 'fullBodyNeopreneDrysuit') {
        const drysuit = {
          type: item.value,
          label: item.label,
          isDry: true,
          hasNeoprene: true,
          maxAirPercentage: 0.4,
          minAirPercentage: 0.2,
          thickness: 3,
          underwearThickness: 2,
          agePercentage: 100,
          // look up total area of the name of the item..
          area: ruleOfNinesArea.fullBody + ruleOfNinesArea.shoes,
        };
        this.$store.dispatch('buoyancy/addWetsuitPiece', drysuit);
        return;
      }

      const piece = {
        type: item.value,
        label: item.label,
        isDry: false,
        hasNeoprene: true,
        maxAirPercentage: 0.74,
        minAirPercentage: 0.35,
        thickness: 7,
        agePercentage: 100,
        underwearThickness: 0,
        // look up total area of the name of the item..
        area: ruleOfNinesArea[item.value],
      };

      this.$store.dispatch('buoyancy/addWetsuitPiece', piece);
    },
    setThickness(index, value) {
      this.$store.dispatch('buoyancy/updateWetsuitPiece', {
        index,
        thickness: value,
      });
    },
    setUnderwearThickness(index, value) {
      this.$store.dispatch('buoyancy/updateWetsuitPiece', {
        index,
        underwearThickness: parseFloat(value),
      });
    },
    // remap value?
    setAgePercentage(index, value) {
      this.$store.dispatch('buoyancy/updateWetsuitPiece', {
        index,
        agePercentage: value,
      });
    },
    deleteIdx(index) {
      this.$store.dispatch('buoyancy/deleteWetsuitPiece', index);
    },
    computeAtPressure(pressure, waterDensity) {
      let totalMass = 0;
      let totalVolume = 0;
      for (let i = 0; i < this.pieces.length; i++) {
        const selectedItem = this.pieces[i];
        // assumtion: old and new wetsuits weigh the same.
        totalMass += math.CalculateNeopreneMass(selectedItem.area,
          selectedItem.thickness,
          selectedItem.maxAirPercentage);
        totalVolume += math.CalculateAgedNeopreneVolumeAtDepth(selectedItem.area,
          selectedItem.thickness,
          selectedItem.agePercentage / 100,
          selectedItem.maxAirPercentage,
          selectedItem.minAirPercentage,
          pressure) + (selectedItem.area * selectedItem.underwearThickness);
      }
      return math.CalculateUnderwaterWeight(totalMass, totalVolume, waterDensity);
    },
    computeItemAtPressure(pressure, waterDensity, index) {
      // assumtion: old and new wetsuits weigh the same.
      const { mass, volume } = math.CalculateSuit(this.pieces[index], pressure);
      return math.CalculateUnderwaterWeight(mass, volume, waterDensity);
    },
  },
};
</script>
<style lang="scss">
 .buoyancy-depth-table {
   td:nth-child(2), td:nth-child(3) {
     text-align: right;
     max-width: 50px;
   }
   .stepper label {
     min-width: 90px;
   }
 }
</style>
