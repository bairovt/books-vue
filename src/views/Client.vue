<template>
  <v-container>
    <v-layout>
      <v-flex sm6 xs10>
        <div v-if="client">
          <h2>{{client.name}}</h2>
          <big><a :href="`tel:${client.phone}`">{{client.phone}}</a></big>
          <v-btn fab small @click.stop="setCallDateDialog = true">
            <v-icon>call</v-icon>
          </v-btn>
          <span>{{client.calledAt | localeDate}}</span>
          <p></p>
        </div>
        <br>
      </v-flex>

      <v-flex xs2>
        <v-menu bottom right offset-y>
          <v-btn slot="activator" icon color="primary">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click.stop="deleteClient">
              <v-list-tile-title>Удалить</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout row justify-space-between>
      <v-flex>
        <v-subheader>Заказы</v-subheader>
        <!-- <h3>Книги</h3> -->
      </v-flex>
      <v-flex>
        <v-btn round small color="secondary"
          @click.stop="addOrderDialog = true"
        >
          Добавить
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout column>
      <v-flex>
        <v-list v-if="client">
          <template v-for="(order, index) in client.orders">
            <v-layout :key="'l'+index">
              <v-flex>
                <v-list-tile :key="order._key" :to="`/orders/${order._key}`">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{order.book.title}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{order | sum}} / {{order | paid}} р. {{order.status | status}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
            </v-layout>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addOrderDialog"
      max-width="600"
      v-if="client"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="addOrder">Добавить заказ</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="addOrderDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-select
            v-model="orderData._to"
            :items="books"
            item-text="title"
            item-value="_id"
            label="Книга"
          ></v-select>
          <v-select
            v-model="orderData.status"
            :items="statuses"
            label="Статус"
          ></v-select>
          <v-text-field
            v-model="orderData.qty"
          ></v-text-field>
          <v-textarea
            placeholder="Информация"
            v-model="orderData.info">
          </v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="setCallDateDialog"
      max-width="215"
      v-if="client"
    >
      <v-card tile>
        <v-toolbar card color="teal">
          <v-spacer></v-spacer>
          <v-btn icon @click.native="setCallDateDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-menu
            :close-on-content-click="false"
            v-model="callDateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field
              slot="activator"
              :value="this.$options.filters.ruDate(this.callDate)"
              label="дата"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="callDate" no-title @input="callDateMenu = false"
              locale="ru-ru"
            ></v-date-picker>
          </v-menu>

          <v-btn @click.native="setCallDate" color="teal" round>
            Добавить звонок
          </v-btn>
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
      client: null,
      addOrderDialog: false,
      setCallDateDialog: false,
      orderData: {
        _from: "",  // client _id
        _to: "",    // book _id
        qty: 1,
        status: "SHIPPED",
        info: ""
      },
      callDateMenu: false,
      callDate: (new Date()).toISOString(),
    }
  },
  computed: {
    books() {return this.$store.state.books},
    statuses() {return this.$store.state.statuses}
  },
  methods: {
    fetchClient() {
      axiosInst.get(`/api/clients/${this.$route.params.key}`)
        .then(resp => {
          this.client = resp.data;
        })
        .catch(console.error)
    },
    addOrder() {
      this.orderData._from = this.client._id,
      axiosInst.post('/api/orders', {
        orderData: this.orderData
      })
        .then(resp => {
          this.addOrderDialog = false;
          this.fetchClient();
        })
        .catch(console.error);
    },
    setCallDate() {
      axiosInst.post(`/api/clients/${this.client._key}/call`, {
        calledAt: this.callDate
      })
        .then(resp => {
            this.client.calledAt = resp.data;
            this.setCallDateDialog = false;
          })
        .catch(console.error);
    },
    showAll() {
      this.search = '';
      this.placeholder = 'все';
      this.clients = this.$store.state.clients;
    },
    deleteClient() {
      const confirmed = confirm(`Точно УДАЛИТЬ?`);
      if (!confirmed) return;
      axiosInst.delete(`/api/clients/${this.client._key}`)
        .then(resp => {this.$router.replace(`/clients`)})
        .catch(console.error);
    }
  },
  // created() {
  //   this.findClientsDeb = _.debounce(this.findClients, 300);
  // },
  mounted() {
    this.fetchClient();
  }
}
</script>

<style scoped>
  /* a {
    padding-left: 0px;
  } */
</style>
