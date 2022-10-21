var WebarSdkSurface = pc.createScript('WebarSdkSurface');


WebarSdkSurface.attributes.add('webarSdkCamera', {
    title: 'Webar Camera',
    type: 'entity'
});

WebarSdkSurface.attributes.add('webarSdkStage', {
    title: 'Webar Stage',
    type: 'entity'
});

// initialize Webar SDK with playcanvas entity details
WebarSdkSurface.prototype.initialize = function() {
    WEBARSDK.InitPlayCanvas('application-canvas', this.webarSdkCamera, this.webarSdkStage);
};
