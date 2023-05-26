<template>
  <div class="payments animated fadeIn">
    <loading v-if="vLoading" />
    <v-col cols="12">
      <v-card-title style="background-color: transparent !important">
        <v-row>
          <v-col>
            <h3>مدیریت پرداخت‌ها</h3>
          </v-col>
          <v-col>
            <v-btn
              class="primary-btn"
              style="float: left"
              @click="openAddDialog()"
            >
              <v-icon left>add</v-icon>
              <h6 class="mt-1">ثبت پرداخت جدید</h6>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card class="cards pa-3">
        <v-card-text>
          <div>
            <v-row class="time-row">
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="dateFrom">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="dateFrom"
                    label=" تاریخ از "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="dateFrom"
                  element="dateFrom"
                  color="#00a7b7"
                /> </v-col
              ><v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="dateTo">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="dateTo"
                    label=" تاریخ تا "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="dateTo"
                  element="dateTo"
                  color="#00a7b7"
                />
              </v-col>
            </v-row>
            <v-row class="time-row">
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="timeFrom">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="timeFrom"
                    label=" ساعت از "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="timeFrom"
                  element="timeFrom"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                <span id="timeTo">
                  <v-text-field
                    outlined
                    dense
                    append-icon="schedule"
                    v-model="timeTo"
                    label=" ساعت تا "
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="timeTo"
                  element="timeTo"
                  color="#00a7b7"
                  type="time"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  class="submit-btn primary-btn"
                  style="float: right"
                  @click="getPaymentsList()"
                  :disabled="Busy"
                  >اعمال</v-btn
                >
              </v-col>
            </v-row>
            <hr />

            <v-text-field
              v-model="Filter"
              prepend-inner-icon="mdi-magnify"
              label="جستجو"
              single-line
              hide-details
              filled
              rounded
              clearable
              class="text-right w-80 mt-2 mb-2 search-input"
            ></v-text-field>
            <b-table
              responsive
              show-empty
              :fields="Fields"
              :items="Items"
              empty-text="رکوردی برای نمایش وجود ندارد"
              empty-filtered-text="رکوردی برای نمایش وجود ندارد"
              :busy="Busy"
              :filter="Filter"
              :current-page="CurrentPage"
              :per-page="PerPage"
              @filtered="onFiltered"
              @row-clicked="onRowSelected"
              :filter-function="myFilterFn"
              tbody-tr-class="trClass"
            >
              <template v-slot:head()="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.label }}
                </div>
              </template>
              <template v-slot:cell()="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.value }}
                </div>
              </template>
              <template v-slot:cell(name)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{
                    data.item.role == "patient"
                      ? data.item.patientName
                      : data.item.userName
                  }}
                </div>
              </template>
              <template v-slot:cell(role)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.item.role == "patient" ? "بیمار" : "کارمند" }}
                </div>
              </template>
              <template v-slot:cell(patientName)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.value }}
                </div>
              </template>
              <template v-slot:cell(userName)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.value }}
                </div>
              </template>
              <template v-slot:cell(amount)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ Number(data.value).toLocaleString() }}
                </div>
              </template>
              <template v-slot:cell(transactionFee)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{
                    data.item.transferType == "چک" ||
                    data.item.transferType == "کارت"
                      ? Number(data.value).toLocaleString()
                      : "-"
                  }}
                </div>
              </template>
              <template v-slot:cell(description)="data">
                <div style="text-align: center; vertical-align: middle">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
                        {{
                          data.value.length > 20
                            ? data.value.slice(0, 20) + "..."
                            : data.value
                        }}
                      </span>
                    </template>
                    <span>{{data.value}}</span>
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:cell(operation)>
                <div style="text-align: center; vertical-align: middle">
                  <v-btn class="btn-primary pa-2 mx-2"
                    ><v-icon color="white">visibility</v-icon></v-btn
                  >
                  <v-btn class="btn-primary pa-2 mx-2"
                    ><v-icon color="white">edit</v-icon></v-btn
                  >
                </div>
              </template>
              <template v-slot:cell(index)="data">
                <div style="text-align: center; vertical-align: middle">
                  {{ data.index + PerPage * (CurrentPage - 1) + 1 }}
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
            <v-pagination
              v-model="CurrentPage"
              :length="Math.ceil(TotalRows / PerPage)"
              :total-visible="5"
              prev-icon="arrow_back"
              next-icon="arrow_forward"
              style="float: center"
            ></v-pagination>
            <v-select
              label="تعداد در هر صفحه:"
              style="width: 150px"
              v-model="PerPage"
              :items="perPageOptions"
              item-text="text"
              item-value="value"
            ></v-select>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog v-model="addPaymentItemDialog" width="600">
      <v-card
        class="pa-3 modal-card"
        style="max-height: 600px !important; overflow-y: auto"
      >
        <v-card-title class="mb-2">
          <h4>ثبت پرداخت جدید برای کارمند</h4>
          <v-spacer></v-spacer>
          <v-icon color="red" class="mb-2" @click="addPaymentItemDialog = false"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="paymentDetail.userId"
            :items="employees"
            item-text="text"
            item-value="id"
            label="کارمند"
            v-if="!employeeBusy"
            outlined
            dense
          ></v-select>
          <vuetify-money
            v-model="paymentDetail.amount"
            label="مبلغ (ریال)"
            :valueWhenIsEmpty="whenIsEmpty"
            :options="vMoneyOptions"
            type="number"
            outlined
            dense
          ></vuetify-money>
          <v-row class="time-row">
            <v-col cols="12">
              <span id="newDate">
                <v-text-field
                  outlined
                  dense
                  type="text"
                  append-icon="calendar_today"
                  v-model="paymentDetail.newDate"
                  label=" تاریخ "
                  :editable="true"
                  class="date-input"
                >
                </v-text-field>
              </span>

              <date-picker
                v-model="paymentDetail.newDate"
                element="newDate"
                color="#00a7b7"
              /> </v-col
            ><v-col cols="12">
              <span id="newTime">
                <v-text-field
                  outlined
                  dense
                  type="text"
                  append-icon="mdi-clock-outline"
                  v-model="paymentDetail.newTime"
                  label=" ساعت"
                  :editable="true"
                  class="date-input"
                >
                </v-text-field>
              </span>

              <date-picker
                v-model="paymentDetail.newTime"
                element="newTime"
                type="time"
                color="#00a7b7"
              />
            </v-col>
          </v-row>
          <v-row class="time-row">
            <v-col>
              <v-select
                v-model="paymentDetail.transferType"
                :items="paymentTypes"
                item-text="text"
                item-value="value"
                label="نحوه پرداخت"
                outlined
                dense
   
              ></v-select>
            </v-col>
          </v-row>

          <v-row
            v-if="
              paymentDetail.transferType == 'card' ||
              paymentDetail.transferType == 'cheque'
            "
          >
            <v-col class="pb-0 pt-2">
              <div v-if="paymentDetail.transferType == 'card'">
                <v-text-field
                  outlined
                  dense
                  type="number"
                  v-model="paymentDetail.cardNumberSender"
                  label="شماره کارت فرستنده "
                  @wheel="$event.target.blur()"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  dense
                  type="number"
                  v-model="paymentDetail.cardNumberReciever"
                  label="شماره کارت گیرنده "
                  @wheel="$event.target.blur()"
                >
                </v-text-field>
              </div>
              <div v-if="paymentDetail.transferType == 'cheque'">
                <v-text-field
                  outlined
                  dense
                  v-model="paymentDetail.chequeBankName"
                  label="نام بانک "
                >
                </v-text-field>
                <vuetify-money
                  v-model="paymentDetail.chequeAmount"
                  label="مبلغ چک (ریال)"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  type="number"
                  outlined
                  dense
                ></vuetify-money>
                <v-text-field
                  outlined
                  dense
                  v-model="paymentDetail.chequeNumber"
                  label="شماره چک"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  dense
                  v-model="paymentDetail.chequeSayyad"
                  label="شناسه صیاد"
                >
                </v-text-field>
                <span id="newCheque">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="paymentDetail.chequeNewDate"
                    label=" تاریخ چک"
                    :editable="true"
                    class="date-input"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="paymentDetail.chequeNewDate"
                  element="newCheque"
                  color="#00a7b7"
                />
                <v-row class="time-row mb-2">
                  <v-col>
                    <v-select
                      v-model="paymentDetail.chequeStatus"
                      :items="chequeStatuses"
                      item-text="text"
                      item-value="value"
                      label="وضعیت چک"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-textarea
                  outlined
                  dense
                  type="text"
                  v-model="paymentDetail.chequeDescription"
                  label=" توضیحات چک"
                >
                </v-textarea>
              </div>
            </v-col>
          </v-row>
          <div
            :class="
              paymentDetail.transferType == 'cash' ||
              !paymentDetail.transferType
                ? 'mt-4'
                : 'mt-2'
            "
          >
            <vuetify-money
              v-if="
                paymentDetail.transferType == 'card' ||
                paymentDetail.transferType == 'cheque'
              "
              v-model="paymentDetail.transactionFee"
              label="کارمزد انتقال وجه (ریال)"
              :valueWhenIsEmpty="whenIsEmpty"
              :options="vMoneyOptions"
              type="number"
              outlined
              dense
              class="mt-4"
            ></vuetify-money>

            <p class="text-right mb-2">
              * شما میتوانید بیش از یک فایل بارگذاری کنید.
            </p>
            <v-file-input
              @change="myUpload(paymentDetail.file)"
              v-model="paymentDetail.file"
              chips
              outlined
              dense
              label="بارگذاری فایل"
              prepend-inner-icon="upload_file"
              prepend-icon=""
              class="file-input"
            ></v-file-input>
            <v-progress-linear
              rounded
              v-if="myFile.showProgress"
              height="10"
              :value="myFile.uploadPercentage"
              class="mb-4 mt-0"
            >
            </v-progress-linear>
          </div>
          <v-row>
            <div
              v-if="myFile.isUploaded"
              color="green"
              class="my-2 px-3"
              style="font-size: 16px"
            >
              فایل با موفقیت بارگذاری شد.
            </div>
          </v-row>
          <div v-if="uploadedFiles.length" class="files-box d-flex flex-column">
            <div class="files-title">فایل‌های آپلود شده ({{uploadedFiles.length}})</div>
            <span
              v-for="(item, index) in uploadedFiles"
              :key="index"
              class="mb-2 pt-2"
            >
              <span @click="deleteFile(index)" class="pointer">
                <v-icon class="red--text text--lighten-1 pl-2"
                  >mdi-close-circle-outline</v-icon
                >
              </span>
              <a :href="item.url" target="blank">{{ showName[index] }}</a>
            </span>
          </div>

          <v-textarea
            v-model="paymentDetail.description"
            label="توضیحات"
            outlined
            dense
            class="mt-5"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            class="primary-btn"
            outlined
            :disabled="computedAddBtn"
            @click="addToPaymentList()"
          >
            ثبت
          </v-btn>
          <v-btn
            class="red-btn"
            outlined
            @click="
              addPaymentItemDialog = false;
              uploadedFiles = [];
              myFile.isUploaded = false;
              myFile.showProgress = false;
            "
          >
            لغو
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentItemDialog" width="600">
      <v-card
        class="modal-card pa-3"
        v-if="!edited"
        style="max-height: 600px !important; overflow-y: auto"
      >
        <v-card-title class="mb-2">
          <h4>مشاهده جزییات پرداخت</h4>
          <v-spacer></v-spacer>
          <v-icon
            color="red"
            class="mb-2 ms-2"
            @click="
              paymentItemDialog = false;
              edited = false;
            "
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-row class="mt-3">
            <v-col v-if="selected.userName">
              <span class="h2 primary--text">نام کارمند:</span>
              <span class="h2"> {{ selected.userName }}</span>
            </v-col>
            <v-col v-if="selected.patientName">
              <span class="h2 primary--text">نام بیمار:</span>
              <span class="h2"> {{ selected.patientName }}</span>
            </v-col>
            <v-col>
              <span class="h2 primary--text">مبلغ :</span>
              <span class="h2">
                {{ Number(selected.amount).toLocaleString() }} ریال</span
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="h2 primary--text">تاریخ پرداخت:</span>
              <span class="h2"> {{ selected.date }}</span>
            </v-col>
            <v-col>
              <span class="h2 primary--text">ساعت پرداخت :</span>
              <span class="h2"> {{ selected.time }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-2">
              <span class="h2 primary--text">نحوه پرداخت :</span>
              <span class="h2"> {{ selected.transferType }}</span>
            </v-col>
          </v-row>
          <v-row
            v-if="
              selected.transferType == 'کارت' || selected.transferType == 'چک'
            "
          >
            <v-col>
              <div
                v-if="selected.transferType == 'کارت'"
                class="cardInfo-box pr-2 py-2 d-flex flex-column"
              >
                <div>
                  <span class="h3 primary--text">شماره کارت فرستنده :</span>
                  <span class="h3 float-left" dir="ltr">
                    {{ cardNumberSpacer(selected.cardNumberSender) }}</span
                  >
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">شماره کارت گیرنده :</span>
                  <span class="h3 float-left" dir="ltr">
                    {{ cardNumberSpacer(selected.cardNumberReciever) }}</span
                  >
                </div>
              </div>
              <div
                v-if="selected.transferType == 'چک'"
                class="cardInfo-box pr-2 py-2 d-flex flex-column"
              >
                <div>
                  <span class="h3 primary--text">نام بانک :</span>
                  <span class="h3"> {{ selected.chequeBankName }}</span>
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">مبلغ چک :</span>
                  <span class="h3">
                    {{ Number(selected.chequeAmount).toLocaleString() }}
                    ریال</span
                  >
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">شماره چک :</span>
                  <span class="h3"> {{ selected.chequeNumber }}</span>
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">شناسه صیاد :</span>
                  <span class="h3">
                    {{
                      selected.chequeSayyad ? selected.chequeSayyad : "--"
                    }}</span
                  >
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">تاریخ چک :</span>
                  <span class="h3"> {{ selected.chequeDueDate }}</span>
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">وضعیت چک :</span>
                  <span class="h3"> {{ selected.chequeStatus }}</span>
                </div>
                <div class="mt-5">
                  <span class="h3 primary--text">توضیحات چک :</span>
                  <div
                    class="h3"
                    style="line-height: 22px; text-align: justify"
                  >
                    {{
                      selected.chequeDescription
                        ? selected.chequeDescription
                        : "توضیحی ثبت نشده است."
                    }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="
              selected.transferType == 'چک' || selected.transferType == 'کارت'
            "
          >
            <v-col>
              <span class="h2 primary--text">کارمزد انتقال وجه:</span>
              <span class="h2">
                {{ Number(selected.transactionFee).toLocaleString() }} ریال
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="selected.files">
              <span class="h2 primary--text"> فایل‌ها ({{selected.files.length}}):</span>
              <!-- قسمت مربوط به فایل (لینک فایل گرفته شود) -->
              <span v-if="!selected.files.length" style="font-size: 15px">
                --
              </span>
              <div class="d-flex flex-column mt-1 ps-5">
                <ul>
                  <li
                    v-for="(item, index) in selected.files"
                    :key="index"
                    class="pt-5"
                    style="font-size: 15px"
                  >
                    <a :href="item.url" target="blank">{{
                      item.name.length > 50
                        ? item.name.slice(0, 50) + "..."
                        : item.name
                    }}</a>
                  </li>
                </ul>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span class="h2 primary--text">توضیحات :</span>
              <div
                class="h3 mt-1"
                style="line-height: 22px; text-align: justify"
              >
                {{ selected.description }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-btn @click="openEditDialog()" class="secondary-btn mb-4 me-5 pa-5">
          <v-icon left>edit</v-icon>
          ویرایش</v-btn
        >
      </v-card>
      <v-card
        class="modal-card"
        v-else
        style="max-height: 600px !important; overflow-y: auto"
      >
        <v-card-title class="mb-2">
          <h4>ویرایش پرداخت</h4>
        </v-card-title>
        <v-card-text>
          <v-row class="mt-3 time-row">
            <v-col>
              <div
                class="disabled-fields grey lighten-3"
                v-if="selectedEdit.userName"
              >
                <span class="h3"> نام کارمند: {{ selectedEdit.userName }}</span>
              </div>
              <div
                class="disabled-fields grey lighten-3"
                v-if="selectedEdit.patientName"
              >
                <span class="h3">
                  نام بیمار: {{ selectedEdit.patientName }}</span
                >
              </div>
            </v-col>
            <v-col>
              <vuetify-money
                v-model="selectedEdit.amount"
                label="مبلغ (ریال)"
                :valueWhenIsEmpty="whenIsEmpty"
                :options="vMoneyOptions"
                type="number"
                outlined
                dense
              ></vuetify-money>
            </v-col>
          </v-row>
          <v-row class="time-row">
            <v-col>
              <span id="newDate">
                <v-text-field
                  outlined
                  dense
                  type="text"
                  append-icon="calendar_today"
                  v-model="selectedEdit.date"
                  label=" تاریخ "
                  :editable="true"
                  class="date-input"
                >
                </v-text-field>
              </span>

              <date-picker
                v-model="selectedEdit.date"
                element="newDate"
                color="#00a7b7"
              /> </v-col
            ><v-col>
              <span id="newTime">
                <v-text-field
                  outlined
                  dense
                  type="text"
                  append-icon="mdi-clock-outline"
                  v-model="selectedEdit.time"
                  label=" ساعت "
                  :editable="true"
                  class="date-input"
                >
                </v-text-field>
              </span>

              <date-picker
                v-model="selectedEdit.time"
                element="newTime"
                type="time"
                color="#00a7b7"
              />
            </v-col>
          </v-row>
          <v-row class="time-row">
            <v-col
              ><v-select
                v-model="selectedEdit.transferType"
                :items="paymentTypes"
                item-text="text"
                item-value="value"
                label="نحوه پرداخت"
                outlined
                dense
                @change="changeEditType"
              ></v-select>
            </v-col>
          </v-row>

          <v-row
            class="time-row"
            v-if="
              selectedEdit.transferType == 'card' ||
              selectedEdit.transferType == 'cheque'
            "
          >
            <v-col>
              <div v-if="selectedEdit.transferType == 'card'">
                <v-text-field
                  outlined
                  dense
                  type="number"
                  class="mb-4"
                  v-model="selectedEdit.cardNumberSender"
                  label="شماره کارت فرستنده "
                  @wheel="$event.target.blur()"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  dense
                  type="number"
                  v-model="selectedEdit.cardNumberReciever"
                  label="شماره کارت گیرنده "
                  @wheel="$event.target.blur()"
                >
                </v-text-field>
              </div>

              <div v-if="selectedEdit.transferType == 'cheque'">
                <v-text-field
                  outlined
                  dense
                  v-model="selectedEdit.chequeBankName"
                  label="نام بانک "
                  class="mb-4"
                >
                </v-text-field>
                <vuetify-money
                  v-model="selectedEdit.chequeAmount"
                  label="مبلغ چک (ریال)"
                  :valueWhenIsEmpty="whenIsEmpty"
                  :options="vMoneyOptions"
                  type="number"
                  outlined
                  dense
                  class="mb-4"
                ></vuetify-money>
                <v-text-field
                  outlined
                  dense
                  v-model="selectedEdit.chequeNumber"
                  label="شماره چک"
                  class="mb-4"
                >
                </v-text-field>
                <v-text-field
                  outlined
                  dense
                  v-model="selectedEdit.chequeSayyad"
                  label="شناسه صیاد"
                  class="mb-4"
                >
                </v-text-field>
                <span id="newChequeDate">
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    append-icon="calendar_today"
                    v-model="selectedEdit.chequeDueDate"
                    label=" تاریخ چک"
                    :editable="true"
                    class="date-input mb-4"
                  >
                  </v-text-field>
                </span>

                <date-picker
                  v-model="selectedEdit.chequeDueDate"
                  element="newChequeDate"
                  color="#00a7b7"
                />

                <v-row class="time-row">
                  <v-col
                    ><v-select
                      v-model="selectedEdit.chequeStatus"
                      :items="chequeStatuses"
                      item-text="text"
                      item-value="value"
                      label="وضعیت چک"
                      outlined
                      dense
                    ></v-select>
                  </v-col>
                </v-row>
                <v-textarea
                  outlined
                  dense
                  type="text"
                  v-model="selectedEdit.chequeDescription"
                  label=" توضیحات چک"
                  class="mt-6"
                >
                </v-textarea>
              </div>
            </v-col>
          </v-row>
          <v-row
            class="time-row"
            v-if="
              selectedEdit.transferType == 'card' ||
              selectedEdit.transferType == 'cheque'
            "
          >
            <v-col>
              <vuetify-money
                v-model="selectedEdit.transactionFee"
                label="کارمزد انتقال وجه (ریال)"
                :valueWhenIsEmpty="whenIsEmpty"
                :options="vMoneyOptions"
                type="number"
                outlined
                dense
              ></vuetify-money>
            </v-col>
          </v-row>
          <v-row class="time-row">
            <v-col>
              <p class="text-right mb-2">
                * شما میتوانید بیش از یک فایل بارگذاری کنید.
              </p>
              <v-file-input
                @change="editedUpload(file)"
                v-model="file"
                chips
                outlined
                dense
                label=" بارگذاری فایل"
                prepend-inner-icon="upload_file"
                prepend-icon=""
                class="file-input mb-6"
              ></v-file-input>
              <v-progress-linear
                rounded
                v-if="myFile.showProgress"
                height="10"
                :value="myFile.uploadPercentage"
                class="mb-4 mt-0"
              >
              </v-progress-linear>
              <v-row>
                <div
                  v-if="myFile.isUploaded"
                  color="green"
                  class="my-1 pa-3"
                  style="font-size: 16px"
                >
                  فایل با موفقیت بارگذاری شد.
                </div>
              </v-row>
            </v-col>
          </v-row>
          <div
            v-if="selectedEdit.files.length"
            class="files-box d-flex flex-column mb-6"
          >
            <div class="files-title">فایل‌های آپلود شده ({{selectedEdit.files.length}})</div>
            <span
              v-for="(item, index) in selectedEdit.files"
              :key="index"
              class="mb-2 pt-2"
            >
              <span @click="deleteFile2(index)" class="pointer">
                <v-icon class="red--text text--lighten-1 pl-2"
                  >mdi-close-circle-outline</v-icon
                >
              </span>
              <a :href="item.url" target="blank">{{ item.name }}</a>
            </span>
          </div>
          <v-row class="time-row">
            <v-col>
              <v-textarea
                v-model="selectedEdit.description"
                label="توضیحات"
                outlined
                dense
                clearable
              ></v-textarea>
            </v-col>
          </v-row>

          <v-btn
            :disabled="computedEditBtn"
            @click="editPaymentItem()"
            class="primary-btn mt-4 mx-2"
            >ثبت</v-btn
          >
          <v-btn
            @click="
              edited = false;
              uploadedFiles = [];
              myFile.isUploaded = false;
              myFile.showProgress = false;
            "
            class="red-btn mt-4"
            >لغو</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from "moment-jalaali";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";
import { mapGetters } from "vuex";
export default {
  components: {
    datePicker: VuePersianDatetimePicker,
  },
  data() {
    return {
      CurrentPage: 1,
      PerPage: 10,
      perPageOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
      TotalRows: "",
      Filter: "",
      Busy: true,
      Fields: [
        { key: "index", label: "#" },
        { key: "name", label: "نام" },
        { key: "role", label: "نقش" },
        { key: "amount", label: "مبلغ (ریال)" },
        { key: "date", label: "تاریخ پرداخت" },
        { key: "time", label: "ساعت پرداخت" },
        { key: "transferType", label: "نحوه پرداخت" },
        { key: "transactionFee", label: "کارمزد انتقال وجه (ریال)" },
        { key: "fileIds", label: "تعداد فایل‌ها" },
        { key: "description", label: "توضیحات" },
        // { key: "operation", label: "عملیات" },
      ],
      Items: [],
      dateFrom: moment(new Date()).format("jYYYY/jMM/jDD"),
      dateTo: moment(new Date()).format("jYYYY/jMM/jDD"),
      timeFrom: "00:00",
      timeTo: "23:59",
      currentDate: moment(new Date()).format("jYYYY-jMM-jDD"),
      role: "",
      addPaymentItemDialog: false,
      types: [
        { value: "hourly", text: "ساعتی" },
        { value: "daily", text: "روزانه" },
      ],
      states: [
        { value: "eligible", text: "استحقاقی" },
        { value: "incentive", text: "تشویقی" },
        { value: "withoutPay", text: "بدون حقوق" },
        { value: "sick", text: "استعلاجی" },
      ],
      status: [
        { value: "registered", text: "ثبت اولیه" },
        { value: "approved", text: "تایید درخواست" },
        { value: "rejected", text: "رد درخواست" },
      ],
      showProgress: false,
      uploadButDisable: false,
      variant: "info",
      striped: true,
      max: 100,
      uploadPercentage: 0,
      isUploaded: false,
      file: [],
      reportFiles: [],
      request: {},
      vLoading: false,

      myFile: new Object({
        uploadPercentage: 0,
      }),
      myFile2: new Object({
        uploadPercentage: 0,
      }),
      fileBusy: false,
      fileFilter: "",
      paymentDetail: {
        cardNumberSender: "",
        cardNumberReciever: "",
        chequeBankName: "",
        chequeAmount: null,
        chequeNumber: "",
        chequeNewDate: "",
        chequeDescription: "",
        chequeSayyad: "",
        chequeStatus: "",
      },
      employees: [],
      employeeBusy: false,
      selected: {},
      edited: false,
      paymentItemDialog: false,
      selectedEdit: {
        amount: "",
        newDate: "",
        newTime: "",
        transactionFee: "",
        transferType: "",
        description: "",
        transferType: "",
        cardNumberSender: "",
        cardNumberReciever: "",
        chequeBankName: "",
        chequeAmount: "",
        chequeNumber: "",
        chequeNewDate: "",
        chequeStatus: "",
      },
      paymentTypes: [
        { text: "نقدی", value: "cash" },
        { text: "کارتخوان", value: "pos" },
        { text: "کارت", value: "card" },
        { text: "چک", value: "cheque" },
      ],
      chequeStatuses: [
        { text: "پاس شده", value: "passed" },
        { text: "برگشت خورده", value: "returned" },
        { text: "ثبت شده", value: "submitted" },
      ],
      uploadedFiles: [],
      showName: [],
      financialId: "",
      fileIds: [],
      name: "",
    };
  },

  methods: {
    cardNumberSpacer(number) {
      //let arr = [];
      //let cardNum = "";
      //if (number.length) {
      //  arr = String(number).match(/.{1,4}/g);

      //  for (let i = 0; i < arr.length; i++) {
      //    cardNum = cardNum + "\xa0\xa0" + arr[i];
      //  }
      //  return cardNum;
      //}
      number = number.match(new RegExp(".{1,4}", "g")).join("-");
      return number;
    },
    openAddDialog() {
      this.addPaymentItemDialog = true;
      this.paymentDetail = {
        cardNumberSender: "",
        cardNumberReciever: "",
        chequeBankName: "",
        chequeAmount: "",
        chequeNumber: "",
        chequeNewDate: "",
        chequeAmount: "",
        chequeNewDate: "",
        chequeSayyad: "",
      };
      this.uploadedFiles = [];
      this.myFile.isUploaded = false;
      this.myFile.showProgress = false;
      this.myFile.uploadPercentage = false;
      this.getEmployeesList();
    },
    openEditDialog() {
      this.selected.transferType == "چک"
        ? (this.selectedEdit.chequeStatus = this.chequeStatuses.filter(
            (x) => x.text == this.selected.chequeStatus
          )[0].value)
        : "";
      this.edited = true;
    },
    changeType() {
      this.paymentDetail.cardNumberSender = "";
      this.paymentDetail.cardNumberReciever = "";
      this.paymentDetail.chequeBankName = "";
      this.paymentDetail.chequeAmount = null;
      this.paymentDetail.chequeNumber = "";
      this.paymentDetail.chequeNewDate = "";
      this.paymentDetail.chequeSayyad = "";
      this.paymentDetail.chequeStatus = "";
      this.paymentDetail.chequeDescription = "";
    },
    changeEditType() {
      this.selectedEdit.cardNumberSender = "";
      this.selectedEdit.cardNumberReciever = "";
      this.selectedEdit.chequeBankName = "";
      this.selectedEdit.chequeAmount = null;
      this.selectedEdit.chequeNumber = "";
      this.selectedEdit.chequeDueDate = "";
      this.selectedEdit.chequeSayyad = "";
      this.selectedEdit.chequeStatus = "";
      this.selectedEdit.chequeDescription = "";
    },
    getEmployeesList() {
      this.$http
        .post(
          this.baseUrl + "/clinic/hr/employees/list",
          {},
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.employeeBusy = false;
          if (res.status == 200) {
            this.paymentDetail.userId = "";
            this.employees = res.data.map((x) => {
              return {
                id: x.id,
                text: x.name,
              };
            });
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.Busy = false;
        });
    },
    getPaymentsList() {
      this.Busy = true;
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/financial/documents/payments",
          {
            startDate: this.dateFrom + this.timeFrom,
            endDate: this.dateTo + this.timeTo,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.Busy = false;
          this.vLoading = false;
          if (res.status == 200) {
            this.Items = res.data;
            if (res.data.role == "patient") {
              this.name == res.data.patientName;
            } else if (res.data.role == "employee") {
              this.name == res.data.userName;
            }
            this.TotalRows = this.Items.length;
            this.CurrentPage = 1;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.vLoading = false;
          this.Busy = false;
        });
    },
    addToPaymentList() {
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/financial/document/newPayment",
          {
            date: this.paymentDetail.newDate + this.paymentDetail.newTime,
            amount: this.paymentDetail.amount,
            description: this.paymentDetail.description,
            transactionFee:this.paymentDetail.transferType == 'card' || this.paymentDetail.transferType == 'cheque' ? this.paymentDetail.transactionFee : '',
            transferType: this.paymentDetail.transferType,
            chequeAmount: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeAmount
              : "",
            chequeNumber: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeNumber
              : "",
            chequeBankName: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeBankName
              : "",
            chequeDueDate: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeNewDate
              : "",
            chequeSayyad: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeSayyad
              : "",
            chequeStatus: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeStatus
              : "",
            chequeDescription: this.paymentDetail.transferType == 'cheque'
              ? this.paymentDetail.chequeDescription
              : "",
            cardNumberSender: this.paymentDetail.transferType == 'card'
              ? this.paymentDetail.cardNumberSender
              : "",
            cardNumberReciever: this.paymentDetail.transferType == 'card'
              ? this.paymentDetail.cardNumberReciever
              : "",
            userId: this.paymentDetail.userId,
            fileIds: this.fileIds,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            this.vLoading = false;
            this.toast(res.data, "success");
            this.addPaymentItemDialog = false;
            this.paymentDetail = {
              cardNumberSender: "",
              cardNumberReciever: "",
              chequeBankName: "",
              chequeAmount: "",
              chequeNumber: "",
              chequeNewDate: "",
              chequeAmount: "",
              chequeNewDate: "",
              chequeSayyad: "",
              chequeStatus: "",
            };
            this.showName = [];
            this.uploadedFiles = [];
            this.getPaymentsList();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
            this.vLoading = false;
            this.addPaymentItemDialog = false;
            this.paymentDetail = {
              cardNumberSender: "",
              cardNumberReciever: "",
              chequeBankName: "",
              chequeAmount: "",
              chequeNumber: "",
              chequeNewDate: "",
              chequeAmount: "",
              chequeNewDate: "",
              chequeSayyad: "",
              chequeStatus: "",
            };
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.vLoading = false;
          this.addPaymentItemDialog = false;
          this.paymentDetail = {
            cardNumberSender: "",
            cardNumberReciever: "",
            chequeBankName: "",
            chequeAmount: "",
            chequeNumber: "",
            chequeNewDate: "",
            chequeAmount: "",
            chequeNewDate: "",
            chequeSayyad: "",
            chequeStatus: "",
          };
        });
    },
    myUpload(file) {
      // NOTE (m-myUpload) to upload files
      this.myFile.showProgress = true;
      this.myFile.variant = "info";
      this.myFile.uploadPercentage = 0;
      this.myFile.isUploaded = false;
      this.myFile.uploadButDisable = true;
      var formData = new FormData();
      this.showName.push(file.name);
      formData.append(file.name, file);

      this.$http
        .post(this.baseUrl + "/clinic/financial/document/upload", formData, {
          headers: {
            Authorization: "Bearer: " + localStorage.getItem("token"),
          },
          onUploadProgress: ((progressEvent) => {
            this.myFile.uploadPercentage =
              Math.round((progressEvent.loaded * 100) / progressEvent.total) -
              1;
          }).bind(this),
        })
        .then((d) => {
          if (d.status == 201) {
            this.myFile.isUploaded = true;
            this.myFile.uploadPercentage = 100;
            this.myFile.striped = false;
            this.myFile.variant = "success";
            this.myFile.uploadButDisable = false;
            this.uploadedFiles.push(d.data);
            this.fileIds.push(d.data.id);
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
        });
    },
    deleteFile(index) {
      this.uploadedFiles.splice(index, 1);
      this.showName.splice(index, 1);
    },
    deleteFile2(index) {
      this.selectedEdit.files.splice(index, 1);
      this.selectedEdit.fileIds.splice(index, 1);
      this.showName.splice(index, 1);
    },
    editedUpload(file) {
      // NOTE (m-myUpload) to upload files
      this.myFile.showProgress = true;
      this.myFile.variant = "info";
      this.myFile.uploadPercentage = 0;
      this.myFile.isUploaded = false;
      this.myFile.uploadButDisable = true;
      var formData = new FormData();
      this.showName.push(file.name);
      formData.append(file.name, file);

      this.$http
        .post(this.baseUrl + "/clinic/financial/document/upload", formData, {
          headers: {
            Authorization: "Bearer: " + localStorage.getItem("token"),
          },
          onUploadProgress: ((progressEvent) => {
            this.myFile.uploadPercentage =
              Math.round((progressEvent.loaded * 100) / progressEvent.total) -
              1;
          }).bind(this),
        })
        .then((d) => {
          if (d.status == 201) {
            this.myFile.isUploaded = true;
            this.myFile.uploadPercentage = 100;
            this.myFile.striped = false;
            this.myFile.variant = "success";
            this.myFile.uploadButDisable = false;
            this.selectedEdit.files.push(d.data);
            let filesLength = this.selectedEdit.files.length;
            let namesLength = this.showName.length;
            this.selectedEdit.files[filesLength - 1].name =
              this.showName[namesLength - 1];
            this.selectedEdit.fileIds.push(d.data.id);
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
        });
    },
    editPaymentItem() {
      this.vLoading = true;
      this.$http
        .post(
          this.baseUrl + "/clinic/financial/document/editPayment",
          {
            financialId: this.financialId,
            date: this.selectedEdit.date + this.selectedEdit.time,
            amount: this.selectedEdit.amount,
            description: this.selectedEdit.description,
            transactionFee:this.selectedEdit.transferType == 'card' || this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.transactionFee : '',
            transferType: this.selectedEdit.transferType,
            chequeAmount:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeAmount : '',
            chequeNumber:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeNumber : '',
            chequeBankName:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeBankName : '',
            chequeDueDate:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeDueDate : '',
            chequeSayyad:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeSayyad : '',
            chequeStatus:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeStatus : '',
            cardNumberSender:this.selectedEdit.transferType == 'card' ? this.selectedEdit.cardNumberSender : '',
            cardNumberReciever:this.selectedEdit.transferType == 'card' ? this.selectedEdit.cardNumberReciever : '',
            chequeDescription:this.selectedEdit.transferType == 'cheque' ? this.selectedEdit.chequeDescription : '',
            fileIds: this.selectedEdit.fileIds,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.vLoading = false;
            this.toast(res.data, "success");
            this.edited = false;
            this.myFile = new Object({
              uploadPercentage: 0,
            });
            this.showName = [];
            this.update();
            this.getPaymentsList();
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
            this.vLoading = false;
            this.edited = false;
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
          this.vLoading = false;
          this.edited = false;
        });
    },
    onRowSelected(item) {
      this.financialId = item.id;
       this.uploadedFiles = [];
      this.myFile.isUploaded = false;
      this.myFile.showProgress = false;
      this.myFile.uploadPercentage = false;
      this.$http
        .post(
          this.baseUrl + "/clinic/financial/document/show",
          {
            financialId: this.financialId,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.selected = res.data;
            this.selectedEdit = JSON.parse(JSON.stringify(this.selected));
            this.selectedEdit.transferType = this.paymentTypes.filter(
              (x) => x.text == this.selected.transferType
            )[0].value;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
        });
      this.edited = false;

      this.paymentItemDialog = true;
    },
    update() {
      this.$http
        .post(
          this.baseUrl + "/clinic/financial/document/show",
          {
            financialId: this.financialId,
          },
          {
            headers: {
              Authorization: "Bearer: " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.selected = res.data;
            this.selectedEdit = JSON.parse(JSON.stringify(this.selected));
            this.selectedEdit.transferType = this.paymentTypes.filter(
              (x) => x.text == this.selected.transferType
            )[0].value;
          } else {
            this.toast("خطا: مشکلی پیش آمده. مجددا امتحان کنید.", "error");
          }
        })
        .catch((err) => {
          this.toast("خطا: " + err.response.data, "error");
        });
    },
    myFilterFn(item, Filter) {
      if (item.role == "employee" && item.userName.includes(Filter)) {
        return true;
      } else if (item.role == "patient" && item.patientName.includes(Filter)) {
        return true;
      } else if (
        item.role.includes(Filter) ||
        item.date.includes(Filter) ||
        item.time.includes(Filter) ||
        item.transferType.includes(Filter) ||
        item.description.includes(Filter)
      ) {
        return true;
      } else {
        return false;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.TotalRows = filteredItems.length;
      this.CurrentPage = 1;
    },
  },
  computed: {
    computedAddBtn() {
      if (
        this.paymentDetail.userId &&
        this.paymentDetail.amount &&
        this.paymentDetail.newDate &&
        this.paymentDetail.newTime &&
        this.paymentDetail.transferType &&
        this.paymentDetail.description
      ) {
        if (this.paymentDetail.transferType == "card") {
          if (
            this.paymentDetail.cardNumberSender &&
            this.paymentDetail.cardNumberReciever &&
            this.paymentDetail.transactionFee
          ) {
            return false;
          } else return true;
        } else if (this.paymentDetail.transferType == "cheque") {
          if (
            this.paymentDetail.chequeBankName &&
            this.paymentDetail.chequeAmount &&
            this.paymentDetail.chequeNumber &&
            this.paymentDetail.chequeNewDate &&
            this.paymentDetail.chequeStatus &&
            this.paymentDetail.transactionFee
          ) {
            return false;
          } else return true;
        } else return false;
      } else return true;
    },
    computedEditBtn() {
      if (
        this.selectedEdit.amount &&
        this.selectedEdit.date &&
        this.selectedEdit.time &&
        this.selectedEdit.transferType &&
        this.selectedEdit.description
      ) {
        if (this.selectedEdit.transferType == "card") {
          if (
            this.selectedEdit.cardNumberSender &&
            this.selectedEdit.cardNumberReciever &&
            this.selectedEdit.transactionFee
          ) {
            return false;
          } else return true;
        } else if (this.selectedEdit.transferType == "cheque") {
          if (
            this.selectedEdit.chequeBankName &&
            this.selectedEdit.chequeAmount &&
            this.selectedEdit.chequeNumber &&
            this.selectedEdit.chequeDueDate &&
            this.selectedEdit.chequeStatus &&
            this.selectedEdit.transactionFee
          ) {
            return false;
          } else return true;
        } else return false;
      } else return true;
    },
  },
  mounted() {
    this.role = localStorage.getItem("role");
    this.getPaymentsList();
  },
};
</script>
<style lang="scss">
.payments {
  .trClass {
    cursor: pointer;
    &:hover {
      background-color: rgb(236, 236, 236);
    }
    &.table-active {
      background-color: #fff !important;
    }
  }
}
.modal-card {
  .cardInfo-box {
    border-right: 2px solid #ccc;
    width: fit-content !important;
  }
  .v-file-input .v-file-input__text.v-file-input__text--chips {
    display: none !important;
  }
  .files-box {
    border: 1px solid rgb(172, 172, 172);
    text-align: right;
    font-size: 14px;
    margin-top: 35px;
    padding: 10px;
    border-radius: 7px;
    position: relative;
    ul {
      li {
        text-decoration: none;
      }
    }
    .files-title {
      position: absolute;
      top: -9px;
      right: 20px;
      background-color: #fff;
      font-size: 14px;
      padding: 0 6px;
    }
  }
}
</style>
