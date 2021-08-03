<template>
<div></div>
</template>

<script>

import {useStore} from "vuex";

export default {
  name: 'LogoutPage',
  setup() {
    const store = useStore();
    store.commit("updateToken", null);
    window.location = "/";
  }
}
</script>