import React, { useState, useEffect, useCallback } from 'react';
import { getRandomArt } from '../data/artData';

const ArtDisplay = () => {
  const [currentArt, setCurrentArt] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fadeClass, setFadeClass] = useState('');
  const [selectedTimer, setSelectedTimer] = useState(10); // Default 10 seconds for testing
  const [showControls, setShowControls] = useState(false);
  const [hideTimer, setHideTimer] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerOptions = [
    { value: 10, label: '10s' },
    { value: 30, label: '30s' },
    { value: 60, label: '1m' },
    { value: 300, label: '5m' },
    { value: 3600, label: '1h' }
  ];

  useEffect(() => {
    loadNewArt();
  }, []);

  const loadNewArt = useCallback(() => {
    setFadeClass('');
    setImageLoaded(false);
    
    setTimeout(() => {
      const newArt = getRandomArt();
      setCurrentArt(newArt);
      setFadeClass('fade-transition');
    }, 100);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleNextArt = useCallback(() => {
    loadNewArt();
  }, [loadNewArt]);

  const handlePreviousArt = useCallback(() => {
    loadNewArt(); // For now, just loads random art. Could be enhanced to track history
  }, [loadNewArt]);

  const handleTimerSelect = (seconds) => {
    setSelectedTimer(seconds);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleBio = () => {
    setShowBio(!showBio);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  // Listen for fullscreen changes (when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          handleNextArt();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handlePreviousArt();
          break;
        case ' ': // Spacebar
          event.preventDefault();
          handleNextArt();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextArt, handlePreviousArt, toggleFullscreen]);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    // Clear existing hide timer
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    
    // Set new hide timer for 10 seconds
    const newHideTimer = setTimeout(() => {
      setShowControls(false);
    }, 10000);
    
    setHideTimer(newHideTimer);
  }, [hideTimer]);

  const handleMouseLeave = useCallback(() => {
    // Hide controls immediately when mouse leaves the window
    if (hideTimer) {
      clearTimeout(hideTimer);
    }
    const newHideTimer = setTimeout(() => {
      setShowControls(false);
    }, 2000); // Shorter delay when mouse leaves
    setHideTimer(newHideTimer);
  }, [hideTimer]);

  // Auto-advance based on selected timer
  useEffect(() => {
    const interval = setInterval(() => {
      loadNewArt();
    }, selectedTimer * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTimer, loadNewArt]);

  // Add mouse event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [handleMouseMove, handleMouseLeave, hideTimer]);

  if (!currentArt) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className={`art-container ${currentArt.orientation} ${fadeClass}`}>
        <div className="art-image-wrapper">
          <img
            src={currentArt.image}
            alt="Martha's Art"
            className="art-image"
            onLoad={handleImageLoad}
            onClick={handleNextArt}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
          />
        </div>
        
        <div className="poetry-container">
          <div className="poetry-text">
            "{currentArt.poetry}"
          </div>
          <div className="poetry-author">
            — {currentArt.author}
          </div>
        </div>
      </div>
      
      <div className={`controls ${showControls ? 'visible' : 'hidden'}`}>
        <div className="timer-buttons">
          {timerOptions.map((option) => (
            <button
              key={option.value}
              className={`timer-button ${selectedTimer === option.value ? 'active' : ''}`}
              onClick={() => handleTimerSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
          
          <button
            className="timer-button dark-mode-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          <button
            className="timer-button bio-toggle"
            onClick={toggleBio}
            title="View Martha's Biography"
          >
            👤
          </button>

          <button
            className="timer-button fullscreen-toggle"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '🪟' : '⛶'}
          </button>
        </div>
        
        <button className="next-button" onClick={handleNextArt}>
          Next
        </button>
      </div>

      {showBio && (
        <div className={`bio-overlay ${showControls ? 'visible' : 'hidden'}`}>
          <div className="bio-content">
            <h2>Martha Cope DeAtley</h2>
            <div className="bio-text">
              <p>In the Hawkins County School System, art classes were not normally available; however, when Martha was in the 7th grade, they offered one year of art instruction. During the following summer, that grade school art teacher taught a watercolor class which Martha attended.</p>
              
              <p>In high school both Martha and her mother took a series of lessons in oil painting (still life and landscape) from a local artist who had moved here from New York City. One summer, she went to a watercolor session in Gatlinburg, Tennessee taught by Jim Gray. Another summer, Martha went to Woodstock, New York for the summer session from "The Art Students League"; and, also, took private lessons from an artist in residence there.</p>
              
              <p>About a year later, Martha applied to the Rhode Island School of Design, was accepted, and studied there the next 2 and 1/2 years.</p>
              
              <p>Since then, Martha has painted on her own and has benefitted from watching many television artist programs.</p>
            </div>
            <button className="bio-close" onClick={toggleBio}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtDisplay;