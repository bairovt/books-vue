<template>
  <v-container>
    <v-layout>
      <v-flex sm6 xs10>
        <div v-if="client">
          <h2>{{client.name}}</h2>
          <a :href="`tel:${client.phone}`">{{client.phone}}</a>
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
        <v-subheader>Книги</v-subheader>
        <!-- <h3>Книги</h3> -->
      </v-flex>
      <v-flex>
        <v-btn round small color="secondary"
          @click.stop="addBookDialog = true"
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
            <v-list-tile :key="order._key">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{order.book.title}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{order|sum}}/{{order|paid}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-if="client"
      v-model="addBookDialog"
      fullscreen
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-btn icon dark @click.native="addBookDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="addBook">Добавить книгу</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
            <v-select
              v-model="orderData._to"
              :items="books"
              item-text="title"
              item-value="_id"
              label="Книга"
            ></v-select>
            <v-text-field
              v-model="orderData.qty"
            ></v-text-field>
            <v-textarea
              placeholder="Информация"
              v-model="orderData.info">
            </v-textarea>
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
      client: null,
      addBookDialog: false,
      orderDialog: false,
      orderData: {
        _from: "",  // client _id
        _to: "",    // book _id
        qty: 1,
        status: "",
        info: ""
      },
      statuses: [

      ]
    }
  },
  computed: {
    books() {return this.$store.state.books}
  },
  methods: {
    fetchClient() {
      axiosInst.get(`/api/clients/${this.$route.params.key}`)
        .then(resp => {
          this.client = resp.data;
        })
        // .catch(console.error)
    },
    addBook() {
      this.orderData._from = this.client._id,
      axiosInst.post('/api/books/order', {
        orderData: this.orderData
      })
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
  filters: {
    /* total sum of the order */
    sum(order) {
      return order.qty * order.book.price;
    },
    /* total sum paid for the order */
    paid(order) {
      let totalPaid = 0;
      if (order.pays) {
        totalPaid = order.pays.reduce((total, payment) => {
          return total + payment.sum;
        }, 0);
      }
      return totalPaid;
    }
  },
  // created() {
  //   this.findClientsDeb = _.debounce(this.findClients, 300);
  // },
  mounted() {
    this.fetchClient();
  },

}
</script>
