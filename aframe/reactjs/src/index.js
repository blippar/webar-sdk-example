import React from 'react';
import ReactDOM from 'react-dom/client';
import GestureControl from './gesture-control';
import './index.css';

class UiView extends React.Component {
  render() {
    return (
      <button className="reset" onClick={ () => {
        console.log("Reset tracking...");
        window.WEBARSDK.SetTrackingStoppedCallback(() => {
          window.WEBARSDK.StartTracking();
        });
        window.WEBARSDK.StopTracking();
      } }>
        { this.props.value }
      </button>
    );
  }
}

class SceneView extends React.Component {
  render() {
    return (
      <a-entity
      gesture-receiver
      class="clickable">
          <a-entity gltf-model="#testmodel1" id="astronaut" rotation="0 0 0" position="0 0 0" scale="0.25 0.25 0.25" webar-loadmonitor="elType: glb"></a-entity>
          <a-entity gltf-model="#testmodel2" id="shoe" rotation="0 0 0" position="0 0 -0.5" scale="4 4 4" webar-loadmonitor="elType: glb"></a-entity>
        </a-entity>
    );
  }
}

class SceneLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assetsReady: false };
    this.gestureCtrl = new GestureControl();
    this.gestureCtrl.initialize(5, 1, 8);
  }

  componentDidMount() {
    this.setState({ assetsReady: true });
  }

  render() {
      return (
          <div>
            <a-scene
              webar-scene="key: xxxxxxxx-1111-2222-3333-yyyyyyyyyyyy"
              vr-mode-ui="enabled: false"
              device-orientation-permission-ui="enabled: false"
              loading-screen="enabled: false"
              renderer="colorManagement: true;">

              <a-camera webar-camera></a-camera>

              <a-assets timeout="60000">
                <a-asset-item id="testmodel1" src="models/astronaut.glb"></a-asset-item>
                <a-asset-item id="testmodel2" src="models/MaterialsVariantsShoe.glb"></a-asset-item>
              </a-assets>

              <a-entity webar-stage
                gesture-control
                raycaster="objects: .clickable;"
                cursor="fuse: false; rayOrigin: mouse;"
                emitevents="true">
                  <a-plane radius="0.25" width="1" height="1" rotation="-90 0 0"></a-plane>
                  <a-entity>
                    {
                      this.state.assetsReady && <SceneView/>
                    }
                  </a-entity>
              </a-entity>
            </a-scene>

            <UiView value="&#x21bb;"/>
          </div>
      );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SceneLoader/>);
