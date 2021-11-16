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

    <div class="content" v-if="hotels.length !== 0">
      <Map v-if="ready" :hotels="hotels_reduced" :center="center" :key="component_key" />
      
      <div class="hotels">
        <result :result="hotel" v-for="hotel in hotels" :key="hotel.id" />
      </div>
    </div>

    <div class="content" v-else>
      <div class="no-results" :class="theme === 'dark' ? 'dark' : ''">
        <p>Your search - <b>{{ this.$route.path.split('/q=')[1].replace(/%20/g, ' ').split('&')[0] }}</b> - did
        not match any documents.</p>
        
        <p>Suggestions:</p>

        <ul>
          <li>Make sure all words are spelled correctly.</li>
          <li>Write places names in English.</li>
          <li>Places must be in Italy or Switzerland.</li>
        </ul>
      </div>
    </div>

    <paging :total="pages" :query="this.$route.path" />
  </div>
</template>

<script>
import Theme from '../components/Theme.vue'
import Search from '../components/Search.vue'
import Map from '../components/Map.vue'
import Result from '../components/Result.vue'
import Paging from '../components/Paging.vue'

export default {
  name: 'Results',
  props: {
    query: String
  },
  components: {
    Theme,
    Search,
    Map,
    Result,
    Paging
  },
  data() {
    return {
      theme: 'light',
      hotels: [],
      pages: 0,
      hotels_reduced: [],
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
      let offset = (Number(this.$route.path.split('&p=')[1]) - 1) * 25 || 0

      if (query_alt === '') {
        await this.$store.dispatch('fetchHotels', [this.query.split('q=')[1], offset])
      } else {
        await this.$store.dispatch('fetchHotels', [query_alt, offset])
      }
      
      this.hotels = this.$store.state.hotels

      let found = this.$store.state.found
      this.pages = Math.ceil(found / 25)

      this.hotels_reduced = this.$store.state.hotels_top20
      console.log(this.hotels)
      console.log(this.hotels_reduced)

      this.center = this.computeCenter()
      this.ready = true
      this.component_key += 1
      window.scrollTo(0,0)
    }
  },
  watch: {
    '$route'() {
      this.loadHotels()
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

    width: 70% !important;
  }

  .no-results {
    text-align: left;
  }

  .no-results.dark {
    color: #bdc1c6;
  }

  .hotels {
    display: flex;
    flex-direction: column;
    
    margin-top: 40px;
    margin-bottom: 40px;

    gap: 38px;
  }
</style>
