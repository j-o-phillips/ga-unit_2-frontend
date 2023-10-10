<template>
  <div class="container" id="custom-container">
    <div id="playlists">
      <button
        class="playlist-card"
        v-for="track in playlists"
        @click="handleSelectPlaylist(track)"
      >
        {{ track.name }}
      </button>
    </div>
    <div id="search">
      <Search :handleAddToSuggestions="handleAddToPersonalPlaylist" />
    </div>
    <div id="content">
      <h3>{{ currentPlaylistName }}</h3>
      <MyPlaylistCard
        v-for="track in content"
        :trackData="track"
        :currentPlaylistId="currentPlaylistId"
        :handleDeleteFrontendOnly="handleDeleteFrontendOnly"
      />
    </div>
  </div>
</template>

<script>
const ROOT_URL = "http://localhost:4000";
import Search from "@/components/Search.vue";
import MyPlaylistCard from "@/components/MyPlaylistCard.vue";

export default {
  name: "MyPlaylists",
  components: { Search, MyPlaylistCard },
  data() {
    return {
      playlists: [],
      content: [],
      currentPlaylistId: "",
      currentPlaylistName: "",
    };
  },
  mounted() {
    fetch(`${ROOT_URL}/my-playlists`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => (this.playlists = res));
  },
  methods: {
    handleAddToPersonalPlaylist(track) {
      //format
      const dataObj = {
        track,
      };

      this.content.push(dataObj);
      fetch(`${ROOT_URL}/my-playlists/${this.currentPlaylistId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(track),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
    },
    handleSelectPlaylist(data) {
      this.currentPlaylistId = data.id;
      this.currentPlaylistName = data.name;
      fetch(`${ROOT_URL}/my-playlists/${data.id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => (this.content = res.tracks.items));
    },
    handleDeleteFrontendOnly(id) {
      console.log(id);
      //delete from frontend
      const index = this.content.findIndex((track) => {
        return track.id === id;
      });
      this.content.splice(index, 1);
    },
  },
};
</script>
<style>
#custom-container {
  height: 90vh;
  width: 100vw;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 2fr;
}
#playlists {
  border: 1px solid black;
  grid-column: 1/4;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
#search {
  border: 1px solid black;
  grid-row: 2/3;
}
#content {
  border: 1px solid black;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.playlist-card {
  height: 100px;
  width: 100px;
  margin: 2px;
  overflow: hidden;
}
</style>
