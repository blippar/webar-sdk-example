class GestureControl {
    constructor() {
        this.sceneElement = null;
        this.targetElement = null;
        this.controlScale = this.controlScale.bind(this);
        this.controlRotation = this.controlRotation.bind(this);
        this.processGestureEvent = this.processGestureEvent.bind(this);

        this.controlMoves = false;
        this.controlEnds = false;
        this.controlStarts = false;
        this.isGestureControlOn = false;
        this.interactionCallback = null;
        this.movesCount = 0;
    }

    initialize(rotationFactor = 5, gestureScaleMin = 0.5, gestureScaleMax = 10, interactionCallback=null) {
        this.rotationFactor = rotationFactor;
        this.gestureScaleMin = gestureScaleMin;
        this.gestureScaleMax = gestureScaleMax;
        this.interactionCallback = interactionCallback;

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

        window.AFRAME.registerComponent('interact-receiver', {
            init: function () {
                this.el.addEventListener('click', evt => {
                    if (!self.isGestureControlOn) {
                        if (self.interactionCallback) {
                            self.interactionCallback(this.el);
                        }
                    }
                });
            }
        });      
    }

    processGestureEvent(event) {
        const currentState = this.deriveGestureControl(event);

        const previousState = this.internalState.previousState;

        this.controlMoves =
            previousState &&
            currentState &&
            currentState.touchCount === previousState.touchCount;
        this.controlEnds = previousState && !this.controlMoves;
        this.controlStarts = currentState && !this.controlMoves;

        if (this.controlStarts) {
            currentState.startTime = performance.now();
    
            currentState.startPosition = currentState.position;
    
            currentState.startSpread = currentState.spread;
    
            const eventName =
            this.getControlName(currentState.touchCount) + "Start";

            this.sceneElement.emit(eventName, currentState);

            this.internalState.previousState = currentState;
            this.movesCount = 0;
        }

        if (this.controlMoves) {
            if (++this.movesCount > 2) {
                this.isGestureControlOn = true;
            }

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

        if (this.controlEnds) {
            const eventName =
            this.getControlName(previousState.touchCount) + "End";
    
            this.sceneElement.emit(eventName, previousState);
    
            this.internalState.previousState = null;
            setTimeout(() => {
                this.isGestureControlOn = false;
            },
            100);
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

        this.scaleFactor = Math.min(this.gestureScaleMax, Math.max(this.scaleFactor, this.gestureScaleMin));

        this.targetElement.object3D.scale.x = this.scaleFactor * this.initialScale.x;
        this.targetElement.object3D.scale.y = this.scaleFactor * this.initialScale.y;
        this.targetElement.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
}

export default GestureControl;
