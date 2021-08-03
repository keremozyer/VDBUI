<template>
    <div id="vendorDiv">
        <h2>Firma Seçiniz Ya Da Yeni Giriş Yapınız:</h2>
        <select v-model="selectedVendor" @change="vendorChanged()">
            <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">
                {{vendor.name}}
            </option>
        </select>
        <div class="adminDiv" v-if="isAdmin">
            <form style="display:inline" v-on:submit.prevent="createVendor">
                <input style="margin-left:25px" type="text" id="vendorName" v-model="createVendorForm.name" placeholder="Yeni Firma Adı"/>
                <button style="margin-left:25px" class="btn btn-primary">Oluştur</button>
            </form>
            <form v-if="selectedVendor != null" style="display:inline" v-on:submit.prevent="deleteVendor">
                <button style="margin-left:25px" class="btn btn-danger">Seçili Firmayı Sil</button>
            </form>
        </div>
    </div>
    <div v-if="selectedVendor != null" id="productDiv" style="margin-top:30px">
        <h2>Ürün Seçiniz Ya Da Yeni Giriş Yapınız:</h2>
        <select v-model="selectedProduct" @change="productChanged()">
            <option v-for="product in products" :key="product.id" :value="product.id">
                {{product.name}}
            </option>
        </select>
        <div class="adminDiv" v-if="isAdmin">
            <form style="display:inline" v-on:submit.prevent="createProduct">
                <input style="margin-left:25px" type="text" id="productName" v-model="createProductForm.name" placeholder="Yeni Ürün Adı"/>
                <button style="margin-left:25px" class="btn btn-primary">Oluştur</button>
            </form>
            <form v-if="selectedProduct != null" style="display:inline" v-on:submit.prevent="deleteProduct">
                <button style="margin-left:25px" class="btn btn-danger">Seçili Ürünü Sil</button>
            </form>
        </div>
    </div>
    <div v-if="selectedProduct != null" id="versionDiv" style="margin-top:30px">
        <h2>Versiyon Seçiniz Ya Da Yeni Giriş Yapınız:</h2>
        <select v-model="selectedVersion">
            <option v-for="version in productVersions" :key="version.id" :value="version.id">
                {{version.version}}
            </option>
        </select>
        <div class="adminDiv" v-if="isAdmin">
            <form style="display:inline" v-on:submit.prevent="createVersion">
                <input style="margin-left:25px" type="text" id="version" v-model="createVersionForm.version" placeholder="Yeni Versiyon"/>
                <button style="margin-left:25px" class="btn btn-primary">Oluştur</button>
            </form>
            <form v-if="selectedVersion != null" style="display:inline" v-on:submit.prevent="deleteVersion">
                <button style="margin-left:25px" class="btn btn-danger">Seçili Versiyonu Sil</button>
            </form>
        </div>
    </div>
</template>


<script>

import {computed} from 'vue';
import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'

export default {
    name: 'InventoryManagementPage',
    data() {
        return {                   
            vendors: [{}],
            selectedVendor: null,
            createVendorForm: {
                name: null
            },
            products: [{}],
            selectedProduct: null,
            createProductForm: {
                vendorID: null,
                name: null
            },
            productVersions: [{}],
            selectedVersion: null,
            createVersionForm: {
                productID: null,
                version: null
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
        apiConnection.Get("InventoryManager/Vendor").then(response => { this.vendors = response?.data?.vendors; });
    },
    methods: {
        async createVendor() {
            await apiConnection.Put("InventoryManager/Vendor", this.createVendorForm).then(response => {
                if (response?.status == 200) {
                    if (this.vendors == null) {
                        this.vendors = [{}];
                    }
                    var existingVendor = this.vendors.filter((vendor) => vendor.id == response.data.id);
                    if (existingVendor == null || existingVendor.length == 0) {
                        this.vendors.push(response.data);
                    }
                    this.selectedVendor = response.data.id;
                    this.selectedProduct = null;
                    this.products = null;
                    this.selectedVersion = null;
                    this.productVersions = null;

                    if (existingVendor != null) {
                        this.vendorChanged();
                    }
                }
            });
        },
        async vendorChanged() {
            await apiConnection.Get(`InventoryManager/Product/ByVendor/${this.selectedVendor}`).then(response => {
                this.products = response?.data?.products;
            });
            this.selectedProduct = null;
            this.selectedVersion = null;
            this.productVersions = null;
        },
        async createProduct() {
            var request = {
                ...this.createProductForm,
                vendorID: this.selectedVendor
            }
            await apiConnection.Put("InventoryManager/Product", request).then(response => {
                if (response?.status == 200) {
                    if (this.products == null) {
                        this.products = [{}];
                    }
                    var existingProduct = this.products.filter((product) => product.id == response.data.id);
                    if (existingProduct == null || existingProduct.length == 0) {
                        this.products.push(response.data);
                    }
                    this.selectedProduct = response.data.id;
                    this.productVersions = null;
                    this.selectedVersion = null;

                    if (existingProduct != null) {
                        this.productChanged();
                    }
                }
            });
        },
        async productChanged() {
            await apiConnection.Get(`InventoryManager/ProductVersion/ByProduct/${this.selectedProduct}`).then(response => {
                this.productVersions = response?.data?.productVersions;
            });
            this.selectedVersion = null;
        },
        async createVersion() {
            var request = {
                ...this.createVersionForm,
                productID: this.selectedProduct
            }
            await apiConnection.Put("InventoryManager/ProductVersion", request).then(response => {
                if (response?.status == 200) {
                    if (this.productVersions == null) {
                        this.productVersions = [{}];
                    }
                    var existingVersion = this.productVersions.filter((version) => version.id == response.data.id);
                    if (existingVersion == null || existingVersion.length == 0) {
                        this.productVersions.push(response.data);
                    }
                    this.selectedVersion = response.data.id;
                }              
            });
        },
        async deleteVendor() {
            await apiConnection.Delete(`InventoryManager/Vendor?id=${this.selectedVendor}`).then(response => {
                if (response?.status == 200) {
                    this.vendors = this.vendors.filter((vendor) => vendor.id != this.selectedVendor);
                    this.selectedVendor = null;
                    this.products = null;
                    this.selectedProduct = null;
                    this.productVersions = null;
                    this.selectedVersion = null;
                }
            });
        },
        async deleteProduct() {
            await apiConnection.Delete(`InventoryManager/Product?id=${this.selectedProduct}`).then(response => {
                if (response?.status == 200) {
                    this.products = this.products.filter((product) => product.id != this.selectedProduct);
                    this.selectedProduct = null;
                    this.productVersions = null;
                    this.selectedVersion = null;
                }
            });
        },
        async deleteVersion() {
            await apiConnection.Delete(`InventoryManager/ProductVersion?id=${this.selectedVersion}`).then(response => {
                if (response?.status == 200) {
                    this.productVersions = this.productVersions.filter((productVersion) => productVersion.id != this.selectedVersion);
                    this.selectedVersion = null;
                }
            });
        }
    }
}
</script>