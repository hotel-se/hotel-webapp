import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hotels: [],
    found: 0
  },
  mutations: {
    setHotels(state, newHotels) {
      state.hotels = newHotels;
    },
    setFound(state, newFound) {
      state.found = newFound;
    }
  },
  actions: {
    async fetchHotels(context, query) {
      const name = query.split('&')[0]
      const lat = query.split('&lat=')[1].split('&')[0]
      const lon = query.split('&lon=')[1].split('&')[0]

      const response = await fetch(`http://localhost:8983/solr/hotels/query?d=5&fq=%7B!geofilt%7D&pt=${lat}%2C${lon}&q=${name}&rows=25&sfield=coordinates&sort=geodist()%20asc`)

      let hotels = await response.json()

      console.log(hotels.response.docs)

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
    }
  }
})
