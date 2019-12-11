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
    <Home />
  </div>
</template>

<script>
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
  }
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
    width: 80px;
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
