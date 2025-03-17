/**
 * Mobile Controls for Super Mario Bros
 * This file handles touch input for mobile devices
 */

(function() {
  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Force mobile controls for testing (remove in production)
  const forceMobile = true;
  
  // Only initialize mobile controls if on a mobile device or forced
  if (!isMobile && !forceMobile) return;
  
  // Force landscape orientation if possible
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(function(error) {
      console.log('Orientation lock failed: ' + error);
    });
  }
  
  // Wait for DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', function() {
    // Get control elements
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnRun = document.getElementById('btn-run');
    const btnShoot = document.getElementById('btn-shoot');
    
    if (!btnLeft || !btnRight || !btnJump || !btnRun || !btnShoot) {
      console.error('Mobile controls not found in DOM');
      return;
    }
    
    // Function to directly set key state in the input module
    function setKeyState(key, isPressed) {
      if (window.input && typeof window.input.isDown === 'function') {
        // Directly access the pressedKeys object through closure
        const pressedKeysObj = {};
        pressedKeysObj[key] = isPressed;
        
        // Use the input module's method to update key state
        if (isPressed) {
          window.input._setKey && window.input._setKey(key, true);
        } else {
          window.input._setKey && window.input._setKey(key, false);
        }
      }
    }
    
    // Alternative method to simulate keyboard events
    function simulateKey(keyCode, isPressed) {
      const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', {
        keyCode: keyCode,
        which: keyCode,
        code: getKeyCodeString(keyCode),
        key: getKeyString(keyCode),
        bubbles: true
      });
      document.dispatchEvent(event);
    }
    
    // Helper function to get key string from keyCode
    function getKeyString(keyCode) {
      switch(keyCode) {
        case 37: return 'ArrowLeft';
        case 39: return 'ArrowRight';
        case 38: return 'ArrowUp';
        case 40: return 'ArrowDown';
        case 74: return 'j';
        case 88: return 'x';
        case 90: return 'z';
        default: return String.fromCharCode(keyCode).toLowerCase();
      }
    }
    
    // Helper function to get code string from keyCode
    function getKeyCodeString(keyCode) {
      switch(keyCode) {
        case 37: return 'ArrowLeft';
        case 39: return 'ArrowRight';
        case 38: return 'ArrowUp';
        case 40: return 'ArrowDown';
        case 74: return 'KeyJ';
        case 88: return 'KeyX';
        case 90: return 'KeyZ';
        default: return 'Key' + String.fromCharCode(keyCode);
      }
    }
    
    // Key codes
    const KEY_LEFT = 37;  // Left arrow
    const KEY_RIGHT = 39; // Right arrow
    const KEY_X = 88;     // X key (Jump)
    const KEY_J = 74;     // J key (Jump alternative)
    const KEY_Z = 90;     // Z key (Run)
    
    // Direct key mapping to the game's expected keys
    const KEY_MAP = {
      'left': 'LEFT',
      'right': 'RIGHT',
      'jump': 'JUMP',
      'run': 'RUN',
      'shoot': 'RUN'  // Shoot uses the same key as run
    };
    
    // Touch event handlers with both methods
    function handleTouchStart(button, key, keyCode) {
      button.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Try both methods
        setKeyState(key, true);
        simulateKey(keyCode, true);
        
        // Visual feedback
        button.classList.add('active');
        
        return false;
      }, { passive: false });
    }
    
    function handleTouchEnd(button, key, keyCode) {
      button.addEventListener('touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Try both methods
        setKeyState(key, false);
        simulateKey(keyCode, false);
        
        // Visual feedback
        button.classList.remove('active');
        
        return false;
      }, { passive: false });
      
      button.addEventListener('touchcancel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Try both methods
        setKeyState(key, false);
        simulateKey(keyCode, false);
        
        // Visual feedback
        button.classList.remove('active');
        
        return false;
      }, { passive: false });
    }
    
    // Apply touch handlers to all buttons
    handleTouchStart(btnLeft, 'LEFT', KEY_LEFT);
    handleTouchEnd(btnLeft, 'LEFT', KEY_LEFT);
    
    handleTouchStart(btnRight, 'RIGHT', KEY_RIGHT);
    handleTouchEnd(btnRight, 'RIGHT', KEY_RIGHT);
    
    handleTouchStart(btnJump, 'JUMP', KEY_X);
    handleTouchEnd(btnJump, 'JUMP', KEY_X);
    
    handleTouchStart(btnRun, 'RUN', KEY_Z);
    handleTouchEnd(btnRun, 'RUN', KEY_Z);
    
    handleTouchStart(btnShoot, 'RUN', KEY_Z); // Same as run for shooting
    handleTouchEnd(btnShoot, 'RUN', KEY_Z);
    
    // Prevent default touch actions to avoid scrolling
    document.addEventListener('touchmove', function(e) {
      if (e.target.classList.contains('control-btn')) {
        e.preventDefault();
        return false;
      }
    }, { passive: false });
    
    // Handle touch leaving the button
    function handleTouchLeave(button, key, keyCode) {
      button.addEventListener('touchmove', function(e) {
        const touch = e.touches[0];
        const buttonRect = button.getBoundingClientRect();
        
        if (touch.clientX < buttonRect.left || 
            touch.clientX > buttonRect.right || 
            touch.clientY < buttonRect.top || 
            touch.clientY > buttonRect.bottom) {
          
          // Try both methods
          setKeyState(key, false);
          simulateKey(keyCode, false);
          
          // Visual feedback
          button.classList.remove('active');
        }
      }, { passive: false });
    }
    
    // Apply touch leave handlers
    handleTouchLeave(btnLeft, 'LEFT', KEY_LEFT);
    handleTouchLeave(btnRight, 'RIGHT', KEY_RIGHT);
    handleTouchLeave(btnJump, 'JUMP', KEY_X);
    handleTouchLeave(btnRun, 'RUN', KEY_Z);
    handleTouchLeave(btnShoot, 'RUN', KEY_Z);
    
    // Disable zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
    
    // Check and handle orientation changes
    function checkOrientation() {
      const orientationMessage = document.querySelector('.orientation-message');
      const gameContainer = document.querySelector('.game-container');
      
      if (window.innerWidth < window.innerHeight) {
        // Portrait mode
        if (orientationMessage) orientationMessage.style.display = 'flex';
        if (gameContainer) gameContainer.style.display = 'none';
      } else {
        // Landscape mode
        if (orientationMessage) orientationMessage.style.display = 'none';
        if (gameContainer) gameContainer.style.display = 'block';
      }
    }
    
    // Check orientation on load and when orientation changes
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // Adjust game canvas for mobile
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Make sure the canvas is properly sized for mobile
      function resizeCanvas() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight * 0.8; // Leave room for controls
        
        // Maintain aspect ratio
        const aspectRatio = canvas.width / canvas.height;
        let newWidth, newHeight;
        
        if (windowWidth / windowHeight > aspectRatio) {
          newHeight = windowHeight;
          newWidth = newHeight * aspectRatio;
        } else {
          newWidth = windowWidth;
          newHeight = newWidth / aspectRatio;
        }
        
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
      }
      
      // Resize on load and window resize
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('orientationchange', resizeCanvas);
    }
  });
})(); 