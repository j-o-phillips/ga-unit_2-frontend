<template>
  <div v-for="post in allPosts">{{ post }}</div>
</template>

<script>
export default {
  name: "PostContainer",
  props: ["allPosts"],
};
</script>
