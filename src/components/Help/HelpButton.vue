<template>
  <div class="help-button-inline">
    <q-btn
        icon="help"
        size="sm"
        @click="showHelp = true"
        round
        unelevated
        color="grey-2"
        text-color="black"
    >
    </q-btn>
    <help-dialog v-model="showHelp">
      <template v-slot:title>
        <slot name="help-title"></slot>
      </template>
      <template v-slot>
        <slot name="help"></slot>
      </template>
    </help-dialog>
  </div>
</template>
<script>
import HelpDialog from 'components/Help/HelpDialog';

export default {
  components: { HelpDialog },
  data() {
    return {
      showHelp: false,
    };
  },
};
</script>
<style lang="scss">

.help-button-inline {
  display: inline-flex;
}
</style>
