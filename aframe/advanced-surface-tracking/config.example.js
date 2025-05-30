/**
 * ============================================
 * ADVANCED SURFACE TRACKING INTEGRATION CONFIG
 * ============================================
 * 
 * Configuration file for the Advanced Surface Tracking Integration
 * 
 * This file centralizes all customization options for your advanced surface tracking
 * implementation, making it easy to modify branding, behaviors, and SDK settings
 * without touching the core implementation files.
 * 
 * USAGE:
 * 1. Copy this file and rename it to 'config.js'
 * 2. Modify the values below to match your requirements
 * 3. Include it in your HTML: <script src="config.js"></script>
 * 4. Load it BEFORE the other WebAR scripts
 * 
 * @author Blippar Development Team
 * @version 2.0.0
 * @focus Advanced Surface Tracking
 */

// ============================================
// BASIC CONFIGURATION
// ============================================

const ADVANCED_INTEGRATION_CONFIG = {
    // Your Blippar license key (required)
    LICENSE_KEY: 'YOUR_LICENSE_KEY_HERE',
    
    // Path to your WebAR SDK file
    SDK_PATH: 'path/to/your/webar-sdk.js',
    
    // App branding
    BRANDING: {
        APP_NAME: 'WebAR SDK',
        SUBTITLE: 'Advanced Integration',
        LOGO_URL: 'https://yoursite.com/logo.png'
    },
    
    // SDK settings
    SDK_SETTINGS: {
        WEBAR_MODE: 'surface-tracking',     // 'surface-tracking' or 'marker-tracking'
        AUTO_INIT: true,                    // Auto-initialize SDK
        AUTO_START_TRACKING: true,          // Auto-start tracking
        MINIMAL_UI: true,                   // Use minimal UI
        EXTERNAL_CAMERA_STREAM: true,       // Handle camera externally
        RENDER_SCENE_ON_DESKTOP: false,     // Show AR on desktop
        DEBUG_MODE: true                    // Enable debug logging
    },
    
    // Camera settings
    CAMERA_SETTINGS: {
        FACING_MODE: 'environment',         // 'user' for front camera, 'environment' for rear
        FOCUS_MODE: 'manual',               // Camera focus mode
        FOCUS_DISTANCE: 0                   // Focus distance (0 = infinity)
    },
    
    // UI customization
    UI_SETTINGS: {
        SHOW_PROGRESS_DATA: true,           // Show raw SDK progress data
        VERBOSE_LOGGING: true,              // Enable detailed console logs
        FADE_DURATION: 500,                 // Loading screen fade duration (ms)
        PERMISSION_TIMEOUT: 30000           // Permission request timeout (ms)
    }
};

// ============================================
// PERMISSION MESSAGES
// ============================================

const PERMISSION_MESSAGES = {
    CAMERA: {
        TITLE: '📷 Camera Access Required',
        MESSAGE: 'We need access to your camera for this AR experience to work.',
        BUTTON_TEXT: 'Grant Access'
    },
    
    MOTION: {
        TITLE: '📱 Motion Sensors Required',
        MESSAGE: 'We need access to motion sensors for AR tracking to work properly.',
        BUTTON_TEXT: 'Grant Access'
    }
};

// ============================================
// ERROR MESSAGES
// ============================================

const ERROR_MESSAGES = {
    CAMERA_DENIED: {
        TITLE: 'Camera Permission Denied',
        MESSAGE: 'Camera access is required for AR to work. Please refresh and allow camera access.',
        INSTRUCTION: 'Refresh the page and click "Allow" when prompted for camera access.'
    },
    
    NO_CAMERA: {
        TITLE: 'No Camera Found',
        MESSAGE: 'No camera was detected on your device.',
        INSTRUCTION: 'Please ensure your device has a working camera and try again.'
    },
    
    CAMERA_IN_USE: {
        TITLE: 'Camera Unavailable',
        MESSAGE: 'Your camera is being used by another application.',
        INSTRUCTION: 'Close other apps that might be using the camera and refresh the page.'
    }
};

// ============================================
// 3D CONTENT CONFIGURATION
// ============================================

const CONTENT_CONFIG = {
    // Demo objects (replace with your own)
    DEMO_OBJECTS: [
        {
            type: 'box',
            position: '-1 0.5 1',
            rotation: '0 45 0',
            color: '#4CC3D9',
            interactive: false
        },
        {
            type: 'sphere',
            id: 'interactive-sphere',
            position: '0 1.25 -1',
            radius: '1.25',
            color: '#EF2D5E',
            interactive: true
        },
        {
            type: 'cylinder',
            position: '1 0.75 1',
            radius: '0.5',
            height: '1.5',
            color: '#FFC65D',
            interactive: false
        }
    ],
    
    // 3D Models (GLTF/GLB files)
    MODELS: [
        {
            id: 'my-model',
            src: 'models/my-model.glb',
            position: '0 0 0',
            scale: '1 1 1',
            rotation: '0 0 0',
            interactive: true
        }
    ],
    
    // Lighting setup
    LIGHTING: {
        AMBIENT: {
            color: '#EEE',
            intensity: 2.1
        },
        DIRECTIONAL: {
            color: '#FFF',
            intensity: 3.14,
            position: '-0.5 1 1',
            castShadow: false
        }
    }
};

// ============================================
// BRANDING & UI CUSTOMIZATION
// ============================================

const SURFACE_TRACKING_CONFIG = {
    // Application Branding
    APP: {
        NAME: 'WebAR SDK',
        SUBTITLE: 'Advanced Surface Tracking',
        DESCRIPTION: 'Professional surface tracking implementation with advanced SDK features',
        VERSION: '2.0.0'
    },
};

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// To use this configuration in your HTML:

1. Include this file in your HTML:
   <script src="config.js"></script>

2. Update the SDK script tag:
   <script src="${ADVANCED_INTEGRATION_CONFIG.SDK_PATH}"
       webar-mode="${ADVANCED_INTEGRATION_CONFIG.SDK_SETTINGS.WEBAR_MODE}"
       auto-init="${ADVANCED_INTEGRATION_CONFIG.SDK_SETTINGS.AUTO_INIT}"
       debug-mode="${ADVANCED_INTEGRATION_CONFIG.SDK_SETTINGS.DEBUG_MODE}">
   </script>

3. Update the scene license key:
   <a-scene webar-scene="key: ${ADVANCED_INTEGRATION_CONFIG.LICENSE_KEY}">

4. Use the branding config in custom-handlers.js:
   const CONFIG = {
       SPLASH: {
           LOGO_URL: ADVANCED_INTEGRATION_CONFIG.BRANDING.LOGO_URL,
           APP_NAME: ADVANCED_INTEGRATION_CONFIG.BRANDING.APP_NAME,
           SUBTITLE: ADVANCED_INTEGRATION_CONFIG.BRANDING.SUBTITLE
       }
   };
*/

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ADVANCED_INTEGRATION_CONFIG,
        PERMISSION_MESSAGES,
        ERROR_MESSAGES,
        CONTENT_CONFIG
    };
} 