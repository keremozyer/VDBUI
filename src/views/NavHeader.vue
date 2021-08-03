<template>
  <div id="nav">
    <router-link to="/">Ana Sayfa</router-link> |
    <router-link to="/catalog">Katalog</router-link> |
    <template v-if="isAdmin"><router-link to="/inventoryManagement">Envanter Yönetimi</router-link> | </template>
    <template v-if="isAdmin"><router-link to="/serverManagement">Sunucu Yönetimi</router-link> | </template>
    <router-link to="/reports">Raporlar</router-link> |
    <template v-if="isAdmin"><router-link to="/notificationSettings">Bildirim Ayarları</router-link> | </template>
    <router-link to="/logout">Çıkış Yap</router-link>
  </div>
  <router-view />
</template>

<script>

import {computed} from 'vue';
import {useStore} from "vuex";

export default {
  name: 'NavHeader',
  setup() {
        const store = useStore();

        let isAdmin = computed(function () {
            return store.state.isAdmin
        });

        return {
            isAdmin
        };
    },
}
</script>