<template>
  <span class="pressure">
    {{ pressure.toFixed(0) }} kg
  </span>
</template>

<script>
export default {
  props: {
    pressure: {
      type: Number,
      required: true,
    },
  },
};
</script>
