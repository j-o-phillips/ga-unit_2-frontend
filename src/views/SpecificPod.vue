<template>
  <div id="custom-container">
    <div class="item" id="search-container">
      <Search
        :handleAddToSuggestions="handleAddToSuggestions"
        :disableButtons="disableButtons"
      />
    </div>
    <div class="item" id="playlist-select">
      <h3>{{ playlistName }}</h3>
      <div class="dropdown">
        <button
          class="btn btn-secondary"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <font-awesome-icon :icon="['fas', 'bars']" style="color: #ffffff" />
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
        :disableButtons="disableButtons"
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
        :disableButtons="disableButtons"
      />
    </div>

    <div class="item" id="friend-container">
      <div class="friend-card admin" v-for="friend in podAdmins">
        <div>{{ friend }}</div>
      </div>
      <div class="friend-card" v-for="friend in podUsers">{{ friend }}</div>
    </div>
    <div class="item" id="post-container">
      <Posts :key="postsKey" :updatePosts="updatePosts" />
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars } from "@fortawesome/free-solid-svg-icons";
library.add(faBars);
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;

import Search from "@/components/Search.vue";
import SuggestionsPlaylist from "@/components/SuggestionsPlaylist.vue";
import PodPlaylist from "@/components/PodPlaylist.vue";
import Posts from "@/components/Posts.vue";
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
const cookieData = JSON.parse(userCred);

export default {
  name: "SpecificPod",
  components: { Search, SuggestionsPlaylist, PodPlaylist, Posts },
  data() {
    return {
      playlistName: "",
      playlistId: "",
      suggestionsData: [],
      playlistData: [],
      test: [],
      podAdmins: [],
      podUsers: [],
      currentPodId: "",
      disableButtons: false,
      postsKey: 0,
      currentUserImage: "",
    };
  },
  mounted() {
    fetch(`${ROOT_URL}/pod/my-pods/${this.$route.params.pod}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        this.podAdmins = res[0].admins;
        this.podUsers = res[0].users;
        this.currentPodId = res[0]._id;
        this.playlistName = res[0].playlists[0].name;
        if (res[0].playlists[0].tracks) {
          this.playlistData = res[0].playlists[0].tracks;
        }
        if (res[0].playlists[0].suggestions) {
          this.suggestionsData = res[0].playlists[0].suggestions;
        }
        if (res[0].playlists[0].spotifyId) {
          this.playlistId = res[0].playlists[0].spotifyId;
        }
      });
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
          likes: [],
        };
        //check if track already exists
        const foundDuplicate = this.suggestionsData.find((suggestion) => {
          return suggestion.id === trackDetails.id;
        });
        if (!foundDuplicate) {
          this.disableButtons = true;
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
            .then((res) => {
              this.disableButtons = false;
            });
        }
      }
    },

    async handleDeleteFromSuggestions(data) {
      if (userCred) {
        this.disableButtons = true;
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
          .then((res) => {
            this.disableButtons = false;
          });
      }
    },

    async handleAddToPlaylist(data) {
      if (userCred) {
        const foundDuplicate = this.playlistData.find((track) => {
          return track.id === data.id;
        });
        if (!foundDuplicate) {
          this.disableButtons = true;
          this.playlistData.push(data);

          await fetch(
            `${ROOT_URL}/my-pods/playlist/${this.$route.params.pod}`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          )
            .then((res) => res.json())
            .then((res) => {
              this.disableButtons = false;
            });
        }
      }
    },

    async handleDeleteFromPlaylist(data) {
      if (userCred) {
        this.disableButtons = true;
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
          .then((res) => {
            this.disableButtons = false;
          });
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
              this.playlistId = res.newId;
            }
          });
      }
    },

    handleLeavePod() {
      fetch(`${ROOT_URL}/leave/${this.currentPodId}`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ podId: this.currentPodId }),
      })
        .then((res) => res.json())

        .then(() => this.$router.push("/my-pods"));
    },

    handleDeletePod() {
      console.log("delete");
    },
    updatePosts() {
      this.postsKey += 1;
    },
  },
};
</script>

<style scoped>
#custom-container {
  height: 90vh;
  width: 100vw;
  color: white;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 50px 1fr 2fr 3fr;
  gap: 7px;
}
.item {
  border-radius: 10px;
  background-color: rgb(57, 56, 56);
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
  bottom: 6px;
  left: 30%;
  right: 30%;
}
.friend-card {
  background-color: rgba(28, 28, 28, 0.624);
  border-radius: 10px;
  height: 6vmin;
  width: 12vmin;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
}
.admin {
  font-weight: bold;
  text-decoration: underline;
}
.dropdown {
  position: absolute;
  right: 5px;
}
ul {
  background-color: rgb(57, 56, 56);
}
li > button {
  border: none;
  color: antiquewhite;
  background: transparent;
}
</style>
