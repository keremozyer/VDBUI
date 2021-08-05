<template>
<div>
    <div id="vendors">
        <h2>Firma Seçiniz:</h2>
        <select v-model="selectedVendor" @change="vendorChanged()">
            <option v-for="vendor in vendors" :key="vendor">{{vendor}}</option>
        </select>
    </div>
    <div v-if="selectedVendor != null" id="products">
        <h2>Ürün Seçiniz:</h2>
        <select v-model="selectedProduct" @change="productChanged()">
            <option v-for="product in products" :key="product">{{product}}</option>
        </select>
    </div>
    <div v-if="selectedProduct != null" id="productVersions">
        <h2>Versiyon Seçiniz:</h2>
        <select v-model="selectedProductVersion" @change="productVersionChanged()">
            <option v-for="productVersion in productVersions" :key="productVersion.id" :value="productVersion.id">{{productVersion.version}}</option>
        </select>
    </div>
    <div v-if="selectedProductVersion != null" id="ignoredCVEs">
        <h2>Zafiyet Seçiniz:</h2>
        <select v-model="selectedIgnoredCVE">
            <option v-for="ignoredCVE in ignoredCVEs" :key="ignoredCVE.id" :value="ignoredCVE.id">{{ignoredCVE.cveid}}</option>
        </select>
    </div>
    <div v-if="isAdmin && selectedIgnoredCVE != null" style="margin-top: 25px">
        <button class="button btn-primary" @click="acknowledgeCVE()">Zafiyeti Kabul Et</button>
    </div>
</div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'

export default {
  name: 'AcknowledgeCVEPage',
  data() {
    return {
      responseData: null,
      vendors: [],
      selectedVendor: null,
      products: [],
      selectedProduct: null,
      productVersions: [],
      selectedProductVersion: null,
      ignoredCVEs: [],
      selectedIgnoredCVE: null
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
  async mounted() {
    await apiConnection.Get("VulnerabilityDetector/ProductVersionCVE").then(response => {
      if (response?.status == 200) {        
        if (response.data?.productVersions != null && response.data?.productVersions.length > 0) {
            this.responseData = response.data.productVersions;
            this.vendors = response.data.productVersions.map(pv => pv.product.vendor);
            this.vendors = [...new Set(this.vendors.map(item => item.name))];            
        }
      }
    });
  },
  methods: {
      vendorChanged() {
        var products = this.responseData.filter(pv => { return pv.product.vendor.name == this.selectedVendor}).map(pv => pv.product);
        this.products = [...new Set(products.map(item => item.name))];
        this.selectedProduct = null;
        this.productVersions = null;
        this.selectedProductVersion = null;
        this.ignoredCVEs = null;
        this.selectedIgnoredCVE = null;
      },
      productChanged() {
        this.productVersions = this.responseData.filter(pv => pv.product.vendor.name == this.selectedVendor && pv.product.name == this.selectedProduct);
        this.selectedProductVersion = null;
        this.ignoredCVEs = null;
        this.selectedIgnoredCVE = null;
      },
      async productVersionChanged() {
          await apiConnection.Get(`VulnerabilityDetector/ProductVersionCVE/Ignored/${this.selectedProductVersion}`).then(response => {
              if (response?.status == 200) {
                  this.ignoredCVEs = response.data.ignoredCVEs;
                  this.selectedIgnoredCVE = null;
              }
          });
      },
      async acknowledgeCVE() {
          await apiConnection.Delete(`VulnerabilityDetector/ProductVersionCVE?productVersionID=${this.selectedProductVersion}&cveid=${this.selectedIgnoredCVE}`).then(response => {
              if (response?.status == 200) {
                  alert("Seçili Ürün Versiyonu - Zafiyet İkilisi Başarıyla Yürürlüğe Alındı.");
                  this.ignoredCVEs = this.ignoredCVEs.filter(c => c.id != this.selectedIgnoredCVE);
                  this.selectedIgnoredCVE = null;
              }
          });
      }
  }
}
</script>