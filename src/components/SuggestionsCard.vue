<template>
  <div id="track-container">
    <div id="first-row">
      <p>
        {{ truncateString(trackData.name, 15) }} ||
        {{ truncateString(trackData.artist, 15) }}
      </p>
      <ul class="list-group list-group-horizontal">
        <button
          :disabled="disableButtons"
          v-if="isAdmin()"
          @click="handleAddToPlaylist(trackData)"
        >
          +
        </button>
        <button
          :disabled="disableButtons"
          v-if="isAdmin()"
          @click="handleDeleteFromSuggestions(trackData)"
        >
          x
        </button>
        <button
          v-if="!isAdmin() && likeButtonVisible"
          :disabled="disableButtons || disableFomLocal"
          @click="handleLike(trackData.id)"
        >
          <font-awesome-icon
            :icon="['fas', 'thumbs-up']"
            flip="horizontal"
            style="color: #ffffff"
          />
        </button>
        <button
          v-if="!isAdmin() && dislikeButtonVisible"
          :disabled="disableButtons || disableFomLocal"
          @click="handleDislike(trackData.id)"
        >
          <font-awesome-icon
            :icon="['fas', 'thumbs-down']"
            flip="horizontal"
            style="color: #ffffff"
          />
        </button>
        <button id="likes-display" :disabled="true">
          {{ likes }}
        </button>
      </ul>
    </div>
    <div>
      <p>{{ truncateString(trackData.album, 40) }}</p>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp,
  faThumbsDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
library.add(faThumbsUp, faThumbsDown, faBars);
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
const cookieJson = JSON.parse(userCred);
const userId = cookieJson.userId;
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;

if (userCred) {
  const cookieData = JSON.parse(userCred);
  userId = cookieData.userId;
}

export default {
  name: "SuggestionsCard",
  props: [
    "trackData",
    "handleAddToPlaylist",
    "handleDeleteFromSuggestions",
    "podAdmins",
    "disableButtons",
  ],
  data() {
    return {
      likes: this.trackData.likes.length,
      likeButtonVisible: true,
      dislikeButtonVisible: false,
      disableFomLocal: false,
    };
  },
  mounted() {
    if (this.trackData.likes.includes(userId)) {
      this.likeButtonVisible = false;
      this.dislikeButtonVisible = true;
    } else {
      this.likeButtonVisible = true;
      this.dislikeButtonVisible = false;
    }
  },
  methods: {
    isAdmin() {
      return !!this.podAdmins.find((user) => userId === user);
    },
    truncateString(str, maxLength) {
      if (str.length > maxLength) {
        return str.slice(0, maxLength) + "...";
      }
      return str;
    },
    handleLike(trackId) {
      const data = {
        trackId,
        userId,
      };
      this.disableFomLocal = true;
      this.likes += 1;
      this.likeButtonVisible = false;
      this.dislikeButtonVisible = true;
      fetch(`${ROOT_URL}/like/${this.$route.params.pod}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => (this.disableFomLocal = false));
    },
    handleDislike(trackId) {
      this.disableFomLocal = true;
      this.likes -= 1;
      this.likeButtonVisible = true;
      this.dislikeButtonVisible = false;
      fetch(`${ROOT_URL}/dislike/${this.$route.params.pod}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackId }),
      })
        .then((res) => res.json())
        .then(() => (this.disableFomLocal = false));
    },
    checkIfUserLikes() {
      if (this.trackData.likes.includes(userId)) {
        this.likeButtonVisible = false;
      }
    },
  },
};
</script>

<style scoped>
p {
  font-size: 0.9em;
}
#track-container {
  display: flex;
  flex-direction: column;
  background-color: rgba(28, 28, 28, 0.624);
  border-radius: 10px;
  margin-bottom: 6px;
  width: 90%;
  overflow: hidden;
}
#track-container > div:first-child {
  display: flex;
  justify-content: space-between;
  height: 20px;
  margin-left: 5px;
}
#track-container > div:last-child {
  align-self: flex-start;
  height: 20px;
  margin-left: 5px;
}
button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  top: 10px;
  position: relative;
}
#likes-display {
  background: rgb(65, 65, 65);
}
</style>
