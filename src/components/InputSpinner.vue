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
  </div>
</template>

<script>
export default {
  props: {
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
    snap: {
      type: Boolean,
      required: false,
      default: true,
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
      const floatVal = parseFloat(value);
      if (!Number.isNaN(floatVal)) {
        this.$emit('input', this.bounds(floatVal));
      }
      return false;
    },
    removeStep() {
      if (this.step && this.value % this.step !== 0) {
        const val = this.value - (this.value % this.step);
        this.$emit('input', this.bounds(val));
        return;
      }
      this.$emit('input', this.bounds(this.value - this.step));
    },
    addStep() {
      if (this.step && this.value % this.step !== 0) {
        const val = this.value - (this.value % this.step) + this.step;
        this.$emit('input', this.bounds(val));
        return;
      }
      this.$emit('input', this.bounds(this.value + this.step));
    },
  },
  computed: {
    inputValue() {
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
  }
</style>
