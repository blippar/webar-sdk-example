<script setup>
</script>

<template>
    <div >
        <button class="reset" @click="reset">
            &#x21bb;
        </button>
    </div>
</template>

<style scoped>
    @import '../assets/main.css';
</style>

<script>
export default {
  data() {
    return {        
    }
  },
  methods: {
    reset() {
        console.log("Reset tracking...");
        window.WEBARSDK.SetTrackingStoppedCallback(() => {
          window.WEBARSDK.StartTracking();
        });

        window.WEBARSDK.StopTracking();
    }
  }
}

</script>
