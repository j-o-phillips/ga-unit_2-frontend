<template>
  <div
    class="container d-flex justify-content-center align-items-center"
    id="container"
  >
    <router-link class="window" to="/my-playlists">My Playlists</router-link>
    <router-link class="window" to="/my-pods">Pods</router-link>
  </div>
</template>

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
<style scoped>
#container {
  height: 90vh;
  width: 100vw;
}
.window {
  margin: 2vmin;
  height: 70%;
  width: 70%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
