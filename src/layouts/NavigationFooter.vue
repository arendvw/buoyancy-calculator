<template>
  <q-footer reveal elevated>
    <q-toolbar>
      <q-btn flat icon="arrow_back_ios">      {{ $route.name }}
      </q-btn>
      <q-toolbar-title>
      </q-toolbar-title>
      <q-btn flat icon-right="arrow_forward_ios">Next</q-btn>
    </q-toolbar>
  </q-footer>
</template>
<script>
export default {
  name: 'navigation-footer',
};
</script>
<style lang="scss">
</style>
