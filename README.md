# WebAR-SDK Example

Try [Live Demo](https://webar-sdk.blippar.com/ "WebAR-sdk Example Live Demo") on your mobile browser. Supports Android Chrome and iOS Safari.

Create your own Surface tracking web app using these simple steps using AFRAME.

## Step 1

- Include **WebAR-sdk** script (available in `webar-sdk` folder) before the `<body>` tag.
  - **WebAR-sdk** script is already bundled with
    - aframe version 1.2.0
    - aframe-extras version 6.1.1

``` html
  <script src="./webar-sdk/blippar-webar.21dbd8ac.js"></script>
```

## Step 2

- Add **webar-scene** attribute to AFrame's `<a-scene>` tag
- Provide a valid Blippar license-key value in the `key:` property

``` html
      <a-scene
        webar-scene="key: xxxxxxxx-1111-2222-3333-yyyyyyyyyyyy"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        loading-screen="enabled: false"
        light="defaultLightsEnabled: false"
        renderer="antialias: true; colorManagement: true; sortObjects: false; precision: high; logarithmicDepthBuffer: false; physicallyCorrectLights: false;">
```

## Step 3

- Add **webar-camera** attribute to AFrame's `<a-entity camera>` tag
  - Do not change the default values of fov and zoom properties

``` html
        <a-entity
          webar-camera
          camera="fov: 80; zoom: 1;"
          wasd-controls-enabled="false"
          look-controls="enabled: true; touchEnabled: false;"></a-entity>
```

## Step 4

- Add **webar-stage** attribute to an AFrame's parent `<a-entity>` tag

``` html
        <a-entity webar-stage>
            <!-- Read Step 5 to place AR models here -->
        </a-entity>
```

## Step 5

- Add AR models under the **webar-stage** node.
  - Add **webar-loadmonitor** attribute to the entities to display loading progress screen before starting the surface tracking. Look more for webar-loadmonitor properties table.

``` html
        <a-entity webar-stage>
          <a-entity gltf-model="#shoe" id="shoe_1" rotation="0 0 0" position="0 0 0" scale="5 5 5" webar-loadmonitor="elType: glb"></a-entity>
        </a-entity>
```

### webar-loadmonitor Attribute

- To monitor the loaded state of an AFrame entity `webar-loadmonitor` attribute's `elType` property should specify the appropriate type.

| elType         | AFrame's Event listened |
|----------------|-------------------------|
| glb            | model-loaded            |
| obj            | model-loaded            |
| asset          | loaded                  |
| texture        | materialtextureloaded   |
| video          | materialvideoloadeddata |
| none           | Waits for 500 ms        |

Example:

``` html
 <a-entity gltf-model="#model" id="model_1" webar-loadmonitor="elType: obj"></a-entity>
```

## Installation

- Host `index.html` and `webar-sdk` folder on a **HTTPS** server. SSL is must to access the webcamera on a mobile browser.
- Load the url on your mobile browser - Android Chrome or iOS Safari.

## Usage

Once the application is loaded on the mobile browser, you 'll see

  1. A loading progress bar while loading the scripts and assets
  2. Webcam view with a hand animation guide.
  3. Move the phone slowly left and right while the camera is looking at a textured/patterned surface. It should not be shiny, over-bright or low-light.
  4. When the surface is detected, a 3d model 'll appear on the surface.

## Known Issues ( Fixes in progress and will be available soon within alpha)

  1. When looking around the 3D object, the object rotation may be slighltly inaccurate sometimes.
