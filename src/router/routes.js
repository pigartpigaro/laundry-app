const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "/dashboard",
        component: () => import("pages/IndexPage.vue"),
      },

      // Route Master
      {
        path: "/master/satuan",
        component: () => import("pages/master/satuan/IndexPage.vue"),
      },
      {
        path: "/master/kategori",
        component: () => import("pages/master/kategori/IndexPage.vue"),
      },
      {
        path: "/master/pelanggan",
        component: () => import("pages/master/pelanggan/IndexPage.vue"),
      },
      {
        path: "/master/layanan",
        component: () => import("pages/master/produklayanan/IndexPage.vue"),
      },

      // Route Transaksi
      {
        path: "/transaksi/antrian",
        component: () => import("pages/transaksi/order/IndexPage.vue"),
      },
      {
        path: "/transaksi/pembayaran",
        component: () => import("pages/transaksi/pembayaran/IndexPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
