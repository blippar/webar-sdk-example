/**
 * ============================================
 * WEBARSDK CUSTOM HANDLERS
 * ============================================
 * 
 * Custom progress and error handlers for the WebAR SDK
 * This file provides enhanced UI and debugging capabilities
 * 
 * IMPORTANT: Load this file BEFORE the WebAR SDK to ensure
 * the callback functions are available when the SDK initializes
 * 
 * Features:
 * - Beautiful custom splash screen with real-time progress
 * - Detailed error handling with user-friendly messages
 * - Developer debugging tools and console logging
 * - Smooth animations and transitions
 * - Mobile-responsive design
 * 
 * @author Blippar Development Team
 * @version 2.0.0
 */

console.log('🔧 Loading WebAR SDK custom handlers...');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Splash screen settings
    SPLASH: {
        LOGO_URL: 'https://webar-static.blippar.com/common/blippar_logo.png',
        APP_NAME: 'WebAR SDK',
        SUBTITLE: 'Advanced Surface Tracking',
        FADE_DURATION: 500 // milliseconds
    },
    
    // Progress simulation settings (used when SDK doesn't provide data)
    FALLBACK: {
        UPDATE_INTERVAL: 200, // milliseconds
        PROGRESS_SPEEDS: {
            EARLY: 5,    // 0-20%
            MIDDLE: 3,   // 20-50%
            LATE: 2,     // 50-80%
            FINAL: 1     // 80-95%
        }
    },
    
    // Debug settings
    DEBUG: {
        VERBOSE_LOGGING: true,
        SHOW_RAW_DATA: true
    }
};

// ============================================
// GLOBAL STATE
// ============================================

let fallbackProgressInterval = null;
let currentFallbackProgress = 0;
let isUsingRealSDKData = false;

// ============================================
// CUSTOM PROGRESS HANDLER
// ============================================

/**
 * Handles progress updates from the WebAR SDK
 * Displays real-time loading progress with detailed information
 * 
 * @param {Object} progress - Progress data from SDK
 * @param {number} progress.percentage - Loading percentage (0-100)
 * @param {number} progress.current - Current step number
 * @param {number} progress.total - Total number of steps
 * @param {Object} progress.debug - Debug information
 */
function customProgressHandler(progress) {
    if (CONFIG.DEBUG.VERBOSE_LOGGING) {
        console.log('🔄 WebAR SDK Progress Update:', progress);
        console.group('📊 Progress Analysis');
        console.log('Percentage:', progress?.percentage);
        console.log('Current step:', progress?.current);
        console.log('Total steps:', progress?.total);
        console.log('Debug info:', progress?.debug);
        console.groupEnd();
    }
    
    // Initialize splash screen if not already done
    initializeSplashScreen();
    
    // Check if we have meaningful progress data from SDK
    const hasValidData = progress && (
        (typeof progress.percentage === 'number' && progress.percentage > 0) ||
        (typeof progress.current === 'number' && typeof progress.total === 'number' && progress.total > 0) ||
        (progress.debug && typeof progress.debug === 'object')
    );
    
    if (hasValidData) {
        // We have real SDK data - use it!
        handleRealSDKProgress(progress);
    } else {
        // No useful data - continue with fallback simulation
        handleFallbackProgress(progress);
    }
}

/**
 * Handles real progress data from the SDK
 */
function handleRealSDKProgress(progress) {
    if (!isUsingRealSDKData) {
        console.log('🎯 Switching to real SDK progress data');
        stopFallbackProgress();
        isUsingRealSDKData = true;
    }
    
    const percentage = progress.percentage || 0;
    const current = progress.current || 0;
    const total = progress.total || 0;
    
    updateProgressUI({
        percentage: percentage,
        mainText: `Loading SDK: ${Math.round(percentage)}%`,
        detailText: total > 0 ? `Components: ${current} of ${total}` : 'Loading components...',
        debugText: getLoadingStageText(percentage),
        rawData: {
            percentage: percentage,
            current: current,
            total: total,
            debug: progress.debug
        }
    });
}

