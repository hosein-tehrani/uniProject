<template>
  <div>
    <!--print doctor report pdf from this div -->
    <v-row style="margin: 10px">
      <v-col v-if="items.doctorName.length > 0">
        <h5 v-if="items.doctorName.length == 1">
          پزشک: دکتر {{ items.doctorName[0] }}
        </h5>
        <h5 v-else>
          پزشکان:
          <span
            v-for="doc in items.doctorName"
            :key="doc.index"
            style="line-height: 30px"
          >
            - دکتر {{ doc }}</span
          >
        </h5>
      </v-col>
      <v-col v-if="items.nurseName.length > 0">
        <h5 v-if="items.nurseName.length == 1">
          پرستار: {{ items.nurseName[0] }}
        </h5>
        <h5 v-else>
          پرستاران:
          <span
            v-for="nurse in items.nurseName"
            :key="nurse.index"
            style="line-height: 30px"
          >
            - {{ nurse }}</span
          >
        </h5>
      </v-col>
      <v-col v-if="items.receptionName.length > 0">
        <h5 v-if="items.receptionName.length == 1">
          پذیرش: {{ items.receptionName[0] }}
        </h5>
        <h5 v-else>
          کارمندان پذیرش:
          <span
            v-for="reception in items.receptionName"
            :key="reception.index"
            style="line-height: 30px"
          >
            - {{ reception }}</span
          >
        </h5>
      </v-col>
    </v-row>
    <v-row v-if="items.startDate" style="margin: 10px">
      <v-col>
        <h5>
          از:
          {{ weekDict[moment(items.startDate, "jYYYY/jMM/jDD").weekday()] }}
          {{ items.startDate }} - {{ items.startTime }}
        </h5>
      </v-col>
      <v-col>
        <h5>
          تا:
          {{ weekDict[moment(items.endDate, "jYYYY/jMM/jDD").weekday()] }}
          {{ items.endDate }} - {{ items.endTime }}
        </h5>
      </v-col>
    </v-row>
    <hr />
    <div v-if="job == 'reception'">
      <div v-if="items.allRelateShifts.relateShifts.length">
        <h5>
          <strong>شیفت‌های مربوطه</strong>
        </h5>
        <!-- nurse report => shifts table -->
        <b-table
          responsive
          show-empty
          :fields="recShiftFields"
          :items="items.allRelateShifts.relateShifts"
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
        </b-table>
        <v-row style="margin: 20px 10px">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                ساعت عملکرد :
                {{ items.allRelateShifts.sum }}
              </strong>
            </h6>
          </v-col>

          <v-col>
            <h6>
              <strong>
                تعداد کل پذیرش :
                {{
                  items.allRelateShifts.relateShifts
                    .map(x => x.number)
                    .reduce((a, b) => parseInt(a) + parseInt(b), 0)
                }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-if="job == 'nurse'">
      <div v-if="items.allRelateShifts.relateShifts.length">
        <h5><strong>شیفت‌های مربوطه</strong></h5>
        <!-- nurse report => shifts table -->
        <b-table
          responsive
          show-empty
          :fields="nurseShiftFields"
          :items="items.allRelateShifts.relateShifts"
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
        </b-table>
        <v-row style="margin: 20px 10px">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                ساعت عملکرد :
                {{ items.allRelateShifts.sum }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>

    <div v-if="job != 'nurse'">
      <div v-if="items.visits.length">
        <h5><strong>ویزیت</strong></h5>
        <!-- doctor report => visits table  -->
        <b-table
          responsive
          show-empty
          :fields="visitFields"
          :items="items.visits"
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
        </b-table>
        <v-row style="margin: 20px 10px">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                تعداد :
                {{ Number(items.visitTotalCount).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                کارکرد درمانگاه :
                {{ Number(items.visitTotalTotal).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col v-if="role != 'reception'">
            <h6>
              <strong>
                هزینه اقلام حفاظتی :
                {{ Number(items.visitTotalClinic).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <!-- <v-col>
            <h6>
              <strong>
                هزینه مواد مصرفی :
                {{ Number(items.visitTotalExpenses).toLocaleString() }}
              </strong>
            </h6>
          </v-col> -->
          <v-col>
            <h6>
              <strong>
                دریافتی :
                {{ Number(items.visitTotalCosts).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-if="job != 'nurse'">
      <div v-if="items.takhasos.length">
        <h5>
          <strong>ویزیت تخصصی</strong>
        </h5>
        <!-- doctor report => expert visit table-->
        <b-table
          responsive
          show-empty
          :fields="visitFields"
          :items="items.takhasos"
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
        </b-table>
        <v-row style="margin: 20px 10px">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                تعداد :
                {{ Number(items.takhasTotalCount).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                کارکرد درمانگاه :
                {{ Number(items.takhasTotalTotal).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col v-if="role != 'reception'">
            <h6>
              <strong>
                هزینه اقلام حفاظتی :
                {{ Number(items.takhasTotalClinic).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <!-- <v-col>
            <h6>
              <strong>
                هزینه مواد مصرفی :
                {{ Number(items.takhasTotalExpenses).toLocaleString() }}
              </strong>
            </h6>
          </v-col> -->
          <v-col>
            <h6>
              <strong>
                دریافتی :
                {{ Number(items.takhasTotalCosts).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-if="items.homeCare.length">
      <h5><strong>خدمات در منزل</strong></h5>
      <!-- doctor report => home care table  -->
      <b-table
        responsive
        show-empty
        :fields="otherItemsField"
        :items="items.homeCare"
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
      </b-table>
      <v-row style="margin: 20px 10px">
        <v-col>
          <h6>
            <strong>مجموع : </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              تعداد :
              {{ Number(items.homeCareTotalCount).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              دریافتی :
              {{ Number(items.homeCareTotalCost).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
      </v-row>
    </div>
    <div v-if="items.balinis.length">
      <h5><strong  class="common-text">خدمات بالینی</strong></h5>
      <!-- doctor report => balini services table -->
      <b-table
        responsive
        show-empty
        :fields="visitFields"
        :items="items.balinis"
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
      </b-table>
      <v-row style="margin: 20px 10px">
        <v-col>
          <h6>
            <strong>مجموع : </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              تعداد :
              {{ Number(items.baliniTotalCount).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              کارکرد درمانگاه :
              {{ Number(items.baliniTotalTotal).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col v-if="role != 'reception'">
          <h6>
            <strong>
              هزینه اقلام حفاظتی :
              {{ Number(items.baliniTotalClinic).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <!-- <v-col>
          <h6>
            <strong>
              هزینه مواد مصرفی :
              {{ Number(items.baliniTotalExpenses).toLocaleString() }}
            </strong>
          </h6>
        </v-col> -->
        <v-col>
          <h6>
            <strong>
              دریافتی :
              {{ Number(items.baliniTotalCosts).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
      </v-row>
    </div>
    <div v-if="items.outBalinis.length">
      <h5><strong>خدمات بالینی (خارج از درمانگاه)</strong></h5>
      <!-- doctor report => balini services out of clinic table -->
      <b-table
        responsive
        show-empty
        :fields="visitFields"
        :items="items.outBalinis"
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
      </b-table>
      <v-row style="margin: 20px 10px">
        <v-col>
          <h6>
            <strong>مجموع : </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              تعداد :
              {{ Number(items.baliniOutTotalCount).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              کارکرد درمانگاه :
              {{ Number(items.baliniOutTotalTotal).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col v-if="role != 'reception'">
          <h6>
            <strong>
              هزینه اقلام حفاظتی :
              {{ Number(items.baliniOutTotalClinic).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <!-- <v-col>
          <h6>
            <strong>
              هزینه مواد مصرفی :
              {{ Number(items.baliniOutTotalExpenses).toLocaleString() }}
            </strong>
          </h6>
        </v-col> -->
        <v-col>
          <h6>
            <strong>
              دریافتی :
              {{ Number(items.baliniOutTotalCosts).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
      </v-row>
    </div>
    <div v-if="items.surgery.length">
      <h5><strong>جراحی سرپایی </strong></h5>
      <!-- doctor report => surgery table -->
      <b-table
        responsive
        show-empty
        :fields="visitFields"
        :items="items.surgery"
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
      </b-table>
      <v-row style="margin: 20px 10px">
        <v-col>
          <h6>
            <strong>مجموع : </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              تعداد :
              {{ Number(items.surgeryTotalCount).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              کارکرد درمانگاه :
              {{ Number(items.surgeryTotalTotal).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col v-if="role != 'reception'">
          <h6>
            <strong>
              هزینه اقلام حفاظتی :
              {{ Number(items.surgeryTotalClinic).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <!-- <v-col>
          <h6>
            <strong>
              هزینه مواد مصرفی :
              {{ Number(items.surgeryTotalExpenses).toLocaleString() }}
            </strong>
          </h6>
        </v-col> -->
        <v-col>
          <h6>
            <strong>
              دریافتی :
              {{ Number(items.surgeryTotalCosts).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
      </v-row>
    </div>
    <div v-if="items.surgeryOut.length">
      <h5><strong>جراحی سرپایی (خارج از درمانگاه)</strong></h5>
      <!-- doctor report => surgery out of clinic table-->
      <b-table
        responsive
        show-empty
        :fields="visitFields"
        :items="items.surgeryOut"
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
      </b-table>
      <v-row style="margin: 20px 10px">
        <v-col>
          <h6>
            <strong>مجموع : </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              تعداد :
              {{ Number(items.surgeryOutTotalCount).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col>
          <h6>
            <strong>
              کارکرد درمانگاه :
              {{ Number(items.surgeryOutTotalTotal).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <v-col v-if="role != 'reception'">
          <h6>
            <strong>
              هزینه اقلام حفاظتی :
              {{ Number(items.surgeryOutTotalClinic).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
        <!-- <v-col>
          <h6>
            <strong>
              هزینه مواد مصرفی :
              {{ Number(items.surgeryOutTotalExpenses).toLocaleString() }}
            </strong>
          </h6>
        </v-col> -->
        <v-col>
          <h6>
            <strong>
              دریافتی :
              {{ Number(items.surgeryOutTotalCosts).toLocaleString() }}
            </strong>
          </h6>
        </v-col>
      </v-row>
    </div>
    <div v-if="job != 'nurse'">
      <div v-if="items.others.length">
        <h5><strong>خدمات دیگر</strong></h5>
        <!-- doctor report => other services table -->
        <b-table
          responsive
          show-empty
          :fields="otherItemsField"
          :items="items.others"
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
        </b-table>
        <v-row style="margin: 20px 10px">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                تعداد :
                {{ Number(items.otherTotalCount).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                دریافتی :
                {{ Number(items.otherTotalCost).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-if="job != 'nurse'">
      <div v-if="items.canceled.length">
        <h5 style="color: red"><strong>خدمات لغو شده</strong></h5>
        <!-- doctor report => canceled services table -->
        <b-table
          responsive
          show-empty
          :fields="visitFields"
          :items="items.canceled"
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
        </b-table>
        <v-row style="margin: 20px 10px; color: red">
          <v-col>
            <h6>
              <strong>مجموع : </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                تعداد :
                {{ Number(items.canceledTotalCount).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col>
            <h6>
              <strong>
                کارکرد درمانگاه :
                {{ Number(items.canceledTotalTotal).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <v-col v-if="role != 'reception'">
            <h6>
              <strong>
                هزینه اقلام حفاظتی :
                {{ Number(items.canceledTotalClinic).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
          <!-- <v-col>
            <h6>
              <strong>
                هزینه مواد مصرفی :
                {{ Number(items.canceledTotalExpense).toLocaleString() }}
              </strong>
            </h6>
          </v-col> -->
          <v-col>
            <h6>
              <strong>
                دریافتی :
                {{ Number(items.canceledTotalCost).toLocaleString() }}
              </strong>
            </h6>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-row>
      <v-col>
        <div
          v-if="items.totalCost != ''"
          style="border-radius: 5px; border: 1px black solid; padding: 20px"
        >
          <h6>
            جمع کارکرد درمانگاه:
            {{ Number(items.totalCost).toLocaleString() }}
            <strong>ریال</strong>
          </h6>
          <h6 v-if="role != 'reception'" style="margin-top: 10px">
            جمع هزینه اقلام حفاظتی:
            {{ Number(items.totalClinicShare).toLocaleString() }}
            <strong>ریال</strong>
          </h6>
          <!-- <h4 style="margin-top: 10px">
            جمع مواد مصرفی:
            {{ Number(items.totalExpen).toLocaleString() }}
            <strong>ریال</strong>
          </h4> -->
          <h6 style="margin-top: 10px">
            جمع دریافتی:
            {{ Number(items.totalIncome).toLocaleString() }}
            <strong>ریال</strong>
          </h6>
        </div>
      </v-col>
      <v-col>
        <div
          style="
            border-radius: 5px;
            border: 1px black solid;
            height: auto;
            padding: 20px;
          "
          class="common-text"
        >
          <p>دریافتی کارتخوان:</p>
          <p>دریافتی نقدی:</p>
          <p>جمع دریافتی روزانه:</p>
          <p>محل امضای پذیرش:</p>
        </div>
      </v-col>
      <v-col v-if="items.doctorName.length == 1">
        <div
          style="
            border-radius: 5px;
            border: 1px grey solid;
            height: 175px;
            padding: 20px;
          "
          class="common-text"
        >
          محل امضای پزشک:
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import moment from "moment-jalaali";
import { mapGetters } from "vuex";

export default {
  props: ["items", "job"],
  data() {
    return {
      moment: moment,
      weekDict: [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه",
        "چهارشنبه",
        "پنج شنبه",
        "جمعه"
      ],
      nurseShiftFields: [
        { key: "index", label: "#" },
        { key: "startTime", label: "تاریخ شیفت" },
        { key: "duration", label: "ساعت عملکرد" }
      ],
      recShiftFields: [
        { key: "index", label: "#" },
        { key: "startTime", label: "تاریخ شیفت" },
        { key: "duration", label: "ساعت عملکرد" },
        { key: "number", label: "تعداد پذیرش " }
      ],
      otherItemsField: [
        { key: "index", label: "#" },
        { key: "name", label: "خدمت" },
        { key: "count", label: "تعداد" },
        { key: "totalCost", label: "مبلغ دریافتی" }
      ],
      role:''
    };
  },
  computed: {
    visitFields() {
      let fields =
        this.role == "reception"
          ? [
              { key: "index", label: "#" },
              { key: "name", label: "خدمت" },
              { key: "count", label: "تعداد" },
              { key: "total", label: "کارکرد درمانگاه" },
              // { key: "totalExpens", label: "هزینه مواد مصرفی" },
              { key: "totalCost", label: "مبلغ دریافتی" }
            ]
          : [
              { key: "index", label: "#" },
              { key: "name", label: "خدمت" },
              { key: "count", label: "تعداد" },
              { key: "total", label: "کارکرد درمانگاه" },
              { key: "totalClinicShare", label: "هزینه اقلام حفاظتی" },
              // { key: "totalExpens", label: "هزینه مواد مصرفی" },
              { key: "totalCost", label: "مبلغ دریافتی" }
            ];
      return fields;
    }
  },
  mounted() {
    this.role = localStorage.getItem("role");
  }
};
</script>
