var WebarSdkMarker = pc.createScript('WebarSdkMarker');

const MAX_MARKERS_COUNT = 10;
const PROEPRTY_MARKER_ID = 'markerId';
const PROEPRTY_MARKER_ENTITY = 'markerEntity';

// WebAR SDK Marker Camera selection UI Attribute
WebarSdkMarker.attributes.add('WebarCamera', {
    title: 'Webar Camera',
    type: 'entity'
});

// WebAR SDK Marker Camera selection UI Attribute
WebarSdkMarker.attributes.add('MarkerEntityMap', {
    type: 'json',
    array: true,
    size: MAX_MARKERS_COUNT,
    schema: [{
            name: PROEPRTY_MARKER_ID,
            type: 'string',
            title: 'Marker Id ',
            placeholder: 'Id',
            description: 'Blippar Marker Id',
            default: ''
        },
        {
            name: PROEPRTY_MARKER_ENTITY,
            type: 'entity',
            title: 'Marker Entity ',
            description: 'Select the Entity to display on a Marker image specified in the Blippar Marker Id',
            default: null
        }
    ]
});

// initialize Webar SDK with playcanvas entity details
WebarSdkMarker.prototype.initialize = function() {
    console.log('this.WebarCamera = ' + this.WebarCamera);
    WEBARSDK.InitPlayCanvas('application-canvas', this.WebarCamera, this.MarkerEntityMap);
};
