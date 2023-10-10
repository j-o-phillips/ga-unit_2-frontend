<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary" v-if="showNavbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Spotify Pods</a>
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
        <p class="mb-2 mb-lg-0 me-4">{{ userId }}</p>
        <button
          v-if="isLoggedIn"
          class="btn btn-outline-success"
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

export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      isLoggedIn: false,
      userId: "",
    };
  },
  mounted() {
    const userCred = Cookies.get("userCred");
    if (userCred) {
      const cookieData = JSON.parse(userCred);
      this.isLoggedIn = true;
      this.userId = cookieData.userId;
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
      this.userId = "";
      this.isLoggedIn = false;
      window.location = "http://localhost:4000/logout";
    },
  },
};
</script>
