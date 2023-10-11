<template>
  <div id="track-container">
    <div id="first-row">
      <p>
        {{ truncateString(trackData.name) }} ||
        {{ truncateString(trackData.artist) }}
      </p>
      <ul class="list-group list-group-horizontal">
        <button v-if="isAdmin()" @click="handleAddToPlaylist(trackData)">
          +
        </button>
        <button
          v-if="isAdmin()"
          @click="handleDeleteFromSuggestions(trackData)"
        >
          X
        </button>
      </ul>
    </div>
    <div>
      <p>{{ trackData.album }}</p>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
let userId;
const userCred = Cookies.get("userCred");
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
  ],
  methods: {
    isAdmin() {
      return !!this.podAdmins.find((user) => userId === user);
    },
    truncateString(str) {
      if (str.length > 15) {
        return str.slice(0, 15) + "...";
      }
      return str;
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
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 4px;
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
#likes {
  margin-right: 5px;
  top: 10px;
  position: relative;
}
</style>
