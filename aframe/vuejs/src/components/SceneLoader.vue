<script setup>
import SceneView from './SceneView.vue';
</script>

<template>
  <a-scene
    webar-scene="key: xxxxxxxx-1111-2222-3333-yyyyyyyyyyyy"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    loading-screen="enabled: false"
    renderer="colorManagement: true;">
    <a-camera webar-camera></a-camera>

    <a-assets timeout="60000">
      <a-asset-item id="testmodel" src="models/astronaut.glb"></a-asset-item>
    </a-assets>

    <a-entity webar-stage position="0 1 -2">
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
