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
  <div class="wrapper" v-if="type !== 'query'">
    <theme class="theme" />

    <img src="../assets/logos/logo-light.svg" alt="logo" class="logo" v-if="theme === 'light'">
    <img src="../assets/logos/logo-dark.svg" alt="logo" class="logo" v-else>

    <div class="search-bar">
      <input type="text" placeholder="Where do you want to go?" class="search" v-model="search_text" v-on:keyup.enter="search">

      <a class="search-button" @click="search">
        <img src="../assets/search-light.svg" alt="search" class="search-icon" v-if="theme === 'light'">
        <img src="../assets/search-dark.svg" alt="search" class="search-icon" v-else>
      </a>
    </div>
  </div>

  <div class="wrapper-query" v-else>
    <a href="/">
      <img src="../assets/logos/logo-symbol-light.svg" alt="logo" class="logo-query" v-if="theme === 'light'">
      <img src="../assets/logos/logo-symbol-dark.svg" alt="logo" class="logo-query" v-else>
    </a>

    <div class="search-bar query">
      <input type="text" placeholder="Where do you want to go?" class="search-query" v-model="search_text" v-on:keyup.enter="search">

      <a class="search-button" @click="search">
        <img src="../assets/search-light.svg" alt="search" class="search-icon-query" v-if="theme === 'light'">
        <img src="../assets/search-dark.svg" alt="search" class="search-icon-query" v-else>
      </a>
    </div>
  </div>
</template>

<script>
import Theme from './Theme.vue'

export default {
  name: 'Home',
  props: {
    type: String
  },
  components: {
    Theme
  },
  data() {
    return {
      search_text: '',
      theme: 'light'
    }
  },
  mounted() {
    if (localStorage.theme === 'dark') {
      this.theme = 'dark'
      document.getElementsByClassName('search-bar')[0].classList.add('dark')

      this.set_text()
    }

    this.$root.$on('theme-changed', (theme) => {
      localStorage.theme = theme
      this.theme = theme
      
      if (theme === 'dark') {
        document.getElementsByClassName('search-bar')[0].classList.add('dark')
      } else {
        document.getElementsByClassName('search-bar')[0].classList.remove('dark')
      }

      this.set_text()
    })

    this.set_text()
  },
  methods: {
    async search() {
      if (this.search_text.length > 0) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${this.search_text}&format=geojson`)
        let coords = await response.json()
        coords = coords['features'][0]['geometry']['coordinates']

        let query = coords ? `q=${this.search_text}&lat=${coords[1]}&lon=${coords[0]}` : `q=${this.search_text}`

        this.$router.push({
          name: 'Results',
          params: {
            query: query
          }
        })
      }
    },
    set_text() {
      if (this.$route.name === 'Results') {
        let query = this.$route.path.split('/q=')[1].replace(/%20/g, ' ').split('&')[0]
        document.querySelector('.search-query').value = query
      }
    }
  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-flow: column;
    flex: 1;

    margin-bottom: 100px;

    align-items: center;
    justify-content: center;

    gap: 50px;
  }

  .theme {
    position: absolute;
    
    top: 30px;
    right: 30px;
  }
</style>

<style>
  .search-bar {
    display: flex;
    flex-direction: row;

    min-width: 700px !important;

    gap: 21px;
  }

  .search-bar > input {
    flex: 1;
    padding: 10px 25px;

    border-style: solid;
    border-color: #ECECEC;
    border-radius: 100px;

    font-size: 16px;
    font-weight: 300;

    color: #333333;
    background-color: transparent;
  }

  .search-bar > input:focus,
  .search-bar > input:active,
  .search-bar > input:hover,
  .search-bar > input:focus-within {
    outline: none;
  }

  .search-bar > a {
    cursor: pointer;
  }

  .search-bar.dark > input {
    border-color: #4B4B4B;
    color: #ffffff;
  }

  .wrapper-query {
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;
  }

  .search-bar-query > input::placeholder {
    color: #c4c4c4;
  }

  .search-bar-query.dark > input::placeholder {
    color: #8F8F8F;
  }

  .search-bar-query > a {
    cursor: pointer;
  }

  .logo-query {
    width: 38px;
    height: 38px;
  }

  .search-bar.query {
    height: 30px;

    margin-left: 30px;
  }

  .search-bar.query > input {
    padding: 5px 15px;

    font-size: 14px;
  }

  .search-bar.query > a > img {
    height: 30px;
    width: 30px;
  }
</style>
