<template>
    <div id="serverDiv">
        <h2>Sunucu Seçiniz Ya Da Yeni Giriş Yapınız:</h2>
        <select v-model="selectedServer" @change="serverChanged()">
            <option v-for="server in servers" :key="server.id" :value="server.id">
                {{server.name}}
            </option>
        </select>
        <div class="adminDiv" v-if="isAdmin">
            <form style="display:inline" v-on:submit.prevent="createServer">
                <input style="margin-left:25px" type="text" id="serverName" v-model="createServerForm.name" placeholder="Yeni Sunucu Adı"/>
                <button style="margin-left:25px" class="btn btn-primary">Oluştur</button>
            </form>
            <form v-if="selectedServer != null" style="display:inline" v-on:submit.prevent="deleteServer">
                <button style="margin-left:25px" class="btn btn-danger">Seçili Sunucuyu Sil</button>
            </form>
        </div>
    </div>
    <div v-if="selectedServer != null" style="margin-top: 50px" id="productVersionsDiv">
        <table>
            <thead>
                <th>Firma Adı</th>
                <th>Ürün Adı</th>
                <th>Versiyon</th>
                <th v-if="isAdmin">Kaldır</th>
            </thead>
            <tbody>
                <tr v-for="productVersion in productVersionsOnServer" :key="productVersion.id">
                    <td>{{productVersion?.product?.vendor?.name}}</td>
                    <td>{{productVersion?.product?.name}}</td>
                    <td>{{productVersion?.version}}</td>
                    <td v-if="isAdmin"><button class="btn btn-secondary" @click="removeProductVersionFromServer(selectedServer, productVersion?.id)">Kaldır</button></td>
                </tr>
            </tbody>
        </table>
        <button v-if="isAdmin" style="margin-top: 50px" class="btn btn-primary" @click="assignProductVersionClicked()">Sunucuya Yeni Ürün Ata</button>
    </div>
    <div v-if="assignProductVersionVisible && isAdmin" style="margin-top: 25px" id="assignProductVersionDiv">
        <form v-on:submit.prevent="assignProductVersionToServer">
            <div style="display:inline" id="vendorDiv">
                <b>Firma:</b>
                <select style="margin-left: 5px" v-model="selectedVendor" @change="vendorChanged()">
                    <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">
                        {{vendor.name}}
                    </option>
                </select>
            </div>
            <div style="display:inline; margin-left:25px" v-if="selectedVendor != null" id="productDiv">
                <b>Ürün:</b>
                <select style="margin-left: 5px" v-model="selectedProduct" @change="productChanged()">
                    <option v-for="product in products" :key="product.id" :value="product.id">
                        {{product.name}}
                    </option>
                </selecT>
            </div>
            <div style="display:inline; margin-left:25px" v-if="selectedProduct != null" id="versionDiv">
                <b>Versiyon:</b>
                <select style="margin-left: 5px" v-model="selectedVersion">
                    <option v-for="version in productVersions" :key="version.id" :value="version.id">
                        {{version.version}}
                    </option>
                </select>
            </div>
            <button style="display:inline; margin-left:25px" class="btn btn-primary">Ata</button>
        </form>
    </div>
</template>

<script>

import {computed} from 'vue';
import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'

export default {
    name: 'ServerManagementPage',
    data() {
        return {
            assignProductVersionVisible: false,
            servers: [{}],
            selectedServer: null,
            createServerForm: {
                name: null
            },
            productVersionsOnServer: [{}],
            selectedVendor: null,
            vendors: [{}],
            selectedProduct: null,
            products: [{}],
            selectedVersion: null,
            productVersions: [{}]
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
        apiConnection.Get("InventoryManager/Server").then(response => this.servers = response?.data?.servers );
    },
    methods: {
        clearassignProductVersionForm() {
            this.assignProductVersionVisible = false;
            this.selectedVersion = null;
            this.productVersions = null;
            this.selectedProduct = null;
            this.products = null;
            this.vendors = null;
            this.selectedVendor = null;
        },
        async createServer() {
            await apiConnection.Put("InventoryManager/Server", this.createServerForm).then(response => {
                if (response?.status == 200) {
                    if (this.servers == null) {
                        this.vendors = [{}];
                    }
                    var existingServer = this.servers.filter((server) => server.id == response.data.id);
                    if (existingServer == null || existingServer.length == 0) {
                        this.servers.push(response.data);
                    }
                    this.selectedServer = response.data.id;   
                    if (existingServer != null) {
                        this.serverChanged();
                    } 
                    this.clearassignProductVersionForm();
                }
            });
        },
        async serverChanged() {
            await apiConnection.Get(`InventoryManager/Server/Products/${this.selectedServer}`).then(response => {
                if (response?.status == 200) {
                    this.productVersionsOnServer = response.data.productVersions;
                    this.clearassignProductVersionForm();
                }
            });
        },
        async deleteServer() {
            await apiConnection.Delete(`InventoryManager/Server?id=${this.selectedServer}`).then(response => {
                if (response?.status == 200) {
                    this.servers = this.servers.filter((server) => server.id != this.selectedServer);
                    this.selectedServer = null;
                    this.productVersionsOnServer = null;
                    this.clearassignProductVersionForm();
                }
            });
        },
        async removeProductVersionFromServer(serverID, productVersionID) {
            await apiConnection.Delete(`InventoryManager/Server/Remove/${serverID}/${productVersionID}`).then(response => {
                if (response?.status == 200) {
                    this.productVersionsOnServer = this.productVersionsOnServer.filter((pv) => pv.id != productVersionID);
                }
            });
        },
        async assignProductVersionClicked() {
            apiConnection.Get("InventoryManager/Vendor").then(response => { this.vendors = response?.data?.vendors; });
            this.assignProductVersionVisible = true;
        },
        async vendorChanged() {
            await apiConnection.Get(`InventoryManager/Product/ByVendor/${this.selectedVendor}`).then(response => {
                this.products = response?.data?.products;
            });
            this.selectedProduct = null;
            this.selectedVersion = null;
            this.productVersions = null;
        },
        async productChanged() {
            await apiConnection.Get(`InventoryManager/ProductVersion/ByProduct/${this.selectedProduct}`).then(response => {
                this.productVersions = response?.data?.productVersions;
            });
            this.selectedVersion = null;
        },
        async assignProductVersionToServer() {
            await apiConnection.Post("InventoryManager/Server", { serverID: this.selectedServer, productVersionID: this.selectedVersion }).then(response => {
                if (response?.status == 200) {
                    if (this.productVersionsOnServer == null) {
                        this.productVersionsOnServer = [];
                    }
                    var existingItem = this.productVersionsOnServer.filter(item => item.id == this.selectedVersion && item.product.id == this.selectedProduct && item.product.vendor.id == this.selectedVendor);
                    if (existingItem == null || existingItem.length == 0) {
                        this.productVersionsOnServer.push({
                            id: this.selectedVersion,
                            version: this.productVersions.filter((productVersion) => productVersion.id == this.selectedVersion)[0].version,
                            product: {
                                id: this.selectedProduct,
                                name: this.products.filter((product) => product.id == this.selectedProduct)[0].name,
                                vendor: {
                                    id: this.selectedVendor,
                                    name: this.vendors.filter((vendor) => vendor.id == this.selectedVendor)[0].name
                                }
                            }
                        });
                    }
                }
            });
        }
    }
}
</script>