import axios from 'axios';
import store from "../store";
import config from "../config/config"

function GetConfigs() {
    return {
        headers: { Authorization: `Bearer ${store.state.token}` }
    };
}

function HandleError(err) {
    if (err.message == "Network Error") {
        console.log(err);
        alert("Sunucuya Bağlanırken Bir Hata Oluştu.");
    }
    else {
        if (err?.response?.status == "401") {
            store.commit("updateToken", null);
            alert("Oturum Süreniz Dolmuştur.");
            window.location = "/";
        }
        else if (err?.response?.status == "403") {
            alert("Bu İşlemi Yapmak İçin Yetkiniz Bulunmamaktadır.");
        }
        else {
            if (err.response.data.messages != null && err.response.data.messages.length > 0) {
                var alertString = "";
                for (var i = 0; i < err.response.data.messages.length; i++) {
                    alertString += (i + 1) + ": " + err.response.data.messages[i] + "\n";
                }
                if (err.response.data.logID != null) {
                    alertString += "\nLog ID: " + err.response.data.logID;
                }
                alert(alertString);
            }
            else {
                console.log(err.response);
                alert("Beklenmedik Bir Hata Oluştu.");
            }
        }
    }
}

export default {
    async Post(endpoint, data) {
        try {
            store.commit("setContentBodyClass", "unclickable");
            return await axios.post(config.webSettings.apiEndpointBase + endpoint, data, GetConfigs()).finally(() => {store.commit("setContentBodyClass", null);});
        }
        catch (err) {
            HandleError(err);
        }
    },
    async Put(endpoint, data) {
        try {
            store.commit("setContentBodyClass", "unclickable");
            return await axios.put(config.webSettings.apiEndpointBase + endpoint, data, GetConfigs()).finally(() => {store.commit("setContentBodyClass", null);});
        }
        catch (err) {
            HandleError(err);
        }
    },
    async Get(endpoint) {
        try {
            store.commit("setContentBodyClass", "unclickable");
            return await axios.get(config.webSettings.apiEndpointBase + endpoint, GetConfigs()).finally(() => {store.commit("setContentBodyClass", null);});
        }
        catch (err) {
            HandleError(err);
        }
    },
    async Delete(endpoint) {
        try {
            store.commit("setContentBodyClass", "unclickable");
            return await axios.delete(config.webSettings.apiEndpointBase + endpoint, GetConfigs()).finally(() => {store.commit("setContentBodyClass", null);});
        }
        catch (err) {
            HandleError(err);
        }
    }
}