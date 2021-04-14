<template>
  <q-card-section class="tank-card">
    <div class="input-row"         v-if="item.isDry"
    >
      <input-spinner
        label="Thickness underwear"
        suffix="mm"
        v-model="underwearThickness"
        :step="0.5"
        :decimals="1"
        :minimum="0"
        :maximum="40"
        :dense="$q.screen.lt.sm"
        help
        :hint="convertImperial(underwearThickness)"
      >
        <template v-slot:help-title>
          Thickness underwear
        </template>
        <template v-slot:help>
          Thicker underwear contains more air. <br/>
          <strong>To measure:</strong><br/>
          <ul>
            <li>
              Fold a piece of clothing
            </li>
            <li>
              Measure it's thickness
            </li>
            <li>
              Divide by 2
            </li>
          </ul>

          Subtract 1-2 mm for diving with high squeeze,
          or add 1-2mm for diving with higher comfort.

          <br/><br/><strong>Example values:</strong><br/>
          <ul>
            <li>Bare baselayer: 1mm</li>
            <li>Bare mid layer: 5mm</li>
          </ul>
        </template>
      </input-spinner>
    </div>
    <div class="input-row" v-if="item.hasNeoprene">
      <input-spinner
        suffix="mm"
        label="Thickness (new)"
        v-model="thickness"
        :hint="convertImperial(thickness)"
        :step="0.5"
        :decimals="1"
        :minimum="0"
        :maximum="20"
        :dense="$q.screen.lt.sm"
        help
      >
        <template v-slot:help-title>
          Neoprene thickness
        </template>
        <template v-slot:help>
          <p>
            Enter the thickness of the suit when in new condition.
          </p>
        </template>

      </input-spinner>
    </div>
    <div class="input-row" v-if="item.hasNeoprene">
      <input-select
        :options="[
          {
            label: 'New',
            value: 5,
          },
          {
            label: 'Lightly used',
            value: 4,
          },
          {
            label: 'Used',
            value: 3,
          },
          {
            label: 'Heavily used',
            value: 2,
          },
          {
            label: 'Almost rubber',
            value: 1,
          }
        ]"
        map-options
        emit-value
        v-model="agePercentage"
        label="Neoprene condition (insulation, flexibility)"
        help
        >
        <template v-slot:help-title>
          Neoprene condition (insulation)
        </template>
        <template v-slot:help>
          <p>
          Neoprene insulates because it has air trapped in the material.
          </p>

          <p>
          We assume a new wetsuit to be
            <ul>
              <li>25% rubber (edpm) that does not compress</li>
              <li>75% air that compresses under pressure,
                and can also escape from the suit over time. ( Bardy et, al)</li>
            </ul>
          </p>

          <p>
            We assume a new (crushed or compressed)
            neoprene drysuit to be:
          <ul>
            <li>60% rubber (edpm) that does not compress</li>
            <li>40% air that compresses under pressure,
              and can also escape from the suit over time.</li>
            <li>These values are an educated guess</li>
          </ul>
          </p>
          <p>
            When compressed neoprene will lose air: the suit will become
            less buoyant (float less), colder to wear and less flexible.
          </p>

          <a href="https://www.researchgate.net/publication/230971354_Thermal_conductivity_and_compressive_strain_of_foam_neoprene_insulation_under_hydrostatic_pressure">
            Source (Bardy, Mollendorf, and Pendergast 2005)
          </a>
        </template>

      </input-select>
    </div>

    <template v-if="item.hasNeoprene && false">
    <div class="data-row">
      <span>Estimated thickness</span>
      <span>{{  computeItemThickness.agedThickness.toFixed(1) }} mm</span>
    </div>
    <div class="data-row">
      <span>Dry weight</span>
      <span>{{  computeItemThickness.mass.toFixed(1) }} kg</span>
    </div>
    </template>
    <template v-if="item.hasNeoprene">
      <div class="input-row data-row">
        <span>Buoyancy</span>
      </div>

      <div style="margin-right: 25px;">
      <q-markup-table
        dense
        flat
        separator="none"
        class="buoyancy-depth-table">
        <tbody>
        <tr v-for="(depth, idx) in depths" :key="idx">
          <td class="text-right">
            <depth :depth="depth"></depth>
          </td>
          <td>
            <buoyancy :buoyancy="buoyancyAtDepth(depth,
              $store.getters['buoyancy/currentWaterDensity'])"></buoyancy>
          </td>
        </tr>
        </tbody>
      </q-markup-table>
      </div>
    </template>
    <template v-else>
      <div class="data-row">
      <span>The trilaminate suit is assumed to be
        neutral in both fresh and salt water</span>
      </div>
      <div class="input-row data-row">
        <span>Buoyancy</span><buoyancy :buoyancy="buoyancy"/>
      </div>
    </template>

  </q-card-section>
</template>
<script>
import InputSpinner from 'components/InputSpinner';
import * as math from 'src/math';
import * as units from 'src/units';
import Buoyancy from 'components/Buoyancy';
import InputSelect from 'components/InputSelect';
import Depth from 'components/Depth';

export default {
  components: {
    Depth, InputSelect, Buoyancy, InputSpinner,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  methods: {
    convertImperial(value) {
      if (this.$store.state.buoyancy.isMetric) {
        return undefined;
      }
      return `${parseFloat(value).toFixed(1)} mm ≈ ${units.mmAsInchFraction(value)} inch`;
    },
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
    buoyancyAtDepth(msw) {
      const ata = (msw / 10) + 1;
      return this.computeItemAtPressure(ata,
        this.$store.getters['buoyancy/currentWaterDensity']);
    },
  },
  computed: {
    depths() {
      return this.$store.state.buoyancy.isMetric
        ? math.DepthsMetric
        : math.DepthsImperial;
    },
    computeItemThickness() {
      // assumtion: old and new wetsuits weigh the same.
      return math.CalculateAgedThickness(this.item, 1);
    },
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
};
</script>
<style lang="scss">
.tank-card {
  .input-row {
    margin-top: 5px;
  }
}

table.q-table tbody td {
  font-size: 14px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding-right: 45px;
  padding-left: 10px;
  padding-top: 10px;
  align-items: center;
}

</style>
