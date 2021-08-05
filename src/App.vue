<template>
<div class="container" id="allContent">  
  <div v-if="contentBodyClass == 'unclickable'" id="loader">
    <img src="./assets/Hourglass.gif" />
  </div>
  <div id="contentBody" :class="contentBodyClass">
    <div v-if="!hasToken">
      <LoginPage style="margin-top:50px" />
    </div>
    <div v-else>
      <NavHeader />
    </div>
  </div>
</div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from "vuex";
import LoginPage from './views/LoginPage.vue'
import NavHeader from './views/NavHeader.vue'

export default {
  name: 'App',
  components: {
    NavHeader,
    LoginPage
  },
  setup() {
    const store = useStore();

    let hasToken = computed(function () {
      return store.state.token != null
    });

    let contentBodyClass = computed(function() {
      return store.state.contentBodyClass;
    });

    return {
      hasToken,
      contentBodyClass
    };
  }
}

</script>

<style>
#contentBody {
  position: relative;
}

#loader {
  z-index: 1000;
  position: absolute;
  top: 25%;
  left: 50%;
  margin: -25px 0 0 -25px;
}

.unclickable {
  pointer-events: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.adminDiv {
  display: inline-block;
}
</style>
