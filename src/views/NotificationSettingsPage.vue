<template>
    <div id="contextDiv">
        <h2>Bildirim Bağlamı Seçiniz:</h2>
        <select v-model="selectedContext" @change="contextChanged()">
            <option v-for="context in contexes" :key="context.id" :value="context.id">
                {{context.type}}
            </option>
        </select>
    </div>
    <div v-if="selectedContext != null" style="margin-top: 50px">
        <h2>Bildirim Tipi Seçiniz:</h2>
        <select v-model="selectedNotificationType" @change="notificationTypeChanged()">
            <option v-for="notificationType in notificationTypes" :key="notificationType.id" :value="notificationType.id">
                {{notificationType.type}}
            </option>
        </select>
    </div>
    <div v-if="selectedNotificationType != null" style="margin-top: 50px">
        <h2>Alıcı Seçiniz Ya Da Yeni Giriş Yapınız:</h2>
        <select v-model="selectedAudience">
            <option v-for="audience in audiences" :key="audience.id" :value="audience.id">
                {{audience.receiver}}
            </option>
        </select>
        <div class="adminDiv" v-if="isAdmin">
            <form style="display:inline" v-on:submit.prevent="assignAudience">
                <input style="margin-left:25px" type="text" id="receiver" v-model="assignAudienceForm.receiver" placeholder="Yeni Alıcı"/>
                <button style="margin-left:25px" class="btn btn-primary">Oluştur</button>
            </form>
        </div>
    </div>
</template>

<script>

import {computed} from 'vue';
import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'

export default {
    name: 'NotificationSettingsPage',
    data() {
        return {
            contexes: [],
            selectedContext: null,
            notificationTypes: [],
            selectedNotificationType: null,
            audiences: [],
            selectedAudience: null,
            assignAudienceForm: {
                contextID: null,
                typeID: null,
                receiver: null
            }
        }
    },
    setup() {
        const store = useStore();

        let isAdmin = computed(function () {
            return store.state.isAdmin
        });

        return {
            isAdmin
        };
    },
    mounted() {
        apiConnection.Get("NotificationCenter/NotificationContext").then(response => this.contexes = response?.data?.contexes );
    },
    methods: {        
        async contextChanged() {
            await apiConnection.Get(`NotificationCenter/NotificationType/?contextID=${this.selectedContext}`).then(response => {
                if (response?.status == 200) {
                    this.notificationTypes = response.data.types;
                    this.selectedNotificationType = null;
                }
            });
        },
        async notificationTypeChanged() {
            await apiConnection.Get(`NotificationCenter/NotificationAudience/?contextID=${this.selectedContext}&typeID=${this.selectedNotificationType}`).then(response => {
                if (response?.status == 200) {
                    this.audiences = response.data.audiences;
                    this.selectedAudience = null;
                }
            });
        },    
        async assignAudience() {
            await apiConnection.Post("NotificationCenter/NotificationAudience", { contextID: this.selectedContext, typeID: this.selectedNotificationType, receiver: this.assignAudienceForm.receiver }).then(response => {
                if (response?.status == 200) {
                    if (this.audiences == null) {
                        this.audiences = [];
                    }
                    var existingItem = this.audiences.filter(item => item.id == response.data);
                    if (existingItem == null || existingItem.length == 0) {
                        this.audiences.push({
                            id: response.data,
                            receiver: this.assignAudienceForm.receiver
                        });
                    }
                    this.selectedAudience = response.data;

                    alert("Alıcı Başarıyla Atandı");
                }
            });
        }
    }
}
</script>