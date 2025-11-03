'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import './preloader.css';

const messages = [
  { text: "Encendiendo motores...", emoji: "⛽" },
  { text: "Alineando la trayectoria...", emoji: "🗺️" },
  { text: "Calculando tus Metas...", emoji: "🎯" },
  { text: "¡Despegue Exitoso!", emoji: "🥳" },
];

export function Preloader({ loading }: { loading: boolean }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (loading) {
      // Simulate progress while loading
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else {
      // When loading is finished, jump to 100% and start fade out
      setProgress(100);
      setTimeout(() => setVisible(false), 500); // Start fade-out
    }

    return () => clearInterval(progressInterval);
  }, [loading]);

  useEffect(() => {
    // Cycle through messages based on progress
    if (progress < 25) setCurrentMessageIndex(0);
    else if (progress < 60) setCurrentMessageIndex(1);
    else if (progress < 100) setCurrentMessageIndex(2);
    else setCurrentMessageIndex(3);
  }, [progress]);
  
  if (!visible) return null;

  return (
    <div className={cn(
      "preloader-container",
      { "fade-out": !loading }
    )}>
      <div className="preloader-content glassmorphic">
        <div className="rocket-container">
          <div className="rocket-emoji" style={{ bottom: `${progress}%`, transform: `translate(-50%, ${progress}%) scale(${1 + progress * 0.01})` }}>
            🚀
          </div>
          <div className="flames" style={{ opacity: progress / 100, transform: `scaleY(${progress / 100})` }} />
        </div>
        <div className="progress-bar-container neumorphic-inset">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="message-container">
          <p>
            <span className="message-emoji">{messages[currentMessageIndex].emoji}</span>
            {messages[currentMessageIndex].text}
          </p>
        </div>
      </div>
    </div>
  );
}
