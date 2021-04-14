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
      :mask="mask"
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
export default {
};
</script>
