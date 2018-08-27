<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center sm12>
        <!-- <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote> -->
        <v-card v-for="book in books" :key="book._key"
          class="mb-1"

          :to="`/books/${book._key}`"
        >
          <v-card-title>
            <h3>{{book.title}}</h3>
          </v-card-title>
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      // books: []
    }
  },
  computed: {
    books() {return this.$store.state.books}
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
