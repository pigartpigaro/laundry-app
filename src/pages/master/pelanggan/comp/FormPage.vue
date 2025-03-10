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
                  v-model="store.form.pelanggan"
                  label="Nama Pelanggan"
                  :valid="{ required: false }"
                />
                <app-input
                  class="col-12"
                  v-model="store.form.alamat"
                  label="Alamat"
                  :valid="{ required: false }"
                />
                <app-input
                  class="col-12"
                  v-model="store.form.nohp"
                  label="Nomer HP"
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
import { useFormMasterPelangganStore } from "src/stores/master/pelanggan/form";
import { computed, onMounted } from "vue";

const emits = defineEmits(["back"]);
const $q = useQuasar();
const isMobile = computed(() => {
  return $q.screen.lt.sm; // Quasar screen size helper
});

const store = useFormMasterPelangganStore();

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});
onMounted(() => {
  store.initReset(props.data);
});

function onSubmit() {
  store.save(props.data);
}
</script>
