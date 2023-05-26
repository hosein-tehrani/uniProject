<template>
  <!-- dashboard template -->

  <div class="animated fadeIn pa-3 pt-0">
    <loading v-if="vLoading" />
    <v-dialog
      v-if="role == 'reception'"
      v-model="startShiftDialog"
      persistent
      max-width="600px"
    >
      <!-- NOTE INJA -->
      <v-card>
        <v-card-title class="mt-5">
          <h4>آغاز شیفت</h4>
        </v-card-title>
        <v-card-text>
          <v-container class="text-right">
            <h5 class="mb-5">
              لطفا نام کادر درمان و پرسنل شیفت را انتخاب کنید
            </h5>
            <v-row>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="shiftDoc"
                  :items="drNames"
                  item-text="text"
                  item-value="value"
                  label="نام پزشک"
                  class="pa-0"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  outlined
                  dense
                  v-else
                  v-model="shiftNurse"
                  :items="nurseNames"
                  item-text="text"
                  item-value="value"
                  label="نام پرستار"
                  class="pa-0"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  outlined
                  dense
                  v-else
                  v-model="dentistId"
                  :items="drNames"
                  item-text="text"
                  item-value="value"
                  label="دندانپزشک"
                  class="pa-0"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  outlined
                  dense
                  v-else
                  v-model="nurseDentistId"
                  :items="nurseNames"
                  item-text="text"
                  item-value="value"
                  label="دستیار دندانپزشک"
                  class="pa-0"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="shiftDocOnCall"
                  :items="drNames"
                  item-text="text"
                  item-value="value"
                  label="نام پزشک آنکال خدمات در منزل"
                  class="pa-0"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="shiftNurseOnCall"
                  :items="nurseNames"
                  item-text="text"
                  item-value="value"
                  label="نام پرستارآنکال خدمات در منزل"
                  class="pa-0"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row
              ><v-col cols="6">
                <v-select
                  v-model="shift"
                  :items="shifts"
                  item-text="text"
                  item-value="value"
                  label="شیفت"
                  outlined
                  dense
                ></v-select></v-col
              ><v-col cols="6">
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  outlined
                  dense
                  v-else
                  v-model="servant"
                  :items="servantNames"
                  item-text="text"
                  item-value="value"
                  label="پرسنل خدمات"
                ></v-autocomplete> </v-col
            ></v-row>
            <v-text-field
              label="نام پذیرش: "
              outlined
              v-model="userName"
              disabled
              dense
            ></v-text-field>
            <v-row class="mt-5">
              <i
                class="fa fa-exclamation-triangle fa-2x text-warning mt-1 ms-3 me-3"
                aria-hidden="true"
              ></i>
              <p class="mt-1 text-danger">
                تذکر: تمام مسئولیت قانونی موارد ثبت شده با مسئول پذیرش این شیفت
                خواهد بود
              </p>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="primary-btn pa-3"
            :disabled="!shift || !shiftDoc || !shiftNurse"
            outlined
            @click="startShift()"
          >
            آغاز شیفت
          </v-btn>
        </v-card-actions>
      </v-card>
      <!-- NOTE TA INJA -->
    </v-dialog>
    <v-dialog
      v-if="role == 'reception'"
      v-model="endShiftDialog"
      persistent
      max-width="600px"
      class=""
    >
      <v-card>
        <v-card-title class="mt-5">
          <h4>فرم پایان شیفت</h4>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row align="center">
              <v-col>
                <v-select
                  v-model="report.shift"
                  :items="shifts"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  label="شیفت"
                ></v-select>
              </v-col>
              <v-col>
                <span id="dateFrom3">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="report.date"
                  
                    label=" تاریخ  "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>                  
                </span>

                <date-picker
                  v-model="report.date"
                  element="dateFrom3"
                  color="#00a7b7"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span id="startshift">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="schedule"
                    v-model="report.shiftStart"
                  
                    label=" از ساعت  "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>                  
                </span>

                <date-picker
                  v-model="report.shiftStart"
                  element="startshift"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
              <v-col>
                <span id="endshift">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="report.shiftEnd"
                  
                    label=" لغایت  "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>                  
                </span>

                <date-picker
                  v-model="report.shiftEnd"
                  element="endshift"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="report.lastShiftDoc"
                  :items="drNames"
                  multiple
                  item-text="text"
                  item-value="text"
                  label="نام پزشک"
                  class="pa-0"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="report.lastShiftNurse"
                  :items="nurseNames"
                  multiple
                  item-text="text"
                  item-value="text"
                  label="نام پرستار"
                  outlined
                  dense
                  class="pa-0"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="report.lastShiftDentist"
                  :items="drNames"
                  multiple
                  item-text="text"
                  item-value="text"
                  outlined
                  dense
                  label="نام دندانپزشک"
                  class="pa-0"
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="report.lastShiftNurseDentist"
                  :items="nurseNames"
                  multiple
                  item-text="text"
                  item-value="text"
                  label="نام دستیار دندانپزشک"
                  class="pa-0"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col>
                <v-text-field
                  v-model="userName"
                  disabled
                  label="پذیرش"
                  outlined
                  dense
                  class="pa-0"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-progress-circular
                  v-if="busy"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-autocomplete
                  v-else
                  v-model="report.lastShiftServant"
                  :items="servantNames"
                  multiple
                  outlined
                  dense
                  item-text="text"
                  item-value="text"
                  label="پرسنل خدمات"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <hr />
            <h4 class="text-center primary--text">خلاصه کارکرد مالی:</h4>
            <br />
            <v-row>
              <v-col>
                <vuetify-money
                  v-model="report.pos"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="کارتخوان(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
              <v-col>
                <vuetify-money
                  v-model="report.cash"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="نقدی(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <vuetify-money
                  v-model="report.lack"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="مبلغ کسری صندوق(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
              <v-col>
                <vuetify-money
                  v-model="report.extra"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="مبلغ اضافه صندوق(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <vuetify-money
                  v-model="report.talab"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="طلب از بیمار(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
              <v-col>
                <vuetify-money
                  v-model="report.debt"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  label="بدهی به بیمار(﷼)"
                  type="number"
                  outlined
                  dense
                />
              </v-col>
            </v-row>
            <v-text-field
              outlined
              label="توضیحات صندوق"
              v-model="report.cashDescription"
              type="text"
            ></v-text-field>
            <hr />
            <h4 class="text-center primary--text">خلاصه اتفاقات شیفت</h4>
            <br />
            <h5>
              1. آیا کمبودی در وسایل و امکانات و تجهیزات در شیفت وجود داشت؟
            </h5>
            <v-radio-group v-model="report.isFacilitiesShortage" row>
              <v-radio label="بله" value="yes"></v-radio>
              <v-radio label="خیر" value="no"></v-radio>
            </v-radio-group>
            <v-text-field
              outlined
              v-if="report.isFacilitiesShortage == 'yes'"
              label="توضیحات و شرح کمبود"
              v-model="report.facilitiesShortage"
              type="text"
            ></v-text-field>
            <h5>
              2. آیا در طول مدت شیفت بیمار یا مراجعه کننده ای اعتراض /ناراحتی/
              شکایت یا درگیری در خصوص نحوه ارایه خدمات درمانگاه اعم از
              خدمات/پذیرش/ پرستاری/ ازمایشگاه/ دندانپزشکی/ داروخانه و یا پزشک
              درمانگاه داشت؟
            </h5>
            <v-radio-group v-model="report.isDissatisfaction" row>
              <v-radio label="بله" value="yes"></v-radio>
              <v-radio label="خیر" value="no"></v-radio>
            </v-radio-group>
            <v-text-field
              outlined
              v-if="report.isDissatisfaction == 'yes'"
              label="اگر بلی توضیح دهید"
              v-model="report.dissatisfaction"
              type="text"
            ></v-text-field>
            <v-text-field
              outlined
              label="سایر موارد"
              v-model="report.others"
              type="text"
            ></v-text-field>
            <v-text-field
              outlined
              label="پیشنهاد جهت ارتقاء فرآیند کاری درمانگاه"
              v-model="report.suggestions"
              type="text"
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="red-btn" outlined @click="endShiftDialog = false">
            لغو
          </v-btn>
          <v-btn
            :disabled="
              !(report.pos || report.cash) ||
                !(report.lastShiftDoc && report.lastShiftNurse && report.shift)
            "
            class="primary-btn "
            outlined
            @click="endShift()"
          >
            ارسال فرم و پایان شیفت
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="role == 'reception'"
      v-model="errorDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span><h4>عدم دسترسی</h4></span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col style="line-height:25px" class="common-text">
                تنها در صورتی قادر به ارائه گزارش و اتمام شیفت هستید که شیفت را
                آغاز کرده باشید. لطفا با اکانت کارمند پذیرش اصلی این شیفت وارد
                سیستم شوید.
              </v-col>
            </v-row>
            <v-row>
              <v-col class="common-text">
                <span>پذیرش اصلی: </span
                ><span>{{ shiftDetails.receptionName }}</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary-btn" outlined @click="errorDialog = false">
            بستن
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      {{ startShiftDialog }}
    </v-row>
    <v-row v-if="!startShiftDialog">
      <v-col cols="12" sm="12" md="6" lg="6">
        <div>
          <v-card class="cards pa-3 mt-5">
            <v-row
              v-if="dashboardInfo.visits"
              class="pa-3 shift-table-card cards"
            >
              <v-card-title class=" card-h-title">
                آخرین درخواست ها
              </v-card-title>
              <b-table
                show-empty
                :fields="Fields"
                :items="dashboardInfo.visits"
                empty-text="رکوردی برای نمایش وجود ندارد"
                striped
                responsive
              >
                <template v-slot:head()="data">
                  <div style="text-align: center; vertical-align: middle;">
                    {{ data.label }}
                  </div>
                </template>
                <template v-slot:cell()="data">
                  <div style="text-align: center; vertical-align: middle">
                    {{ data.value }}
                  </div>
                </template>
                <template v-slot:cell(index)="data">
                  <div style="text-align: center; vertical-align: middle">
                    {{ data.index + 1 }}
                  </div>
                </template>
                <template v-slot:cell(operation)="data">
                  <div style="text-align: center; vertical-align: middle">
                    <v-btn
                      class="q-btn"
                      :to="'/reception/editrequest/' + data.item.id"
                    >
                      <v-icon>
                        help_outline
                      </v-icon>
                    </v-btn>
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
            </v-row>
          </v-card>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="cards pa-2">
          <v-card-title class="ps-6 pe-6 pt-6">
            <v-row class="card-title-row">
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="align-items:center">
                  <h4 class="ma-3 card-h-title">شیفت در جریان</h4>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-row style="justify-content:flex-end">
                  <div class="date-div">
                    <span class="span-1">
                      ساعت
                    </span>
                    <span class="span-2">
                      {{ time }}
                    </span>
                  </div>
                  <div class="date-div  ms-3 me-3">
                    <span class="span-1">
                      روز
                    </span>
                    <span class="span-2">
                      {{ splitDate(currentDate).day }}
                    </span>
                  </div>

                  <div class="date-div">
                    <span class="span-1">
                      ماه
                    </span>
                    <span class="span-2">
                      {{ splitDate(currentDate).month }}
                    </span>
                  </div>
                </v-row>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text v-if="dashboardInfo.shift" class="ps-6 pe-6 pt-5">
            <v-row>
              <v-col class="details-div">
                <span class="h5">پذیرش: </span>
                <span class="h5">{{ dashboardInfo.shift.receptionName }} </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">عنوان شیفت: </span>
                <span class="h5">{{ dashboardInfo.shift.subject }}</span>
              </v-col>
            </v-row>
            <v-row class=" details-div">
              <v-col>
                <span class="h5">ساعت آغاز شیفت: </span>
                <span class="h5">{{ dashboardInfo.shift.startTime }} </span>
              </v-col>
            </v-row>
            <hr class="mt-3" />
            <v-row class="mt-2 ">
              <v-col class="details-div">
                <span class="h5">پزشک: </span>
                <span class="h5">{{ dashboardInfo.shift.doctorName }} </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار : </span>
                <span class="h5">{{ dashboardInfo.shift.nurseName }} </span>
              </v-col>
            </v-row>
            <v-row class="">
              <v-col class="details-div">
                <span class="h5">پزشک آنکال: </span>
                <span class="h5">
                  {{ dashboardInfo.shift.oncallDoctorName }}</span
                >
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار آنکال: </span>
                <span class="h5"
                  >{{ dashboardInfo.shift.oncallNurseName }}
                </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="details-div">
                <span class="h5 ">دندانپزشک: </span>
                <span class="h5"> {{ dashboardInfo.shift.dentistName }}</span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار دندانپزشک : </span>
                <span class="h5">
                  {{ dashboardInfo.shift.nurseDentistName }}</span
                >
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text v-else class="ps-6 pe-6 pt-5">
            <v-row>
              <v-col class="details-div">
                <span class="h5">پذیرش: </span>
                <span class="h5">- </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">عنوان شیفت: </span>
                <span class="h5">-</span>
              </v-col>
            </v-row>
            <v-row class=" details-div">
              <v-col>
                <span class="h5">ساعت آغاز شیفت: </span>
                <span class="h5">- </span>
              </v-col>
            </v-row>
            <hr class="mt-3" />
            <v-row class="mt-2 ">
              <v-col class="details-div">
                <span class="h5">پزشک: </span>
                <span class="h5">- </span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار : </span>
                <span class="h5">- </span>
              </v-col>
            </v-row>
            <v-row class="">
              <v-col class="details-div">
                <span class="h5">پزشک آنکال: </span>
                <span class="h5"> -</span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار آنکال: </span>
                <span class="h5">- </span>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="details-div">
                <span class="h5 ">دندانپزشک: </span>
                <span class="h5"> -</span>
              </v-col>
              <v-col class="mr-auto details-div">
                <span class="h5">پرستار دندانپزشک : </span>
                <span class="h5"> -</span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row class="d-btn-row mb-0 mt-0 ps-2 pe-2">
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-btn
                  class="primary-btn d-btn py-6 shift-btn"
                  @click="goToChangeShiftDetails"
                >
                  تغییر اطلاعات شیفت
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="6" lg="6">
                <v-btn
                  class="secondary-btn d-btn py-6 endshift-btn"
                  @click="showEendShift()"
                >
                  اتمام شیفت
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <v-row class="mt-2" v-if="dashboardInfo.shift">
          <v-col>
            <v-card class="cards pa-4">
              <v-card-title class="number-card-title">
                <div style="white-space: nowrap;font-size:16px">شماره نوبت ویزیت</div>
                <div class="mt-2 num-div">
                  {{ dashboardInfo.shift.visitNo }}
                </div>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col class="num-div-container">
            <v-card class="cards pa-4">
              <v-card-title class="number-card-title">
                <div style="white-space: nowrap;font-size:16px">شماره نوبت خدمات</div>
                <div class="mt-2 num-div">
                  {{ dashboardInfo.shift.nurseNo }}
                </div>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col class="num-div-container">
            <v-card class="cards pa-4">
              <v-card-title class="number-card-title">
                <div style="white-space: nowrap;font-size:16px">شماره نوبت تخصص</div>
                <div class="mt-2 num-div">
                  {{ dashboardInfo.shift.exVisitNo }}
                </div>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-else>
      <div class="blur-bg"></div>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import moment from "moment-jalaali";
