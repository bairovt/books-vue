import Vue from 'vue';
import Router from 'vue-router';
import Books from './views/Books.vue';
import Clients from './views/Clients.vue';
import Client from './views/Client.vue';

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
  ],
  mode: 'history'
});
