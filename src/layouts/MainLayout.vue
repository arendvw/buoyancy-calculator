<template>
  <q-layout view="lHh Lpr lFf">
    <navigation-header
      @toggle="leftDrawerOpen = !leftDrawerOpen">
    </navigation-header>
    <navigation-footer/>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
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
      <q-item>
        <q-item-section style="padding-left: 55px">
          <input-units :is-headline="false"></input-units>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <div class="page-container">
          <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialRoute from 'components/EssentialRoute.vue';
import NavigationFooter from 'layouts/NavigationFooter';
import NavigationHeader from 'layouts/NavigationHeader';
import InputUnits from 'components/InputUnits';

const linksData = [
  {
    title: 'Your weight',
    caption: 'What is your buoyancy?',
    icon: 'accessibility',
    to: { name: 'person' },
  },
  {
    title: 'Your suit',
    caption: 'What does your suit weigh?',
    icon: 'ac_unit',
    to: { name: 'suit' },
  },
  {
    title: 'Tank',
    caption: 'What does your tank weigh?',
    icon: 'battery_unknown',
    to: { name: 'tank' },

  },
  {
    title: 'Weights and equipment',
    caption: 'How much does your equipment weigh?',
    icon: 'fitness_center',
    to: { name: 'weights' },

  },
  {
    title: 'Report',
    caption: 'Calculate your buoyancy',
    icon: 'receipt',
    to: { name: 'report' },

  },
];

export default {
  name: 'MainLayout',
  components: {
    InputUnits,
    NavigationHeader,
    NavigationFooter,
    EssentialRoute,
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    };
  },
};
</script>

<style lang="scss">

  #q-app {
    background-color: $grey-1;
  }
  .q-toolbar__title {
    max-width: 750px;
  }
  @media (max-width: $breakpoint-xs-max)
  {
    .q-toolbar__title {
      max-width: 100%;
    }
  }
  .page-container {
    max-width: 1000px;
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: white;
    border-right: solid 1px $grey-3;
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

  .page-container {
    display: flex;
    align-content: center;
  }
  .column-container {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 15px;
  }
  @media (max-width: 550px) {
    .column-container {
      width: 100%;
    }
  }

  @media (min-width: 550px) {
    .column-container {
      width: 550px;
    }
  }

  .buoyancy-depth-table {
    td:nth-child(2), td:nth-child(3) {
      text-align: right;
      max-width: 50px;
    }

    .stepper label {
      min-width: 90px;
    }
  }
</style>
