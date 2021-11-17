import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hotels: [],
    found: 0,
    hotels_top20: [],
    time: 0
  },
  mutations: {
    setHotels(state, newHotels) {
      state.hotels = newHotels;
    },
    setHotelsTop20(state, newHotelsTop20) {
      state.hotels_top20 = newHotelsTop20;
    },
    setFound(state, newFound) {
      state.found = newFound;
    },
    setTime(state, newTime) {
      state.time = newTime;
    }
  },
  actions: {
    async fetchHotels(context, query) {
      const name = query[0].split('&')[0]
      const lat = query[0].split('&lat=')[1].split('&')[0]
      const lon = query[0].split('&lon=')[1].split('&')[0]

      var startTime = performance.now()
      const response = await fetch(`http://localhost:8983/solr/hotels/query?d=5&fq=%7B!geofilt%7D&pt=${lat}%2C${lon}&q=${name}&rows=25&sfield=coordinates&sort=geodist()%20asc&start=${query[1]}`)
      var endTime = performance.now()

      const response_top20 = await fetch(`http://localhost:8983/solr/hotels/query?d=5&fq=%7B!geofilt%7D&pt=${lat}%2C${lon}&q=${name}&rows=20&sfield=coordinates&sort=geodist()%20asc`)

      let hotels = await response.json()
      let hotels_top20 = await response_top20.json()

      const num_found = hotels['response']['numFound']
      hotels = hotels.response.docs.map(async (hotel) => {
        let coords = 0.0

        if (!hotel.coordinates_0_coordinate) {
          const hotel_coords = await fetch(`https://nominatim.openstreetmap.org/search?q=${hotel.address}&format=geojson`)
          coords = await hotel_coords.json()
          coords = coords['features'][0]['geometry']['coordinates'] ? coords['features'][0]['geometry']['coordinates'] : null
        }

        return {
          id: hotel.id,
          name: hotel.name ? hotel.name : null,
          address: hotel.address ? hotel.address : null,
          description: hotel.description ? hotel.description : null,
          phone_number: hotel.phone_number ? hotel.phone_number : null,
          rating: {
            score: hotel['rating.score'] ? hotel['rating.score'] : null,
            n_ratings: hotel['rating.n_ratings'] ? hotel['rating.n_ratings'] : null
          },
          source: hotel.source ? hotel.source : null,
          url: hotel.url ? hotel.url : null,
          coordinates: {
            latitude: hotel.coordinates_0_coordinate ? hotel.coordinates_0_coordinate : coords,
            longitude: hotel.coordinates_1_coordinate ? hotel.coordinates_1_coordinate : coords
          }
        }
      })

      hotels_top20 = hotels_top20.response.docs.map(async (hotel) => {
        let coords = 0.0

        if (!hotel.coordinates_0_coordinate) {
          const hotel_coords = await fetch(`https://nominatim.openstreetmap.org/search?q=${hotel.address}&format=geojson`)
          coords = await hotel_coords.json()
          coords = coords['features'][0]['geometry']['coordinates'] ? coords['features'][0]['geometry']['coordinates'] : null
        }

        return {
          id: hotel.id,
          name: hotel.name ? hotel.name : null,
          address: hotel.address ? hotel.address : null,
          description: hotel.description ? hotel.description : null,
          phone_number: hotel.phone_number ? hotel.phone_number : null,
          rating: {
            score: hotel['rating.score'] ? hotel['rating.score'] : null,
            n_ratings: hotel['rating.n_ratings'] ? hotel['rating.n_ratings'] : null
          },
          source: hotel.source ? hotel.source : null,
          url: hotel.url ? hotel.url : null,
          coordinates: {
            latitude: hotel.coordinates_0_coordinate ? hotel.coordinates_0_coordinate : coords,
            longitude: hotel.coordinates_1_coordinate ? hotel.coordinates_1_coordinate : coords
          }
        }
      })

      await Promise.all(hotels).then(hotels => {
        context.commit('setHotels', hotels)
        context.commit('setFound', num_found)
      })

      await Promise.all(hotels_top20).then(hotels_top20 => {
        context.commit('setHotelsTop20', hotels_top20)
      })

      context.commit('setTime', ((endTime - startTime) / 1000).toFixed(2))
    }
  }
})
