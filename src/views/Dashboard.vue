<template>
  <div
    class="container d-flex justify-content-center align-items-center"
    id="container"
  >
    <router-link class="window" to="/my-playlists"
      ><span>My Playlists</span></router-link
    >
    <router-link class="window" to="/my-pods"><span>Pods</span></router-link>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Cookies from "js-cookie";

const ROOT_URL = process.env.VUE_APP_BACKEND_URL;
const redirectUri = "https://pods-ga.netlify.app";
const clientId = process.env.VUE_APP_CLIENT_ID;
const clientSecret = process.env.VUE_APP_CLIENT_SECRET;

export default {
  name: "Dashboard",
  components: { Navbar },
  props: ["refreshNavbar"],
  data() {
    return {
      userId: "",
    };
  },
  mounted() {
    const userCred = Cookies.get("userCred");
    if (!userCred) {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");

      let codeVerifier = localStorage.getItem("code_verifier");

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      const response = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
          this.getProfile();
        })
        .then(() => {
          setTimeout(() => {
            this.refreshNavbar();
          }, 1000);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  },
  methods: {
    async getProfile() {
      let accessToken = localStorage.getItem("access_token");

      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });

      const data = await response.json();
      const cookieData = JSON.stringify({
        displayName: data.display_name,
        email: data.email,
        userId: data.id,
        images: data.images,
        accessToken: accessToken,
      });
      Cookies.set("userCred", cookieData);
      this.updateUserDB(data.id);
    },
    async updateUserDB(userId) {
      fetch(`${ROOT_URL}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
        }),
      });
    },
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
  border-radius: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      217deg,
      rgba(162, 255, 0, 0.625),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgba(179, 7, 242, 0.851), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(13, 13, 243, 0.8), rgba(0, 0, 255, 0) 70.71%);
  color: rgba(110, 108, 108, 0.681);
  font-family: Bagel Fat One;
  text-decoration: none;
  font-size: 6em;
  overflow: hidden;
}
.window:hover {
  background: linear-gradient(
      217deg,
      rgba(162, 255, 0, 0.752),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgb(179, 7, 242), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(13, 13, 243, 0.8), rgba(0, 0, 255, 0) 70.71%);
}
span {
  transform: rotate(45deg);
}
</style>
