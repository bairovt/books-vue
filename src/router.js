import Vue from 'vue';
import Router from 'vue-router';
import Books from './views/Books.vue';
import Clients from './views/Clients.vue';
import Client from './views/Client.vue';
import Order from './views/Order.vue';
import Places from './views/Places.vue';
// import Place from './views/Place.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Books,
    },
    {
      path: '/clients',
      name: 'clients',
      component: Clients,
    },
    {
      path: '/clients/:key',
      name: 'client',
      component: Client,
    },
    {
      path: '/orders/:key',
      name: 'order',
      component: Order,
    },
    {
      path: '/places',
      name: 'places',
      component: Places,
    },
    // {
    //   path: '/places/:key',
    //   name: 'place',
    //   component: Place,
    // },
  ],
  mode: 'history'
});
