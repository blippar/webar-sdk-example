class GestureControl {
    constructor() {
        this.sceneElement = null;
        this.targetElement = null;
        this.controlScale = this.controlScale.bind(this);
        this.controlRotation = this.controlRotation.bind(this);
        this.processGestureEvent = this.processGestureEvent.bind(this);
    }

    initialize(rotationFactor = 5, minScale = 0.5, maxScale = 10) {
        this.rotationFactor = rotationFactor;
        this.minScale = minScale;
        this.maxScale = maxScale;

        var self = this;

        window.AFRAME.registerComponent("gesture-control", {
            init: function() {
                self.sceneElement = this.el.sceneEl;

                self.internalState = {
                    previousState: null
                };

                self.sceneElement.addEventListener("touchstart", self.processGestureEvent);
                self.sceneElement.addEventListener("touchend", self.processGestureEvent);
                self.sceneElement.addEventListener("touchmove", self.processGestureEvent);
            },
            remove: function() {
                self.sceneElement.removeEventListener("touchstart", self.processGestureEvent);
                self.sceneElement.removeEventListener("touchend", self.processGestureEvent);
                self.sceneElement.removeEventListener("touchmove", self.processGestureEvent);
            },

        });

        window.AFRAME.registerComponent("gesture-receiver", {
            init: function () {
              self.sceneElement = this.el.sceneEl;
              self.targetElement = this.el;

              self.initialScale = this.el.object3D.scale.clone();
              self.scaleFactor = 1;

              self.sceneElement.addEventListener("rotateControlMove", self.controlRotation);
              self.sceneElement.addEventListener("zoomControlMove", self.controlScale);
            },

            remove: function () {
                self.sceneElement.removeEventListener("rotateControlMove", self.controlRotation);
                self.sceneElement.removeEventListener("zoomControlMove", self.controlScale);
            }
          });
    }

    processGestureEvent(event) {
        const currentState = this.deriveGestureControl(event);

        const previousState = this.internalState.previousState;

        const controlMoves =
            previousState &&
            currentState &&
            currentState.touchCount === previousState.touchCount;

        const controlEnds = previousState && !controlMoves;

        const controlStarts = currentState && !controlMoves;

        if (controlStarts) {
            currentState.startTime = performance.now();
    
            currentState.startPosition = currentState.position;
    
            currentState.startSpread = currentState.spread;
    
            const eventName =
            this.getControlName(currentState.touchCount) + "Start";

            this.sceneElement.emit(eventName, currentState);

            this.internalState.previousState = currentState;
        }
    
        if (controlMoves) {
            const eventDetail = {
                positionChange: {
                    x: currentState.position.x - previousState.position.x,
        
                    y: currentState.position.y - previousState.position.y
                }
            };
    
            if (currentState.spread) {
                eventDetail.spreadChange = currentState.spread - previousState.spread;
            }
    
            Object.assign(previousState, currentState);
    
            Object.assign(eventDetail, previousState);
    
            const eventName =
                this.getControlName(currentState.touchCount) + "Move";

            this.sceneElement.emit(eventName, eventDetail);
        }

        if (controlEnds) {
            const eventName =
            this.getControlName(previousState.touchCount) + "End";
    
            this.sceneElement.emit(eventName, previousState);
    
            this.internalState.previousState = null;
        }
    }

    deriveGestureControl(evt) {
        if (evt.touches.length === 0) {
            return null;
        }
    
        const touchList = [];
    
        for (let i = 0; i < evt.touches.length; i++) {
            touchList.push(evt.touches[i]);
        }

        const touchState = {
            touchCount: touchList.length
        };

        const centerPositionRawX =
            touchList.reduce((sum, touch) => sum + touch.clientX, 0) /
            touchList.length;
    
        const centerPositionRawY =
            touchList.reduce((sum, touch) => sum + touch.clientY, 0) /
            touchList.length;
    
        touchState.positionRaw = { x: centerPositionRawX, y: centerPositionRawY };
    
        const screenScale = 2 / (window.innerWidth + window.innerHeight);
    
        touchState.position = {
            x: centerPositionRawX * screenScale,
            y: centerPositionRawY * screenScale
        };
    
        if (touchList.length >= 2) {
            const spread =
            touchList.reduce((sum, touch) => {
                return (
                sum +
                Math.sqrt(
                    Math.pow(centerPositionRawX - touch.clientX, 2) +
                    Math.pow(centerPositionRawY - touch.clientY, 2)
                )
                );
            }, 0) / touchList.length;
    
            touchState.spread = spread * screenScale;
        }

        return touchState;
    }

    getControlName(touchCount) {
        const numberNames = ["rotateControl", "zoomControl"];

        return numberNames[Math.min(touchCount, 2) - 1];
    }

    controlRotation(evt) {
        this.targetElement.object3D.rotation.y +=
            evt.detail.positionChange.x * this.rotationFactor;
    }

    controlScale(evt) {
        this.scaleFactor *=
        1 + evt.detail.spreadChange / evt.detail.startSpread;

        this.scaleFactor = Math.min(this.maxScale, Math.max(this.scaleFactor, this.minScale));

        this.targetElement.object3D.scale.x = this.scaleFactor * this.initialScale.x;
        this.targetElement.object3D.scale.y = this.scaleFactor * this.initialScale.y;
        this.targetElement.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
}

export default GestureControl;
