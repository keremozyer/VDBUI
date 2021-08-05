<template>
<div id="reportInfo">
  <b>Id: </b>{{report?.id}} <br />
  <b>Rapor Üretim Tarihi: </b>{{utils.convertToLocalDateTime(report.reportCreationDate)}} <br />
  <b>Rapor Durumu: </b>{{report.reportStatus ? getReportStatusLabel(report.reportStatus) : null}}
</div>
<div id="reportContents" style="margin-top: 50px">
  <table>
    <thead>
      <th v-if="isAdmin">Yok say</th>
      <th>Firma</th>
      <th>Ürün</th>
      <th>Versiyon</th>
      <th>CVE Id</th>
      <th>Yayım Tarihi</th>
      <th>Güncellenme Tarihi</th>
      <th>Açıklama</th>
      <th>Bulunduğu Sunucular</th>
      <th>Tarama Notu</th>
    </thead>
    <tbody>
      <template v-for="content in report.contents" :key="content.productVersion.id">
        <tr v-for="cveMatch in content.cveMatches" :key="cveMatch.cve.id">
          <td v-if="isAdmin"><button class="button btn-primary" @click="ignoreCVEForProductVersion(content.productVersion.id, cveMatch.cve.id)">Yok Say</button></td>
          <td>{{content.productVersion.product.vendor.name}}</td>
          <td>{{content.productVersion.product.name}}</td>
          <td>{{content.productVersion.version}}</td>
          <td>{{cveMatch.cve.cveid}}</td>
          <td>{{cveMatch.publishedDate}}</td>
          <td>{{cveMatch.lastModifiedDate}}</td>
          <td>{{cveMatch.description}}</td>
          <td>
          <ul>
            <li v-for="server in content.servers" :key="server.id">
              {{server.name}}
            </li>
          </ul>
          </td>
          <td>{{mappings.cveMatchTypeMap[cveMatch.matchType]}}</td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from "vuex";
import apiConnection from '../arch/apiConnection'
import maps from "../maps/CodeValueMaps"
import utilities from "../arch/utils"

export default {
  name: 'ReportContentsPage',
  data() {
    return {
      report: {}
    }    
  },
  setup() {
    const store = useStore();

    let isAdmin = computed(function () {
        return store.state.isAdmin
    });

    let mappings = computed(function() {
        return maps;
    });
    let utils = computed(function() {
        return utilities;
    })
    return {
        mappings,
        utils,
        isAdmin
    };
  },
  async mounted() {
    await apiConnection.Get(`VulnerabilityDetector/Report/Content/${this.$route.query.reportID}`).then(response => {
      if (response.status == 200) {
        this.report = response.data;
      }
    });
  },
  methods: {
    getReportStatusLabel(status) {
      return this.mappings.reportStatusMap.filter(o => { return o.value == status; })[0].label;
    },
    async ignoreCVEForProductVersion(productVersionID, cveID) {
      await apiConnection.Post(`VulnerabilityDetector/ProductVersionCVE`, { productVersionID: productVersionID, cveID: cveID }).then(response => {
        if (response.status == 200) {
          alert("İlgili Zafiyet - Ürün Versiyonu İkilisi Başarıyla Yok Sayıldı.");
        }
      });
    }
  }
}
</script>