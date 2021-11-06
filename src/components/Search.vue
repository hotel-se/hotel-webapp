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
    <img src="../assets/logos/logo-light.svg" alt="logo" class="logo">

    <div class="search-bar">
      <input type="text" placeholder="Where do you want to go?" class="search" v-model="search_text">

      <a class="search-button" @click="search">
        <img src="../assets/search.svg" alt="search" class="search-icon">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      search_text: ''
    }
  },
  methods: {
    search() {
      // this.$router.push({
      //   name: 'SearchResults',
      //   params: {
      //     search: this.search_text
      //   }
      // })
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
  }

  .search-bar > input::placeholder,
  .search-bar > input::-webkit-input-placeholder,
  .search-bar > input::-moz-placeholder,
  .search-bar > input:-ms-input-placeholder {
    color: #B8B8B8;
  }

  .search-bar > a {
    cursor: pointer;
  }
</style>
