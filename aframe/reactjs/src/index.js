import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class UiView extends React.Component {
  render() {
    return (
      <button className="reload" onClick={ () => {
        console.log("Reloading...");
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
        <a-entity gltf-model="#testmodel" id="testmodel_1" rotation="0 0 0" position="0 0 0" scale="0.25 0.25 0.25" webar-loadmonitor="elType: glb"></a-entity>
    );
  }
}

class SceneLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assetsReady: false };
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
                <a-asset-item id="testmodel" src="models/astronaut.glb"></a-asset-item>
              </a-assets>

              <a-entity webar-stage>
              {
                this.state.assetsReady && <SceneView/>
              }
              </a-entity>

            </a-scene>

            <UiView value="&#x21bb;"/>
          </div>
      );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SceneLoader/>);
