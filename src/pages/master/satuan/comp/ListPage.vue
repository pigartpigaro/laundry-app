<template>
  <div class="column fit">
    <div class="col full-height">
      <div class="full-height q-pa-sm">
        <q-list class="rounded-borders full-height column">
          <div class="col-auto">
            <q-item-label header>
              <div class="row full-width items-center">
                <div class="col-grow">
                  <div class="flex items-center">
                    <app-input
                      v-model="store.params.q"
                      prepend-icon="search"
                      label="Telusuri"
                      style="min-width: 250px"
                      :debounce="300"
                      @update:model-value="
                        (e) => {
                          infiniteScroll.reset();
                          store.getList();
                        }
                      "
                    />
                  </div>
                </div>

                <div class="col-auto">
                  <app-btn
                    icon="add"
                    tooltip="Tambah Data"
                    @click="emits('add')"
                  />
                </div>
              </div>
            </q-item-label>
            <q-separator inset="item" />
          </div>

          <div ref="scrollTarget" class="col full-height">
            <q-infinite-scroll
              @load="store.loadMore"
              ref="infiniteScroll"
              :disable="store?.isError || store?.meta?.next_page_url === null"
              :scroll-target="scrollTarget"
              :offset="150"
              :initial-index="store.params.page"
            >
              <q-intersection
                v-for="(item, i) in store.items"
                :key="i"
                transition="fade"
                class="example-item"
              >
                <q-item
                  clickable
                  v-ripple
                  @mouseover="hoveredId = item?.id"
                  @mouseleave="hoveredId = null"
                >
                  <q-item-section avatar>
                    <q-avatar color="black" text-color="white">{{
                      item.satuan[0]
                    }}</q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">{{ item?.satuan }}</q-item-label>
                  </q-item-section>
                  <q-item-section v-if="hoveredId === item?.id" side>
                    <div class="flex q-gutter-sm">
                      <btn-edit @click="edit(item)" />
                      <btn-delete @click="del(item)" />
                    </div>
                  </q-item-section>
                  <q-item-section v-else side top>
                    <q-item-label caption>{{
                      humanDate(item?.created_at)
                    }}</q-item-label>
                    <q-item-label caption>{{
                      jamTnpDetik(item?.created_at)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset="item" />
              </q-intersection>

              <template v-slot:loading>
                <div v-if="!store.isError" class="text-center q-my-md">
                  <q-spinner-dots color="accent" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
          </div>
        </q-list>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useQuasar } from "quasar";
import { humanDate, jamTnpDetik } from "src/modules/utils";
import { useMasterSatuanStore } from "src/stores/master/satuan/list";
import { computed, onBeforeMount, ref } from "vue";

const store = useMasterSatuanStore();
const scrollTarget = ref(null);
const infiniteScroll = ref(null);
const hoveredId = ref(null);
// const items = ref([ {}, {}, {}, {}, {}, {}, {},{},{},{},{}, {} ])

const emits = defineEmits(["add", "edit"]);
const $q = useQuasar();
onBeforeMount(() => {
  // Promise.all([
  // store.getList(null);
  // ])
});
const edit = (item) => {
  emits("edit", item);
};
const del = (item) => {
  $q.dialog({
    title: "Peringatan",
    message: "Apakah Data ini akan dihapus?",
    cancel: true,
    // persistent: true
  })
    .onOk(() => {
      // const params = { id: selected.value }
      store.deleteItem(item?.id);
    })
    .onCancel(() => {
      console.log("Cancel");
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
// eslint-disable-next-line no-unused-vars
const next = computed(() => {
  let page = false;

  if (store.meta?.next_page_url) {
    page = true;
  }

  return page;
});
</script>
<style lang="scss" scoped>
.example-item {
  height: 56px;
}
</style>
