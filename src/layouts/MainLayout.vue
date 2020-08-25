<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Buoyancy calculator
        </q-toolbar-title>

        <div>v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
        </q-item-label>
        <EssentialRoute
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialRoute from 'components/EssentialRoute.vue';

const linksData = [
  {
    title: 'Your weight',
    caption: 'What is your buoyancy?',
    icon: 'accessibility',
    to: 'person',
  },
  {
    title: 'Your suit',
    caption: 'What does your suit weigh?',
    icon: 'ac_unit',
    to: 'suit',
  },
  {
    title: 'Bcd',
    caption: 'Buoyancy compensator',
    icon: 'bubble_chart',
    to: 'bcd',
  },
  {
    title: 'Tank',
    caption: 'What does your tank weigh?',
    icon: 'battery_unknown',
    to: 'tank',
  },
  {
    title: 'Weights and equipment',
    caption: 'How much lead do you use?',
    icon: 'fitness_center',
    to: 'weights',
  },
  {
    title: 'Report',
    caption: 'Calculate your buoyancy',
    icon: 'receipt',
    to: 'report',
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialRoute },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
};
</script>
