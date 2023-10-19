<template>
  <div class="mt-3" id="search-box">
    <input
      type="text"
      name="search"
      id="search"
      v-model="searchItem"
      class="text-left"
    />
    <button @click="handleSearch">Search</button>
  </div>
  <div id="trackcard-container">
    <TrackCard
      v-for="track in searchResults"
      :trackData="track"
      :handleAddToSuggestions="handleAddToSuggestions"
      :disableButtons="disableButtons"
    />
  </div>
</template>

<script>
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
const cookieJson = JSON.parse(userCred);
const accessToken = cookieJson.accessToken;
import TrackCard from "./TrackCard.vue";
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;

export default {
  name: "Search",
  components: { TrackCard },
  props: ["handleAddToSuggestions", "disableButtons"],
  data() {
    return {
      searchItem: "",
      searchResults: "",
    };
  },
  methods: {
    handleSearch() {
      fetch(`${ROOT_URL}/searchSpotify/${this.searchItem}/${accessToken}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => (this.searchResults = result));
    },
  },
};
</script>
<style scoped>
#trackcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
input {
  border-radius: 10px;
  margin-right: 5px;
}
</style>
