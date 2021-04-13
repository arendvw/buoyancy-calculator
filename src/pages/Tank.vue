<template>
  <q-page class="page-container">
    <div class="column-container">
      <div class="row q-mb-md flex justify-end" v-if="$q.screen.width <= 500">
        <input-salinity :is-headline="false"></input-salinity>
      </div>
      <div class="column">
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
      <q-markup-table
        v-if="false"
        dense
      >
          <thead>
          <tr>
            <th colspan="2">
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
              {{ math.GetTankShortLabel(tank) }}<br />
              {{ math.GetGasLabel(tank.gasMixture) }}, {{tank.workingPressure}} bar
            </td>
            <td></td>
            <td class="text-right" style="width: 40px">
              {{
                math.CalculateTankWeightWithValve(tank)
                  .toFixed(1)
              }}&nbsp;kg
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
      <q-card class="q-mt-lg">
        <q-card-section
          class="tankListItem"
          v-for="(tank, index) in tanks" :key="index"
                        style="border-bottom: solid 1px #ccc">
          <div>
            <table class="tankTable" @click="edit(index)">
              <tr>
                <td class="titleCell">
                  <span>{{ math.GetTankShortLabel(tank) }}</span>, {{tank.workingPressure}}&nbsp;bar
              </td>
                <td>Weight</td>
                <td>Buoyancy</td>
                <td colspan="1" class="actions">
                  <q-btn
                    flat dense label="edit"
                    color="grey-7"
                    @click="edit(index)"/>
                  <q-btn size="12px"
                         color="grey-7"
                         flat dense round icon="delete"
                         @click.stop="deleteIdx(index)" />
                </td>
              </tr>

              <tr>
                <td>Full</td>
                <td class="weight-cell"> {{ (math.CalculateTankWeightWithValve(tank) +
                  math.CalculateTankGasWeight(tank)).toFixed(1) }} kg</td>
                <td>
                  <buoyancy
                    :buoyancy="math.CalculateTankBuoyancy(tank,
                  tank.workingPressure,
                  $store.getters['buoyancy/currentWaterDensity'])"/>
                </td>
              </tr>
              <tr><td>
                Empty
              </td>
              <td class="weight-cell">
                {{ math.CalculateTankWeightWithValve(tank)
                .toFixed(1) }} kg
              </td>
                <td>
                  <buoyancy
                    :buoyancy="math.CalculateTankBuoyancy(tank,
                  0,
                  $store.getters['buoyancy/currentWaterDensity'])"/>
                </td>
              </tr>
              <tr>
                <td>
                  {{ math.GetGasLabel(tank.gasMixture) }}
                </td>
                <td class="weight-cell">
                  {{ (math.CalculateTankGasWeight(tank).toFixed(1)) }} kg
                </td>
              </tr>
              <tr class="responsiveEdit">
                <td></td>
                <td></td>
                <td colspan="1" class="actions">
                  <q-btn
                    flat dense label="edit"
                    color="grey-7"
                    @click="edit(index)"/>
                  <q-btn size="12px"
                         color="grey-7"
                         flat dense round icon="delete"
                         @click.stop="deleteIdx(index)" />
                </td>
              </tr>
            </table>
          </div>
          <div class="buttons">

          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import Buoyancy from 'components/Buoyancy';
import EditTank from 'pages/EditTank';
import InputSalinity from 'components/InputSalinity';
import * as math from '../math';

export default {
  name: 'PageTank',
  components: {
    InputSalinity,
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
<style lang="scss">
.tankListItem {
  &:hover {
    background-color: $grey-2;
    cursor: pointer;
  }
}
.titleRow {
  display: flex;

}
.responsiveEdit {
  display: none;
}
.tankTable {
  width: 100%;
  td {
    padding: 2px;
  }
  .titleCell {
    width: 50%;
    font-weight: 500;
  }
  .weight-cell {
    color: $grey-7;
  }
  max-width: 500px;
  tr td:nth-child(2), tr td:nth-child(3), tr td:nth-child(4) {
    text-align: right;
  }
  td.pad {
    padding-right: 18px;
  }
}

@media (max-width: 500px) {
  .tankTable td:nth-child(4) {
    display: none;
  }
  .responsiveEdit {
    display: table-row;
  }
}
</style>
