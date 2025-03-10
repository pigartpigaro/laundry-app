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
                  :options="selectPelanggan?.items"
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
                    label="Tambah Rincian"
                    clickable
                    @click="tambahRinci()"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
          <DialogRinci v-model="store.dialogrincis" :data="data" />
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
import { useMasterPelangganSelectStore } from "src/stores/master/pelanggan/select";
import { useFormOrderTransaksiStore } from "src/stores/order/form";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
const ListRinci = defineAsyncComponent(() => import("./ListRinci.vue"));
const DialogRinci = defineAsyncComponent(() => import("./DialogRinci.vue"));

const emits = defineEmits(["back"]);
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

const store = useFormOrderTransaksiStore();
const selectPelanggan = useMasterPelangganSelectStore();
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

function isipelanggan(val) {
  const kode = selectPelanggan?.items.find((x) => x?.pelanggan === val);
  store.form.kodepelanggan = kode?.kodepelanggan;
  store.form.alamat = kode?.alamat;
  store.form.nohp = kode?.nohp;

  store.dialogrincis = true;

  console.log("form", store.dialogrincis);
}

function tambahRinci() {
  store.dialogrincis = true;
}
</script>
