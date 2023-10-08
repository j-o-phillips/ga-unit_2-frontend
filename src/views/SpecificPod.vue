<template>
  <div id="custom-container">
    <div class="item" id="search-container">
      <Search :handleAddToSuggestions="handleAddToSuggestions" />
    </div>
    <div class="item" id="playlist-select"></div>
    <div class="item" id="current-playlist"></div>
    <div class="item" id="suggestion-playlist">
      <SuggestionsPlaylist :suggestionsData="suggestionsData" />
    </div>
    <div class="item" id="player-container"></div>
    <div class="item" id="friend-container"></div>
    <div class="item" id="post-container"></div>
  </div>
</template>

<script>
import Search from "@/components/Search.vue";
import SuggestionsPlaylist from "@/components/SuggestionsPlaylist.vue";

export default {
  name: "SpecificPod",
  components: { Search, SuggestionsPlaylist },
  data() {
    return {
      suggestionsData: [],
    };
  },
  methods: {
    handleAddToSuggestions(data) {
      this.suggestionsData.push(data);
    },
  },
};
</script>

<style scoped>
#custom-container {
  height: 90vh;
  width: 100vw;

  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 50px 1fr 2fr 3fr 75px;
}
.item {
  border: 1px solid black;
}
#search-container {
  grid-row: 1/6;
}
#playlist-select {
  grid-row: 1/2;
}
#current-playlist {
  grid-row: 2/4;
}
#suggestion-playlist {
  grid-row: 4/5;
}
#player-container {
  grid-row: 5/6;
}
#friend-container {
  grid-row: 1/3;
}
#post-container {
  grid-row: 3/6;
}
</style>
