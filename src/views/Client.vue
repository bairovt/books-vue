<template>
  <v-container>
    <v-layout>
      <v-flex sm6 xs10 v-if="client.name">
          <h2>{{client.name}}<span v-if="client.hasOwnProperty('xls') && !client.checked"> &#9679;</span></h2>
          <big><a :href="`tel:${client.phone}`">{{client.phone}}</a></big> &nbsp;
          <big><a :href="`tel:${client.phone2}`">{{client.phone2}}</a></big> &nbsp;
          <v-btn fab small @click.stop="setCallDateDialog = true">
            <v-icon>call</v-icon>
          </v-btn>
          <span>{{client.calledAt | ruDate}}</span>
          <p v-if="client.place"><small>насел. пункт:</small> {{client.place | placeName}}</p>
          <p v-if="client.job"><small>орг-я:</small> {{client.job | jobName}}</p>
      </v-flex>
      <v-flex xs2>
        <v-menu bottom right offset-y>
          <v-btn slot="activator" icon color="primary">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="updateClientDialog = true">
              <v-list-tile-title>Изменить</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="checkDialog = true">
              <v-list-tile-title>Сверка</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="deleteClient">
              <v-list-tile-title>Удалить</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex sm6 xs10>
        <v-subheader v-if="!client.info">Информация</v-subheader>
        <p v-else>{{client.info}}</p>
      </v-flex>
      <v-flex xs2>
        <v-btn icon dark color="teal" @click.stop="editInfoDialog = true"
          class="mt-0"
        >
          <v-icon>edit</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>

    <!-- <v-divider></v-divider> -->
    <table v-if="client.hasOwnProperty('xls') && !client.checked">
      <tr>
        <td>A (номера тетр.)</td>
        <td>{{client.xls.A}}</td>
      </tr>
      <tr>
        <td>E (организация)</td>
        <td>{{client.xls.E}}</td>
      </tr>
      <tr>
        <td>F (насел. пункт)</td>
        <td>{{client.xls.F}}</td>
      </tr>
      <tr>
        <td>G (Тэмуджин)</td>
        <td>{{client.xls.G}}</td>
      </tr>
      <tr>
        <td>H (Тэмуджин)</td>
        <td>{{client.xlsG}}</td>
      </tr>
      <tr>
        <td>I (Сказания Хори)</td>
        <td>{{client.xlsI}}</td>
      </tr>
      <tr>
        <td>J (Сказания Хори)</td>
        <td>{{client.xlsJ}}</td>
      </tr>
      <tr>
        <td>K (Чингисхан)</td>
        <td>{{client.xlsK}}</td>
      </tr>
      <tr>
        <td>L (Рабджун)</td>
        <td>{{client.xlsL}}</td>
      </tr>
    </table>
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
        <v-list>
          <template v-for="(order, index) in client.orders">
            <v-layout :key="'l'+index">
              <v-flex>
                <v-list-tile :key="order._key" :to="`/orders/${order._key}`">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{order.book.title}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span v-if="order.num">№{{order.num}}</span> {{order.status | status}} {{order | sum}} / {{order | paid}} р.
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
            v-model="newOrder._to"
            :items="books"
            item-text="title"
            item-value="_id"
            label="Книга"
          ></v-select>
          <v-text-field
            label="№ в тетради"
            v-model="newOrder.num"
          ></v-text-field>
          <v-select
            v-model="newOrder.status"
            :items="statuses"
            label="Статус"
          ></v-select>
          <v-menu
            :close-on-content-click="false"
            v-model="statusDateMenu"
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
              :value="this.$options.filters.ruDate(this.newOrder.statusDate)"
              label="дата статуса"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="newOrder.statusDate" no-title @input="statusDateMenu = false"
              locale="ru-ru"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="newOrder.qty"
          ></v-text-field>
          <v-textarea
            placeholder="Информация"
            v-model="newOrder.info">
          </v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="setCallDateDialog"
      max-width="215"
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

    <v-dialog
      v-model="editInfoDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="saveInfo">Сохранить</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="editInfoDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-textarea
            placeholder="Информация"
            v-model="client.info"
          >
          </v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="checkDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="saveCheck">Сохранить</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="checkDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-checkbox
            label="Сверка"
            v-model="client.checked"
          ></v-checkbox>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="updateClientDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="updateClient">Сохранить</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="updateClientDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <client-form :client="client"></client-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from 'lodash';
import axiosInst from '@/utils/axios-instance';
import trimObject from '@/utils/trim-object';

export default {
  data() {
    return {
      client: {
        name: '',
        phone: null,
        phone2: null,
        info: null,
        orders: [],
        calledAt: '',
        place: null,
        job: null,
        xls: {},
        checked: undefined
      },
      addOrderDialog: false,
      setCallDateDialog: false,
      editInfoDialog: false,
      updateClientDialog: false,
      checkDialog: false,
      statusDateMenu: false,
      newOrder: {
        num: null,
        _from: '',  // client _id
        _to: '',    // book _id
        qty: 1,
        status: "SHIPPED",
        statusDate: '',
        info: ''
      },
      callDateMenu: false,
      callDate: (new Date()).toISOString(),
      // info: ''
    }
  },
  computed: {
    books() {return this.$store.state.books},
    statuses() {return this.$store.state.statuses}
  },
  methods: {
    updateClient() {
      trimObject(this.client);
      axiosInst.post(`/api/clients/${this.client._key}/update`, {
        name: this.client.name,
        phone: this.client.phone,
        phone2: this.client.phone2,
        place: this.client.place,
        job: this.client.job,
      })
        .then(resp => {
          // this.client.info = resp.data;
          this.updateClientDialog = false;
        })
        .catch(console.error);
    },
    saveInfo() {
      axiosInst.post(`/api/clients/${this.client._key}/info`, {
        info: this.client.info
      })
        .then(resp => {
          this.client.info = resp.data;
          this.editInfoDialog = false;
        })
        .catch(console.error);
    },
    saveCheck() {
      axiosInst.post(`/api/clients/${this.client._key}/check`, {
        checked: this.client.checked
      })
        .then(resp => {
          this.client.checked = resp.data.checked;
          this.checkDialog = false;
        })
        .catch(console.error);
    },
    fetchClient() {
      axiosInst.get(`/api/clients/${this.$route.params.key}`)
        .then(resp => {
          this.client = resp.data;
        })
        .catch(console.error)
    },
    addOrder() {
      this.newOrder._from = this.client._id,
      axiosInst.post('/api/orders', {
        newOrder: this.newOrder
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
  mounted() {
    this.fetchClient();
  }
}
</script>

<style scoped>
  /* a {
    padding-left: 0px;
  } */
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid grey;
    padding: 2px;
  }
</style>
