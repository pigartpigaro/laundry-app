import { defineAsyncComponent } from "vue";

export default ({ app }) => {
  // Daftarkan komponen global
  app.component(
    "AppBtn",
    defineAsyncComponent(() => import("components/~global/AppBtn.vue"))
  );
  app.component(
    "AppInput",
    defineAsyncComponent(() => import("components/~global/AppInput.vue"))
  );
  app.component(
    "BtnEdit",
    defineAsyncComponent(() => import("components/~global/BtnEdit.vue"))
  );
  app.component(
    "BtnDelete",
    defineAsyncComponent(() => import("components/~global/BtnDelete.vue"))
  );
  app.component(
    "BtnPrint",
    defineAsyncComponent(() => import("components/~global/BtnPrint.vue"))
  );
  app.component(
    "AppBtnBack",
    defineAsyncComponent(() => import("components/~global/AppBtnBack.vue"))
  );
  app.component(
    "AppSelect",
    defineAsyncComponent(() => import("components/~global/AppSelect.vue"))
  );
  app.component(
    "AppSelectServer",
    defineAsyncComponent(() => import("components/~global/AppSelectServer.vue"))
  );
  app.component(
    "BtnSave",
    defineAsyncComponent(() => import("components/~global/BtnSave.vue"))
  );
};
