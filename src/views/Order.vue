<template>
  <v-container fluid>
    <v-layout>
      <v-flex sm6 xs10>
        <div v-if="order">
            <v-subheader>Заказ {{order._key}}</v-subheader>
            <router-link :to="`/clients/${order.client._key}`">{{order.client.name}}</router-link>
            <h3>{{order.book.title}}</h3>
        </div>
        <br>
      </v-flex>
      <v-flex xs2>
        <v-menu bottom right offset-y>
          <v-btn slot="activator" icon color="primary">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click.stop="deleteOrder">
              <v-list-tile-title>Удалить заказ</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>

<v-divider></v-divider>
<v-subheader>Добавить платеж</v-subheader>
    <v-layout row justify-space-between>
      <v-flex xs3>
        <v-text-field
          v-model="payment.sum"
          label="сумма"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-menu
          :close-on-content-click="false"
          v-model="dateMenu"
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
            :value="this.ruDate"
            label="дата"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="payment.date" no-title @input="dateMenu = false"

            locale="ru-ru"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs4>
        <v-btn @click.stop="addPayment"
          color="primary"
          :disabled="!isSum(this.payment.sum)"
        >
          Добавить
        </v-btn>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import _ from 'lodash';
import axiosInst from '@/utils/axios-instance';

export default {
  data() {
    return {
      order: {
        _from: "",  // client _id
        _to: "",    // book _id
        client: {},
        book: {},
        qty: 0,
        status: "",
        info: ""
      },
      payment: {
        sum: null,
        date: null
      },
      dateMenu: false
    }
  },
  computed: {
    ruDate() {
      if (!this.payment.date) return null;
      const [year, month, day] = this.payment.date.split('-');
      return `${day}.${month}.${year}`;
    }
  },
  methods: {
    fetchOrder() {
      axiosInst.get(`/api/orders/${this.$route.params.key}`)
        .then(resp => {
          this.order = resp.data;
        })
        .catch(console.error)
    },
    addPayment() {
      axiosInst.post(`/api/orders/${this.$route.params.key}/pay`, {
        payment: this.payment
      })
        .then(resp => {this.payment.sum = null})
        .catch(console.error);
    },
    deleteOrder() {
      const confirmed = confirm(`Точно УДАЛИТЬ?`);
      if (!confirmed) return;
      axiosInst.delete(`/api/orders/${this.order._key}`)
        .then(resp => {this.$router.replace(`/clients/${this.order.client._key}`)})
        .catch(console.error);
    },
    isSum(value) {
      let sum = Number(value);
      return !isNaN(sum) && sum > 0;
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
  created() {
    const today = new Date();
    this.payment.date = today.toISOString().slice(0, 10); // only date: 2018-10-25
  },
  mounted() {
    this.fetchOrder();
  },

}
</script>
