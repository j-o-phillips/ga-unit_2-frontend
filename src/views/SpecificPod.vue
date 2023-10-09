<template>
  <div id="custom-container">
    <div class="item" id="search-container">
      <Search :handleAddToSuggestions="handleAddToSuggestions" />
    </div>
    <div class="item" id="playlist-select">
      {{ playlistName }}
    </div>
    <div class="item" id="current-playlist">
      <PodPlaylist
        v-if="playlistData"
        :playlistData="playlistData"
        :handleDeleteFromPlaylist="handleDeleteFromPlaylist"
      />
      <button @click="syncToSpotify">Sync to Spotify</button>
    </div>
    <div class="item" id="suggestion-playlist">
      <SuggestionsPlaylist
        v-if="suggestionsData"
        :suggestionsData="suggestionsData"
        :handleAddToPlaylist="handleAddToPlaylist"
        :handleDeleteFromSuggestions="handleDeleteFromSuggestions"
      />
    </div>
    <div class="item" id="player-container"></div>
    <div class="item" id="friend-container"></div>
    <div class="item" id="post-container">
      <Posts />
    </div>
  </div>
</template>

<script>
const ROOT_URL = "http://localhost:4000";

import Search from "@/components/Search.vue";
import SuggestionsPlaylist from "@/components/SuggestionsPlaylist.vue";
import PodPlaylist from "@/components/PodPlaylist.vue";
import Posts from "@/components/Posts.vue";

export default {
  name: "SpecificPod",
  components: { Search, SuggestionsPlaylist, PodPlaylist, Posts },
  data() {
    return {
      playlistName: "",
      playlistId: "", //2sRwnPfp61VZaNZNsbPLmh?si=842b91f70c714c3f
      suggestionsData: [],
      playlistData: [],
      test: [],
    };
  },
  mounted() {
    fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}`)
      .then((res) => res.json())
      .then((res) => {
        this.playlistName = res.name;
        if (res.tracks) {
          this.playlistData = res.tracks;
        }
        if (res.suggestions) {
          this.suggestionsData = res.suggestions;
        }
      });
  },
  methods: {
    async handleAddToSuggestions(data) {
      const trackDetails = {
        id: data.id,
        name: data.name,
        artist: data.artists[0].name,
        album: data.album.name,
        uri: data.uri,
      };
      this.suggestionsData.push(trackDetails);
      await fetch(`${ROOT_URL}/my-pods/suggestions/${this.$route.params.pod}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackDetails),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
    },

    async handleDeleteFromSuggestions(data) {
      const index = this.suggestionsData.findIndex((track) => {
        return track.id === data.id;
      });
      this.suggestionsData.splice(index, 1);

      await fetch(`${ROOT_URL}/my-pods/suggestions/${this.$route.params.pod}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
    },

    async handleAddToPlaylist(data) {
      this.playlistData.push(data);

      await fetch(`${ROOT_URL}/my-pods/playlist/${this.$route.params.pod}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
    },

    async handleDeleteFromPlaylist(data) {
      const index = this.playlistData.findIndex((track) => {
        return track.id === data.id;
      });
      this.playlistData.splice(index, 1);
      await fetch(`${ROOT_URL}/my-pods/playlist/${this.$route.params.pod}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message));
    },

    syncToSpotify() {
      const data = {
        playlistName: this.playlistName,
        playlistId: this.playlistId,
        playlistData: this.playlistData,
      };
      fetch(`${ROOT_URL}/my-pods/sync`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.newId) {
            console.log(res.newId);
            this.playlistId = res.newId;
          }
        })
        .then(() => console.log(this.playlistId));
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
  overflow: auto;
}
#playlist-select {
  grid-row: 1/2;
}
#current-playlist {
  grid-row: 2/4;
  overflow: auto;
  position: relative;
}
#suggestion-playlist {
  grid-row: 4/5;
  overflow: auto;
}
#player-container {
  grid-row: 5/6;
}
#friend-container {
  grid-row: 1/3;
}
#post-container {
  grid-row: 3/6;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#current-playlist > button {
  position: absolute;
  bottom: 3px;
}
</style>
