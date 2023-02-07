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
            this.props.onResetTracking();
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
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onMounted();
  }

  render() {
    return (
      <a-entity
      gesture-receiver
      class="gesturable">
          <a-entity id="scene-1" visible="true">
            <a-entity gltf-model="#testmodel1" id="astronaut" rotation="0 0 0" position="0 0 0" scale="0.25 0.25 0.25" webar-loadmonitor="elType: glb"></a-entity>
            <a-entity gltf-model="#testmodel2" id="shoe" rotation="0 0 0" position="0 0 -0.5" scale="4 4 4" webar-loadmonitor="elType: glb"></a-entity>
          </a-entity>

          <a-entity id="scene-2" visible="false">
            <a-entity gltf-model="#testmodel3" id="bottle" rotation="0 0 0" position="0 0 0" scale="4 4 4" webar-loadmonitor="elType: glb"></a-entity>
          </a-entity>
        </a-entity>
    );
  }
}

class SceneLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assetsReady: false };
    this.onSceneViewMounted = this.onSceneViewMounted.bind(this);
    this.onResetTracking = this.onResetTracking.bind(this);

    this.gestureCtrl = new GestureControl();
    this.gestureCtrl.initialize(5, 1, 8, 
      (el)=> {
        if (el.id === 'astronaut') {
          this.switchToScene('scene-2');
        }
        else if (el.id === 'bottle') {
          this.switchToScene('scene-1');
        }
      });
  }

  switchToScene(sceneId) {
    const scene1 = document.getElementById('scene-1');
    const scene2 = document.getElementById('scene-2');
    const astronaut = document.getElementById('astronaut');
    const bottle = document.getElementById('bottle');

    if (sceneId === 'scene-2') {
      scene1.setAttribute('visible', false);
      scene2.setAttribute('visible', true);
      this.disableInteraction(astronaut);
      this.enableInteraction(bottle);
    }
    else {
      // enable scene-1 by default
      scene1.setAttribute('visible', true);
      scene2.setAttribute('visible', false);

      this.disableInteraction(bottle);
      this.enableInteraction(astronaut);
    }
  }

  disableInteraction(el) {
    el.classList.remove('interactable');
    el.removeAttribute('interact-receiver');
  }

  enableInteraction(el) {
    el.classList.add('interactable');
    el.setAttribute('interact-receiver', '');
  }

  componentDidMount() {
    this.setState({ assetsReady: true });
  }

  onSceneViewMounted() {
    this.switchToScene('scene-1');
  }

  onResetTracking() {
    this.switchToScene('scene-1');
  }

  render() {
      return (
          <div>
            <a-scene
              webar-scene="key: 0318fd72-73d9-46aa-86ff-f0881d1fcd7f"
              vr-mode-ui="enabled: false"
              device-orientation-permission-ui="enabled: false"
              loading-screen="enabled: false"
              renderer="colorManagement: true;">

              <a-camera webar-camera></a-camera>

              <a-assets timeout="60000">
                <a-asset-item id="testmodel1" src="models/astronaut.glb"></a-asset-item>
                <a-asset-item id="testmodel2" src="models/MaterialsVariantsShoe.glb"></a-asset-item>
                <a-asset-item id="testmodel3" src="models/milk_bottle_1l.glb"></a-asset-item>
              </a-assets>

              <a-entity webar-stage
                gesture-control
                raycaster='objects: .gesturable, .interactable'
                cursor="fuse: false; rayOrigin: mouse;"
                emitevents="true">
                    <a-plane radius="0.25" width="1" height="1" rotation="-90 0 0"></a-plane>
                    <a-entity>
                      {
                        this.state.assetsReady && <SceneView onMounted={() => this.onSceneViewMounted()}/>
                      }
                  </a-entity>
              </a-entity>
            </a-scene>

            <UiView value="&#x21bb;" onResetTracking={ () => this.onResetTracking() }/>
          </div>
      );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SceneLoader/>);
