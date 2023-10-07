import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Landing from "../views/Landing.vue";
import MyPods from "../views/MyPods.vue";
import SpecificPod from "../views/SpecificPod.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing,
  },
  {
    path: "/home",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/my-pods",
    name: "myPods",
    component: MyPods,
  },
  {
    path: "/my-pods/pod",
    name: "pod",
    component: SpecificPod,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
