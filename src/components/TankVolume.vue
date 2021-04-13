<template>
  <span class="tankVolume">
    {{ volume.toFixed(1) }} kg
  </span>
</template>

<script>
export default {
  props: {
    volume: {
      type: Number,
      required: true,
    },
    pressure: {
      type: Number,
      required: true,
    },
  },
};
</script>
