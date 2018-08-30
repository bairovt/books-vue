import Vue from 'vue';
import Vuex from 'vuex';
import axiosInst from '@/utils/axios-instance'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    books: [],
    clients: [],
    clientsTotal: 0,
    user: {
      name: 'username'
    },
    statuses: [
      {text: "ЗАКАЗАН", value: "ORDERED"},
      {text: "ДОСТАВЛЕН", value: "SHIPPED"},
      {text: "ОПЛАЧЕН", value: "PAID"},
      {text: "ПРЕДОПЛАТА", value: "PREPAY"},
      {text: "НЕОПРЕДЕЛЕН", value: "UNDEF"},
    ]
  },
  mutations: {
    setLoading(state, payload) {state.loading = payload},
    setBooks(state, payload) {state.books = payload},
    // setClients(state, payload) {state.clients = payload}
    setClientsTotal(state, payload) {state.clientsTotal = payload}
  },
  actions: {
    fetchAllBooks({commit}) {
      axiosInst.get('/api/books')
        .then(resp => {
          commit('setBooks', resp.data);
        })
        .catch(console.error);
    },
    fetchClientsTotal({commit}) {
      axiosInst.get('/api/clients/total')
        .then(resp => {
          commit('setClientsTotal', resp.data);
        })
        .catch(console.error);
    }
  },
});
