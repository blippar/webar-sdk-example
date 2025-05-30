/**
 * ============================================
 * WEBARSDK CAMERA & PERMISSION HANDLER
 * ============================================
 * 
 * Handles camera stream setup and device permissions for the WebAR SDK
 * This module manages the complex permission flow required for mobile AR
 * 
 * WORKFLOW:
 * 1. Wait for A-Frame scene to load
 * 2. Request camera permissions (iOS requires user interaction)
 * 3. Start camera stream with optimal settings
 * 4. Request motion sensor permissions (iOS only)
 * 5. Initialize WebAR SDK with camera stream
 * 6. Hide loading screen when video starts
 * 
 * @author Blippar Development Team
 * @version 2.0.0
 */

console.log('📹 Loading WebAR camera & permission handler...');

// ============================================
// CONFIGURATION
// ============================================

const CAMERA_CONFIG = {
    // Camera constraints for optimal AR performance
    VIDEO_CONSTRAINTS: {
        facingMode: 'environment',     // Use rear camera
        advanced: [{ 
            focusMode: 'manual', 
            focusDistance: 0 
        }]
    },
    
    // Timing settings
    TIMING: {
        GYRO_CHECK_DELAY: 500,        // ms to wait before checking gyro
        SDK_RETRY_INTERVAL: 250,      // ms between SDK initialization retries
        VIDEO_TRANSITION_DELAY: 800   // ms before hiding loading screen
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let cameraStream = null;
let isSDKReady = false;
let hasGyroPermission = false;
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// DOM elements (cached for performance)
let videoElement;
let loadingScreen;
let cameraPermissionDialog;
let gyroPermissionDialog;

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the camera handler
 * Cache DOM elements and set up event listeners
 */
function initialize() {
    // Cache DOM elements
    videoElement = document.getElementById('video');
    loadingScreen = document.getElementById('loadingscreen');
    cameraPermissionDialog = document.getElementById('camperms');
    gyroPermissionDialog = document.getElementById('gyroperms');
    
    // Start gyroscope permission detection
    initializeGyroPermissions();
    
    // Wait for A-Frame scene to finish loading
    const aframeScene = document.getElementById('mainScene');
    if (aframeScene) {
        aframeScene.addEventListener('loaded', onSceneLoaded);
        console.log('📱 Waiting for A-Frame scene to load...');
    } else {
        console.warn('⚠️ A-Frame scene element not found, starting camera immediately');
        onSceneLoaded();
    }
}

/**
 * Called when A-Frame scene has finished loading
 */
function onSceneLoaded() {
    console.log('🎬 A-Frame scene loaded, starting camera setup...');
    initializeCameraPermissions();
}

// ============================================
// CAMERA PERMISSION & STREAM SETUP
// ============================================

/**
 * Initialize camera permissions based on platform
 * iOS requires user interaction before requesting camera access
 */
function initializeCameraPermissions() {
    if (isIOS) {
        console.log('🍎 iOS detected - showing camera permission prompt');
        showCameraPermissionDialog();
    } else {
        console.log('🤖 Non-iOS platform - requesting camera access directly');
        startCameraStream();
    }
}

/**
 * Show camera permission dialog for iOS users
 */
function showCameraPermissionDialog() {
    if (cameraPermissionDialog) {
        cameraPermissionDialog.classList.remove('hide');
        cameraPermissionDialog.classList.add('showflex');
        
        // Add click handler for permission button
        const permissionButton = cameraPermissionDialog.querySelector('.permsbutton');
        if (permissionButton) {
            permissionButton.addEventListener('click', onCameraPermissionGranted, { once: true });
        }
    }
}

/**
 * Handle camera permission granted by user
 */
function onCameraPermissionGranted() {
    console.log('📷 Camera permission granted by user');
    hideCameraPermissionDialog();
    startCameraStream();
}

/**
 * Hide camera permission dialog
 */
function hideCameraPermissionDialog() {
    if (cameraPermissionDialog) {
        cameraPermissionDialog.classList.remove('showflex');
        cameraPermissionDialog.classList.add('hide');
    }
}

/**
 * Start camera stream with optimal settings for AR
 */
async function startCameraStream() {
    console.log('🎥 Starting camera stream...');
    
    if (!navigator.mediaDevices?.getUserMedia) {
        console.error('❌ getUserMedia not supported in this browser');
        return;
    }
    
    try {
        // Get available video input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length > 0) {
            console.log(`📹 Found ${videoDevices.length} video device(s)`);
            
            // Use the last camera (usually rear camera on mobile)
            const selectedDevice = videoDevices[videoDevices.length - 1];
            console.log('📱 Selected camera:', selectedDevice.label || 'Unknown camera');
            
            // Add device ID to constraints if available
            if (selectedDevice.deviceId) {
                CAMERA_CONFIG.VIDEO_CONSTRAINTS.deviceId = selectedDevice.deviceId;
            }
        }
        
        // Request camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
            video: CAMERA_CONFIG.VIDEO_CONSTRAINTS
        });
        
        console.log('✅ Camera stream started successfully');
        cameraStream = stream;
        
        // Assign stream to video element
        if (videoElement) {
            videoElement.srcObject = stream;
        }
        
        // Wait a bit then check motion sensor permissions
        setTimeout(initializeMotionPermissions, CAMERA_CONFIG.TIMING.GYRO_CHECK_DELAY);
        
    } catch (error) {
        console.error('❌ Failed to start camera:', error);
        handleCameraError(error);
    }
}

