<template>
  <div id="app">
    <div class="corner">
      <div class="top">
        <img class="corner-left" :src="corner" />
        <img class="corner-right" :src="corner" />
      </div>
      <div class="bottom">
        <img class="corner-left" :src="corner" />
        <img class="corner-right" :src="corner" />
      </div>
    </div>

    <h1 :data-heading="name" class="title"> Famille {{ name }}</h1>
    <Home :tree="this.tree" />
  </div>
</template>

<script>
import familyJSON from './data/longFamily.json'
import Home from './components/Home.vue'
import corner from './assets/corner.png'

export default {
  name: 'app',
  components: {
    Home
  },
  data() {
    return {
      corner
    }
  },
  created() {
    [this.name, this.tree] = Object.values(familyJSON)
  },
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  @media screen and (max-width: 720px) {

  }
}

.corner {
  img {
    width: 4rem;
    position: absolute;
  }

  .top {
    img {
      top: 0px;
    }
    .corner-left {
      rotate: 180deg;
      left: 0px;
    }

    .corner-right {
      rotate: -90deg;
      right: 0px;
    }
  }
  .bottom {
    img {
      bottom: 0px;
    }
    .corner-left {
      rotate: 90deg;
      left: 0px;
    }

    .corner-right {
      rotate: 0deg;
      right: 0px;
    }
  }
}
</style>
