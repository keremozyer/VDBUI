<template>
<table>
    <thead>
        <th>Firma Adı</th>
        <th>Ürün Adı</th>
        <th>Ürün Versiyonu</th>
        <th>Bulunduğu Sunucular</th>
    </thead>
    <tbody>
        <template v-for="product in catalog" :key="product.id">
            <tr v-for="version in product.productVersions" :key="version.id">
                <td>{{product.vendor?.name}}</td>
                <td>{{product.name}}</td>
                <td>{{version.version}}</td>
                <td>{{version.servers.map(function(s) { return s.name }).join(", ")}}</td>
            </tr>
        </template>
    </tbody>
</table>
</template>


<script>

import apiConnection from '../arch/apiConnection'

export default {
  name: 'CatalogPage',
  data() {
      return {
          catalog: [{}]
      }
  },
  mounted() {
      apiConnection.Get("InventoryManager/Product?IncludeVersions=true&IncludeVendorData=true&IncludeContainingServers=true").then(response => { this.catalog = response?.data?.products; });
  }
}
</script>

<style>
table, th, td 
{
	border: 1px solid black;
	border-collapse: collapse;
}
th, td {
	padding: 5px 5px 5px 5px;
	text-align: center;
}
</style>