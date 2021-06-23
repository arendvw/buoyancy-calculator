<template>
  <div class="stepper">
    <q-input
      :label="label"
      filled
      square
      type="number"
      :dense="dense"
      input-class="text-right"
      side
      :value="inputValue"
      @input="onInput"
      :suffix="suffix"
      :disable="disable"
      :hint="hint"
     />
    <q-btn
      unelevated
      color="grey-2"
      text-color="black"
      size="sm"
      class="q-ml-xs q-pa-xs"
      icon="remove"
      :dense="dense"
      :disable="disable"
      @click="removeStep"
    ></q-btn>
    <q-btn
      unelevated
      square
      :dense="dense"
      :disable="disable"
      size="sm"
      color="grey-2"
      text-color="black"
      class="q-ml-xs q-pa-xs"
      icon="add"
      @click="addStep"
    ></q-btn>
    <template v-if="help">
      <div class="help-button-inline">
        <q-btn
          class=""
          icon="help"
          size="sm"
          @click="showHelp = true"
          round
          unelevated
          color="grey-2"
          text-color="black"
        >
        </q-btn>
      </div>
      <help-dialog v-model="showHelp">
        <template v-slot:title>
          <slot name="help-title"></slot>
        </template>
        <template v-slot>
          <slot name="help"></slot>
        </template>
      </help-dialog>
    </template>
  </div>
</template>

<script>
import HelpDialog from 'components/Help/HelpDialog';
import * as units from '../units';

export default {
  components: { HelpDialog },
  props: {
    hint: {
      type: String,
      required: false,
    },
    value: {
      type: Number,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: false,
    },
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },
    step: {
      type: Number,
      required: false,
      default: 1,
    },
    decimals: {
      type: Number,
      default: 0,
    },
    suffix: {
      type: String,
      required: false,
      default: '',
    },
    minimum: {
      type: Number,
      required: false,
      default: NaN,
    },
    maximum: {
      type: Number,
      required: false,
      default: NaN,
    },
    help: {
      type: Boolean,
      default: false,
    },
    converter: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showHelp: false,
    };
  },
  methods: {
    bounds(value) {
      if (!Number.isNaN(this.maximum)) {
        value = Math.min(this.maximum, value);
      }
      if (!Number.isNaN(this.minimum)) {
        value = Math.max(this.minimum, value);
      }
      return value;
    },
    onInput(value) {
      let floatVal = 0;
      if (this.converter !== null) {
        floatVal = units.units[this.converter].toMetric(value);
      } else {
        floatVal = parseFloat(value);
      }
      if (!Number.isNaN(floatVal)) {
        this.$emit('input', this.bounds(floatVal));
      }
      return false;
    },
    removeStep() {
      // very close to a 'snap' value..
      if (this.step && this.value % this.step > this.step / 100) {
        const val = this.value - (this.value % this.step);
        this.$emit('input', val);
        return;
      }
      this.$emit('input', this.bounds(this.value - this.step));
    },
    addStep() {
      // very close to a 'snap' value..
      if (this.step && this.value % this.step < this.step / 100) {
        const val = this.value - (this.value % this.step) + this.step;
        this.$emit('input', this.bounds(val));
        return;
      }
      this.$emit('input', this.bounds(this.value + this.step));
    },
  },
  computed: {
    inputValue() {
      if (this.converter !== null) {
        return units.units[this.converter]
          .fromMetric(this.value)
          .toFixed(this.decimals);
      }
      return this.value.toFixed(this.decimals);
    },
  },
};
</script>
<style lang="scss">
  .stepper {
    display: flex;
    align-items: stretch;
    justify-items: flex-start;
    position: relative;
    label {
      width: 100%;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    input[type=number] {
      -moz-appearance:textfield; /* Firefox */
    }
    .help-button-inline {
      padding-left: 10px;
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: column;
      .btn {
        flex-grow: 0;
      }
    }
    .help-button {
      position: absolute;
      right: -50px;
      top: 15px;
    }
    @media (max-width: $breakpoint-sm-max) {
      .help-button {
        position: absolute;
        right: -35px;
        top: 5px;
      }
    }
  }

</style>
