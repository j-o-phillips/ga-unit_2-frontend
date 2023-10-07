<template></template>

<script>
import Navbar from "@/components/Navbar.vue";
import Cookies from "js-cookie";

export default {
  name: "Dashboard",
  components: { Navbar },
  data() {
    return {
      userId: "",
    };
  },
  mounted() {
    const userCred = Cookies.get("userCred");
    const cookieData = JSON.parse(userCred);

    this.userId = cookieData.userId;
  },
};
</script>
