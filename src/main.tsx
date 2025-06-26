import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Test console availability
try {
  console.log("🧪 Console test: This should appear in developer tools");
  console.warn("🧪 Console warn test");
  console.error("🧪 Console error test");
  
  // Test window.console directly
  window.console.log("🧪 Window.console test");
  
  // Force alert as fallback
  // alert("Console test - check if you see logs in developer tools");
} catch (e) {
  alert("Console is not working: " + e);
}

console.log("🚀 Application starting...", new Date().toISOString());

// Register Service Worker for cache control
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

console.log("🚀 About to render React app...");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log("🚀 React app rendered!");
