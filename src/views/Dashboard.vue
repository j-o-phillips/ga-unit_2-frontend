<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
  <h1>{{ userId }}</h1>
</template>

<script>
import Cookies from "js-cookie";

export default {
  name: "Dashboard",
  components: {},
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
