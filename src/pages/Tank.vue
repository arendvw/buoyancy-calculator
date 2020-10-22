<template>
  <q-page class="flex" style="align-content: start">
    <div class="full-width page-width">
      <div class="q-pa-md q-gutter-y-md column">
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
      <div class="q-pa-md q-gutter-y-md column full-width ">
        <q-markup-table v-if="false">
          <thead>
          <tr>
            <th>Tank volume (&ell;)</th>
            <th>Material</th>
            <th>Empty weight (kg)</th>
            <th>Operating pressure (bar)</th>
            <th>Gas mix</th>
            <th>Full</th>
            <th>Empty</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(tank, index) in tanks" :key="index">
            <td class="text-right" style="width: 40px">
              <input-spinner
                :value="tank.volume"
                @input="setVolume(index, $event)"
                :decimals="1"
                suffix="ℓ"
                dense
                :minimum="0"
              >
              </input-spinner>
              <q-checkbox
                :value="tank.isDouble"
                @input="setIsDouble(index, $event)"
                label="Double"
              />
            </td>
            <td style="width: 40px">
              <q-btn-toggle
                :value="tank.material"
                @input="setMaterial(index, $event)"
                size="sm"
                class="q-ml-lg"
                toggle-color="primary"
                :options="materialOptions"
              />
            </td>
            <td class="text-right" style="width: 40px">
              <input-spinner
                :value="tank.weight"
                @input="setWeight(index, $event)"
                :decimals="1"
                :step="0.5"
                suffix="kg"
                dense
                :minimum="0"
              ></input-spinner>
            </td>
            <td class="text-right" style="width: 40px">
              <input-spinner
                :value="tank.workingPressure"
                @input="setWorkingPressure(index, $event)"
                :decimals="0"
                :step="10"
                suffix="bar"
                dense
                :minimum="0"
              ></input-spinner>
            </td>
            <td>
              <q-select
                dense
                filled
                @input="setGas(index, $event)"
                :value="tank.gasMixture"
                :options="gasses"
                map-options
              />
            </td>
            <td class="text-right">
              {{
                math.CalculateTankBuoyancy(tank,
                  tank.workingPressure,
                  $store.getters['buoyancy/currentWaterDensity'])
                  .toFixed(1)
              }} kg
            </td>
            <td class="text-right">
              {{
                math.CalculateTankBuoyancy(tank,
                  0,
                  $store.getters['buoyancy/currentWaterDensity'])
                  .toFixed(1)
              }} kg
            </td>
            <td style="width: 25px">
            </td>
          </tr>
          </tbody>
        </q-markup-table>
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
    </div>
  </q-page>
</template>
<script>
import InputSpinner from 'components/InputSpinner';
import Buoyancy from 'components/Buoyancy';
import EditTank from 'pages/EditTank';
import * as math from '../math';

export default {
  name: 'PageTank',
  components: {
    EditTank,
    Buoyancy,
    InputSpinner,
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
