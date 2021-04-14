<template>
  <span class="buoyancy">
    <weight :weight="buoyancy"></weight>
    <span class="icon">
      <q-icon name="expand_less" class="positive" v-if="buoyancy > 0.1"></q-icon>
      <q-icon name="drag_handle" class="neutral" v-if="buoyancy > -0.1 && buoyancy < 0.1"></q-icon>
      <q-icon name="expand_more" class="negative" v-if="buoyancy < -0.1"></q-icon>
    </span>
  </span>
</template>

<script>
import Weight from 'components/Weight';

export default {
  components: { Weight },
  props: {
    buoyancy: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style lang="scss">
  .buoyancy .positive {
    color: $green-4;
  }
  .buoyancy .negative {
    color: $red-4
  }

  .buoyancy .neutral {
    color: $grey-4
  }

  .buoyancy {
    padding-top: 4px;
    white-space: nowrap;
  }
</style>
