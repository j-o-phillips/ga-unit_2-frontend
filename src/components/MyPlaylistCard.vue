<template>
  <div id="track-container">
    <div id="first-row">
      <p>
        {{ truncateString(trackData.track.name) }} ||
        {{ truncateString(trackData.track.artists[0].name) }}
      </p>

      <button
        :disabled="disableButtons"
        @click="handleDeleteFromSpotify(trackData)"
      >
        x
      </button>
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
  props: [
    "trackData",
    "currentPlaylistId",
    "disableButtons",
    "handleSelectPlaylist",
    "currentPlaylistData",
  ],
  methods: {
    handleDeleteFromSpotify(data) {
      fetch(`${ROOT_URL}/my-playlists/${this.currentPlaylistId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.track),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            this.handleSelectPlaylist(this.currentPlaylistData);
          } else if (res.status === 403) {
            console.log("you don't own this playlist");
          }
        });
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
  background-color: rgba(28, 28, 28, 0.624);
  border-radius: 10px;
  margin-bottom: 6px;
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
