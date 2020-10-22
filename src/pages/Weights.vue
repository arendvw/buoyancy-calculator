<template>
  <q-page class="flex">
    <div class="q-pa-md q-gutter-y-md column full-width page-width">
      <q-select
        filled
        label="Add new item"
        @input="addOption"
        :value="null"
        :options="optionsWithLabel"
        placeholder="Add new tank"/>
      <q-markup-table class="full-width">
        <thead>
          <tr>
            <th>Name</th>
            <th>Material</th>
            <th>Weight</th>
            <th v-if="showCalculations">Volume</th>
            <th v-if="showCalculations">Density</th>
            <th v-if="$store.state.buoyancy.salinity === 'fresh'">Buoyancy (fresh water)</th>
            <th v-if="$store.state.buoyancy.salinity === 'salt'">Buoyancy (salt water)</th>
            <th colspan="2"></th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(weightItem, index) in weights" :key="index"
            style="cursor: pointer"
            @click="edit(index)"
        >
          <td>{{ weightItem.name }}</td>
          <td>{{ weightItem.material }}</td>
          <td class="text-right">{{ weightItem.weight.toFixed(1) }} kg</td>
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
          <td style="width: 40px">
            <q-btn
              flat dense label="edit"
              @click="edit(index)"/>
          </td>
          <td style="width: 12px">
            <q-btn size="12px" flat dense round icon="delete"
                   @click.stop="deleteIdx(index)"/>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
      <q-dialog v-model="showEdit">
        <q-card>
          <q-card-section>
            <div class="text-h6" v-if="currentWeightItem!=null">
              {{ currentWeightItem.name }}
            </div>
            <div class="text-subtitle2"
                 v-if="currentWeightItem!=null"
            >Define by {{ currentWeightItem.mode }}</div>
          </q-card-section>
          <EditWeight
            :is-dense="isDense"
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
import * as math from '../math';

export default {
  name: 'PageWeights',
  data() {
    return {
      currentWeightIndex: null,
      showEdit: false,
      isDense: false,
      showCalculations: false,
    };
  },
  components: {
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
      console.log(obj);
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
  },
};
</script>
