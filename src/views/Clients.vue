<template>
  <v-container>
    <v-layout>
      <v-flex>
        <v-btn round @click.stop="fetchAllClients">
          <v-subheader>{{clientsTotal}}</v-subheader>
        </v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs2 sm1 class="text-lg-right">
        <v-btn small @click.stop="addClientDialog=true" fab color="teal" dark>+</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row class="mb-2">
      <v-flex xs2 sm1>
        <v-btn small color="primary" @click.stop="filterClients" fab>
          <v-icon>filter_list</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4 sm2>
        <v-select
          v-model="filter.status"
          :items="statuses"
          label="Статус"
        ></v-select>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex class="mb-2">
        <v-text-field
          :placeholder="placeholder"
          :messages = [clients.length]
          v-model="searchStr"
          @focus="placeholder='поиск'"
          @input="searchDebounced"
        ></v-text-field>
        <!-- @input="findClientsDeb" -->
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex xs12 sm6>
        <v-list>
          <template v-for="(client, index) in clients">
            <v-list-tile :key="client._key" :to="`/clients/${client._key}`">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{client.name}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{client.phone}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addClientDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="createClient">Добавить клиента</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="addClientDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <client-form :client="newClient"></client-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from 'lodash';
import axiosInst from '@/utils/axios-instance';

export default {
  data() {
    return {
      clients: [],
      searchStr: '',
      filter: {
        status: 'SHIPPED'
      },
      placeholder: 'поиск',
      addClientDialog: false,
      newClient: {
        name: "",
        phone: "",
        phone2: "",
        info: ""
      }
    }
  },
  computed: {
    statuses() {return this.$store.state.statuses},
    clientsTotal() {return this.$store.state.clientsTotal}
  },
  watch: {
    'filter.status': 'filterClients'
  },
  methods: {
    createClient() {
      axiosInst.post('/api/clients', {
        client: this.newClient
      })
      .then(resp => {this.$router.replace(`/clients/${resp.data._key}`)})
      .catch(console.error);
    },
    filterClients() {
      this.searchStr = '';
      this.placeholder = 'фильтр';
      axiosInst.get('/api/clients/filter', {
        params: {
          filter: JSON.stringify(this.filter)
        }
      }).then(resp => {
        this.clients = resp.data;
      }).catch(console.error);
    },
    fetchAllClients() {
      this.searchStr = '';
      this.placeholder = 'все';
      axiosInst.get('/api/clients/all')
        .then(resp => {
          this.clients = resp.data;
        })
        .catch(console.error);
    },
    search() {
      this.placeholder = 'поиск';
      if (this.searchStr.length <= 2) return this.clients = [];  // don't searchStr if <= 2 letters
      axiosInst.get('/api/clients/search', {
        params: {
          str: this.searchStr.toLocaleLowerCase()
        }
      }).then(resp => {
        this.clients = resp.data;
      })
      .catch(console.error);
    }
  },
  created() {
    this.searchDebounced = _.debounce(this.search, 300);
    this.filterClients();
  },
  mounted() {},

}
</script>