/**
 * Handle camera stream errors
 */
function handleCameraError(error) {
    console.error('Camera error details:', error);
    
    // You could implement custom error handling here
    // For now, we'll just log the error
    if (error.name === 'NotAllowedError') {
        console.error('Camera permission denied');
    } else if (error.name === 'NotFoundError') {
        console.error('No camera found');
    } else if (error.name === 'NotReadableError') {
        console.error('Camera is in use by another application');
    }
}

// ============================================
// MOTION SENSOR PERMISSIONS (iOS)
// ============================================

/**
 * Initialize gyroscope permission detection
 */
function initializeGyroPermissions() {
    if (isIOS) {
        // On iOS, listen for device orientation events
        window.addEventListener('deviceorientation', onGyroPermissionReceived, { once: true });
    } else {
        // On other platforms, listen for device motion events
        window.addEventListener('devicemotion', onMotionReceived);
    }
}

/**
 * Initialize motion sensor permissions after camera is ready
 */
function initializeMotionPermissions() {
    console.log('🧭 Checking motion sensor permissions...');
    
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        // iOS 13+ requires explicit permission
        console.log('📱 iOS 13+ detected - showing motion permission prompt');
        showMotionPermissionDialog();
    } else {
        // Check if we already have motion data
        if (hasGyroPermission) {
            console.log('✅ Motion sensors already available');
            hideMotionPermissionDialog();
            initializeSDK();
        } else {
            console.log('⏳ Waiting for motion sensor data...');
            // Will be handled by event listeners set up in initializeGyroPermissions()
        }
    }
}

/**
 * Show motion permission dialog for iOS users
 */
function showMotionPermissionDialog() {
    if (gyroPermissionDialog) {
        gyroPermissionDialog.classList.remove('hide');
        gyroPermissionDialog.classList.add('showflex');
        
        // Add click handler for permission button
        const permissionButton = gyroPermissionDialog.querySelector('.permsbutton');
        if (permissionButton) {
            permissionButton.addEventListener('click', onMotionPermissionRequested, { once: true });
        }
    }
}

/**
 * Handle motion permission request by user
 */
async function onMotionPermissionRequested() {
    console.log('🧭 Motion permission requested by user');
    
    try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
            console.log('✅ Motion permission granted');
            hasGyroPermission = true;
            hideMotionPermissionDialog();
            initializeSDK();
        } else {
            console.warn('⚠️ Motion permission denied');
            hideMotionPermissionDialog();
            // Continue without motion sensors
            initializeSDK();
        }
    } catch (error) {
        console.error('❌ Failed to request motion permission:', error);
        hideMotionPermissionDialog();
        initializeSDK();
    }
}

/**
 * Hide motion permission dialog
 */
function hideMotionPermissionDialog() {
    if (gyroPermissionDialog) {
        gyroPermissionDialog.classList.remove('showflex');
        gyroPermissionDialog.classList.add('hide');
    }
}

/**
 * Handle gyroscope permission received (iOS)
 */
function onGyroPermissionReceived() {
    console.log('🧭 Gyroscope permission detected');
    hasGyroPermission = true;
    window.removeEventListener('deviceorientation', onGyroPermissionReceived);
    
    // If camera is ready, initialize SDK
    if (cameraStream) {
        initializeSDK();
    }
}

/**
 * Handle device motion received (non-iOS)
 */
