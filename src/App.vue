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
  <div id="app">
    <search />
  </div>
</template>

<script>
import Search from './components/Search.vue'

export default {
  name: 'App',
  components: {
    Search
  },
  data () {
    return {
      theme: 'light'
    }
  },
  mounted() {
    if (localStorage.theme === 'dark') {
      this.theme = 'dark'
      document.body.className = 'dark'
    }

    this.$root.$on('theme-changed', (theme) => {
      localStorage.theme = theme
      this.theme = theme
      
      if (theme === 'dark') {
        document.body.className = 'dark'
      } else {
        document.body.className = ''
      }
    })
  },
  watch: {
    theme(new_theme) {
      localStorage.theme = new_theme
    }
  },
}
</script>

<style>
  #app {
    display: flex;
    height: 100vh;
    width: 100vw;

    margin: -10px;

    font-family: Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body {
    background-color: #ffffff;
    transition: background 0.4s ease;
  }

  body.dark {
    background-color: #202123;
    transition: background 0.4s ease;
  }
</style>
