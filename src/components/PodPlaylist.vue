<template>
  <div id="trackcard-container">
    <PlaylistCard
      v-for="track in playlistData"
      :trackData="track"
      :handleDeleteFromPlaylist="handleDeleteFromPlaylist"
      :podAdmins="podAdmins"
      :disableButtons="disableButtons"
    ></PlaylistCard>
  </div>
</template>

<script>
import PlaylistCard from "./PlaylistCard.vue";

export default {
  name: "PodPlaylist",
  props: [
    "playlistData",
    "handleDeleteFromPlaylist",
    "podAdmins",
    "disableButtons",
  ],
  components: { PlaylistCard },
};
</script>

<style scoped>
#trackcard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
</style>
