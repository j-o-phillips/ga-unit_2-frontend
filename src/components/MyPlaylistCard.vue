<template>
  <div id="track-container">
    <div id="first-row">
      <p>{{ trackData.track.name }} || {{ trackData.track.artists[0].name }}</p>

      <button @click="handleDeleteFromSpotify(trackData)">x</button>
    </div>
    <div>
      <p>{{ trackData.track.album.name }}</p>
    </div>
  </div>
</template>

<script>
const ROOT_URL = "http://localhost:4000";
export default {
  name: "TrackCard",
  props: ["trackData", "currentPlaylistId", "handleDeleteFrontendOnly"],
  methods: {
    handleDeleteFromSpotify(data) {
      this.handleDeleteFrontendOnly(data.track.id);
      fetch(`${ROOT_URL}/my-playlists/${this.currentPlaylistId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.track),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
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
