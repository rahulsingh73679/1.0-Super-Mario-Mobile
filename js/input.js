(function() {
    var pressedKeys = {};
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break; // right
        case 40:
            key = 'DOWN'; break;
        case 74:
        case 88: // Allow both J and X for jump
            key = 'JUMP'; break;
        case 90:
            key = 'RUN'; break;
        default:
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    // For mobile: handle visibility change to reset keys when app goes to background
    if (isMobile) {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Reset all keys when the game is not visible
                pressedKeys = {};
            }
        });
        
        // Handle page resize which might indicate keyboard appearance on mobile
        window.addEventListener('resize', function() {
            // Reset keys that might get stuck when keyboard appears/disappears
            pressedKeys['LEFT'] = false;
            pressedKeys['RIGHT'] = false;
            pressedKeys['JUMP'] = false;
            pressedKeys['RUN'] = false;
        });
    }

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },
        reset: function() {
          pressedKeys['RUN'] = false;
          pressedKeys['LEFT'] = false;
          pressedKeys['RIGHT'] = false;
          pressedKeys['DOWN'] = false;
          pressedKeys['JUMP'] = false;
        },
        // Direct method to set key state for mobile controls
        _setKey: function(key, status) {
            pressedKeys[key] = status;
        }
    };
})();
