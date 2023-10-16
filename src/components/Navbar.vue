<template>
  <nav class="navbar navbar-expand-lg" data-bs-theme="dark" v-if="showNavbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#" id="logo"> Pods</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/home" class="nav-link active" aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/my-playlists" class="nav-link" aria-current="page"
              >My Playlists</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/my-pods" class="nav-link" aria-current="page"
              >My Pods</router-link
            >
          </li>
        </ul>
        <img :src="userImage.url" alt="" />
        <p class="mb-2 mb-lg-0 me-4">{{ userId }}</p>
        <button
          id="logout"
          v-if="isLoggedIn"
          class="btn"
          type="submit"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import Cookies from "js-cookie";
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      isLoggedIn: false,
      userId: "",
      userData: "",
      userImage: "",
    };
  },
  mounted() {
    const userCred = Cookies.get("userCred");
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const cookieData = JSON.parse(userCred);
      this.isLoggedIn = true;
      this.userId = cookieData.displayName;
      this.userImage = cookieData.images[0];
    }
  },
  computed: {
    showNavbar() {
      // Check if the current route has the hideNavbar meta field set to true
      return !this.$route.meta.hideNavbar;
    },
  },
  methods: {
    handleLogout() {
      Cookies.remove("userCred");
      localStorage.removeItem("code_verifier");
      localStorage.removeItem("access_token");

      this.userId = "";
      this.isLoggedIn = false;
      this.$router.push("/");
    },
  },
};
</script>
<style scoped>
nav {
  background-color: rgb(48, 48, 48);
  color: antiquewhite;
}
#logo {
  font-family: Bagel Fat One;
  font-size: 1.5em;
  margin-bottom: 7px;
}
#logout {
  border: none;
  border-radius: 10px;
}
img {
  margin-right: 10px;
  border-radius: 40%;
}
</style>
