import Vue from 'vue';
import Router from 'vue-router';
import Books from './views/Books.vue';
import Clients from './views/Clients.vue';
import Client from './views/Client.vue';
import Order from './views/Order.vue';

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
  ],
  mode: 'history'
});
