<template>
  <v-container>
    <v-layout>
      <v-subheader>Организации</v-subheader>
      <v-spacer></v-spacer>
      <v-flex xs2 sm1 class="text-lg-right">
        <v-btn small @click.stop="addJobDialog=true" fab color="teal" dark>+</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex class="mb-2">
        <v-text-field
          label="поиск"
          v-model="searchStr"
          :messages = [jobs.length]
        ></v-text-field>
        <!-- @input="searchDebounced" -->
      </v-flex>
    </v-layout>

    <v-layout column>
      <v-flex xs12 sm6>
        <v-list>
          <template v-for="(job, index) in jobs">
            <v-list-tile :key="job._key" :to="`/jobs/${job._key}`">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{job.name}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{job.place | placeName}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="addJobDialog"
      max-width="600"
    >
      <v-card tile>
        <v-toolbar card dark color="teal">
          <v-toolbar-items>
            <v-btn dark flat @click.native="createJob">Добавить организацию</v-btn>
          </v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn icon dark @click.native="addJobDialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-autocomplete
            v-model="newJob.place"
            label="Насел. пункт"
            item-text="name"
            item-value="_id"
            :items="allPlaces"
            :chips="true"
            :deletable-chips="true"
          >
          </v-autocomplete>
          <v-text-field
            placeholder="Название"
            v-model="newJob.name">
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
      searchStr: '',
      addJobDialog: false,
      foundJobs: [],
      newJob: {
        name: null,
        place: null
      }
    }
  },
  computed: {
    allPlaces() { return this.$store.state.allPlaces },
    jobs() {
      if (this.searchStr === '') {
        return this.$store.state.allJobs;
      }
      if (this.searchStr.length <= 1) {
        return [];  // don't searchStr if <= 1 letters
      }
      return this.foundJobs;
    }
  },
  watch: {
    searchStr: function(newStr, oldStr) {
      if (newStr.length > 1) this.searchDebounced();
    }
  },
  methods: {
    createJob() {
      axiosInst.post('/api/jobs', {
        job: this.newJob
      })
      .then(resp => {
        this.$store.commit('addJob', resp.data);
        // set inital state of newClient. todo: find right way
        this.newJob.name = null;
        this.newJob.place = null;
        this.addJobDialog = false;
      })
      .catch(console.error);
    },
    searchJobs: function() {
      this.foundJobs = this.$store.state.allJobs.filter(job => {
        const name = job.name.toLocaleLowerCase(); // name in lower case
        const searchStr = this.searchStr.toLocaleLowerCase();
        return name.includes(searchStr); // if contains substr
      })
    }
  },
  created() {
    this.searchDebounced = _.debounce(this.searchJobs, 300);
  },
  mounted() {},

}
</script>
