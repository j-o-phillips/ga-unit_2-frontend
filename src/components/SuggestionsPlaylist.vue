<template>
  <h4>Suggested Tracks</h4>
  <div id="trackcard-container">
    <SuggestionsCard
      v-for="track in suggestionsData"
      :trackData="track"
      :handleAddToPlaylist="handleAddToPlaylist"
      :handleDeleteFromSuggestions="handleDeleteFromSuggestions"
      :podAdmins="podAdmins"
      :disableButtons="disableButtons"
    ></SuggestionsCard>
  </div>
</template>

<script>
import SuggestionsCard from "./SuggestionsCard.vue";

export default {
  name: "SuggestionsPlaylist",
  props: [
    "suggestionsData",
    "handleAddToPlaylist",
    "handleDeleteFromSuggestions",
    "podAdmins",
    "disableButtons",
  ],
  components: { SuggestionsCard },
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
