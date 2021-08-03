<template>
<div>
  <h2>Giriş Yap</h2>
  <form v-on:submit.prevent="submitForm">
    <div class="form-group loginComponent">
      <label for="username">Kullanıcı Adı</label>
      <input type="text" class="form-control" id="username" placeholder="Ad" v-model="form.username">
    </div>
    <div class="form-group loginComponent">
      <label for="password">Parola</label>
      <input type="password" class="form-control" id="password" placeholder="Parola" v-model="form.password">
    </div>
    <div class="form-group loginComponent">
      <button class="btn btn-primary">Giriş Yap</button>
    </div>
  </form>
</div>
</template>

<script>

import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'

let store = null;

export default {
  name: 'LoginForm',
  setup() {
    store = useStore();
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
    async submitForm() {
      var tokenData = null;
      await apiConnection.Post("Auth/Token", this.form).then(response => {
        if (response.status == 200) {
          tokenData = response.data;
        }        
      });
      if (tokenData?.token != null) {        
        store.commit("updateToken", tokenData.token);
      }
      if (tokenData?.unit == "VDBAdmins") {
        store.commit("setAdminFlag", true);
      }
      else {
        store.commit("setAdminFlag", false);
      }
    }
  }
}
</script>

<style>
.loginComponent {
  margin-top: 10px;
}
</style>