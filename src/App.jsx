import React, { useState, useEffect, useCallback, useRef } from "react";
import TreemanApp from "./TreemanApp.jsx";
import { loadInitial, persist, subscribe } from "./sync";

export default function App() {
  const [initialState, setInitialState] = useState(null);
  const [loading, setLoading] = useState(true);
  // Lets realtime updates from other devices push a fresh state into the component.
  const [remoteState, setRemoteState] = useState(null);
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
      // Ignore echoes of our own very recent writes to avoid cursor jumps.
      if (Date.now() - lastLocalWrite.current < 1200) return;
      setRemoteState(next);
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

  // `key` forces a remount when a realtime update arrives so the component re-seeds
  // from the new shared state. Simple + safe for this whole-document sync model.
  return (
    <TreemanApp
      key={remoteState ? "remote-" + Date.now() : "local"}
      initialState={remoteState || initialState}
      onPersist={onPersist}
    />
  );
}
