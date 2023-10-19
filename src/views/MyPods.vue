<template>
  <div class="container" id="container">
    <div class="row">
      <div class="col-3 window">
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
            <div>
              <span>{{ pod.name }}</span>
            </div>
            <button
              id="join"
              v-if="!isPodInMyPods(pod.name)"
              @click="handleJoinPod(pod._id)"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div class="col-9 window">
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
            ><span>{{ pod.name }}</span></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
const cookieJson = JSON.parse(userCred);
const userId = cookieJson.userId;
console.log(userId);
const ROOT_URL = process.env.VUE_APP_BACKEND_URL;

export default {
  name: "MyPods",
  props: ["updateView"],
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
    try {
      fetch(`${ROOT_URL}/my-pods/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => (this.podList = res));
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    handlePodSearch() {
      if (userCred) {
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
            .then(() => this.updateView());
        } catch (error) {
          console.log(error);
        }
      }
    },
    handleJoinPod(id) {
      fetch(`${ROOT_URL}/join/${id}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ podId: id }),
      })
        .then((res) => res.json())
        .then(() => {
          this.updateView();
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
  color: white;
}
.row {
  height: 100%;
}
h3 {
  margin-top: 5px;
}
.window {
  height: 100%;
  background-color: rgb(65, 65, 65);
  border-radius: 20px;
}
#search-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.pod-card {
  height: 18vmin;
  width: 23vmin;
  background-color: rgba(28, 28, 28, 0.612);
  color: white;
  text-decoration: none;

  margin: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.pod-card:hover {
  background: linear-gradient(
      217deg,
      rgba(162, 255, 0, 0.625),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgba(179, 7, 242, 0.851), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(13, 13, 243, 0.8), rgba(0, 0, 255, 0) 70.71%);
}

#mypods-container > :first-child {
  height: 18vmin;
  width: 23vmin;
  background-color: rgba(28, 28, 28, 0.612);
  margin: 5px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
#podName,
#playlistName {
  width: 80%;
}
input {
  border-radius: 10px;
}
#search {
  margin-right: 5px;
}
span {
  font-family: Bagel Fat One;
  font-size: 2em;
}
</style>
