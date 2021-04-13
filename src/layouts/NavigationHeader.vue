<template>
  <q-header reveal elevated>
    <q-toolbar>
      <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="$emit('toggle')"
      />

      <q-toolbar-title>
        <strong>Buoyancy</strong> Assistant
      </q-toolbar-title>
      <div v-if="$q.screen.width > 500">
        <input-salinity :is-headline="true"/>
      </div>
    </q-toolbar>
  </q-header>
</template>
<script>
import InputSalinity from 'components/InputSalinity';

export default {
  name: 'navigation-header',
  components: { InputSalinity },
};
</script>
<style lang="scss">
.q-header {
  max-width: 1000px;
}
</style>
