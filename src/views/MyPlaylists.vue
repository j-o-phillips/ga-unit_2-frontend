<template>
  <div class="container" id="custom-container">
    <div id="playlists">
      <button
        id="tester"
        class="playlist-card"
        v-for="playlist in playlists"
        @click="handleSelectPlaylist(playlist)"
      >
        {{ playlist.name }}
      </button>
    </div>
    <div id="search">
      <Search
        :handleAddToSuggestions="handleAddToPersonalPlaylist"
        :disableButtons="disableButtons"
      />
    </div>
    <div id="content">
      <h3>{{ currentPlaylistName }}</h3>
      <MyPlaylistCard
        v-for="track in content"
        :trackData="track"
        :currentPlaylistId="currentPlaylistId"
        :disableButtons="disableButtons"
        :handleSelectPlaylist="handleSelectPlaylist"
        :currentPlaylistData="currentPlaylistData"
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
      currentPlaylistData: "",
      disableButtons: false,
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
      this.disableButtons = true;
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
        .then((res) => {
          console.log(res.message);
          this.handleSelectPlaylist(this.currentPlaylistData);
          this.disableButtons = false;
        });
    },
    handleSelectPlaylist(data) {
      this.currentPlaylistId = data.id;
      this.currentPlaylistName = data.name;
      this.currentPlaylistData = data;

      fetch(`${ROOT_URL}/my-playlists/${data.id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => (this.content = res.tracks.items));
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 2fr;
  gap: 5px;
  color: white;
}
#playlists {
  grid-column: 1/4;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
#search {
  grid-row: 2/3;
}
#content {
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
button {
  height: 100px;
  width: 100px;
  margin: 2px;
  overflow: hidden;
  background: rgba(28, 28, 28, 0.624);
}
#custom-container > div {
  background-color: rgb(57, 56, 56);
  border-radius: 20px;
}
#tester {
  background-color: rgba(28, 28, 28, 0.624);
}
</style>
