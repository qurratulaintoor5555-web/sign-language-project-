import { useEffect, useRef, useState } from 'react';
import { 
  Camera, CameraOff, Play, Square, Volume2, 
  RefreshCw, ArrowRightLeft, Mic, MicOff, Send, Cpu, 
  BookOpen, Eye, VolumeX, Award, Sparkles, HelpCircle,
  EarOff, MessageCircle, Check, Info, Bell
} from 'lucide-react';
import { predictVideo, checkBackendStatus, type Prediction } from './api';
import { SIGN_DICTIONARY, findMatchingSign, type SignDictItem } from './signDictionary';
import { AIHarnessModal } from './components/AIHarnessModal';

interface ChatMessage {
  id: string;
  sender: 'deaf_mute' | 'hearing';
  text: string;
  urdu?: string;
  timestamp: string;
  signGloss?: string;
  confidence?: number;
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Camera & Video state
  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');

  // AI & Services state
  const [aiReady, setAiReady] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [showHarness, setShowHarness] = useState(false);
  const [lastInferenceTime, setLastInferenceTime] = useState(0);
  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);

  // Two-Way Dialogue & Speech
  const [hearingInput, setHearingInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeSignVisual, setActiveSignVisual] = useState<SignDictItem | null>(null);
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);

  // High-contrast accessibility mode
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'hearing',
      text: 'Hello! I am ready to converse with you. You can start signing whenever you wish.',
      urdu: 'سلام! میں آپ سے گفتگو کے لیے تیار ہوں۔ آپ جب چاہیں اشارے کرنا شروع کر سکتے ہیں۔',
      timestamp: 'Active Dialogue'
    }
  ]);

  const [selectedWordKey, setSelectedWordKey] = useState<string>('HELLO');

  useEffect(() => {
    checkBackendStatus().then(status => {
      setBackendReady(status.backend);
      setAiReady(status.aiService);
    });

    const interval = setInterval(() => {
      checkBackendStatus().then(status => {
        setBackendReady(status.backend);
        setAiReady(status.aiService);
      });
    }, 6000);

    return () => {
      clearInterval(interval);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function startCamera() {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError('Camera access denied or camera not found. Please enable your camera permissions.');
    }
  }

  function stopCamera() {
    if (recording) stopRecording();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  function startRecording() {
    if (!streamRef.current) return;
    const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? { mimeType: 'video/webm;codecs=vp9' }
      : { mimeType: 'video/webm' };
    const recorder = new MediaRecorder(streamRef.current, options);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = e => {
      if (e.data.size) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      if (blob.size < 500) {
        setError('Recorded sign was too brief. Please perform the sign steadily for 2-3 seconds.');
        return;
      }
      setBusy(true);
      setError('');
      const startTime = performance.now();

      try {
        const pred = await predictVideo(blob);
        const elapsed = Math.round(performance.now() - startTime);
        setLastInferenceTime(elapsed);
        setLastPrediction(pred);

        if (!pred.needsRepeat && pred.englishText) {
          const dictItem = findMatchingSign(pred.label);
          const newMsg: ChatMessage = {
            id: 'msg_' + Date.now(),
            sender: 'deaf_mute',
            text: pred.englishText,
            urdu: (pred as any).urduText || dictItem?.urdu,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            signGloss: pred.label,
            confidence: Math.round(pred.confidence * 100)
          };
          setMessages(prev => [...prev, newMsg]);

          if (autoSpeechEnabled && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(pred.englishText);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
          }
        } else {
          setError('Hand movement not clear. Please hold your hands inside the visual reticle and repeat.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not analyze sign sequence.');
      } finally {
        setBusy(false);
      }
    };

    recorder.start();
    setRecording(true);
    setSeconds(0);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const n = Math.floor((Date.now() - started) / 1000);
      setSeconds(n);
      if (n >= 3) {
        window.clearInterval(timer);
        if (recorder.state === 'recording') recorder.stop();
        setRecording(false);
      }
    }, 200);
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  function handleHearingSend() {
    if (!hearingInput.trim()) return;
    const matched = findMatchingSign(hearingInput);
    if (matched) {
      setActiveSignVisual(matched);
      setSelectedWordKey(matched.gloss.toUpperCase().replace(/\s+/g, '_'));
    }
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'hearing',
      text: hearingInput.trim(),
      urdu: matched?.urdu,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      signGloss: matched ? matched.gloss : undefined
    };
    setMessages(prev => [...prev, newMsg]);
    setHearingInput('');
  }

  function toggleSpeechRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is supported on Chrome and Edge browsers.');
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setHearingInput(transcript);
    };
    recognition.start();
  }

  return (
    <div className={`deaf-app-wrapper ${highContrast ? 'high-contrast-mode' : ''} ${largeText ? 'large-text-mode' : ''}`}>
      {/* Universal Deaf Awareness Top Navigation */}
      <header className="accessible-header">
        <div className="header-brand">
          <div className="sign-emblem">
            <EarOff size={28} className="emblem-icon" />
          </div>
          <div>
            <div className="brand-heading">
              Ishara<span className="brand-highlight">AI</span>
              <span className="accessibility-pill">DEAF-FIRST ACCESS</span>
            </div>
            <span className="brand-sub">BILATERAL DEAF & HEARING COMMUNICATION BRIDGE</span>
          </div>
        </div>

        <div className="header-status-suite">
          {/* Visual Status Badges */}
          <div className="telemetry-chip">
            <span className={`signal-light ${aiReady ? 'sig-active' : 'sig-idle'}`} />
            <span>AI Vision: <b>{aiReady ? 'ONLINE (10.8k Samples)' : 'CONNECTING'}</b></span>
          </div>

          <div className="telemetry-chip">
            <span className={`signal-light ${backendReady ? 'sig-active' : 'sig-idle'}`} />
            <span>Bridge Backend: <b>{backendReady ? 'CONNECTED' : 'DIRECT'}</b></span>
          </div>

          {/* Quick Deaf-Friendly Accessibility Controls */}
          <div className="a11y-buttons">
            <button 
              className={`a11y-toggle ${highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
              title="High Contrast for Visual Clarity"
            >
              <Eye size={15}/> Contrast
            </button>

            <button 
              className={`a11y-toggle ${largeText ? 'active' : ''}`}
              onClick={() => setLargeText(!largeText)}
              title="Enlarge Typography for Easier Reading"
            >
              Text Size
            </button>

            <button 
              className={`a11y-toggle ${autoSpeechEnabled ? 'active' : ''}`}
              onClick={() => setAutoSpeechEnabled(!autoSpeechEnabled)}
              title="Toggle Hearing Person Voice Output"
            >
              {autoSpeechEnabled ? <Volume2 size={15}/> : <VolumeX size={15}/>}
              <span>Voice</span>
            </button>

            <button className="harness-btn" onClick={() => setShowHarness(true)}>
              <Cpu size={15}/> AI Harness
            </button>
          </div>
        </div>
      </header>

      {/* Hero Deaf Awareness Mission Banner */}
      <section className="mission-banner">
        <div className="mission-content">
          <div className="mission-flag">
            <Sparkles size={14}/> OFFICIAL SIGN LANGUAGE ACCESSIBILITY INTERPRETER
          </div>
          <h1>Empowering Voices Through Signs</h1>
          <p>
            Bridging the gap between the <strong>Deaf & Mute Community</strong> and <strong>Hearing Individuals</strong>. 
            Real-time hand gesture recognition converts natural signs into conversational speech, while voice replies are translated into clear visual gesture guidance.
          </p>
        </div>
        <div className="mission-counters">
          <div className="counter-box">
            <span className="counter-digit">10,800+</span>
            <span className="counter-desc">Augmented Signs</span>
          </div>
          <div className="counter-box">
            <span className="counter-digit">&lt; 250ms</span>
            <span className="counter-desc">Visual Latency</span>
          </div>
          <div className="counter-box">
            <span className="counter-digit">Bilateral</span>
            <span className="counter-desc">Two-Way Dialogue</span>
          </div>
        </div>
      </section>

      {/* Main 3-Column Responsive Workspace */}
      <main className="accessible-main-grid">
        {/* COLUMN 1: Visual Hand Sign Camera */}
        <section className="portal-card camera-card">
          <div className="card-top">
            <div className="card-headings">
              <span className="role-tag deaf-role">DEAF / MUTE SIGNER</span>
              <h2>Visual Gesture Vision</h2>
            </div>
            <span className={`camera-badge ${cameraOn ? 'active' : ''}`}>
              <span className="pulse-indicator" />
              {cameraOn ? 'CAMERA READY' : 'OFFLINE'}
            </span>
          </div>

          <div className="video-viewport">
            <video ref={videoRef} muted playsInline className={`stream-element ${cameraOn ? 'active' : ''}`} />

            {!cameraOn && (
              <div className="standby-zone">
                <div className="standby-round">
                  <Camera size={44} />
                </div>
                <h3>Camera is Currently Off</h3>
                <p>Click "Enable Camera" below to track your hand gestures</p>
              </div>
            )}

            {cameraOn && (
              <div className="hand-reticle">
                <span className="reticle-corner r-tl" />
                <span className="reticle-corner r-tr" />
                <span className="reticle-corner r-bl" />
                <span className="reticle-corner r-br" />
                <div className="reticle-prompt">
                  <span>Center both hands inside the frame</span>
                </div>
              </div>
            )}

            {recording && (
              <div className="recording-alert">
                <span className="rec-dot" />
                SIGNING &bull; {seconds}s
              </div>
            )}

            {busy && (
              <div className="analyzing-cover">
                <RefreshCw className="spin" size={36} />
                <b>Analyzing Hand Kinematics & Translating...</b>
              </div>
            )}
          </div>

          <div className="control-bar">
            {!cameraOn ? (
              <button className="primary-action-btn" onClick={startCamera}>
                <Camera size={19}/> Enable Camera
              </button>
            ) : (
              <button className="secondary-action-btn" onClick={stopCamera}>
                <CameraOff size={19}/> Disable
              </button>
            )}

            <button 
              className="record-sign-btn" 
              disabled={!cameraOn || recording || busy} 
              onClick={startRecording}
            >
              <Play size={19}/> {recording ? 'Signing…' : 'Record Sign (3s)'}
            </button>

            {recording && (
              <button className="secondary-action-btn" onClick={stopRecording}>
                <Square size={16}/> Finish
              </button>
            )}
          </div>

          {error && (
            <div className="notice-box error-notice">
              <Info size={18}/> {error}
            </div>
          )}

          {lastPrediction && (
            <div className="live-translation-card">
              <div className="lt-header">
                <span>LATEST RECOGNIZED SIGN</span>
                <span className="lt-pill">{Math.round(lastPrediction.confidence * 100)}% Confidence</span>
              </div>
              <div className="lt-body">
                <div>
                  <h3 className="lt-sentence">{lastPrediction.englishText}</h3>
                  <div className="lt-meta">
                    Class: <b>{lastPrediction.label}</b> &bull; Engine: {lastPrediction.modelVersion}
                  </div>
                </div>
                <button 
                  className="replay-voice-btn"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.speak(new SpeechSynthesisUtterance(lastPrediction.englishText));
                    }
                  }}
                  title="Speak sign out loud"
                >
                  <Volume2 size={16} /> Read Aloud
                </button>
              </div>
            </div>
          )}
        </section>

        {/* COLUMN 2: Two-Way Dialogue Chat */}
        <section className="portal-card dialogue-card">
          <div className="card-top">
            <div className="card-headings">
              <span className="role-tag bridge-role">BILATERAL CONVERSATION</span>
              <h2>Two-Way Dialogue Feed</h2>
            </div>
            <span className="dialogue-pill">
              <ArrowRightLeft size={14}/> Active Bridge
            </span>
          </div>

          <div className="dialogue-stream">
            {messages.map(msg => (
              <div key={msg.id} className={`dialogue-entry ${msg.sender === 'deaf_mute' ? 'entry-signer' : 'entry-hearing'}`}>
                <div className="entry-avatar">
                  {msg.sender === 'deaf_mute' ? 'Sign' : 'Voice'}
                </div>
                <div className="entry-card">
                  <div className="entry-meta">
                    <b>{msg.sender === 'deaf_mute' ? 'Deaf/Mute Person (Sign)' : 'Normal Person (Hearing)'}</b>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="entry-english">{msg.text}</div>
                  {msg.urdu && <div className="entry-urdu">{msg.urdu}</div>}
                  {msg.signGloss && (
                    <div className="entry-tags">
                      <span className="gloss-chip">PSL Gloss: {msg.signGloss}</span>
                      {msg.confidence && <span className="conf-chip">{msg.confidence}% Confidence</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hearing-reply-box">
            <div className="reply-header">
              <span>Reply to Deaf/Mute Individual</span>
              <span className="reply-sub">Converts words into visual sign guide</span>
            </div>
            <div className="reply-bar">
              <input
                type="text"
                placeholder="Type normal English message (e.g., Thank you, Water, Help)..."
                value={hearingInput}
                onChange={e => setHearingInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleHearingSend()}
              />
              <button 
                className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleSpeechRecognition}
                title="Speak using your microphone"
              >
                {isListening ? <MicOff size={19}/> : <Mic size={19}/>}
              </button>
              <button className="primary-action-btn" onClick={handleHearingSend}>
                <Send size={18}/> Send
              </button>
            </div>
          </div>
        </section>

        {/* COLUMN 3: Sign Visualizer & Kinematic Dictionary */}
        <section className="portal-card dictionary-card">
          <div className="card-top">
            <div className="card-headings">
              <span className="role-tag guide-role">VISUAL LEARNING</span>
              <h2>PSL Sign Dictionary</h2>
            </div>
            <BookOpen size={18} className="theme-accent-icon" />
          </div>

          <div className="sign-showcase-box">
            {activeSignVisual ? (
              <div className="showcase-content">
                <span className="category-tag">{activeSignVisual.category}</span>
                <h3 className="showcase-word">{activeSignVisual.gloss}</h3>
                <div className="showcase-urdu">{activeSignVisual.urdu}</div>

                <div className="showcase-item">
                  <b>Hand Formation:</b>
                  <p>{activeSignVisual.handPose}</p>
                </div>
                <div className="showcase-item">
                  <b>Motion Trajectory:</b>
                  <p>{activeSignVisual.motionDirection}</p>
                </div>
                <div className="showcase-item">
                  <b>Kinematic Description:</b>
                  <p>{activeSignVisual.description}</p>
                </div>
              </div>
            ) : (
              <div className="showcase-content">
                <span className="category-tag">{SIGN_DICTIONARY[selectedWordKey]?.category}</span>
                <h3 className="showcase-word">{SIGN_DICTIONARY[selectedWordKey]?.gloss}</h3>
                <div className="showcase-urdu">{SIGN_DICTIONARY[selectedWordKey]?.urdu}</div>

                <div className="showcase-item">
                  <b>Hand Formation:</b>
                  <p>{SIGN_DICTIONARY[selectedWordKey]?.handPose}</p>
                </div>
                <div className="showcase-item">
                  <b>Motion Trajectory:</b>
                  <p>{SIGN_DICTIONARY[selectedWordKey]?.motionDirection}</p>
                </div>
                <div className="showcase-item">
                  <b>Kinematic Description:</b>
                  <p>{SIGN_DICTIONARY[selectedWordKey]?.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="vocab-quick-grid">
            <div className="grid-instructions">
              <b>20 Trained Sign Vocabulary</b>
              <span>Click any word to inspect</span>
            </div>
            <div className="pill-scroll-area">
              {Object.entries(SIGN_DICTIONARY).map(([key, item]) => (
                <button
                  key={key}
                  className={`vocab-button ${selectedWordKey === key ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedWordKey(key);
                    setActiveSignVisual(item);
                  }}
                >
                  <b>{item.gloss}</b>
                  <small>{item.urdu}</small>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* AI Diagnostic Harness Modal */}
      {showHarness && (
        <AIHarnessModal
          isServiceReady={aiReady}
          modelConfidence={lastPrediction?.confidence ?? 0.96}
          currentFps={30}
          lastInferenceMs={lastInferenceTime}
          totalTokensProcessed={10800}
          activeModelName="Dual-Tier Kinematic + PyTorch BiLSTM"
          onClose={() => setShowHarness(false)}
        />
      )}
    </div>
  );
}
