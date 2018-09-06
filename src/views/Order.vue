<template>
  <v-container>
    <v-layout v-if="order._key">

      <v-flex sm6 xs10>
        <div v-if="order">
            <v-subheader>Заказ {{order._key}} - {{order.status | status}}</v-subheader>
            <big><router-link :to="`/clients/${order.client._key}`">{{order.client.name}}</router-link></big>
            <h3>{{order.book.title}} - <small>{{order.price}}</small></h3>
            <p>{{order.qty}} шт.- {{order | sum}} / {{order | paid}} р.</p>
            <div class="text-xs-right">
              <!-- <p v-if="order.orderedAt">заказан: {{order.orderedAt | ruDate}}</p>               -->
              <template v-for="(status, index) in statuses">
                  <p v-if="status.value.toLowerCase()+'At' in order" :key="'status'+index"
                    class="mb-0"
                  >
                    {{status.text.toLowerCase()}}: {{order[status.value.toLowerCase()+'At'] | ruDate}}
                  </p>
                <!-- <small v-if="status.value.toLowerCase()+'At' in order" :key="'status'+index">
                  <p>{{status.text.toLowerCase()}}: {{order[status.value.toLowerCase()+'At'] | ruDate}}</p>
                </small> -->
              </template>
            </div>
        </div>
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
            <v-list-tile @click.stop="changeStatusDialog = true">
              <v-list-tile-title>Изменить статус</v-list-tile-title>
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
          v-model="paymentDateMenu"
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
            :value="this.$options.filters.ruDate(this.payment.date)"
            label="дата"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="payment.date" no-title @input="paymentDateMenu = false"
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

    <v-dialog
      v-model="changeStatusDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="changeStatus">Сохранить</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="changeStatusDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-select
            v-model="newStatus"
            :items="statuses"
            label="Статус"
          ></v-select>
          <v-menu
            :close-on-content-click="false"
            v-model="newStatusDateMenu"
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
              :value="this.$options.filters.ruDate(this.newStatusDate)"
              label="дата статуса"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="newStatusDate" no-title @input="newStatusDateMenu = false"
              locale="ru-ru"
            ></v-date-picker>
          </v-menu>
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
      changeStatusDialog: false,
      newStatus: '',
      newStatusDateMenu: false,
      newStatusDate: null,
      payment: {
        sum: null,
        date: null
      },
      paymentDateMenu: false
    }
  },
  computed: {
    statuses() {return this.$store.state.statuses}
  },
  methods: {
    changeStatus() {
      axiosInst.post(`/api/orders/${this.$route.params.key}/change-status`, {
        status: this.newStatus,
        date: this.newStatusDate
      })
        .then(resp => {
          const {status, statusAt, date} = resp.data;
          this.order.status = status;
          this.order[statusAt] = date;
          this.changeStatusDialog = false;
        })
        .catch(console.error)
    },
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
