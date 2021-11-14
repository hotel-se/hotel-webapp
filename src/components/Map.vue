<template>
  <div class="wrapper">
    <kendo-map
      class="map"
      :center="center"
      :zoom="13"
      :controls-navigator="false"
      :key="component_key"
    >
      <kendo-map-layer
        class="layer"
        :type="'tile'"
        :url-template="tiles"
        :subdomains="['a', 'b', 'c']"
      />

      <kendo-map-marker v-for="hotel in hotels" :key="hotel.id"
                        :shape="shape"
                        :location="[hotel.coordinates.latitude, hotel.coordinates.longitude]" />
    </kendo-map>
  </div>
</template>

<script>
export default {
  name: 'Map',
  props: {
    hotels: Array,
    center: Array
  },
  data() {
    return {
      component_key: 0,
      theme: 'light',
      shape: 'light',
      tiles: 'https://cartodb-basemaps-#= subdomain #.global.ssl.fastly.net/light_all/#= zoom #/#= x #/#= y #.png'
    }
  },
  mounted() {
    if (localStorage.theme === 'dark') {
      this.theme = 'dark'
      this.shape = 'dark'
      this.tiles = 'https://cartodb-basemaps-#= subdomain #.global.ssl.fastly.net/dark_all/#= zoom #/#= x #/#= y #.png'

      this.forceRerender()
    }

    this.$root.$on('theme-changed', (theme) => {
      localStorage.theme = theme
      this.theme = theme
      
      if (theme === 'dark') {
        this.shape = 'dark'
        this.tiles = 'https://cartodb-basemaps-#= subdomain #.global.ssl.fastly.net/dark_all/#= zoom #/#= x #/#= y #.png'
      } else {
        this.shape = 'light'
        this.tiles = 'https://cartodb-basemaps-#= subdomain #.global.ssl.fastly.net/light_all/#= zoom #/#= x #/#= y #.png'
      }

      this.forceRerender()
    })
  },
  methods: {
    forceRerender() {
      this.component_key += 1;
    }
  }
};
</script>

<style>
  .km-scroll-wrapper {
    border-radius: 20px;
  }

  .k-i-marker-light {
    background-image: url('../assets/icons/map/pin-light.svg');
    background-repeat: no-repeat;
    background-position: center;
  }

  .k-i-marker-dark {
    background-image: url('../assets/icons/map/pin-dark.svg');
    background-repeat: no-repeat;
    background-position: center;
  }
</style>

<style scoped>
  .wrapper {
    margin-top: 20px;
  }

  .map {
    margin-left: 30px;
    margin-right: 30px;

    width: -webkit-fill-available !important;
    width: -moz-available !important;
    height: 400px;
  }
</style>
