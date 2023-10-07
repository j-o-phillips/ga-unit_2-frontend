<template>
  <div id="search-box">
    <label for="search">Search:</label>
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
    <TrackCard v-for="track in searchResults" :trackData="track" />
  </div>
</template>

<script>
import TrackCard from "./TrackCard.vue";
const ROOT_URL = "http://localhost:4000";
export default {
  name: "Search",
  components: { TrackCard },
  data() {
    return {
      searchItem: "",
      searchResults: "",
    };
  },
  methods: {
    handleSearch() {
      console.log("search");
      fetch(`${ROOT_URL}/search/${this.searchItem}`, {
        method: "GET",
        credentials: "include",
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
</style>
