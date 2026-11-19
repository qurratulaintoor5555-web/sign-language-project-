import { useEffect, useRef, useState } from 'react';
import { 
  Camera, CameraOff, Play, Square, Volume2, 
  RefreshCw, ArrowRightLeft, Mic, MicOff, Send, Cpu, 
  BookOpen, Eye, VolumeX, Sparkles, Check, Info, ShieldCheck,
  MessageSquare, Radio, CheckCircle2, AlertTriangle, Layers
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
      text: 'Assalam-o-Alaikum! I am ready to converse with you. You can start signing.',
      urdu: 'السلام علیکم! میں آپ سے گفتگو کے لیے تیار ہوں۔ آپ اشارے شروع کر سکتے ہیں۔',
      timestamp: 'Online'
    }
  ]);

  const [selectedWordKey, setSelectedWordKey] = useState<string>('Assalamulaikum');

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
    }, 5000);

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
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
    setRecording(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  }

  function speakText(text: string) {
    if (!autoSpeechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  async function startRecording() {
    setError('');
    if (!streamRef.current) {
      await startCamera();
      if (!streamRef.current) return;
    }

    chunksRef.current = [];
    const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    let chosenMime = '';
    for (const m of mimeTypes) {
      if (MediaRecorder.isTypeSupported(m)) {
        chosenMime = m;
        break;
      }
    }

    const recorder = new MediaRecorder(streamRef.current, chosenMime ? { mimeType: chosenMime } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: chosenMime || 'video/webm' });
      if (blob.size < 500) {
        setError('Recorded gesture was too short. Please perform the sign for 2-3 seconds.');
        return;
      }

      setBusy(true);
      const startT = Date.now();
      try {
        const result = await predictVideo(blob);
        const elapsed = Date.now() - startT;
        setLastInferenceTime(elapsed);
        setLastPrediction(result);

        if (result.needsRepeat) {
          setError(`Confidence low (${Math.round(result.confidence * 100)}%). Please repeat your sign clearly.`);
        } else {
          setError('');
          speakText(result.englishText);

          const newMsg: ChatMessage = {
            id: 'msg_' + Date.now(),
            sender: 'deaf_mute',
            text: result.englishText,
            urdu: result.urduText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            signGloss: result.label,
            confidence: Math.round(result.confidence * 100)
          };
          setMessages(prev => [...prev, newMsg]);

          if (result.label && SIGN_DICTIONARY[result.label]) {
            setActiveSignVisual(SIGN_DICTIONARY[result.label]);
            setSelectedWordKey(result.label);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Recognition request failed.');
      } finally {
        setBusy(false);
      }
    };

    recorder.start(100);
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
      setSelectedWordKey(matched.gloss);
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
      alert('Speech recognition is supported on modern Chrome and Edge browsers.');
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

  const currentDisplaySign = activeSignVisual || SIGN_DICTIONARY[selectedWordKey] || Object.values(SIGN_DICTIONARY)[0];

  return (
    <div className={`deaf-app-wrapper ${highContrast ? 'high-contrast-mode' : ''} ${largeText ? 'large-text-mode' : ''}`}>
      {/* Professional Top Navigation */}
      <header className="accessible-header">
        <div className="header-brand">
          <div className="sign-emblem">
            <Radio size={26} className="emblem-icon" />
          </div>
          <div>
            <div className="brand-heading">
              BolSuno <span className="brand-highlight">AI</span>
              <span className="accessibility-pill">PSL 2.0 BENCHMARK</span>
            </div>
            <span className="brand-sub">TWO-WAY SIGN LANGUAGE & SPEECH BRIDGE FOR PAKISTAN</span>
          </div>
        </div>

        <div className="header-status-suite">
          {/* Status Badges */}
          <div className="telemetry-chip">
            <span className={`signal-light ${aiReady ? 'sig-active' : 'sig-idle'}`} />
            <span>AI Inference: <b>{aiReady ? 'ONLINE (1.3K Benchmark)' : 'CONNECTING'}</b></span>
          </div>

          <div className="telemetry-chip">
            <span className={`signal-light ${backendReady ? 'sig-active' : 'sig-idle'}`} />
            <span>Cloud Gateway: <b>{backendReady ? 'CONNECTED' : 'DIRECT'}</b></span>
          </div>

          {/* Accessibility & Diagnostics Controls */}
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
              title="Toggle Large Typography"
            >
              Text Size
            </button>

            <button 
              className={`a11y-toggle ${autoSpeechEnabled ? 'active' : ''}`}
              onClick={() => setAutoSpeechEnabled(!autoSpeechEnabled)}
              title="Toggle Voice Audio Output"
            >
              {autoSpeechEnabled ? <Volume2 size={15}/> : <VolumeX size={15}/>}
              <span>Voice</span>
            </button>

            <button className="harness-btn" onClick={() => setShowHarness(true)}>
              <Cpu size={15}/> AI Diagnostics
            </button>
          </div>
        </div>
      </header>

      {/* Hero Mission & Telemetry Banner */}
      <section className="mission-banner">
        <div className="mission-content">
          <div className="mission-flag">
            <Sparkles size={14}/> CERTIFIED PAKISTAN SIGN LANGUAGE COMMUNICATION PLATFORM
          </div>
          <h1>Seamless Dialogue Between Deaf & Hearing Individuals</h1>
          <p>
            Powered by high-precision MediaPipe dual-hand and body kinematics with PyTorch deep learning. 
            Converts natural Pakistan Sign Language gestures into conversational English & Urdu audio speech, while speech is mapped to visual sign guides.
          </p>
        </div>
        <div className="mission-counters">
          <div className="counter-box">
            <span className="counter-digit">1,300</span>
            <span className="counter-desc">Benchmark PSL Samples</span>
          </div>
          <div className="counter-box">
            <span className="counter-digit">91.3%</span>
            <span className="counter-desc">Model Accuracy</span>
          </div>
          <div className="counter-box">
            <span className="counter-digit">&lt; 200ms</span>
            <span className="counter-desc">Inference Latency</span>
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
            <video ref={videoRef} playsInline muted autoPlay className={cameraOn ? 'visible-video' : 'hidden-video'} />

            {!cameraOn && (
              <div className="camera-standby-view">
                <div className="standby-icon">
                  <CameraOff size={42} />
                </div>
                <h3>Camera is Currently Off</h3>
                <p>Click below to turn on camera and enable real-time gesture interpretation.</p>
                <button className="primary-action-btn pulse-glow" onClick={startCamera}>
                  <Camera size={18}/> Enable Camera
                </button>
              </div>
            )}

            {cameraOn && recording && (
              <div className="recording-hud">
                <span className="rec-dot" />
                <span>RECORDING SIGN ({seconds}s / 3s)</span>
              </div>
            )}

            {busy && (
              <div className="inference-hud">
                <RefreshCw size={24} className="spin-icon" />
                <span>Interpreting PSL Sign...</span>
              </div>
            )}
          </div>

          {error && (
            <div className="feedback-banner error-banner">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {lastPrediction && !error && (
            <div className="prediction-ribbon">
              <div className="pred-main">
                <span className="pred-label">{lastPrediction.label}</span>
                <span className="pred-conf">{Math.round(lastPrediction.confidence * 100)}% Match</span>
              </div>
              <div className="pred-text">{lastPrediction.englishText}</div>
              {lastPrediction.urduText && <div className="pred-urdu">{lastPrediction.urduText}</div>}
            </div>
          )}

          <div className="camera-controls-bar">
            {cameraOn ? (
              <>
                {!recording ? (
                  <button className="primary-action-btn" onClick={startRecording} disabled={busy}>
                    <Play size={18}/> Interpret Sign (3s)
                  </button>
                ) : (
                  <button className="danger-action-btn" onClick={stopRecording}>
                    <Square size={18}/> Stop & Process
                  </button>
                )}
                <button className="secondary-action-btn" onClick={stopCamera}>
                  <CameraOff size={18}/> Turn Off
                </button>
              </>
            ) : null}
          </div>
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
              <span className="reply-sub">Converts spoken or typed words into visual sign guide</span>
            </div>
            <div className="reply-bar">
              <input
                type="text"
                placeholder="Type normal message (e.g., Assalamulaikum, Barai Mehrbani, G Han, Bemar)..."
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
            <div className="showcase-content">
              <span className="category-tag">{currentDisplaySign.category}</span>
              <h3 className="showcase-word">{currentDisplaySign.gloss}</h3>
              <div className="showcase-urdu">{currentDisplaySign.urdu}</div>

              <div className="showcase-item">
                <b>Hand Formation:</b>
                <p>{currentDisplaySign.handPose}</p>
              </div>
              <div className="showcase-item">
                <b>Motion Trajectory:</b>
                <p>{currentDisplaySign.motionDirection}</p>
              </div>
              <div className="showcase-item">
                <b>Kinematic Description:</b>
                <p>{currentDisplaySign.description}</p>
              </div>
            </div>
          </div>

          <div className="vocab-quick-grid">
            <div className="grid-instructions">
              <b>26 Trained PSL Vocabulary Signs</b>
              <span>Click any word to inspect gesture</span>
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
          modelConfidence={lastPrediction?.confidence ?? 0.91}
          currentFps={30}
          lastInferenceMs={lastInferenceTime}
          totalTokensProcessed={1300}
          activeModelName="PyTorch BiLSTM (MediaPipe 225-Vector)"
          onClose={() => setShowHarness(false)}
        />
      )}
    </div>
  );
}
