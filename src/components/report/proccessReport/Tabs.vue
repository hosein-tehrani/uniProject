<template>
  <div class="pb-5">
    <div class="pb-5">
      <v-expansion-panels v-model="opens" background-color="transparent" multiple>
        <div class="break-avoid w-100" v-for="(item, index) in item" :key="index">
          <v-expansion-panel class="pa-0 border mb-1">
            <div class="break-avoid">
              <v-expansion-panel-header>
                <v-row>
                  <v-col class="text-center">
                    {{ item.day }} - {{ item.date }}
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="my-1 pa-0">
                <b-table
                  responsive
                  small
                  show-empty
                  
                  :fields="computedFields[index]"
                  :items="item.shifts"
                  empty-text="رکوردی برای نمایش وجود ندارد"
                  empty-filtered-text="رکوردی برای نمایش وجود ندارد"
                >
                  <template v-slot:head()="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{ data.label }}
                    </div>
                  </template>
                  <template v-slot:cell()="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{
                        typeof data.value === "number"
                          ? Number(data.value).toLocaleString()
                          : data.value
                      }}
                    </div>
                  </template>
                  <template v-slot:cell(index)="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{ data.index + 1 }}
                    </div>
                  </template>
                  <div slot="table-busy" class="text-center primary--text my-2">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      class="align-middle"
                    ></v-progress-circular>
                  </div>
                </b-table>
                <!-- {{item.shifts[0].filter(x=>x)}} -->
              </v-expansion-panel-content>
            </div>
          </v-expansion-panel>
          <hr />
        </div>
      </v-expansion-panels>
      <v-expansion-panels v-model="sumOpen" background-color="transparent" multiple>
        <div class="break-avoid w-100">
          <v-expansion-panel class="pa-0 border mb-1">
            <div class="break-avoid">
              <v-expansion-panel-header>
                <v-row>
                  <v-col class="text-center"> مجموع کل </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="my-1 pa-0">
                <b-table
                  responsive
                  small
                  show-empty
                 
                  :fields="fields.filter((x) => x.key != 'shiftName')"
                  :items="total"
                  class="my-3"
                  empty-text="رکوردی برای نمایش وجود ندارد"
                  empty-filtered-text="رکوردی برای نمایش وجود ندارد"
                >
                  <template v-slot:head()="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{ data.label }}
                    </div>
                  </template>
                  <template v-slot:cell()="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{
                        typeof data.value === "number"
                          ? Number(data.value).toLocaleString()
                          : data.value
                      }}
                    </div>
                  </template>
                  <template v-slot:cell(index)="data">
                    <div style="text-align: center; vertical-align: middle">
                      {{ data.index + 1 }}
                    </div>
                  </template>
                  <div slot="table-busy" class="text-center primary--text my-2">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                      class="align-middle"
                    ></v-progress-circular>
                  </div>
                </b-table>
              </v-expansion-panel-content>
            </div>
          </v-expansion-panel>
          <hr />
        </div>
      </v-expansion-panels>      
    </div>

  </div>
</template>
<script>
export default {
  props: ["opens", "fields", "item", "total"],
  data() {
    return {
     sumOpen:[0] 
    }
    
  },
  computed: {
    computedFields() {
      let daysCount = this.item.length;
      let myFields = new Array(daysCount).fill(this.fields);

      // myFields.forEach((dayField, index) => {
      //   myFields[index] = dayField.filter(x=>x.key != "shiftName")
      // });

      myFields.forEach((dayField, index) => {
        let dayShiftCounter = this.item[index].shifts.length;
        let myDayTotal = this.item[index].shifts[dayShiftCounter - 1];

        let notToDeleteColumns = [
          "generalCosts",
          "generalClinic",
          "generalTotal",
          "takhasosCosts",
          "takhasTotalTotal",
          "takhasTotalClinic",
          "takhasosTotal",
          "homeCareTotalCost",
          "dentistryTotalTotal",
          "sumAllCosts",
          "sumAllClinic",
          "sumAllTotal"
        ];

        myFields[index] = dayField.filter(
          (x) => myDayTotal[x.key] || notToDeleteColumns.includes(x.key)
        );
      });

      return myFields;
    },
  },
};
</script>
<style scoped>
table {
  break-inside: avoid;
  page-break-inside: avoid;
  transform: scale(0.5);
}
.break-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
@media print {
  table {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .break-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  td,
  th {
    font-size: 20%;
  }
}
</style>