import { mapActions } from "vuex";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
export default {
  data() {
    return {
      Fields: [
        { key: "index", label: "ردیف" },
        { key: "patientName", label: "نام و نام خانوادگی" },
        { key: "visitNo", label: "  شماره نوبت" },
        { key: "visitType", label: "عنوان درخواست" },
        { key: "operation", label: " عملیات" }
      ],
      //CurrentPage: 1,
      //PerPage: 7,
      //perPageOptions: [
      //  { value: 10, text: "10" },
      //  { value: 25, text: "25" },
      //  { value: 50, text: "50" },
      //  { value: 100, text: "100" }
      //],
      role: "",
      busy: false,
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD"),
      time: "",
      shiftStart: "00:00",
      shiftEnd: "23:59",
      persianMonths: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند"
      ],
      dashboardInfo: {},
      shiftDoc: "",
      shiftNurse: "",
      changing: false,
      shiftDocOnCall: "",
      shiftNurseOnCall: "",
      dentistId: "",
      nurseDentistId: "",
      servant: "",
      shift: "",
      shifts: [
        { value: "صبح", text: "صبح" },
        { value: "عصر", text: "عصر" },
        { value: "شب", text: "شب" }
      ],
      useName: "",
      startShiftDialog: false,
      endShiftDialog: false,
      errorDialog: false,
      report: {
        shift: "",
        date: moment(new Date()).format("jYYYY/jMM/jDD"),
        shiftStart: "00:00",
        shiftEnd: "23:59",
        lastShiftNurse: [],
        lastShiftDoc: [],
        lastShiftServant: [],
        reception: "",
        pos: "",
        cash: "",
        lack: "",
        extra: "",
        talab: "",
        debt: "",
        cashDescription: "",
        isFacilitiesShortage: "",
        facilitiesShortage: "",
        isDissatisfaction: "",
        dissatisfaction: "",
        others: "",
        suggestions: ""
      }
    };
  },
  components: {
    datePicker: VuePersianDatetimePicker
  },
  methods: {
    ...mapActions(["getCurrent"]),
    goToChangeShiftDetails() {
      this.$router.push("ChangeShiftDetails");
    },
    goToNewRequest() {
      this.$router.push("NewRequest");
    },
    goToNewHomeCare() {
      this.$router.push("NewHomeCare");
    },
    goToChangeShiftDetails() {
      this.$router.push("ChangeShiftDetails");
    },
    splitDate(Date) {
      var dateparts = Date.split("-");
      var year = dateparts[0];
      var day = dateparts[2];
      var month = this.persianMonths[parseInt(dateparts[1] - 1)];
      return {
        day: day,
        month: month,
        year: year
      };
    },
    getTime() {
      var now = new Date().toLocaleTimeString("fa-IR");
      now.split(":");
      now = now.substring(0, now.length - 3);
      this.time = now;
      setTimeout(() => {
        this.getTime();
      }, 60000);
    },
    getDashboardInfo() {
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/dashboard/receptionDashboard",
          {},
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token")
            }
          }
        )
        .then(res => {
          this.vLoading = false;

          if (res.status == 200) {
            if (res.data.shift.receptionName) {
              this.startShiftDialog = false;
              this.dashboardInfo = res.data;
            } else {
              this.startShiftDialog = true;
              this.dashboardInfo = {};
              this.shiftDoc = "";
              this.shiftNurse = "";
              this.dentistId = "";
              this.nurseDentistId = "";
              this.shiftDocOnCall = "";
              this.shiftNurseOnCall = "";
              this.servant = "";
            }
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          this.vLoading = false;
          console.log(err);
          this.toast("خطا: " + err.response.data, "error");
        });
    },

    startShift() {
      this.changing = true;
      this.busy = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/shift/start",
          {
            docId: this.shiftDoc,
            nurseId: this.shiftNurse,
            subject: this.shift,
            oncallDocId: this.shiftDocOnCall,
            oncallNurseId: this.shiftNurseOnCall,
            servantId: this.servant,
            dentistId: this.dentistId,
            nurseDentistId: this.nurseDentistId
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token")
            }
          }
        )
        .then(res => {
          this.busy = false;
          this.changing = false;
          this.getCurrent();
          if (res.status == 201) {
            this.toast("شیفت با موفقیت آغاز گردید.", "success");
            this.startShiftDialog = false;
            this.getDashboardInfo();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          console.log(err);
          this.toast("خطا: " + err.response.data, "error");
          this.busy = false;
          this.changing = false;
        });
    },
    showEendShift() {
      if (this.shiftDetails.receptionName == this.userName) {
        this.report = {
          shift: "",
          date: moment(new Date()).format("jYYYY/jMM/jDD"),
          shiftStart: "00:00",
          shiftEnd: "23:59",
          lastShiftNurse: [],
          lastShiftDoc: [],
          lastShiftServant: [],
          reception: "",
          pos: "",
          cash: "",
          lack: "",
          extra: "",
          talab: "",
          debt: "",
          cashDescription: "",
          isFacilitiesShortage: "",
          facilitiesShortage: "",
          isDissatisfaction: "",
          dissatisfaction: "",
          others: "",
          suggestions: ""
        };
        this.endShiftDialog = true;
      } else {
        this.errorDialog = true;
      }
    },
    endShift() {
      this.changing = true;
      this.busy = true;
      this.report.reception = this.userName;
      this.report.cash = this.report.cash ? this.report.cash : "0";
      this.report.pos = this.report.pos ? this.report.pos : "0";
      this.$http
        .post(
          this.baseUrl + "/clinic/shift/end",
          {
            shiftId: this.shiftDetails.id,
            report: JSON.stringify(this.report)
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token")
            }
          }
        )
        .then(res => {
          this.busy = false;
          this.changing = false;
          if (res.status == 200) {
            this.toast("شیفت با موفقیت پایان یافت.", "success");
            this.getCurrent();
            this.endShiftDialog = false;
            this.getDashboardInfo();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch(err => {
          console.log(err);
          this.toast("خطا: " + err.response.data, "error");
          this.busy = false;
          this.changing = false;
        });
    }
  },
  watch: {
    shiftDetails(val) {
      if (!val.status) {
        this.startShiftDialog = true;
        this.shiftDoc = "";
        this.shiftNurse = "";
        this.dentistId = "";
        this.nurseDentistId = "";
        this.shiftDocOnCall = "";
        this.shiftNurseOnCall = "";
        this.servant = "";
      } else {
        this.startShiftDialog = false;
      }
    }
  },
  computed: {
    ...mapGetters([
      "drNames",
      "nurseNames",
      "servantNames",
      "shiftDetails",
      "userName"
    ])
  },
  mounted() {
    this.role = localStorage.getItem("role");
    this.getDashboardInfo();
    this.getTime();
  },
  created() {
    this.getCurrent();
  }
};
</script>
