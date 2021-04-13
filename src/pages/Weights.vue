<template>
  <q-page class="page-container">
    <div class="column-container">
      <div class="row q-mb-md flex justify-end" v-if="$q.screen.width <= 500">
        <input-salinity :is-headline="false"></input-salinity>
      </div>
      <q-select
        filled
        label="Add new item"
        @input="addOption"
        :value="null"
        :options="optionsWithLabel"
        placeholder="Add new tank"/>
      <q-markup-table
        :dense="isDense"
        class="full-width q-mt-lg">
        <thead>
          <tr>
            <th>Name</th>
            <th v-if="showCalculations">Volume</th>
            <th v-if="showCalculations">Density</th>
            <th v-if="!isDense">Weight</th>
            <th>Buoyancy</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(weightItem, index) in weights" :key="index"
            style="cursor: pointer"
            @click="edit(index)"
        >
          <td style="white-space: normal; overflow: hidden; max-width: 150px;">
            {{ math.GetWeightItemLabel(weightItem) }}
          </td>
          <td v-if="!isDense" class="text-right">{{ weightItem.weight.toFixed(1) }} kg</td>
          <td v-if="showCalculations"
              class="text-right">{{ weightItem.volume.toFixed(1) }} &ell;</td>
          <td v-if="showCalculations"
              class="text-right">{{ weightItem.density.toFixed(1) }} kg/&ell;</td>
          <td class="text-right" v-if="$store.state.buoyancy.salinity === 'fresh'">
            <buoyancy :buoyancy="weightItem.buoyancyFreshWater"/>
          </td>
          <td class="text-right" v-if="$store.state.buoyancy.salinity === 'salt'">
            <buoyancy :buoyancy="weightItem.buoyancySaltWater"/>
          </td>
          <td style="width: 12px">
            <q-btn
              color="grey-7"
              flat dense label="edit"
              @click="edit(index)"/>
            <q-btn size="12px" flat dense round icon="delete"
                   color="grey-7"
                   @click.stop="deleteIdx(index)"/>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
      <q-dialog v-model="showEdit">
        <q-card>
          <q-card-section v-if="false">
            <div class="text-h6" v-if="currentWeightItem!=null">
              {{ currentWeightItem.name }}
            </div>
            <div class="text-subtitle2"
                 v-if="currentWeightItem!=null"
            >Define by {{ currentWeightItem.mode }}</div>
          </q-card-section>
          <EditWeight
            :dense="isDense"
            :index="currentWeightIndex"
          />
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Close" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>

</template>
<script>
import Buoyancy from 'components/Buoyancy';
import EditWeight from 'pages/EditWeight';
import InputSalinity from 'components/InputSalinity';
import * as math from '../math';

export default {
  name: 'PageWeights',
  data() {
    return {
      currentWeightIndex: null,
      showEdit: false,
      showCalculations: false,
    };
  },
  components: {
    InputSalinity,
    EditWeight,
    Buoyancy,
  },
  methods: {
    addOption(value) {
      value = this.calculateByMaterial(value);
      value.mode = 'material';
      this.$store.dispatch('buoyancy/addWeightItem', value);
    },
    calculateByMaterial({ name, weight, material }) {
      const obj = {
        name,
        weight,
        material,
      };
      obj.density = math.WeightItemMaterials[material].density;
      obj.volume = obj.weight / obj.density;
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
    edit(index) {
      this.showEdit = true;
      this.currentWeightIndex = index;
    },
    deleteIdx(index) {
      this.$store.dispatch('buoyancy/deleteWeightItem', index);
      return false;
    },
  },
  computed: {
    isDense() {
      return this.$q.screen.lt.sm;
    },
    currentWeightItem() {
      if (this.currentWeightIndex < this.$store.state.buoyancy.weightItems.length) {
        return this.$store.state.buoyancy.weightItems[this.currentWeightIndex];
      }
      return null;
    },
    optionsWithLabel() {
      return math.WeightItems.map((option, idx) => {
        option.label = math.GetWeightItemLabel(option);
        option.value = idx;
        return option;
      });
    },
    weights() {
      return this.$store.state.buoyancy.weightItems;
    },
    math() {
      return math;
    },
  },
};
</script>
