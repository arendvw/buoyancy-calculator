const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Person.vue') },
      { path: 'person', component: () => import('pages/Person.vue') },
      { path: 'suit', component: () => import('pages/Suit.vue') },
      { path: 'bcd', component: () => import('pages/Bcd.vue') },
      { path: 'tank', component: () => import('pages/Tank.vue') },
      { path: 'tank/:tankId', name: 'editTank', component: () => import('pages/Tank.vue') },
      { path: 'equipment', component: () => import('pages/Equipment.vue') },
      { path: 'weights', component: () => import('pages/Weights.vue') },
      { path: 'report', component: () => import('pages/Report.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
