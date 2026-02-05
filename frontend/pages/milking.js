import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MilkingSession() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [milkQuantity, setMilkQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start the session
  const handleStart = () => {
    setStartTime(new Date());
    setIsRunning(true);
    setIsPaused(false);
    setSeconds(0);
    
    // Start audio
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  };

  // Pause/Resume
  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    } else {
      setIsPaused(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // Stop the session
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowModal(true);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Handle exit confirmation
  const handleExitConfirm = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowExitConfirm(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    } else {
      router.push('/');
    }
  };

  const handleExitCancel = () => {
    setShowExitConfirm(false);
    setPendingNavigation(null);
  };

  // Handle navigation away during active session
  useEffect(() => {
    if (!isRunning) return;

    const handleRouteChange = (url) => {
      // Allow navigation to same page
      if (url === router.asPath || url === '/milking') {
        return;
      }
      
      // Show confirmation modal and block navigation
      setPendingNavigation(url);
      setShowExitConfirm(true);
      
      // Prevent navigation
      throw 'Route change aborted - session active';
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Do you want to close this session? Your progress will be lost.';
      return e.returnValue;
    };

    const handleRouteChangeError = (err) => {
      // Ignore our intentional error
      if (err === 'Route change aborted - session active') {
        return;
      }
    };

    if (router.events) {
      router.events.on('routeChangeStart', handleRouteChange);
      router.events.on('routeChangeError', handleRouteChangeError);
    }
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (router.events) {
        router.events.off('routeChangeStart', handleRouteChange);
        router.events.off('routeChangeError', handleRouteChangeError);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, router]);

  // Submit session
  const handleSubmit = async () => {
    if (!milkQuantity || parseFloat(milkQuantity) < 0) {
      alert('Please enter a valid milk quantity');
      return;
    }

    setIsSubmitting(true);
    const endTime = new Date();
    const duration = seconds;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration: duration,
          milk_quantity: parseFloat(milkQuantity),
        }),
      });

      const result = await response.json();

      if (result.success && response.ok) {
        router.push('/history');
      } else {
        alert(result.message || 'Failed to save session. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting session:', error);
      alert('Error saving session. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Cancel modal
  const handleCancel = () => {
    setShowModal(false);
    setMilkQuantity('');
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Milking Session - Milking Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="container milking-container">
        <div className="card">
          <h1 className="title">Milking Session</h1>
          
          <div className="timer">{formatTime(seconds)}</div>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            loop
            preload="auto"
          >
            <source src="/music/After-the-Rain-Inspiring-Atmospheric-Music.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {!isRunning ? (
            <button className="btn" onClick={handleStart}>
              Start Milking
            </button>
          ) : (
            <div>
              <button className="btn" onClick={handlePauseResume}>
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button className="btn btn-danger" onClick={handleStop}>
                Stop
              </button>
            </div>
          )}

          <a 
            className="link" 
            onClick={() => {
              if (isRunning) {
                setPendingNavigation('/');
                setShowExitConfirm(true);
              } else {
                router.push('/');
              }
            }} 
            style={{ cursor: 'pointer', marginTop: '20px' }}
          >
            Back to Home
          </a>
        </div>
      </div>

      {/* Modal for milk quantity */}
      {showModal && (
        <div className="modal" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Session Complete!</h2>
            <div className="input-group">
              <label className="input-label">Milk Quantity (liters)</label>
              <input
                type="number"
                className="input"
                placeholder="Enter quantity"
                value={milkQuantity}
                onChange={(e) => setMilkQuantity(e.target.value)}
                min="0"
                step="0.1"
                autoFocus
              />
            </div>
            <div>
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ marginRight: '10px' }}
              >
                {isSubmitting ? 'Saving...' : 'Save Session'}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="modal" onClick={handleExitCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">⚠️ Active Session Detected</h2>
            <p style={{ marginBottom: '20px', color: '#4b5563', lineHeight: '1.6' }}>
              Do you want to close this session? Your current progress will be lost.
            </p>
            <div>
              <button
                className="btn btn-danger"
                onClick={handleExitConfirm}
                style={{ marginRight: '10px' }}
              >
                Yes, Close Session
              </button>
              <button className="btn btn-secondary" onClick={handleExitCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
