<template>
  <PostContainer :allPosts="allPosts" :refreshPosts="refreshPosts" />

  <div id="container">
    <textarea placeholder="Type your comment" v-model="postContent"></textarea>
    <br />
    <button @click="handleSubmitPost">Send</button>
  </div>
</template>

<script>
import PostContainer from "./PostContainer.vue";
const ROOT_URL = "http://localhost:4000";
export default {
  name: "PostBar",
  components: { PostContainer },
  data() {
    return {
      postContent: "",
      allPosts: [],
    };
  },
  mounted() {
    this.refreshPosts();
  },
  methods: {
    async refreshPosts() {
      fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/posts`)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          this.allPosts = res;
        });
    },

    async handleSubmitPost() {
      const data = {
        content: this.postContent,
      };
      await fetch(`${ROOT_URL}/my-pods/${this.$route.params.pod}/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => {
          this.refreshPosts();
        });
    },
  },
};
</script>
<style scoped>
textarea {
  height: 100px;
  width: 300px;
}
</style>
