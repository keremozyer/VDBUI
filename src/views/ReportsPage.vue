<template>
<div id="newReportDiv">
    <button class="button btn-primary" @click="createNewReport()">Yeni Tarama Başlat</button>
</div>
<div id="searchCriterias" style="margin-top: 25px">
    <div class="searchCriteria">
        <b>Arama Başlangıç Tarihi:</b>
        <datepicker v-model="startingDate" clearable="true" />
    </div>
    <div class="searchCriteria">
        <b>Arama Bitiş Tarihi:</b>
        <datepicker v-model="endingDate" clearable="true" />
    </div>
    <div class="searchCriteria" style="width:25%">
        <b>Rapor Durumu:</b>
        <Multiselect v-model="statuses" :options="statusOptions" mode="tags" :createTag="true" />
    </div>
    <div class="searchCriteria" style="width:25%">
        <b>Sayfa Başına Sonuç Sayısı:</b>
        <input v-model="requestedPageSize" type="number" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57" />
    </div>
    <div class="searchCriteria">
        <button class="button btn-primary" @click="searchReports(1)">Ara</button>        
    </div>
</div>
<div id="reports" style="margin-top: 25px">
    <b v-if="noRecords">Kayıt Bulunamadı</b><b v-else>Toplam Kayıt Sayısı: {{totalItemCount}}</b>
    <table>
        <thead>
            <th>Rapor Oluşturulma Tarihi</th>
            <th>Rapor Durumu</th>
            <th>Hata Mesajı</th>
            <th>Dökümanı İndir</th>
        </thead>
        <tbody>
            <tr v-for="report in reports" :key="report.id">
                <td v-if="report.reportCreationDate != null && report.reportCreationDate != ''">{{(new Date(new Date(report.reportCreationDate) - ((new Date()).getTimezoneOffset() * 120000))).toISOString().slice(0, -5).replace('T', ' ')}}</td><td v-else></td>
                <td>{{getReportStatusLabel(report.reportStatus)}}</td>
                <td>{{report.errorMessage}}</td>
                <td v-if="report.hasDocument"><button type="button" class="btn btn-info btn-sm" @click="downloadReport(report.id)">İndir</button></td><td v-else></td>
            </tr>
        </tbody>
    </table>
    <div v-if="pageIndexes != null && pageIndexes.length > 0" id="pageButtons" style="width:fit-content; margin-top: 5px">
        Sayfalar: <button v-for="pageIndex in pageIndexes" :key="pageIndex" @click="searchReports(pageIndex)" type="button" class="btn btn-secondary btn-sm" style="margin-right: 3px">{{pageIndex}}</button>        
    </div>
</div>
</template>


<script>
import Datepicker from 'vue3-datepicker'
import Multiselect from '@vueform/multiselect'
import apiConnection from '../arch/apiConnection'

const defaultPageSize = 20;

export default {
  name: 'ReportsPage',
  components: {
      Datepicker,
      Multiselect
  },
  data() {
      return {
          noRecords: true,
          startingDate: null,
          endingDate: null,
          statuses: null,
          statusOptions: [
              { value: "CMP", label: "Tamamlandı" },
              { value: "PROC", label: "İşlem Sürüyor" },
              { value: "WAIT", label: "Beklemede" },
              { value: "ERR", label: "Hata Yaşandı" },
          ],
          totalItemCount: 0,
          reports: [],
          pageIndexes: [],
          requestedPageSize: 0
      }
  },
  methods: {
      async createNewReport() {
          await apiConnection.Post("VulnerabilityDetector/Report").then(response => {
              if (response.status == 200) {
                if (this.reports == null) {
                    this.reports = [];
                }
                this.reports.unshift({
                    id: response.data,
                    reportStatus: "WAIT"
                });
              }
          });
      },
      getReportStatusLabel(status) {
          return this.statusOptions.filter(o => { return o.value == status; })[0].label;
      },
      async searchReports(pageIndex) {
          if (this.requestedPageSize != null) {
              this.requestedPageSize = this.requestedPageSize.toString().replace(",", "").replace(".", "");
          }
          var queryPageSize = this.requestedPageSize;
          if (queryPageSize == null || queryPageSize <= 0) {
              queryPageSize = defaultPageSize
          }

          var query = `VulnerabilityDetector/Report?PageIndex=${pageIndex}&PageSize=${queryPageSize}`;
          if (this.startingDate != null) {
              query += "&StartingDate=" + this.startingDate.toISOString();
          }
          if (this.endingDate != null) {
              query += "&EndingDate=" + this.endingDate.toISOString();
          }
          if (this.statuses != null && this.statuses.length > 0) {
              for (var i = 0; i < this.statuses.length; i++) {
                  query += "&Statuses=" + this.statuses[i];
              }
          }
          await apiConnection.Get(query).then(response => 
          {
              if (response?.status == 200) {
                this.pageIndexes = [];
                this.totalItemCount = response.data.totalItemCount;
                this.reports = response.data.reports;
                this.noRecords = this.reports == null || this.reports.length < 0;
                var pageCount = Math.ceil(this.totalItemCount / queryPageSize);
                if (pageCount > 1) {
                    for (var i = 1; i <= pageCount; i++) {
                        this.pageIndexes.push(i);
                    }
                }  
              }                            
          });
      },
      async downloadReport(reportID) {
          await apiConnection.Get(`VulnerabilityDetector/Report/Document/${reportID}`).then(response => {
              if (response?.status == 200) {
                var element = document.createElement('a');                
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data));
                element.setAttribute('download', response.headers["content-disposition"].split(";")[1].replace(" filename=", "").replace("\"", "").replace("_", "").replace("\"", ""));

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
              }
          });
      }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.searchCriteria {
    display: inline-block;
    margin-right: 15px;
}
</style>