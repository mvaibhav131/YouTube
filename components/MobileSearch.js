import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";

export default function MobileSearch({ onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  // Auto-focus when overlay opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Auto-close as soon as any navigation starts (handles SSR round-trip delay)
  useEffect(() => {
    const close = () => onClose();
    router.events?.on("routeChangeStart", close);
    return () => router.events?.off("routeChangeStart", close);
  }, [router.events, onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError(
        "Voice search is not supported. Please use Chrome or Edge.",
      );
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;

    setIsListening(true);
    setVoiceError("");

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      rec.abort();          // stop mic immediately
      setIsListening(false);
      onClose();            // close overlay first
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
    };

    rec.onerror = (e) => {
      rec.abort();
      setIsListening(false);
      if (e.error === "not-allowed") {
        setVoiceError(
          "Microphone access denied. Allow access in your browser settings.",
        );
      } else if (e.error === "no-speech") {
        setVoiceError("No speech detected. Please try again.");
      } else {
        setVoiceError("Voice search failed. Please try again.");
      }
    };

    rec.onend = () => setIsListening(false);

    try {
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="mobile-search-overlay" onClick={onClose}>
      <div className="mobile-search-inner" onClick={(e) => e.stopPropagation()}>
        {/* Search bar */}
        <form className="mobile-search-bar" onSubmit={handleSearch}>
          <button
            type="button"
            className="yt-icon-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <ArrowLeftOutlined style={{ fontSize: 20 }} />
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search YouTube…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mobile-search-input"
            aria-label="Search"
          />

          {query && (
            <button type="submit" className="yt-icon-btn" aria-label="Search">
              <SearchOutlined style={{ fontSize: 18 }} />
            </button>
          )}

          <button
            type="button"
            className={`yt-icon-btn${isListening ? " voice-active" : ""}`}
            onClick={handleVoice}
            aria-label={isListening ? "Listening…" : "Search by voice"}
            title="Search by voice"
          >
            {isListening ? (
              <AudioOutlined style={{ fontSize: 18, color: "#ff0000" }} />
            ) : (
              <AudioMutedOutlined style={{ fontSize: 18 }} />
            )}
          </button>
        </form>

        {/* Listening state */}
        {isListening && (
          <div className="voice-listening">
            <div className="voice-rings">
              <div className="voice-ring r1" />
              <div className="voice-ring r2" />
              <div className="voice-ring r3" />
              <AudioOutlined
                style={{
                  fontSize: 36,
                  color: "#ff0000",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
            <p style={{ color: "var(--yt-text-2)", marginTop: 16 }}>
              Listening…
            </p>
          </div>
        )}

        {/* Error message */}
        {voiceError && <div className="voice-error">{voiceError}</div>}
      </div>
    </div>
  );
}