function onMotionReceived(event) {
    if (event.rotationRate?.alpha || event.rotationRate?.beta || event.rotationRate?.gamma) {
        console.log('🧭 Motion sensor data received');
        hasGyroPermission = true;
        window.removeEventListener('devicemotion', onMotionReceived);
        
        // If camera is ready, initialize SDK
        if (cameraStream) {
            initializeSDK();
        }
    }
}

// ============================================
// WEBARSDK INITIALIZATION
// ============================================

/**
 * Initialize the WebAR SDK with camera stream
 */
function initializeSDK() {
    console.log('🚀 Initializing WebAR SDK...');
    
    if (isSDKReady && cameraStream) {
        console.log('✅ SDK ready and camera available - starting AR');
        setCameraStreamOnSDK();
    } else if (isSDKReady) {
        console.log('⏳ SDK ready but waiting for camera...');
    } else if (cameraStream) {
        console.log('⏳ Camera ready but waiting for SDK...');
        // Keep trying until SDK is ready
        retrySDKInitialization();
    } else {
        console.log('⏳ Waiting for both SDK and camera...');
    }
}

/**
 * Retry SDK initialization until it's ready
 */
function retrySDKInitialization() {
    const retryInterval = setInterval(() => {
        if (isSDKReady) {
            clearInterval(retryInterval);
            initializeSDK();
        }
    }, CAMERA_CONFIG.TIMING.SDK_RETRY_INTERVAL);
}

/**
 * Set camera stream on the SDK
 */
function setCameraStreamOnSDK() {
    console.log('📹 Setting camera stream on WebAR SDK...');
    
    try {
        WEBARSDK.SetCameraStream(cameraStream);
        console.log('✅ Camera stream successfully set on SDK');
    } catch (error) {
        console.error('❌ Failed to set camera stream on SDK:', error);
    }
}

// ============================================
// SDK EVENT HANDLERS
// ============================================

/**
 * Called when WebAR SDK is ready
 */
WEBARSDK.SetAppReadyCallback(() => {
    console.log('🎯 WebAR SDK is ready!');
    isSDKReady = true;
    
    // If camera is already available, initialize
    if (cameraStream) {
        initializeSDK();
    }
});

/**
 * Called when SDK video has started
 */
WEBARSDK.SetVideoStartedCallback(() => {
    console.log('🎥 WebAR video started - transitioning from loading screen');
    
    // Stop any fallback progress animation
    if (typeof stopFallbackProgress === 'function') {
        stopFallbackProgress();
    }
    
    // Hide loading screen with smooth transition
    setTimeout(() => {
        hideLoadingScreenWithTransition();
        removeOriginalVideoElement();
        setupDemoInteractions();
    }, CAMERA_CONFIG.TIMING.VIDEO_TRANSITION_DELAY);
});

// ============================================
// UI TRANSITION HANDLERS
// ============================================

/**
 * Hide loading screen with smooth fade transition
 */
function hideLoadingScreenWithTransition() {
    if (loadingScreen) {
        console.log('🎭 Hiding loading screen with fade transition');
        
        // Add fade out effect
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        loadingScreen.style.opacity = '0';
        
        // Remove from view after animation
        setTimeout(() => {
            loadingScreen.classList.remove('showflex');
            loadingScreen.classList.add('hide');
        }, 500);
    }
}

/**
 * Remove the original video element as SDK now handles video
 */
function removeOriginalVideoElement() {
    if (videoElement && videoElement.parentElement) {
        console.log('🗑️ Removing original video element');
        videoElement.parentElement.removeChild(videoElement);
    }
}

/**
 * Setup demo interactions for the AR objects
 */
function setupDemoInteractions() {
    // Add click interaction to the demo sphere
    const sphereElement = document.getElementById('spheremod');
    if (sphereElement) {
        sphereElement.addEventListener('click', toggleSphereColor);
        console.log('🎮 Demo interactions enabled - click the red sphere to change its color');
    }
}

// ============================================
// DEMO INTERACTION HANDLERS
// ============================================

let currentSphereColor = '#EF2D5E'; // Initial red color

/**
 * Toggle sphere color for demo purposes
 */
function toggleSphereColor() {
    console.log('🎨 Sphere clicked - changing color');
    
    // Toggle between red and green
    currentSphereColor = currentSphereColor === '#EF2D5E' ? '#00FF00' : '#EF2D5E';
    
    const sphereElement = document.getElementById('spheremod');
    if (sphereElement) {
        sphereElement.setAttribute('material', `color: ${currentSphereColor}`);
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Start the initialization process when script loads
initialize();

console.log('✅ WebAR camera & permission handler loaded');