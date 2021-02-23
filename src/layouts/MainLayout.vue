<template>
  <q-layout view="lHh Lpr lFf">
    <navigation-header/>
    <navigation-footer/>
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
import NavigationFooter from 'layouts/NavigationFooter';
import NavigationHeader from 'layouts/NavigationHeader';

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
    title: 'Tank',
    caption: 'What does your tank weigh?',
    icon: 'battery_unknown',
    to: 'tank',
  },
  {
    title: 'Weights and equipment',
    caption: 'How much does your equipment weigh?',
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
  components: { NavigationHeader, NavigationFooter, EssentialRoute },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
};
</script>

<style lang="scss">
  .q-toolbar__title {
    max-width: 750px;
  }
  @media (max-width: $breakpoint-xs-max)
  {
    .q-toolbar__title {
      max-width: 100%;
    }
  }
  .page-width {
    max-width: 1000px;
  }
  .width-100-pct {
    width: 100%;
  }
  .max-width-600 {
    width: 100%;
    max-width: 600px;
  }
  .max-width-500 {
    width: 100%;
    max-width: 500px;
  }
  .max-width-400 {
    width: 100%;
    max-width: 400px;
  }
  .max-width-300 {
    width: 100%;
    max-width: 300px;
  }
  .max-width-100 {
    width: 100%;
    max-width: 100px;
  }
</style>
