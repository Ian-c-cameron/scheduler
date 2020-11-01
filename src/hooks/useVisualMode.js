import { useState } from "react";

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = function(value, replace = false) {
    if (!replace) {
      setMode(value);
      setHistory(prev => [...prev, value]);
      return;
    }
    const hist = [...history];
    hist.pop()
    setMode(value);
    setHistory([...hist, value]);
  }
  const back = function() {
    if (history.length > 1) {
      const hist = [...history];
      hist.pop()
      setMode(hist[hist.length-1]);
      setHistory(hist);
    }
  }

  return { mode, transition, back };
}