<template>
  <v-container>
    <v-layout v-if="order._key">

      <v-flex sm6 xs10>
        <div v-if="order">
            <v-subheader>Заказ {{order._key}} - {{order.status | status}}</v-subheader>
            <big><router-link :to="`/clients/${order.client._key}`">{{order.client.name}}</router-link></big>
            <h3>{{order.book.title}} - <small>{{order.price}}</small></h3>
            <p>{{order.qty}} шт.- {{order | sum}} / {{order | paid}} р.</p>
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

    <v-subheader>Платежи</v-subheader>
    <v-divider></v-divider>
    <v-layout row justify-left>
      <v-flex xs3 sm2>
        <v-text-field
          v-model="payment.sum"
          label="сумма"
        ></v-text-field>
      </v-flex>
      <v-flex xs5 sm2>
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
      <!-- <v-spacer></v-spacer> -->
      <v-flex xs4 sm2>
        <v-btn @click.stop="addPayment"
          color="primary"
          :disabled="!isSum(this.payment.sum)"
        >
          Добавить
        </v-btn>
      </v-flex>
    </v-layout>

    <v-divider></v-divider>
    <v-layout column>
      <v-flex>
        <v-list v-if="order">
          <template v-for="(payment, index) in order.payments">
            <v-layout :key="'l'+index">
              <v-flex xs10>
                <v-list-tile :key="`payment${index}`">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{payment.sum}} р.
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{payment.date | localeDate}}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs2>
                <a @click.stop="deletePayment(payment)">x</a>
              </v-flex>
            </v-layout>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
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
        _from: '',  // client _id
        _to: '',    // book _id
        client: {},
        book: {},
        payments: [],
        qty: 0,
        status: '',
        info: ''
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
        .then(resp => {
          this.payment.sum = null;
          this.order.payments.push(resp.data.payment);
          if (resp.data.status === 'PAID') this.order.status = 'PAID';
        })
        .catch(console.error);
    },
    deleteOrder() {
      const confirmed = confirm(`Точно УДАЛИТЬ?`);
      if (!confirmed) return;
      axiosInst.delete(`/api/orders/${this.order._key}`)
        .then(resp => {this.$router.replace(`/clients/${this.order.client._key}`)})
        .catch(console.error);
    },
    deletePayment(payment) {
      const sum = prompt('Введите сумму для подтверждения удаления:');
      if (Number(sum) === payment.sum) {
        axiosInst.delete(`/api/orders/${this.order._key}/payment/${payment._key}`)
          .then(resp => {
            const index = this.order.payments.findIndex((el) => {return el._key === payment._key});
            this.order.payments.splice(index, 1);
            if (resp.data.status === 'UNDEF') this.order.status = 'UNDEF';
          })
          .catch(console.error);
      }
    },
    isSum(value) {
      let sum = Number(value);
      return !isNaN(sum) && sum > 0;
    },
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
