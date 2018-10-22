<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-text-field
                    placeholder="Имя"
                    v-model="client.name">
                </v-text-field>
                <v-text-field
                    placeholder="Телефон"
                    v-model="client.phone">
                </v-text-field>
                <v-text-field
                    placeholder="Телефон 2"
                    v-model="client.phone2">
                </v-text-field>
                <v-autocomplete
                    v-model="client.place"
                    placeholder="Насел. пункт"
                    item-text="name"
                    item-value="_id"
                    :items="allPlaces"
                    :chips="true"
                    :deletable-chips="true"
                >
                </v-autocomplete>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ['client'],
    data() {
        return {

        }
    },
    computed: {
        allPlaces() {return this.$store.state.allPlaces}
    }
}
</script>
