<template>
  <span class="volume">
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
  },
};
</script>
