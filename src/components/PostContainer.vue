<template>
  <div v-for="post in allPosts" id="post-container">
    <button v-if="userId === post.author" @click="handleDeletePost(post)">
      x
    </button>
    <p id="author">{{ post.author }}</p>
    <p>{{ post.content }}</p>
  </div>
</template>

<script>
import Cookies from "js-cookie";

const ROOT_URL = process.env.VUE_APP_BACKEND_URL;
export default {
  name: "PostContainer",
  props: ["allPosts", "updatePosts"],
  data() {
    return {
      userId: "",
    };
  },
  mounted() {
    const userCred = Cookies.get("userCred");
    const cookieData = JSON.parse(userCred);
    this.userId = cookieData.userId;
  },
  methods: {
    handleDeletePost(post) {
      const id = post._id;
      fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/${id}`, {
        method: "DELETE",
      }).then(() => this.updatePosts());
    },
  },
};
</script>

<style scoped>
#post-container {
  background-color: rgba(28, 28, 28, 0.624);
  border-radius: 10px;
  margin: 5px;
  width: 80%;
  position: relative;
}
p {
  text-align: left;
  margin: 0 0 0 10px;
}
#author {
  font-weight: bold;
  font-size: 0.9em;
}
button {
  position: absolute;
  top: 5px;
  right: 5px;
  height: 20px;
  width: 20px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}
</style>
