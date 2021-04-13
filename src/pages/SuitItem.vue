<template>
  <div class="q-item-type q-pa-md suit-item-card">
    <div class="title"
         @click="$emit('click')">
      <strong>{{ item.label }}</strong>
      <div class="underwear-thickness "
           v-if="item.isDry || item.hasNeoprene">
        <template v-if="item.hasNeoprene">
          {{ thickness.toFixed(1) }} mm<template v-if="item.isDry">, </template>
        </template>
        <template v-if="item.isDry">
          underwear
          {{ underwearThickness.toFixed(1) }} mm
        </template>
      </div>
    </div>
    <div class="weight-button">
      <div>
        <buoyancy :buoyancy="buoyancy"/>
      </div>
    </div>
    <div class="edit-buttons">
      <div>
      <q-btn
        flat
        color="grey-7"
        dense
        @click="$emit('click')"
      >Edit</q-btn>
      </div>
      <div>
      <q-btn size="12px"
             flat
             dense
             round
             color="grey-7"
             icon="delete"
             @click="deletePiece"
      />
      </div>
    </div>
  </div>
</template>
<script>
import Buoyancy from 'components/Buoyancy';
import * as math from 'src/math';

export default {
  components: {
    Buoyancy,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    item() {
      return this.$store.state.buoyancy.wetsuitPieces[this.index];
    },
    thickness: {
      get() {
        return this.item.thickness;
      },
      set(value) {
        this.$store.dispatch('buoyancy/updateWetsuitPiece', {
          index: this.index,
          thickness: parseFloat(value),
        });
      },
    },
    underwearThickness: {
      get() {
        return this.item.underwearThickness;
      },
      set(value) {
        this.$store.dispatch('buoyancy/updateWetsuitPiece', {
          index: this.index,
          underwearThickness: parseFloat(value),
        });
      },
    },
    agePercentage: {
      get() {
        return this.item.agePercentage / 20.0;
      },
      set(value) {
        this.$store.dispatch('buoyancy/updateWetsuitPiece', {
          index: this.index,
          agePercentage: value * 20.0,
        });
      },
    },
    buoyancy() {
      return this.computeItemAtPressure(1,
        this.$store.getters['buoyancy/currentWaterDensity']);
    },
    mass() {
      const { mass } = math.CalculateSuit(this.item, 1);
      return mass;
    },
  },
  methods: {
    // remap value?
    setAgePercentage(value) {
      this.$store.dispatch('buoyancy/updateWetsuitPiece', {
        index: this.index,
        agePercentage: value,
      });
    },
    deletePiece() {
      setTimeout(() => {
        this.$store.dispatch('buoyancy/deleteWetsuitPiece', this.index);
      }, 20);
    },
    computeItemAtPressure(pressure, waterDensity) {
      // assumtion: old and new wetsuits weigh the same.
      const { mass, volume } = math.CalculateSuit(this.item, pressure);
      return math.CalculateUnderwaterWeight(mass, volume, waterDensity);
    },
  },
};
</script>
<style lang="scss">
.weight-button {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  padding-left: 10px;
  grid-row: 1/3;
}

.edit-buttons {
  display: inline-flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  padding-left: 10px;
  grid-row: 1/3;
}

.suit-item-card {
  strong {
    font-weight: 500;
  }
  display: grid;
  grid-template-columns: 1fr 75px 75px;
  .title {
    grid-row: 1/3;
    grid-column: 1;
  }
  cursor: pointer;
  &:hover {
    background-color: $grey-2;
  }
}
@media (max-width: $breakpoint-xs-max)
{
  .suit-item-card {
    grid-template-columns: 1fr 75px;
  }
  .weight-button, .edit-buttons {
    grid-row: auto;
  }
}
</style>
