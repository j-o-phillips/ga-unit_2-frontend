<template>
  <PostContainer :allPosts="allPosts" :updatePosts="updatePosts" />

  <div id="posts-container">
    <textarea placeholder="Type your comment" v-model="postContent"></textarea>
    <br />
    <button @click="handleSubmitPost">Post</button>
  </div>
</template>

<script>
import PostContainer from "./PostContainer.vue";
import Cookies from "js-cookie";
const userCred = Cookies.get("userCred");
let userId;
if (userCred) {
  const cookieJson = JSON.parse(userCred);
  userId = cookieJson.userId;
}

const ROOT_URL = process.env.VUE_APP_BACKEND_URL;
export default {
  name: "PostBar",
  components: { PostContainer },
  props: ["updatePosts"],
  data() {
    return {
      postContent: "",
      allPosts: [],
    };
  },
  mounted() {
    fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/posts`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        this.allPosts = res;
      });
  },
  methods: {
    async handleSubmitPost() {
      const data = {
        content: this.postContent,
        userId: userId,
      };
      await fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => {
          this.updatePosts();
        });
    },
  },
};
</script>
<style scoped>
textarea {
  height: 100px;
  width: 300px;
  border-radius: 10px;
  margin-top: 5px;
}
#posts-container {
  position: absolute;
  bottom: 5%;
}
</style>
