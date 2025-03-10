<template>
  <q-card flat class="full-width full-height">
    <q-card-section
      class="q-px-md q-py-xs bg-primary text-white col-auto full-width"
    >
      <div class="row items-center justify-between">
        <div class="text-weight-bold">
          Rincian Order || No Nota : {{ store?.form?.no_nota ?? "-" }} ||
          <span class="text-yellow-6">
            TOTAL {{ formatRpDouble(totalrinci) }}
          </span>
        </div>
      </div>
    </q-card-section>
    <div class="row q-col-gutter-md full-width justify-between">
      <q-card-section
        class="full-height q-px-md"
        style="min-width: 50%; max-width: 100%"
      >
        <q-list separator>
          <template v-if="listrincian.length > 0">
            <q-item v-for="(item, n) in listrincian" :key="n" class="list-move">
              <q-item-section>
                <div class="row full-width">
                  <div class="full-width">
                    <span class="text-weight-medium">{{ item?.produk }}</span>
                    <span class="text-grey-8"> ({{ item?.satuan }})</span>
                    <span class="text-weight-medium q-pl-sm">
                      {{ item?.keterangan }}</span
                    >
                  </div>
                  <div class="col-3">
                    <span class="text-weight-medium">
                      {{ item?.kuantitas }}</span
                    >
                  </div>
                  <div class="col-1">
                    <span> x </span>
                  </div>
                  <div class="col-3">
                    <span class="text-weight-medium">
                      {{ formatRpDouble(item?.harga) }}</span
                    >
                  </div>
                  <div class="col-1">
                    <span class="text-weight-medium"> = </span>
                  </div>
                  <div class="col-4 text-right">
                    <span class="text-weight-medium">
                      {{ formatRpDouble(item?.subtotal) }}</span
                    >
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8">
                  <btn-delete @click="del(item)" />
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-card-section>
      <q-card-section
        class="full-height q-px-md justify-around"
        style="min-width: 50%; max-width: 100%"
      >
        <q-list separator class="full-height q-pt-md">
          <template v-if="listrincian.length > 0">
            <q-item class="full-width text-center bg-yellow-8">
              <q-item-section>
                <div class="row full-width flex-center text-bold">
                  <div class="q-pr-sm">Total Order :</div>
                  {{ formatRpDouble(totalrinci) }}
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8">
                  <!-- <btn-print v-print="printObj" /> -->
                  <btn-print @click="viewCetak()" />
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
  <dialog-cetak v-model="store.dialogCetak" :listDataitem="listDataitem" />
</template>
<script setup>
import { useQuasar } from "quasar";
import { formatRpDouble } from "src/modules/formatter";
import { useFormOrderTransaksiStore } from "src/stores/order/form";
// import { useOrderTransaksiStore } from "src/stores/order/list";
import { computed, defineAsyncComponent, onBeforeMount, ref } from "vue";
const DialogCetak = defineAsyncComponent(() => import("./DialogCetak.vue"));

const store = useFormOrderTransaksiStore();
// const list = useOrderTransaksiStore();
const $q = useQuasar();
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
onBeforeMount(() => {
  // Promise.all([store.getrinci()]);
});
const del = (item) => {
  console.log("hapus id", item);
  $q.dialog({
    dark: true,
    title: "Peringatan",
    message: "Apakah Data ini akan dihapus?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      // console.log('OK')
      store.deleteData(item?.id);
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const listrincian = computed(() => {
  console.log("formrinci", store.form);
  return store.form.rincians || [];
});

const totalrinci = computed(() => {
  // console.log("formrinci", store.form);
  const rinci = store?.form?.rincians.map((s) => parseFloat(s.subtotal));
  const total = rinci.reduce((a, b) => a + b, 0);
  return total;
});

const listDataitem = ref(null);
function viewCetak() {
  store.dialogCetak = true;
  listDataitem.value = store.form;
  store.dataCetak = store.form;
  console.log("store.form", store.form);
}
// const printed = ref(false);
// const printObj = {
//   id: "printMe",
//   popTitle:
//     "Surat Permintaan Pengesahan Pendapatan, Belanja, dan Pembiayaan | SIASIK on XENTER",
//   beforeOpenCallback(vue) {
//     printed.value = true;
//     console.log("wait...");
//   },
//   openCallback(vue) {
//     console.log("opened");
//   },
//   closeCallback(vue) {
//     printed.value = false;
//     console.log("closePrint");
//   },
// };
</script>
