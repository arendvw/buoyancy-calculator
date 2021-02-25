<template>
  <q-item class="q-pa-md">
    <div class="col-grow">
      <q-item-label lines="1" class="flex">
        <div class="col-grow">
          <strong>{{ item.label }}</strong>
        </div>
      </q-item-label>
      <div class="q-mt-md" v-if="item.hasNeoprene">
        <input-spinner
            suffix="mm"
            label="Thickness"
            v-model="thickness"
            :step="0.5"
            :decimals="1"
            :minimum="0"
            :maximum="20"
            :dense="$q.screen.lt.sm"

        >
        </input-spinner>
      </div>
      <div class="q-mt-md" v-if="item.isDry">
        <input-spinner
            label="Thickness underwear"
            v-if="item.isDry"
            suffix="mm"
            v-model="underwearThickness"
            :step="0.5"
            :decimals="1"
            :minimum="0"
            :maximum="40"
            :dense="$q.screen.lt.sm"
        >
        </input-spinner>
      </div>
      <div class="q-mt-md flex justify-end" v-if="item.hasNeoprene">
        <div
            style="text-align: left; flex-grow: 1; font-size: 13px; padding-top: 5px">
          Condition (insulation, flexibility)
        </div>
        <q-rating
            filled
            v-model="agePercentage"
            size="2em"
            color="green-5"
            icon="star_border"
            icon-selected="star"
        />
      </div>
    </div>
    <div class="weight-button">
      <div>
        <buoyancy :buoyancy="buoyancy"/>
        <q-btn size="12px"
               flat
               dense
               round
               icon="delete"
               @click="deletePiece"
        />
      </div>
    </div>
  </q-item>
</template>
<script>
import Buoyancy from 'components/Buoyancy';
import InputSpinner from 'components/InputSpinner';
import * as math from 'src/math';

export default {
  components: {
    Buoyancy,
    InputSpinner,
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
      this.$store.dispatch('buoyancy/deleteWetsuitPiece', this.index);
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
  display: flex;
  flex-direction: column;
  justify-content: end;
  padding-left: 10px;
}

@media (max-width: $breakpoint-sm-min) {
  //
}
</style>
