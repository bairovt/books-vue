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
      {text: "ПРЕДОПЛАТА", value: "PREPAY"},
      {text: "ЗАКАЗАН", value: "ORDERED"},
      {text: "ДОСТАВЛЕН", value: "SHIPPED"},
      {text: "ОПЛАЧЕН", value: "PAID"},
      {text: "ВОЗВРАТ", value: "RETURN"},
      {text: "УКЛОНЕНИЕ", value: "AVOID"},
      {text: "НЕОПРЕДЕЛЕН", value: "UNDEF"},
    ]
  },
  mutations: {
    setLoading(state, payload) {state.loading = payload},
    setBooks(state, payload) {state.books = payload},
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
