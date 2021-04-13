<template>
  <span class="weight">
    {{ weight.toFixed(1) }} kg
  </span>
</template>

<script>
export default {
  props: {
    weight: {
      type: Number,
      required: true,
    },
  },
};
</script>
