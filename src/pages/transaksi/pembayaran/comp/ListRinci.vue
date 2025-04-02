<template>
  <q-card flat class="full-width full-height">
    <q-card-section
      class="q-px-md q-py-xs bg-primary text-white col-auto full-width"
    >
      <div class="row items-center justify-between">
        <div class="text-weight-bold">
          Rincian Pembayaran || No Pembayaran :
          {{ store?.form?.kodebayar ?? "-" }} ||
          <span class="text-yellow-6">
            TOTAL {{ formatRpDouble(totalrinci()) }}
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
          <template v-if="store.form.rincians.length > 0">
            <q-item
              v-for="(item, n) in store.form.rincians"
              :key="n"
              class="list-move"
            >
              <q-item-section>
                <div class="row full-width">
                  <div class="full-width">
                    <span class="text-weight-medium">{{ item?.no_nota }}</span>
                  </div>
                  <div class="col-4">
                    <span class="text-weight-medium"> {{ item?.tanggal }}</span>
                  </div>

                  <div class="col text-right">
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
          <template v-if="store.form.rincians.length > 0">
            <q-item>
              <app-select
                class="col-12"
                v-model="store.form.jnsbayar"
                label="Pilih Pembayaran"
                :options="store.jnsbayar"
                option-label="item"
                option-value="item"
              />
            </q-item>
            <q-item class="row full-width text-center">
              <div class="col-3 text-left content-center q-pr-sm">
                Total Nota :
              </div>
              <app-input
                class="col"
                :model-value="formatRpDouble(store.form.total)"
                :valid="{ required: true }"
                :disable="store.disableHeader"
                readonly
                @update:model-value="
                  (val) => {
                    const nilai = unformatRp(val); // Konversi dari format Rp ke angka
                    store.form.total = nilai;
                  }
                "
              />
            </q-item>
            <q-item class="row full-width text-center">
              <div class="col-3 text-left content-center q-pr-sm">
                Total Bayar :
              </div>
              <app-input
                class="col"
                :model-value="formatRpDouble(store.form.totalbayar)"
                :valid="{ required: true }"
                :disable="store.disableHeader"
                @update:model-value="
                  (val) => {
                    const nilai = unformatRp(val); // Konversi dari format Rp ke angka
                    store.form.totalbayar = nilai;
                    store.form.kembalian = nilai - store.form.total;
                  }
                "
              />
            </q-item>

            <q-item class="row full-width text-center">
              <div class="col-3 text-left content-center q-pr-sm">
                Kembalian :
              </div>
              <app-input
                class="col"
                :model-value="formatRpDouble(store.form.kembalian)"
                :valid="{ required: true }"
                :disable="store.disableHeader"
                @update:model-value="
                  (val) => {
                    const nilai = unformatRp(val); // Konversi dari format Rp ke angka
                    store.form.kembalian = nilai;
                  }
                "
              />
            </q-item>
            <q-item class="full-width text-center">
              <q-item-section>
                <div class="text-grey-8">
                  <btn-save
                    class="q-pr-sm"
                    :loading="store.loading"
                    type="button"
                    :dense="false"
                    label="Simpan"
                    @click="simpan"
                  />
                  <btn-print @click="viewCetak()" />
                </div>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-card-section>
    </div>
  </q-card>
</template>
<script setup>
import { useQuasar } from "quasar";
import { formatRpDouble, unformatRp } from "src/modules/formatter";
import { useFormPembayaranStore } from "src/stores/pembayaran/form";
import { computed } from "vue";

const store = useFormPembayaranStore();
const $q = useQuasar();
const del = (item) => {
  console.log("hapus nota", item);
  $q.dialog({
    dark: true,
    title: "Peringatan",
    message: "Apakah Data ini akan dihapus?",
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      store.form.rincians = store.form.rincians.filter(
        (rincian) => rincian.no_nota !== item.no_nota
      );
      store.removeSelectedNota(item.no_nota);
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
function totalrinci() {
  // console.log("formrinci", store.form);
  const rinci = store?.form?.rincians.map((s) => parseFloat(s.subtotal));
  const total = rinci.reduce((a, b) => a + b, 0);
  store.form.total = total;
  return total;
}

function simpan() {
  console.log("save", store.form);
}
</script>
