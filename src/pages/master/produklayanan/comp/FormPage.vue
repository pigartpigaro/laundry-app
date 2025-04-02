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
        <q-form class="full-height" @submit="onSubmit">
          <q-card-section class="full-height q-pa-lg scroll">
            <div class="row q-col-gutter-md justify-around">
              <div
                :class="`col-${isMobile ? 12 : 6}`"
                class="row q-col-gutter-md"
              >
                <app-input
                  class="col-12"
                  v-model="store.form.produk"
                  label="Produk Layanan"
                  :valid="{ required: false }"
                />
                <app-select
                  class="col-6"
                  v-model="store.form.satuan"
                  label="Satuan Produk"
                  :options="selectSatuan?.items"
                  option-label="satuan"
                  option-value="satuan"
                  @update:model-value="(val) => isisatuan(val)"
                />
                <app-select
                  class="col-6"
                  v-model="store.form.kategori"
                  label="Kategori Produk"
                  :options="selectKategori?.items"
                  option-label="kategori"
                  option-value="kategori"
                  @update:model-value="(val) => isikategori(val)"
                />
                <app-input
                  class="col-12"
                  v-model="store.form.harga"
                  label="Harga Produk"
                  :valid="{ number: true }"
                  @update:model-value="
                    (val) => {
                      //untuk hapus o dipean angka pake ini yaa
                      const _removedZeros = val?.replace(/^0+/, '');
                      if (val > 1) store.form.harga = _removedZeros;
                    }
                  "
                />

                <div class="col-12">
                  <q-separator class="q-my-md" />
                  <app-btn
                    :loading="store.loading"
                    type="submit"
                    :dense="false"
                    label="Simpan"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useMasterKategoriSelectStore } from "src/stores/master/kategori/select";
import { useFormMasterProdukStore } from "src/stores/master/produklayanan/form";
import { useMasterSatuanSelectStore } from "src/stores/master/satuan/select";
import { computed, onBeforeMount, onMounted } from "vue";

const emits = defineEmits(["back"]);
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

const store = useFormMasterProdukStore();
const selectSatuan = useMasterSatuanSelectStore();
const selectKategori = useMasterKategoriSelectStore();
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
onMounted(() => {
  store.initReset(props.data);
});
onBeforeMount(() => {
  selectSatuan.getDataAll();
  selectKategori.getDataAll();
});

function isisatuan(val) {
  const kode = selectSatuan?.items.find((x) => x?.satuan === val)?.kodesatuan;
  store.form.kodesatuan = kode;
}
function isikategori(val) {
  const kode = selectKategori?.items.find(
    (x) => x?.kategori === val
  )?.kodekategori;
  store.form.kodekategori = kode;
}

function onSubmit() {
  store.save(props.data);
}
</script>
