<template>
  <q-footer reveal elevated>
    <q-toolbar>
      <q-btn
        v-if="previous !== null"
        flat
        :to="{ name: previous.name }"
        align="left"
        icon="arrow_back_ios">{{ previous.title }}</q-btn>
      <div v-else>
        <span></span>
      </div>
      <q-btn
        v-if="next !== null"
        :to="{ name: next.name }"
        flat
        align="right"
        icon-right="arrow_forward_ios">
        {{ next.title }}
      </q-btn>
      <div v-else></div>
    </q-toolbar>
  </q-footer>
</template>
<script>
// eslint-disable-next-line no-unused-vars
const routes = [
  {
    name: 'person',
    title: 'Your weight',
  },
  {
    title: 'Your suit',
    name: 'suit',
  },
  {
    name: 'tank',
    title: 'Tanks',
  },
  {
    name: 'weights',
    title: 'Equipment',
  },
  {
    name: 'report',
    title: 'Report',
  },
  {
    name: 'balancedrig',
    title: 'Balanced Rig',
  },
];
export default {
  name: 'navigation-footer',
  computed: {
    currentIndex() {
      const currentPage = routes.find((item) => item.name === this.$route.name);
      if (currentPage == null) {
        return null;
      }
      return routes.indexOf(currentPage);
    },
    current() {
      if (this.currentIndex == null) {
        return null;
      }
      if (this.currentIndex < routes.length) {
        return routes[this.currentIndex];
      }
      return null;
    },
    next() {
      if (this.currentIndex == null) {
        return null;
      }
      const next = this.currentIndex + 1;
      if (next < routes.length) {
        return routes[next];
      }
      return null;
    },
    previous() {
      if (this.currentIndex == null) {
        return null;
      }
      const previous = this.currentIndex - 1;
      if (previous >= 0) {
        return routes[previous];
      }
      return null;
    },
  },
};
</script>
<style lang="scss">
  .q-footer .q-toolbar {
    justify-content: space-between;
    max-width: 1000px;
    .q-btn {
      min-width: 150px;
    }
  }
  .q-footer {
    max-width: 1000px;
  }
</style>
