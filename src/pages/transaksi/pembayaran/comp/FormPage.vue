<template>
  <div class="fit column">
    <div class="col-auto">
      <div class="row items-center q-pa-lg">
        <div class="col-grow">
          <app-btn-back @click="emits('back')" />
        </div>
        <div class="col-auto"></div>
      </div>
    </div>
    <div class="col full-height q-px-lg q-pb-lg">
      <q-card flat class="col full-height">
        <q-form class="full-height">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div class="row q-col-gutter-md">
                <app-select
                  class="col-12"
                  v-model="store.form.pelanggan"
                  label="Pilih Pelanggan"
                  :options="selectPelanggan"
                  option-label="pelanggan"
                  option-value="pelanggan"
                  @update:model-value="(val) => isipelanggan(val)"
                  :disable="store.disableHeader"
                />
                <app-input
                  class="col-6"
                  v-model="store.form.alamat"
                  label="Alamat"
                  readonly
                  :valid="{ required: true }"
                  :disable="store.disableHeader"
                />
                <app-input
                  class="col-6"
                  v-model="store.form.nohp"
                  label="No. HP"
                  readonly
                  :valid="{ required: true }"
                  :disable="store.disableHeader"
                />

                <div class="col-12">
                  <q-separator class="q-mb-md" />
                  <app-btn
                    v-if="store.form.pelanggan"
                    :loading="store.loading"
                    type="button"
                    :dense="false"
                    label="Tambah Nota"
                    clickable
                    @click="tambahRinci()"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
          <DialogRinci
            v-model="store.dialogrincis"
            :data="data"
            :selectNota="selectNota"
            :totalNota="totalNota"
          />
        </q-form>
      </q-card>
    </div>
  </div>
  <div class="col full-height q-px-lg q-pb-lg">
    <list-rinci />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useOrderTransaksiStore } from "src/stores/order/list";
import { useFormPembayaranStore } from "src/stores/pembayaran/form";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
const ListRinci = defineAsyncComponent(() => import("./ListRinci.vue"));
const DialogRinci = defineAsyncComponent(() => import("./DialogRinci.vue"));

const emits = defineEmits(["back"]);
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

const store = useFormPembayaranStore();
const plg = useOrderTransaksiStore();
// const selectKategori = useMasterKategoriSelectStore();
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
onMounted(() => {
  store.initReset(props.data);
});
const totalNota = ref(null);
const selectNota = ref([]);
const selectPelanggan = ref([]);
const datapelanggan = plg.items;
const unx = datapelanggan.map((x) => x.kodepelanggan);
const uniks = unx.length ? [...new Set(unx)] : [];
for (let i = 0; i < uniks.length; i++) {
  const el = uniks[i];
  const arr = plg.items;

  const obj = {
    kodepelanggan: arr.filter((x) => x.kodepelanggan === el)[0]?.kodepelanggan,
    pelanggan: arr.filter((x) => x.kodepelanggan === el)[0]?.pelanggan,
    alamat: arr.filter((x) => x.kodepelanggan === el)[0]?.alamat,
    nohp: arr.filter((x) => x.kodepelanggan === el)[0]?.nohp,
  };
  selectPelanggan.value.push(obj);
}
// console.log("value NOTA", filternota);
function isipelanggan(val) {
  const kode = selectPelanggan?.value.find((x) => x?.pelanggan === val);
  store.form.kodepelanggan = kode?.kodepelanggan;
  store.form.alamat = kode?.alamat;
  store.form.nohp = kode?.nohp;

  store.dialogrincis = true;
  const filternota = plg.items.filter(
    (x) => x.kodepelanggan === store.form.kodepelanggan
  );

  const nota = [];
  // const pernota = selectNota.value.map((x) => x.rincians);
  for (let i = 0; i < filternota.length; i++) {
    const el = filternota[i];

    const obj = {
      no_nota: el?.no_nota,
      tanggal: el?.tanggal,
      subtotal: el?.rincians
        .map((x) => parseFloat(x.subtotal))
        .reduce((a, b) => a + b, 0),
    };
    nota.push(obj);
  }

  selectNota.value = nota;
  store.selectNota = nota;
  console.log("form", nota);
}

function tambahRinci() {
  store.dialogrincis = true;
}
</script>
