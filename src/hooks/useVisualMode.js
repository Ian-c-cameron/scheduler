import { useState } from "react";

/**
 * useVisualMode - custom hook for managing the transition
 *  between the visual modes of appointment elements
 * @param {*} initial - the starting mode of the element
 * returns: mode - the current mode
 * transition - a callback function to change modes
 * back - a callback function to move back to the
 *  previous mode in the history
 */
export default function useVisualMode(initial){
  //mode - the currently displayed state
  const [mode, setMode] = useState(initial);
  //history - the past modes to allow going back
  const [history, setHistory] = useState([initial]);

  /**
   * transition - changes from one mode to the next
   * @param {*} value - the new mode
   * @param {*} replace - true: remove the last mode from
   *  the history and replace it
   *  -false(default): keep the previous mode in the history
   */
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

  /**
   * back - returns to the previous mode using the history
   */
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