/**
 * Handles fallback progress when SDK data is not available
 */
function handleFallbackProgress(progress) {
    if (CONFIG.DEBUG.VERBOSE_LOGGING) {
        console.log('⚠️ Using fallback progress simulation - no useful SDK data received');
    }
    
    // Start fallback simulation if not already running
    if (!fallbackProgressInterval && !isUsingRealSDKData) {
        startFallbackProgress();
    }
    
    // Update raw data display with received data (even if not useful)
    const rawDataDiv = document.getElementById('splashRawData');
    if (rawDataDiv && CONFIG.DEBUG.SHOW_RAW_DATA) {
        rawDataDiv.textContent = `Fallback mode - SDK data: ${JSON.stringify(progress || 'null', null, 2)}`;
    }
}

// ============================================
// CUSTOM ERROR HANDLER
// ============================================

/**
 * Handles errors from the WebAR SDK
 * Displays user-friendly error messages with appropriate styling
 * 
 * @param {Object} error - Error object from SDK
 * @param {string} error.code - Error code
 * @param {string} error.message - Technical error message
 * @param {string} error.description - User-friendly description
 * @param {string} error.instruction - Instructions for user
 * @param {string} error.browser - Browser information
 */
function customErrorHandler(error) {
    console.error('🚨 WebAR SDK Error:', error);
    
    // Show error UI
    displayErrorDialog(error);
    
    // Log detailed error information
    if (CONFIG.DEBUG.VERBOSE_LOGGING) {
        console.group('🔍 Error Details');
        console.log('Code:', error.code);
        console.log('Message:', error.message);
        console.log('Description:', error.description);
        console.log('Instructions:', error.instruction);
        console.log('Browser:', error.browser);
        console.groupEnd();
    }
}

// ============================================
// UI MANAGEMENT FUNCTIONS
// ============================================

/**
 * Initializes the custom splash screen
 */
function initializeSplashScreen() {
    const loadingScreen = document.getElementById('loadingscreen');
    
    if (loadingScreen && !loadingScreen.querySelector('.custom-splash-content')) {
        loadingScreen.innerHTML = createSplashHTML();
        console.log('🎨 Custom splash screen initialized');
        
        // Start fallback progress as initial state
        if (!isUsingRealSDKData) {
            startFallbackProgress();
        }
    }
}

/**
 * Creates the HTML for the custom splash screen
 */
function createSplashHTML() {
    return `
        <div class="custom-splash-content">
            <div class="custom-splash-logo">
                <img src="${CONFIG.SPLASH.LOGO_URL}" alt="Logo" class="blippar-logo">
                <div class="logo-text">${CONFIG.SPLASH.APP_NAME}</div>
            </div>
            <div class="custom-splash-subtitle">${CONFIG.SPLASH.SUBTITLE}</div>
            <div class="custom-splash-progress-container">
                <div class="custom-splash-progress-bar" id="splashProgressBar"></div>
            </div>
            <div class="custom-splash-text" id="splashProgressText">Initializing WebAR...</div>
            <div class="custom-splash-details" id="splashProgressDetails">Preparing SDK...</div>
            <div class="custom-splash-debug" id="splashProgressDebug">Starting up...</div>
            ${CONFIG.DEBUG.SHOW_RAW_DATA ? '<div class="custom-splash-raw-data" id="splashRawData">Waiting for progress data...</div>' : ''}
        </div>
    `;
}

/**
 * Updates the progress UI with given data
 */
