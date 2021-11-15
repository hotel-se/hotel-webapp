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
    <span class="address" :class="theme === 'dark' ? 'dark' : ''"> {{ toTitleCase(result.address) }} </span>
    <span class="name" :class="theme === 'dark' ? 'dark' : ''"> <a :href="result.url"> {{ result.name }} </a> </span>
    <span class="description" :class="theme === 'dark' ? 'dark' : ''" v-if="result.description"> {{ result.description }} </span>
    <span class="bottom">
      <rating :n="score" v-if="score" />
      <img class="separator" src="../assets/icons/results/separator-light.svg" v-if="score">

      <tooltip label="Tripadvisor" position="is-right" v-if="result.source === 'tripadvisor'">
        <img class="source" src="../assets/icons/results/sources/tripadvisor-light.svg" v-if="theme === 'light'" />
        <img class="source" src="../assets/icons/results/sources/tripadvisor-dark.svg" v-else />
      </tooltip>

      <tooltip label="Lonely Planet" position="is-right" v-if="result.source === 'lonely'">
        <img class="source" src="../assets/icons/results/sources/lonely-light.svg" v-if="theme === 'light'" />
        <img class="source" src="../assets/icons/results/sources/lonely-dark.svg" v-else />
      </tooltip>

      <tooltip label="MySwitzerland" position="is-right" v-if="result.source === 'myswitzerland'">
        <img class="source" src="../assets/icons/results/sources/myswitzerland-light.svg" v-if="theme === 'light'" />
        <img class="source" src="../assets/icons/results/sources/myswitzerland-dark.svg" v-else />
      </tooltip>
    </span>
  </div>
</template>

<script>
import Rating from '../components/Rating.vue'
import Tooltip from '@adamdehaven/vue-custom-tooltip'

export default {
  name: 'Result',
  components: {
    Rating,
    Tooltip,
  },
  props: {
    result: Object
  },
  data() {
    return {
      score: this.result.rating.score,
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
  },
  methods: {
    toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }
  },
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    flex-direction: column;

    align-items: flex-start !important;
  }

  .address {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;

    color: #747474;
  }

  .address.dark {
    color: #9B9B9B;
  }

  .name {
    margin-top: 4px;

    font-style: normal;
    font-weight: 500;
    font-size: 21px;
  }

  .name.dark {
    color: #7096F9;
  }

  .name > a {
    text-decoration: none;
    color: #2652C4 !important;
  }

  .name.dark > a {
    color: #7096F9 !important;
  }

  .name > a:hover {
    text-decoration: underline;
  }

  .name > a:visited {
    color: #822EAB !important;
  }

  .name.dark > a:visited {
    color: #C58AF9 !important;
  }

  .description {
    display: -webkit-box;

    margin-top: 8px;

    text-overflow: ellipsis;
    text-align: left;

    font-style: normal;
    font-weight: normal;
    font-size: 14px;

    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .description.dark {
    color: #dfdfdf;
  }

  .bottom {
    display: flex;
    flex-direction: row;

    justify-content: center !important;
    align-content: center !important;

    margin-top: 8px;
  }

  .bottom > .separator {
    margin-left: 15px;
    margin-right: 15px;
  }
</style>
