<template>
  <div class="wrapper">
    <div class="pages" :key="component_key">
      <div class="page" :class="`${current_page}` === `${page}` ? 'active' : ''" v-for="page in total" :key="page">
        <a href="#" @click.prevent="changePage(page)">{{ page }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Paging',
  props: {
    total: Number,
    query: String
  },
  data() {
    return {
      currentPage: 1,
      component_key: 0
    };
  },
  mounted() {
    this.current_page = this.getCurrentPage();
  },
  methods: {
    changePage(page) {
      let url = this.query

      if (this.query.slice(1).split('&p=')[1]) {
        let curr = this.query.slice(1).split('&p=')[0]
        url = curr + '&p=' + page
      } else {
        url = this.query.slice(1) + '&p=' + page
      }

      this.$router.push({
        name: 'Results',
        params: {
          query: url
        }
      })
    },
    getCurrentPage() {
      const page = this.$route.path.split('&p=')[1]
      return page ? page : 1
    }
  },
  watch: {
    '$route'() {
      this.current_page = this.getCurrentPage()
      this.component_key += 1
    }
  }
}
</script>

<style scoped>
  .pages {
    display: flex;
    flex-direction: row !important;

    justify-content: center;
    align-items: center;

    margin-top: 20px;
    margin-bottom: 30px;
  }

  .page {
    display: flex;

    justify-content: center;
    align-items: center;

    height: 35px;
    width: 35px;
  }

  .active {
    background-color: #2552C4;
    border-radius: 5px;
  }

  .page > a {
    text-decoration: none;

    color: #000000;
  }

  .page.active > a {
    color: #fff;
  }
</style>