function updateProgressUI(data) {
    const elements = {
        progressBar: document.getElementById('splashProgressBar'),
        progressText: document.getElementById('splashProgressText'),
        progressDetails: document.getElementById('splashProgressDetails'),
        progressDebug: document.getElementById('splashProgressDebug'),
        rawData: document.getElementById('splashRawData')
    };
    
    if (elements.progressBar) {
        elements.progressBar.style.width = `${Math.round(data.percentage)}%`;
    }
    
    if (elements.progressText) {
        elements.progressText.textContent = data.mainText;
    }
    
    if (elements.progressDetails) {
        elements.progressDetails.textContent = data.detailText;
    }
    
    if (elements.progressDebug) {
        elements.progressDebug.textContent = data.debugText;
    }
    
    if (elements.rawData && CONFIG.DEBUG.SHOW_RAW_DATA) {
        elements.rawData.textContent = `Real SDK Data: ${JSON.stringify(data.rawData, null, 2)}`;
    }
}

/**
 * Displays error dialog with appropriate styling
 */
function displayErrorDialog(error) {
    const errorDiv = document.getElementById('customError');
    if (!errorDiv) return;
    
    const errorInfo = getErrorDisplayInfo(error);
    
    // Update error dialog content
    updateElement('errorTitle', errorInfo.title);
    updateElement('errorMessage', errorInfo.message);
    updateElement('errorInstruction', errorInfo.instruction, errorInfo.instruction ? 'block' : 'none');
    updateElement('errorDetails', `Error Code: ${error.code} | Browser: ${error.browser || 'Unknown'}`);
    
    // Show error dialog
    errorDiv.style.display = 'flex';
}

/**
 * Gets display information for different error types
 */
function getErrorDisplayInfo(error) {
    const errorMappings = {
        'ERR_FACEBOOK_BROWSER': {
            title: 'Unsupported Browser - Facebook',
            message: 'Facebook\'s in-app browser doesn\'t support WebAR. Please open this link in Safari or Chrome.',
            instruction: 'Tap the menu button (•••) and select "Open in Safari" or "Open in Chrome"'
        },
        'ERR_INSTAGRAM_BROWSER': {
            title: 'Unsupported Browser - Instagram', 
            message: 'Instagram\'s in-app browser doesn\'t support WebAR. Please open this link in Safari or Chrome.',
            instruction: 'Tap the menu button (•••) and select "Open in Safari" or "Open in Chrome"'
        },
        'ERR_WEBRTC_NOT_SUPPORTED': {
            title: 'Browser Not Supported',
            message: 'Your browser doesn\'t support the required WebRTC features for AR.',
            instruction: 'Please try using Chrome, Safari, or another modern browser'
        },
        'ERR_CAMERA_PERMISSION_DENIED': {
            title: 'Camera Permission Required',
            message: 'Camera access is required for the AR experience to work.',
            instruction: 'Please refresh the page and allow camera access when prompted'
        },
        'ERR_LANDSCAPE_MODE': {
            title: 'Please Rotate Device',
            message: 'Please rotate your device to portrait mode for the best AR experience.',
            instruction: 'Hold your device vertically'
        }
    };
    
    return errorMappings[error.code] || {
        title: 'WebAR Error',
        message: error.description || error.message || 'An unexpected error occurred',
        instruction: error.instruction || ''
    };
}

// ============================================
// FALLBACK PROGRESS SIMULATION
// ============================================

/**
 * Starts fallback progress simulation when SDK data is not available
 */
