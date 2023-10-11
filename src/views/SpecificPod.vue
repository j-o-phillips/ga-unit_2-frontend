<template>
  <div id="custom-container">
    <div class="item" id="search-container">
      <Search :handleAddToSuggestions="handleAddToSuggestions" />
    </div>
    <div class="item" id="playlist-select">
      <h3>{{ playlistName }}</h3>
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Menu
        </button>
        <ul class="dropdown-menu">
          <li><button @click="handleLeavePod">Leave pod</button></li>
          <li><button @click="handleDeletePod">Delete pod</button></li>
        </ul>
      </div>
    </div>
    <div class="item" id="current-playlist">
      <PodPlaylist
        v-if="playlistData"
        :playlistData="playlistData"
        :handleDeleteFromPlaylist="handleDeleteFromPlaylist"
        :podAdmins="podAdmins"
      />
      <button @click="syncToSpotify">Sync to Spotify</button>
    </div>
    <div class="item" id="suggestion-playlist">
      <SuggestionsPlaylist
        v-if="suggestionsData"
        :suggestionsData="suggestionsData"
        :handleAddToPlaylist="handleAddToPlaylist"
        :handleDeleteFromSuggestions="handleDeleteFromSuggestions"
        :podAdmins="podAdmins"
      />
    </div>

    <div class="item" id="friend-container">
      <div class="friend-card" v-for="friend in podMembers">{{ friend }}</div>
    </div>
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
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");

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
      podMembers: [],
      podAdmins: [],
      podUsers: [],
      currentPodId: "",
    };
  },
  mounted() {
    if (userCred) {
      fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}`)
        .then((res) => res.json())
        .then((res) => {
          this.podAdmins = res[0].admins;
          this.podUsers = res[0].users;
          this.podMembers = [res[0].admins + res[0].users];
          console.log(this.podMembers);
          this.currentPodId = res[0]._id;
          this.playlistName = res[0].playlists[0].name;
          if (res[0].playlists[0].tracks) {
            this.playlistData = res[0].playlists[0].tracks;
          }
          if (res[0].playlists[0].suggestions) {
            this.suggestionsData = res[0].playlists[0].suggestions;
            console.log(this.suggestionsData);
          }
          if (res[0].playlists[0].spotifyId) {
            this.playlistId = res[0].playlists[0].spotifyId;
          }
        });
    }
  },
  methods: {
    async handleAddToSuggestions(data) {
      if (userCred) {
        const trackDetails = {
          id: data.id,
          name: data.name,
          artist: data.artists[0].name,
          album: data.album.name,
          uri: data.uri,
        };
        this.suggestionsData.push(trackDetails);
        await fetch(
          `${ROOT_URL}/my-pods/suggestions/${this.$route.params.pod}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(trackDetails),
          }
        )
          .then((res) => res.json())
          .then((res) => console.log(res.message));
      }
    },

    async handleDeleteFromSuggestions(data) {
      if (userCred) {
        const index = this.suggestionsData.findIndex((track) => {
          return track.id === data.id;
        });
        this.suggestionsData.splice(index, 1);

        await fetch(
          `${ROOT_URL}/my-pods/suggestions/${this.$route.params.pod}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        )
          .then((res) => res.json())
          .then((res) => console.log(res.message));
      }
    },

    async handleAddToPlaylist(data) {
      if (userCred) {
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
      }
    },

    async handleDeleteFromPlaylist(data) {
      if (userCred) {
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
      }
    },

    syncToSpotify() {
      if (userCred) {
        const data = {
          playlistName: this.playlistName,
          playlistId: this.playlistId,
          playlistData: this.playlistData,
        };

        fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/sync`, {
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
      }
    },

    handleLeavePod() {
      console.log("leave");
      fetch(`${ROOT_URL}/leave/${this.currentPodId}`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ podId: this.currentPodId }),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message))
        .then(() => this.$router.push("/my-pods"));
    },

    handleDeletePod() {
      console.log("delete");
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
  grid-template-rows: 50px 1fr 2fr 3fr;
  gap: 5px;
}
.item {
  border: 1px solid black;
  border-radius: 10px;
}
#search-container {
  grid-row: 1/6;
  overflow: auto;
}
#playlist-select {
  grid-row: 1/2;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
}
#current-playlist {
  grid-row: 2/4;
  overflow: auto;
  position: relative;
}
#suggestion-playlist {
  grid-row: 4/6;
  overflow: auto;
}

#friend-container {
  grid-row: 1/3;
  display: flex;
  flex-wrap: wrap;
}
#post-container {
  grid-row: 3/6;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
#current-playlist > button {
  position: absolute;
  bottom: 3px;
}
.friend-card {
  border: 1px solid black;
  height: 6vmin;
  width: 10vmin;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.dropdown {
  position: absolute;
  right: 5px;
}
li > button {
  border: none;
  background-color: transparent;
}
</style>
