<template>
  <v-container>
    <v-layout row>
      <v-flex xs2 sm1>
        <v-btn small @click.stop="showAll" fab>
          все
        </v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs2 sm1 class="text-lg-right">
        <v-btn small @click.stop="addClientDialog=true" fab color="teal" dark>+</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 class="mb-2">
        <v-text-field
          :placeholder="placeholder"
          :messages = [clients.length]
          v-model="search"
          @input="findClientsDeb"
        ></v-text-field>
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
      fullscreen
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-btn icon dark @click.native="addClientDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="createClient">Добавить клиента</v-btn>
          </v-toolbar-items>
          <!-- <v-menu bottom right offset-y>
            <v-btn slot="activator" dark icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in items" :key="i" @click="">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu> -->
        </v-toolbar>
        <v-card-text>
            <v-text-field
              placeholder="Имя"
              v-model="newClient.name">
            </v-text-field>
            <v-text-field
              placeholder="Телефон"
              v-model="newClient.phone">
            </v-text-field>
            <v-textarea
              placeholder="Информация"
              v-model="newClient.info">
            </v-textarea>

          <!-- <v-btn color="primary" dark @click.stop="dialog2 = !dialog2">Open Dialog 2</v-btn>
          <v-tooltip right>
            <v-btn slot="activator">Tool Tip Activator</v-btn>
            Tool Tip
          </v-tooltip> -->

          <!-- <v-list three-line subheader>
            <v-subheader>User Controls</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Content filtering</v-list-tile-title>
                <v-list-tile-sub-title>Set the content filtering level to restrict apps that can be downloaded</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Password</v-list-tile-title>
                <v-list-tile-sub-title>Require password for purchase or use password to restrict purchase</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-divider></v-divider> -->

          <!-- <v-list three-line subheader>
            <v-subheader>General</v-subheader>
            <v-list-tile avatar>
              <v-list-tile-action>
                <v-checkbox v-model="notifications"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Notifications</v-list-tile-title>
                <v-list-tile-sub-title>Notify me about updates to apps or games that I downloaded</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list> -->

        </v-card-text>

        <div style="flex: 1 1 auto;"></div>
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
      search: '',
      placeholder: 'поиск',
      addClientDialog: false,
      newClient: {
        name: "",
        phone: "",
        info: ""
      }
    }
  },
  computed: {
  },
  watch: {
    // search: function(newVal, oldVal) {this.findClientsDeb()}
  },
  methods: {
    createClient() {
      axiosInst.post('/api/clients', {
        client: this.newClient
      })
      .then(resp => {this.$router.replace(`/clients/${resp.data._key}`)})
      .catch(console.error);
    },
    findClients: function() {
      this.placeholder = 'поиск';
      if (this.search.length <= 2) return this.clients = [];  // don't search if <= 2 letters
      this.clients = this.$store.state.clients.filter(client => {
        const name = client.name.toLocaleLowerCase(); // name in lower case
        const search = this.search.toLocaleLowerCase();
        return name.includes(search); // if contains substr
      })
    },
    showAll() {
      this.search = '';
      this.placeholder = 'все';
      this.clients = this.$store.state.clients;
    }
  },
  created() {
    this.findClientsDeb = _.debounce(this.findClients, 300);
  },
  mounted() {},

}
</script>