function startFallbackProgress() {
    if (fallbackProgressInterval) return;
    
    console.log('🔄 Starting fallback progress simulation');
    currentFallbackProgress = 0;
    
    fallbackProgressInterval = setInterval(() => {
        // Calculate progress increment based on current stage
        let increment;
        if (currentFallbackProgress < 20) {
            increment = Math.random() * CONFIG.FALLBACK.PROGRESS_SPEEDS.EARLY;
        } else if (currentFallbackProgress < 50) {
            increment = Math.random() * CONFIG.FALLBACK.PROGRESS_SPEEDS.MIDDLE;
        } else if (currentFallbackProgress < 80) {
            increment = Math.random() * CONFIG.FALLBACK.PROGRESS_SPEEDS.LATE;
        } else if (currentFallbackProgress < 98) {
            increment = Math.random() * CONFIG.FALLBACK.PROGRESS_SPEEDS.FINAL;
        } else {
            // Complete the progress
            currentFallbackProgress = 100;
            clearInterval(fallbackProgressInterval);
            fallbackProgressInterval = null;
            console.log('✅ Fallback progress completed - waiting for video callback');
            
            // Start backup timer to hide loading screen if video callback doesn't fire
            startLoadingScreenBackupTimer();
        }
        
        currentFallbackProgress = Math.min(currentFallbackProgress + increment, 100);
        
        // Update UI with simulated progress
        updateProgressUI({
            percentage: currentFallbackProgress,
            mainText: `Loading SDK: ${Math.round(currentFallbackProgress)}%`,
            detailText: getFallbackDetailText(currentFallbackProgress),
            debugText: getLoadingStageText(currentFallbackProgress),
            rawData: { simulated: true, percentage: currentFallbackProgress }
        });
        
    }, CONFIG.FALLBACK.UPDATE_INTERVAL);
}

/**
 * Stops fallback progress simulation
 */
function stopFallbackProgress() {
    if (fallbackProgressInterval) {
        console.log('🛑 Stopping fallback progress - real SDK data available');
        clearInterval(fallbackProgressInterval);
        fallbackProgressInterval = null;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Gets appropriate loading stage text based on percentage
 */
function getLoadingStageText(percentage) {
    if (percentage < 25) return 'Initializing SDK components';
    if (percentage < 50) return 'Loading AR engine';
    if (percentage < 75) return 'Setting up tracking system';
    if (percentage < 100) return 'Finalizing initialization';
    return 'SDK ready - preparing camera';
}

/**
 * Gets fallback detail text based on progress
 */
function getFallbackDetailText(percentage) {
    if (percentage < 25) return 'Fetching resources';
    if (percentage < 50) return 'Setting up tracking';
    if (percentage < 75) return 'Configuring video input';
    if (percentage < 95) return 'Almost ready';
    if (percentage >= 100) return 'Ready - starting camera';
    return 'Ready to start';
}

/**
 * Backup function to hide loading screen if video callback doesn't fire
 */
function startLoadingScreenBackupTimer() {
    // Give the SDK 3 seconds after progress completes to call video callback
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingscreen');
        if (loadingScreen && !loadingScreen.classList.contains('hide')) {
            console.log('⚠️ Video callback timeout - hiding loading screen as backup');
            hideLoadingScreenWithTransition();
        }
    }, 3000);
}

/**
 * Hide loading screen with smooth fade transition
 */
