<template>
  <div class="selector">
    <q-select
      filled
      :label="label"
      :options="options"
      :map-options="mapOptions"
      :dense="dense"
      square
      :value="value"
      :disable="disable"
      :emit-value="emitValue"
      @input="onInput"
    >
    </q-select>
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

export default {
  components: { HelpDialog },
  props: {
    value: {
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
    options: {
      type: Array,
      default() { return []; },
    },
    mapOptions: {
      type: Boolean,
      default: false,
    },
    emitValue: {
      type: Boolean,
      default: false,
    },
    help: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showHelp: false,
    };
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>
<style lang="scss">
  .selector {
    display: flex;
    align-items: stretch;
    justify-items: flex-start;
    position: relative;
    label {
      width: 100%;
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
  }

</style>
