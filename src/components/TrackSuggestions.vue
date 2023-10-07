<template>
  <div id="suggestions-container"></div>
</template>

<script>
export default {
  name: "TrackSuggestions",
  data() {
    return {
      suggestedTracks: [],
    };
  },
};
</script>

<style scoped>
#suggestions-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
</style>
