<script setup>
import SceneView from './SceneView.vue';
</script>

<template>
  <a-scene
    webar-scene="key: fca11512-0ec7-4773-85e0-a1d4b56ab49e"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    loading-screen="enabled: false"
    renderer="colorManagement: true;">
    <a-camera webar-camera></a-camera>

    <a-assets timeout="60000">
      <a-asset-item id="testmodel" src="models/astronaut.glb"></a-asset-item>
    </a-assets>

    <a-entity webar-stage>
      <SceneView v-if="assetsLoaded"/>
    </a-entity>
  </a-scene>
</template>

<script>
export default {
  data() {
    return {
      assetsLoaded: false
    }
  },
  mounted() {
    this.assetsLoaded = true;
  }
}
</script>
