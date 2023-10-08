<template>
  <div id="trackcard-container">
    <SuggestionsCard
      v-for="track in suggestionsData"
      :trackData="track"
    ></SuggestionsCard>
  </div>
</template>

<script>
import SuggestionsCard from "./SuggestionsCard.vue";

export default {
  name: "SuggestionsPlaylist",
  props: ["suggestionsData"],
  components: { SuggestionsCard },
};
</script>

<style>
#trackcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
</style>
