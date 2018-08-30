<template>
  <v-app>
    <v-navigation-drawer app
      persistent
      v-model="drawer"
      fixed
      :clipped="true"
    >
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <!-- <v-icon v-html="item.icon"></v-icon> -->
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="user.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="primary"
      app
    >
    <!-- :clipped-left="clipped" -->
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-btn round to="/">
        Книги
      </v-btn>
      <v-btn round to="/clients">
        Клиенты
      </v-btn>
      <!-- <v-toolbar-title v-text="title" ></v-toolbar-title> -->
      <v-spacer></v-spacer>

    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }]
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {
    this.$store.dispatch('fetchAllBooks');
    this.$store.dispatch('fetchClientsTotal');
  }
}
</script>
