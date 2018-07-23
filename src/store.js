import Vue from 'vue';
import Vuex from 'vuex';
import axiosInst from '@/utils/axios-instance'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    books: [],
    clients: [],
    user: {
      name: 'username'
    }
  },
  mutations: {
    setLoading(state, payload) {state.loading = payload},
    setBooks(state, payload) {state.books = payload},
    setClients(state, payload) {state.clients = payload}
  },
  actions: {
    fetchAllBooks({commit}) {
      axiosInst.get('/api/books')
        .then(resp => {
          commit('setBooks', resp.data);
        })
        .catch(console.error);
    },
    fetchAllClients({commit}) {
      axiosInst.get('/api/clients')
        .then(resp => {
          commit('setClients', resp.data);
        })
        .catch(console.error);
    }
  },
});
