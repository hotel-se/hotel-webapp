// Copyright 2021 Edoardo Riggio

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

<template>
  <div class="wrapper">
    <div class="header">
      <search type="query" :query="this.$route.path.split('/q=')[1].replace(/%20/g, ' ').split('&')[0]" />
      <theme />
    </div>

    <div class="content">
      <Map v-if="ready" :hotels="hotels_reduced" :center="center" :key="component_key" />
      
      <div class="hotels">
        <result :result="hotel" v-for="hotel in hotels_reduced" :key="hotel.id" />
      </div>
    </div>
  </div>
</template>

<script>
import Theme from '../components/Theme.vue'
import Search from '../components/Search.vue'
import Map from '../components/Map.vue'
import Result from '../components/Result.vue'

export default {
  name: 'Results',
  props: {
    query: String
  },
  components: {
    Theme,
    Search,
    Map,
    Result
  },
  data() {
    return {
      theme: 'light',
      hotels: [],
      hotels_reduced: [],
      found: 0,
      center: [0, 0],
      ready: false,
      component_key: 0
    }
  },
  async mounted() {
    if (localStorage.theme === 'dark') {
      this.theme = 'dark'
      document.getElementsByClassName('search-bar')[0].classList.add('dark')
    }

    this.$root.$on('theme-changed', (theme) => {
      localStorage.theme = theme
      this.theme = theme
      
      if (theme === 'dark') {
        document.getElementsByClassName('search-bar')[0].classList.add('dark')
      } else {
        document.getElementsByClassName('search-bar')[0].classList.remove('dark')
      }
    })

    this.$root.$on('search', (query) => {
      this.loadHotels(query)
    })

    this.loadHotels()
  },
  methods: {
    computeCenter() {
      let max_lat = Number.NEGATIVE_INFINITY
      let min_lat = Number.POSITIVE_INFINITY
      let max_lng = Number.NEGATIVE_INFINITY
      let min_lng = Number.POSITIVE_INFINITY

      for (let hotel of this.hotels) {
        max_lat = Math.max(max_lat, hotel.coordinates.latitude)
        min_lat = Math.min(min_lat, hotel.coordinates.latitude)
        max_lng = Math.max(max_lng, hotel.coordinates.longitude)
        min_lng = Math.min(min_lng, hotel.coordinates.longitude)
      }

      return [(max_lat + min_lat) / 2, (max_lng + min_lng) / 2]
    },
    async loadHotels(query_alt='') {
      if (query_alt === '') {
        await this.$store.dispatch('fetchHotels', this.query.split('q=')[1])
      } else {
        await this.$store.dispatch('fetchHotels', query_alt)
      }
      
      this.hotels = this.$store.state.hotels
      this.found = this.$store.state.found

      this.hotels_reduced = this.hotels

      if (this.hotels.length > 20) {
        this.hotels_reduced = this.hotels.slice(0, 20)
      }

      this.center = this.computeCenter()
      this.ready = true
      this.component_key += 1
    }
  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;

    align-items: center;

    width: -webkit-fill-available !important;
    width: -moz-available !important;
  }

  .header {
    display: flex;
    flex-direction: row;

    margin: 30px;

    width: -webkit-fill-available !important;
    width: -moz-available !important;

    align-items: center;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;

    margin-left: 30px;
    margin-right: 30px;

    width: -webkit-fill-available !important;
    width: -moz-available !important;
  }

  .hotels {
    display: flex;
    flex-direction: column;
    
    margin-top: 40px;
    margin-bottom: 40px;

    gap: 38px;
  }
</style>
