<template>
  <div id="track-container">
    <div id="first-row">
      <p>{{ trackData.name }} || {{ trackData.artists[0].name }}</p>

      <button @click="handleAddToSuggestions(trackData)">+</button>
    </div>
    <div>
      <p>{{ trackData.album.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrackCard",
  props: ["trackData", "handleAddToSuggestions"],
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
</style>
