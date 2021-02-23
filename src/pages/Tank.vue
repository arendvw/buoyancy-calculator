<template>
  <q-page class="flex" style="align-content: start">
    <div class="q-pa-md q-gutter-y-md full-width page-width">
      <div class=" column">
        <q-select
          filled
          label="Add new tank"
          @input="addOption"
          :value="null"
          :options="optionsWithLabel"
          placeholder="Add new tank"/>
      </div>
      <q-dialog v-model="showEdit">
        <q-card>
          <q-card-section>
            <div class="text-h6" v-if="currentTank!=null">
              {{ currentTank.volume.toFixed(1) }} ℓ {{ currentTank.material }}
              {{ currentTank.workingPressure }} bar
            </div>
          </q-card-section>
          <EditTank
            :is-dense="isDense"
            :index="currentTankIndex"
          />
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="Close" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-markup-table>
          <thead>
          <tr>
            <th colspan="3">
            </th>
            <th colspan="2">
              Weight
            </th>
            <th></th>
            <th colspan="2">
              Buoyancy
            </th>
            <th style="width: 50px"></th>
            <th></th>
          </tr>
          <tr>
            <th>Tank</th>
            <th style="width: 30px">Gas</th>
            <th></th>
            <th>Empty</th>
            <th>Gas</th>
            <th></th>
            <th>Full</th>
            <th>Empty</th>
            <th></th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(tank, index) in tanks" :key="index" style="cursor: pointer"
              @click="edit(index)">

            <td class="text-right" style="width: 40px">
              {{ math.GetTankFullLabel(tank) }}

            </td>
            <td>
              {{ math.GetGasLabel(tank.gasMixture) }}
            </td>
            <td></td>

            <td class="text-right" style="width: 40px">
              {{
                math.CalculateTankWeightWithValve(tank)
                  .toFixed(1)
              }} kg
            </td>
            <td class="text-right" style="width: 40px">
              {{ math.CalculateTankGasWeight(tank).toFixed(1) }} kg
            </td>
            <td></td>
            <td class="text-right" style="width: 40px">
              <buoyancy
                :buoyancy="math.CalculateTankBuoyancy(tank,
                  tank.workingPressure,
                  $store.getters['buoyancy/currentWaterDensity'])"/>
            </td>
            <td class="text-right" style="width: 40px">
              <buoyancy
                :buoyancy="math.CalculateTankBuoyancy(tank,
                  0,
                  $store.getters['buoyancy/currentWaterDensity'])"/>
            </td>
            <td style="width: 40px">
              <q-btn
                flat dense label="edit"
                @click="edit(index)"/>
            </td>
            <td style="width: 12px">
              <q-btn size="12px" flat dense round icon="delete"
                     @click.stop="deleteIdx(index)" />
            </td>
          </tr>
          </tbody>
      </q-markup-table>
    </div>
  </q-page>
</template>
<script>
import Buoyancy from 'components/Buoyancy';
import EditTank from 'pages/EditTank';
import * as math from '../math';

export default {
  name: 'PageTank',
  components: {
    EditTank,
    Buoyancy,
  },
  data() {
    return {
      showEdit: false,
      currentTankIndex: null,
      isDense: true,
    };
  },
  methods: {
    addOption(value) {
      value.isDouble = false;
      value.gasMixture = 'air';
      value.includeValve = true;
      value.configuredPressure = value.workingPressure;
      this.$store.dispatch('buoyancy/addTank', value);
    },
    deleteIdx(index) {
      this.$store.dispatch('buoyancy/deleteTank', index);
      return false;
    },
    edit(index) {
      this.showEdit = true;
      this.currentTankIndex = index;
    },
  },
  computed: {
    math() {
      return math;
    },
    currentTank() {
      if (this.currentTankIndex < this.$store.state.buoyancy.tanks.length) {
        return this.$store.state.buoyancy.tanks[this.currentTankIndex];
      }
      return null;
    },
    tanks() {
      return this.$store.state.buoyancy.tanks;
    },
    optionsWithLabel() {
      return math.TankConfigurations.map((option, idx) => {
        option.label = math.GetTankLabel(option);
        option.value = idx;
        return option;
      });
    },
  },
};
</script>
