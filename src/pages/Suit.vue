<template>
  <q-page class="page-container">
    <div class="column-container">
    <div class="row q-mb-md flex justify-end" v-if="$q.screen.width <= 500">
      <input-salinity :is-headline="false"></input-salinity>
    </div>
    <q-dialog v-model="showEdit">
      <q-card>
        <q-card-section>
          <div class="text-h6" v-if="currentItem">
            {{ currentItem.label }}
          </div>
        </q-card-section>
        <suit-edit
          :index="currentIndex"
        />
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Close" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="q-gutter-y-md flex-center">
      <div>
        <q-select
          filled
          label="Add new piece"
          @input="addOption"
          :value="null"
          :options="options"
          placeholder="Add new piece"/>
      </div>
      <q-card>
        <q-list separator v-if="pieces.length > 0">
          <SuitItem
            @click="showEdit = true; currentIndex = idx;"
            :index="idx" v-for="(item, idx) in pieces" :key="idx"/>
        </q-list>
      </q-card>
      <q-markup-table class="buoyancy-depth-table" v-if="pieces.length > 0">
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
    </div>
  </q-page>
</template>

<script>
import Buoyancy from 'components/Buoyancy';
import SuitItem from 'pages/SuitItem';
import SuitEdit from 'pages/SuitEdit';
import InputSalinity from 'components/InputSalinity';
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

 1.2MPA = 12 ata / 12 bar = 120m depth

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
  components: {
    InputSalinity,
    SuitEdit,
    SuitItem,
    Buoyancy,
  },
  data() {
    return {
      showEdit: false,
      currentIndex: -1,
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
    ruleOfNinesArea() {
      return math.RuleOfNines(this.bsaMosteller);
    },
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
    currentItem() {
      return this.$store.state.buoyancy.wetsuitPieces[this.currentIndex];
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

</style>
