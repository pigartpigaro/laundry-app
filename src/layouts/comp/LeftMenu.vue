<template>
  <!-- <div class="fit column">
    <div class="col-auto">
      <div class="column flex-center"> -->
  <!-- <q-list>
          <q-item
            v-model="store.tab"
            vertical
            align="justify"
            switch-indicator
            active-color="secondary"
            class="text-grey-7"
          ></q-item>
        </q-list> -->
  <q-list
    v-for="item in store?.tabs"
    :key="item.name"
    bordered
    separator
    class="full-width"
    :name="item.name"
    @click="emits('selectTab', item)"
  >
    <q-expansion-item v-if="item.subs.length > 0">
      <template #header>
        <q-item-section avatar>
          <q-icon :key="item.name" :name="item.icon" size="sm"></q-icon>
        </q-item-section>
        <q-item-section> {{ item.label }}</q-item-section>
      </template>
      <q-list v-for="sub in item.subs" :key="sub.name">
        <q-item
          class="q-pl-sm flex flex-center"
          clickable
          v-ripple
          :to="`${sub.link}`"
        >
          <q-icon
            class="q-pl-xl flex flex-center"
            :name="sub.icon"
            size="xs"
          ></q-icon>
          <q-item-section class="q-pl-sm"> {{ sub.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-item clickable v-ripple :to="`${item.link}`" v-else>
      <q-item-section avatar>
        <q-icon :key="item.name" :name="item.icon" size="sm"></q-icon>
      </q-item-section>
      <q-item-section>
        {{ item.label }}
      </q-item-section>
    </q-item>
  </q-list>

  <!-- <div class="col full-height">
          <div class="column full-height flex-center">
            <div>
              <q-tabs
                v-model="store.tab"
                vertical
                align="justify"
                switch-indicator
                active-color="secondary"
                class="text-grey-6"
              >
                <q-tab
                  v-for="item in store?.tabs"
                  :key="item.name"
                  :name="item.name"
                  @click="emits('selectTab', item)"
                >
                  <q-icon :name="item.icon" size="sm"></q-icon>
                </q-tab>
              </q-tabs>
            </div>
          </div>
        </div> -->

  <!-- <div v-for="item in store?.tabs" :key="item.name">
          <q-item class="flex flex-center item item-link">
            <q-menu
              ref="refMenu"
              anchor="top right"
              self="top left"
              transition-show="slide-down"
              transition-hide="slide-right"
              :offset="[0, 0]"
            >
              <q-list v-if="item.subs.length > 0" bordered separator>
                <q-item-label>
                  <div class="text-weight-bold q-pa-md text-black">
                    {{ item.label }}
                  </div>
                </q-item-label>
                <q-separator />
                <q-item
                  v-for="(submenu, n) in item.subs"
                  :key="n"
                  v-ripple
                  clickable
                  :to="`${submenu.link}`"
                  replace
                  exact
                >
                  <q-item-section>{{ submenu.nama }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
        </div> -->
  <!-- </div>
    </div>
  </div> -->
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useLeftDrawerStore } from "../../stores/app/leftdrawer";

const store = useLeftDrawerStore();
onMounted(() => {
  store.getMenu();
});

const refMenu = ref(null);
const emits = defineEmits(["selectTab"]);
</script>
