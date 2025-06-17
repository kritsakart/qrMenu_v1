import { createRoot } from 'react-dom/client'
// import App from './App.tsx' // Temporarily removed for deep UI freeze diagnosis
import './index.css'

createRoot(document.getElementById("root")!).render(
  <div style={{ padding: '50px', textAlign: 'center', fontSize: '36px', color: 'blue' }}>
    Якщо ви бачите це повідомлення, фронтенд працює!
  </div>
);
