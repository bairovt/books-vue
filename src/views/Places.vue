<template>
  <v-container>
    <v-layout>
      <!-- <v-flex>
        <v-btn round @click.stop="showAllPlaces">
          <v-subheader>{{allPlaces.length}}</v-subheader>
        </v-btn>
      </v-flex> -->
      <v-subheader>Насел. пункты</v-subheader>
      <v-spacer></v-spacer>
      <v-flex xs2 sm1 class="text-lg-right">
        <v-btn small @click.stop="addPlaceDialog=true" fab color="teal" dark>+</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex class="mb-2">
        <v-text-field
          :placeholder="placeholder"
          v-model="searchStr"
          :messages = [places.length]
          @focus="placeholder='поиск'"
        ></v-text-field>
        <!-- @input="searchDebounced" -->
      </v-flex>
    </v-layout>

    <v-layout column>
      <v-flex xs12 sm6>
        <v-list>
          <template v-for="(place, index) in places">
            <v-list-tile :key="place._key" :to="`/places/${place._key}`">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{place.name}}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addPlaceDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="createPlace">Добавить насел. пункт</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="addPlaceDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-text-field
              placeholder="Название"
              v-model="newPlace.name">
            </v-text-field>
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
      // places: [], // searched places
      searchStr: '',
      placeholder: 'поиск',
      addPlaceDialog: false,
      foundPlaces: [],
      newPlace: {
        name: ""
      }
    }
  },
  computed: {
    // allPlaces() { return this.$store.state.allPlaces }
    places() {
      if (this.searchStr === '') {
        return this.$store.state.allPlaces;
      }
      if (this.searchStr.length <= 1) {
        return [];  // don't searchStr if <= 1 letters
      }
      return this.foundPlaces;
    }
  },
  watch: {
    searchStr: function(newStr, oldStr) {
      if (newStr.length > 1) this.searchDebounced();
    }
  },
  methods: {
    createPlace() {
      axiosInst.post('/api/places', {
        place: this.newPlace
      })
      // .then(resp => {this.$router.replace(`/clients/${resp.data._key}`)})
      .then(resp => {
        this.$store.commit('addPlace', resp.data);
        this.addPlaceDialog = false;
      })
      .catch(console.error);
    },
    searchPlaces: function() {
      this.foundPlaces = this.$store.state.allPlaces.filter(place => {
        const name = place.name.toLocaleLowerCase(); // name in lower case
        const searchStr = this.searchStr.toLocaleLowerCase();
        return name.includes(searchStr); // if contains substr
      })
    },
    // search() {
    //   this.placeholder = 'поиск';
    //   if (this.searchStr.length <= 2) return this.clients = [];  // don't searchStr if <= 2 letters
    //   axiosInst.get('/api/clients/search', {
    //     params: {
    //       str: this.searchStr.toLocaleLowerCase()
    //     }
    //   }).then(resp => {
    //     this.clients = resp.data;
    //   })
    //   .catch(console.error);
    // }
  },
  created() {
    this.searchDebounced = _.debounce(this.searchPlaces, 300);
  },
  mounted() {},

}
</script>
