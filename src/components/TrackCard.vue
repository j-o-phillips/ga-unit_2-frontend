<template>
  <div id="track-container">
    <div id="first-row">
      <p>
        {{ truncateString(trackData.name) }} ||
        {{ truncateString(trackData.artists[0].name) }}
      </p>

      <button
        :disabled="disableButtons"
        @click="handleAddToSuggestions(trackData)"
      >
        +
      </button>
    </div>
    <div>
      <p>{{ trackData.album.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrackCard",
  props: ["trackData", "handleAddToSuggestions", "disableButtons"],
  methods: {
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
  background-color: rgba(28, 28, 28, 0.624);

  border-radius: 10px;
  margin-bottom: 6px;
  width: 90%;
  overflow: hidden;
  flex-wrap: nowrap;
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
