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
                    label="Насел. пункт"
                    item-text="name"
                    item-value="_id"
                    :items="allPlaces"
                    :chips="true"
                    :deletable-chips="true"
                >
                </v-autocomplete>
                <v-autocomplete
                    v-model="client.job"
                    label="Организация"
                    item-text="name"
                    item-value="_id"
                    :items="allJobs"
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
        allPlaces() {return this.$store.state.allPlaces},
        allJobs() {return this.$store.state.allJobs}
    },
    watch: {
        'client.job': function(newJobId, oldJobId) {
            if (newJobId) {
                const job = this.allJobs.find(job => {
                    return job._id === newJobId;
                })
                if (job && job.place) {
                    this.client.place = job.place;
                }
            }
        }
    }
}
</script>
