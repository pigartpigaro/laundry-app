<template>
  <q-dialog class="full-width q-mt-lg" backdrop-filter="blur(4x)" persistent>
    <q-card style="width: 40vw; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="full-width full-height q-pb-sm text-center text-h6">
          Pilih Nomer Nota
        </div>
        <q-space />
        <q-btn
          class="absolute-top-right"
          icon="close"
          flat
          round
          dense
          @click="closeDialog"
        />
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <q-form @submit="onSubmit">
            <q-item
              v-for="item in filteredNota"
              :key="item.no_nota"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-item-label>
                  {{ item.no_nota }}
                </q-item-label>
                <q-item-label class="text-bold">
                  Nilai : {{ formatRpDouble(item.subtotal) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  {{ item.tanggal }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>
                  <app-btn
                    :loading="store.loading"
                    type="button"
                    :dense="false"
                    label="Pilih"
                    @click="pilihItem(item)"
                  />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-form>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { formatRpDouble } from "src/modules/formatter";
import { useFormPembayaranStore } from "src/stores/pembayaran/form";
import { computed, ref } from "vue";

const store = useFormPembayaranStore();
// const props = defineProps({
//   selectNota: {
//     type: Array,
//     default: () => [],
//   },
// });
// const selectednota = ref([]);
// FILTER: HIDDEN RINCIAN YG DIPILIH
const filteredNota = computed(() => {
  return store.selectNota?.filter(
    (item) => !store.isipembayaran.includes(item.no_nota)
  );
});

function closeDialog() {
  store.dialogrincis = false;
}

function pilihItem(item) {
  console.log("Item yang dipilih:", item);
  store.addSelectedNota(item.no_nota);
  store.dialogrincis = false;
  store.form.rincians.push(item);
}

function onSubmit(row) {
  console.log("bayar", row);
}
</script>
