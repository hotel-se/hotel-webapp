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
  <div class="wrapper" v-if="theme === 'light'">
    <img src="../assets/icons/results/star-fill-light.svg" v-for="i in filled" :key="i" />
    <img src="../assets/icons/results/star-half-light.svg" v-if="`${n}`.includes('.5')" :key="20" />
    <img src="../assets/icons/results/star-outline-light.svg" v-for="i in empty" :key="i+5" />
  </div>

  <div class="wrapper" v-else>
    <img src="../assets/icons/results/star-fill-dark.svg" v-for="i in filled" :key="i" />
    <img src="../assets/icons/results/star-half-dark.svg" v-if="`${n}`.includes('.5')" :key="20" />
    <img src="../assets/icons/results/star-outline-dark.svg" v-for="i in empty" :key="i+5" />
  </div>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    n: Number
  },
  data() {
    return {
      filled: Math.floor(this.n),
      empty: 5 - Math.ceil(this.n),
      theme: 'light'
    }
  },
  mounted() {
    if (localStorage.theme === 'dark') {
      this.theme = 'dark'
    }

    this.$root.$on('theme-changed', (theme) => {
      this.theme = theme
    })
  }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row !important;
  }
</style>
