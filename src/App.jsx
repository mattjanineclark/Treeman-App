import React, { useState, useEffect, useCallback, useRef } from "react";
import TreemanApp from "./TreemanApp.jsx";
import { loadInitial, persist, subscribe } from "./sync";

export default function App() {
  const [initialState, setInitialState] = useState(null);
  const [loading, setLoading] = useState(true);
  // Realtime updates from other devices. We bump `remoteRev` only when a genuinely
  // new remote state arrives, and use it as the remount key — so the app does NOT
  // remount on every render (which was wiping transient UI like toasts/open forms).
  const [remoteState, setRemoteState] = useState(null);
  const [remoteRev, setRemoteRev] = useState(0);
  const lastLocalWrite = useRef(0);

  useEffect(() => {
    let mounted = true;
    loadInitial().then((s) => {
      if (!mounted) return;
      setInitialState(s);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const unsub = subscribe((next) => {
      // Ignore echoes of our own recent writes to avoid clobbering local edits.
      if (Date.now() - lastLocalWrite.current < 2000) return;
      setRemoteState(next);
      setRemoteRev((r) => r + 1);
    });
    return unsub;
  }, []);

  const onPersist = useCallback((next) => {
    lastLocalWrite.current = Date.now();
    persist(next);
  }, []);

  if (loading || !initialState) {
    return (
      <div style={{
        minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0f1a08", color: "#8DC63F", fontFamily: "system-ui, sans-serif", flexDirection: "column", gap: 14,
      }}>
        <div style={{ fontSize: 40 }}>🌲</div>
        <div style={{ fontWeight: 700, letterSpacing: 1 }}>The Treeman — loading…</div>
      </div>
    );
  }

  // Stable key: only changes when a real remote update lands (remoteRev increments),
  // NOT on every render. This preserves toasts, open sheets and scroll position during
  // normal local use.
  return (
    <TreemanApp
      key={"rev-" + remoteRev}
      initialState={remoteRev > 0 ? remoteState : initialState}
      onPersist={onPersist}
    />
  );
}
