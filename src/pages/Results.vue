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
      <search type="query" />
      <theme />
    </div>

    <div class="content">
      <Map />
    </div>
  </div>
</template>

<script>
import Theme from '../components/Theme.vue'
import Search from '../components/Search.vue'
import Map from '../components/Map.vue'

export default {
  name: 'Results',
  props: {
    query: String
  },
  components: {
    Theme,
    Search,
    Map
  },
  data() {
    return {
      theme: 'light'
    }
  },
  mounted() {
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
  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;

    align-items: center;
    
    width: 100vw;
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
</style>
