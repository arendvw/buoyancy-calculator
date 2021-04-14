const routes = [
  {
    path: '/',
    redirect: '/person',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'person',
        path: 'person',
        component: () => import('pages/Person.vue'),
      },
      {
        name: 'suit',
        path: 'suit',
        component: () => import('pages/Suit.vue'),
      },
      {
        name: 'tank',
        path: 'tank',
        component: () => import('pages/Tank.vue'),
      },
      {
        name: 'editTank',
        path: 'tank/:tankId',
        component: () => import('pages/Tank.vue'),
      },
      {
        name: 'equipment',
        path: 'equipment',
        component: () => import('pages/Equipment.vue'),
      },
      {
        name: 'weights',
        path: 'weights',
        component: () => import('pages/Weights.vue'),
      },
      {
        name: 'report',
        path: 'report',
        component: () => import('pages/Report.vue'),
      },
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
