<template>
  <div id="landing-container">
    <h1 id="title">PODS</h1>
    <div id="wave-container"></div>
  </div>

  <button id="login-btn" @click="handleLogin">Login</button>
</template>

<script>
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;

const clientId = "2420c054672e481b9ecd1cee4a3ff324";
const clientSecret = "1f0e69d316cc431e9e9aacb89efbf903";
export default {
  name: "Landing",
  mounted() {
    for (let i = 0; i < 90; i++) {
      const left = i * 3 + 1;
      const anim = Math.floor(Math.random() * 75 + 800);
      const height = Math.floor(Math.random() * 25 + 3);

      // Create the bar element and append it to the wave-container
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.left = `${left}px`;
      bar.style.animationDuration = `${anim}ms`;
      bar.style.height = `${height}px`;

      document.querySelector("#wave-container").appendChild(bar);
    }
  },
  methods: {
    generateRandomString(length) {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
    async generateCodeChallenge(codeVerifier) {
      function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);

      return base64encode(digest);
    },
    async handleLogin() {
      const redirectUri = "http://localhost:8080/home";

      let codeVerifier = this.generateRandomString(128);

      this.generateCodeChallenge(codeVerifier).then((codeChallenge) => {
        let state = this.generateRandomString(16);
        let scope =
          "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public";

        localStorage.setItem("code_verifier", codeVerifier);

        let args = new URLSearchParams({
          response_type: "code",
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          state: state,
          code_challenge_method: "S256",
          code_challenge: codeChallenge,
        });

        window.location = "https://accounts.spotify.com/authorize?" + args;
      });
    },
  },
};
</script>
<style>
#landing-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  color: white;
}
#title {
  color: rgb(100, 100, 100);
  font-family: Bagel Fat One;
  font-size: 5em;
  margin-bottom: 10vmin;
  position: absolute;
}
#wave-container {
  height: 14px;
  width: 180px;
  margin: 0 0 0 -350px;
  transform: scale(4);
}

.bar {
  position: absolute;
  bottom: 0px;
  height: 3px;
  width: 1px;

  background: linear-gradient(
      217deg,
      rgba(160, 7, 237, 0.856),
      rgba(192, 2, 235, 0) 70.71%
    ),
    linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(158, 1, 211, 0.275), rgba(0, 0, 255, 0) 70.71%);
  animation: sound 0ms -800ms linear infinite alternate;
  transform: translateY(50%);
}

@keyframes sound {
  0% {
    opacity: 0.35;
    height: 2px;
  }
  100% {
    opacity: 1;
    height: 25px;
  }
}

#login-btn {
  height: 40px;
  width: 180px;
  border-radius: 20px;
  background: linear-gradient(
      217deg,
      rgba(162, 255, 0, 0.841),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgb(242, 7, 222), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(13, 13, 243, 0.8), rgba(0, 0, 255, 0) 70.71%);
}
#login-btn:hover {
  background: linear-gradient(
      217deg,
      rgba(162, 255, 0, 0.963),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgb(255, 88, 241), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(13, 13, 243, 0.8), rgba(0, 0, 255, 0) 70.71%);
}
</style>
