<template>
  <h1>SPOTIFY PODS</h1>
  <button @click="handleLogin">Login with Spotify</button>
  <button @click="testCookies">Search for cookie</button>
</template>

<script>
const URL = "http://localhost:4000/auth/spotify";

export default {
  name: "Landing",
  methods: {
    handleLogin() {
      //   console.log("requested");
      //   try {
      //     fetch(URL).then(() => {
      //       console.log("fetched");
      //     });
      //   } catch (error) {
      //     console.log(error);
      //   }
      window.location = URL;
    },
  },
};
</script>