function hideLoadingScreenWithTransition() {
    const loadingScreen = document.getElementById('loadingscreen');
    if (loadingScreen) {
        console.log('🎭 Hiding loading screen with fade transition');
        
        // Add fade out effect
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        loadingScreen.style.opacity = '0';
        
        // Remove from view after animation
        setTimeout(() => {
            loadingScreen.classList.remove('showflex');
            loadingScreen.classList.add('hide');
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

/**
 * Updates element content and display style
 */
function updateElement(id, content, display = null) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
        if (display !== null) {
            element.style.display = display;
        }
    }
}

/**
 * Hides the custom error dialog
 */
function hideCustomError() {
    const errorDiv = document.getElementById('customError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// ============================================
// UI INITIALIZATION
// ============================================

/**
 * Creates custom UI elements and styles
 */
function createCustomUIElements() {
    createErrorDialog();
    createCustomStyles();
}

/**
 * Creates the error dialog HTML
 */
function createErrorDialog() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'customError';
    errorDiv.className = 'custom-error-overlay';
    errorDiv.innerHTML = `
        <div class="custom-error-container">
            <div class="custom-error-icon">⚠️</div>
            <h2 id="errorTitle" class="custom-error-title">Error</h2>
            <p id="errorMessage" class="custom-error-message"></p>
            <p id="errorInstruction" class="custom-error-instruction"></p>
            <div id="errorDetails" class="custom-error-details"></div>
            <button onclick="hideCustomError()" class="custom-error-button">Dismiss</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

/**
 * Creates custom CSS styles
 */
function createCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* ============================================ */
        /* CUSTOM SPLASH SCREEN STYLES                */
        /* ============================================ */
        
        .custom-splash-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 15px;
            box-sizing: border-box;
            background: linear-gradient(135deg, #fca711 0%, #f18f01 100%);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        
        .custom-splash-logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-bottom: 15px;
        }
        
        .blippar-logo {
            height: 120px;
            width: auto;
            filter: brightness(0) invert(1);
            drop-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        
        .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            letter-spacing: -0.5px;
        }
        
        .custom-splash-subtitle {
            font-size: 16px;
            margin-bottom: 30px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
        }
        
        .custom-splash-progress-container {
            width: 80%;
            max-width: 320px;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .custom-splash-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            width: 0%;
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 4px;
            box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);
        }
        
        .custom-splash-text {
            font-size: 20px;
            margin-bottom: 12px;
            font-weight: 600;
            letter-spacing: -0.3px;
        }
        
        .custom-splash-details {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 12px;
            font-weight: 400;
        }
        
        .custom-splash-debug {
            font-size: 12px;
            color: #ffeb3b;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            margin-bottom: 20px;
            max-width: 90%;
            word-wrap: break-word;
            font-weight: 500;
        }
        
        .custom-splash-raw-data {
            font-size: 10px;
            color: #ccc;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 6px;
            max-width: 90%;
            max-height: 120px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            border: 1px solid rgba(255, 255, 255, 0.1);
            line-height: 1.3;
        }
        
        /* ============================================ */
        /* CUSTOM ERROR DIALOG STYLES                 */
        /* ============================================ */
        
        .custom-error-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .custom-error-container {
            text-align: center;
            max-width: 420px;
            width: 100%;
            padding: 40px 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .custom-error-icon {
            font-size: 56px;
            margin-bottom: 24px;
        }
        
        .custom-error-title {
            font-size: 24px;
            margin-bottom: 16px;
            color: #ff6b6b;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .custom-error-message {
            font-size: 16px;
            margin-bottom: 16px;
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .custom-error-instruction {
            font-size: 14px;
            margin-bottom: 24px;
            color: #ffeb3b;
            line-height: 1.4;
            font-weight: 500;
        }
        
        .custom-error-details {
            font-size: 12px;
            color: #ccc;
            margin-bottom: 24px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            padding: 8px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
        }
        
        .custom-error-button {
            background: #2196F3;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            letter-spacing: -0.3px;
        }
        
        .custom-error-button:hover {
            background: #1976D2;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }
        
        /* ============================================ */
        /* RESPONSIVE DESIGN                          */
        /* ============================================ */
        
        @media (max-width: 480px) {
            .custom-splash-content {
                padding: 15px;
            }
            
            .logo-text {
                font-size: 24px;
            }
            
            .custom-splash-text {
                font-size: 18px;
            }
            
            .custom-error-container {
                padding: 30px 20px;
            }
            
            .custom-error-title {
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// GLOBAL FUNCTION REGISTRATION
// ============================================

// Make functions globally available for the SDK
window.customProgressCallback = customProgressHandler;
window.customErrorCallback = customErrorHandler;
window.hideCustomError = hideCustomError;

// Additional functions for external use
window.stopFallbackProgress = stopFallbackProgress;

// ============================================
// INITIALIZATION
// ============================================

// Initialize UI when DOM is ready
function initializeWhenReady() {
    createCustomUIElements();
    initializeSplashScreen();
    console.log('✅ Custom WebAR handlers loaded and ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
} else {
    initializeWhenReady();
} 