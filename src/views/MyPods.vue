<template>
  <div class="container" id="container">
    <div class="row">
      <div class="col-3 bg-primary window">
        <h3>Search All Pods</h3>
        <div id="search-box">
          <input
            type="text"
            name="search"
            id="search"
            v-model="searchItem"
            class="text-left"
          />
          <button @click="handlePodSearch">Search</button>
        </div>
        <div id="search-results">
          <div
            class="pod-card"
            :to="'/my-pods/' + pod.name"
            v-for="pod in searchResults"
          >
            <div>{{ pod.name }}</div>
            <button
              v-if="!isPodInMyPods(pod.name)"
              @click="handleJoinPod(pod._id)"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div class="col-9 bg-warning window">
        <h3>My Pods</h3>
        <div class="d-flex flex-wrap m-4" id="mypods-container">
          <div>
            <input
              type="text"
              name="podName"
              id="podName"
              v-model="podName"
              class="text-left"
              placeholder="Pod Name"
            />
            <input
              type="text"
              name="playlistName"
              id="playlistName"
              v-model="playlistName"
              class="text-left"
              placeholder="First Playlist Name"
            />
            <button @click="handleAddPod">Create New Pod</button>
          </div>
          <router-link
            class="pod-card"
            :to="'/my-pods/' + pod.name"
            v-for="pod in podList"
            >{{ pod.name }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
const ROOT_URL = "http://localhost:4000";

export default {
  name: "MyPods",
  data() {
    return {
      searchItem: "",
      searchResults: [],
      podName: "",
      playlistName: "",
      podList: "",
    };
  },
  mounted() {
    this.refreshPodlist();
  },
  methods: {
    handlePodSearch() {
      if (userCred) {
        console.log("search");
        fetch(`${ROOT_URL}/my-pods/${this.searchItem}`)
          .then((res) => res.json())
          .then((res) => (this.searchResults = res));
      }
    },
    handleAddPod() {
      if (userCred) {
        try {
          const podData = {
            podName: this.podName,
            playlistName: this.playlistName,
          };
          fetch(`${ROOT_URL}/my-pods`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(podData),
          })
            .then((res) => res.json())
            .then((res) => alert(res.message))
            .then(() => this.refreshPodlist());
        } catch (error) {
          console.log(error);
        }
      }
    },
    refreshPodlist() {
      if (userCred) {
        try {
          fetch(`${ROOT_URL}/my-pods`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((res) => (this.podList = res));
          console.log(this.podList);
        } catch (error) {
          console.log(error);
        }
      }
    },
    handleJoinPod(id) {
      console.log(id);
      fetch(`${ROOT_URL}/join/${id}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ podId: id }),
      })
        .then((res) => res.json())
        .then((res) => console.log(res.message))
        .then(() => {
          this.$router.push("my-pods");
          this.$router.go();
        });
    },
    isPodInMyPods(name) {
      return !!this.podList.find((pod) => pod.name === name);
    },
  },
};
</script>
<style scoped>
#container {
  height: 80vh;
  margin-top: 4vmin;
}
.row {
  height: 100%;
  width: 100%;
}
.window {
  height: 100%;
}
#search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pod-card {
  height: 18vmin;
  width: 23vmin;
  background-color: blueviolet;
  margin: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#mypods-container > :first-child {
  height: 18vmin;
  width: 23vmin;
  background-color: blueviolet;
  margin: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
