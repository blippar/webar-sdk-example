<script setup>
import SceneLoader from './components/SceneLoader.vue';
import UIView from './components/UIView.vue';
</script>

<template>
  <SceneLoader/>
  <UIView v-if="stageReady"/>
</template>

<style scoped>
</style>


<script>
export default {
  data() {
    return {
      stageReady: false
    }
  },
  created() {
    WEBARSDK.SetStageReadyCallback(() => {
      this.stageReady = true;
    });
  }
}
</script>
