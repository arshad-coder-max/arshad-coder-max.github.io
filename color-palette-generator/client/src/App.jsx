import React, { useState, useEffect, useCallback } from 'react';

// Utility to generate random hex color
const generateRandomColor = () => {
  const hexChars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += hexChars[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility to calculate contrast color (black or white)
const getContrastColor = (hexcolor) => {
  if (!hexcolor) return '#121212';
  // Strip the '#'
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#121212' : '#ffffff';
};

const API_URL = 'http://localhost:5000/api/palettes';

function App() {
  const [colors, setColors] = useState([]);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const initPalette = useCallback(() => {
    setColors(Array(5).fill(null).map(() => ({
      hex: generateRandomColor(),
      locked: false
    })));
  }, []);

  useEffect(() => {
    initPalette();
    fetchPalettes();
  }, [initPalette]);

  const generatePalette = useCallback(() => {
    setColors(prev => prev.map(color => {
      if (color.locked) return color;
      return { ...color, hex: generateRandomColor() };
    }));
  }, []);

  // Handle Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatePalette]);

  const toggleLock = (index) => {
    setColors(prev => {
      const newColors = [...prev];
      newColors[index] = { ...newColors[index], locked: !newColors[index].locked };
      return newColors;
    });
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchPalettes = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setSavedPalettes(data);
      }
    } catch (err) {
      console.error('Failed to fetch palettes. Is the server running?', err);
    }
  };

  const savePalette = async () => {
    try {
      const currentHexes = colors.map(c => c.hex);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors: currentHexes })
      });
      if (res.ok) {
        showToast('Palette Saved!');
        fetchPalettes();
      } else {
         showToast('Failed to save palette on server.');
      }
    } catch (err) {
      showToast('Failed to connect to backend server.');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">PaletteGen</div>
        <div className="header-actions">
          <button className="btn" onClick={() => setIsDrawerOpen(true)}>
            Saved Palettes
          </button>
          <button className="btn btn-primary" onClick={savePalette}>
            Save Palette
          </button>
        </div>
      </header>

      <div className="palette-container">
        {colors.map((color, index) => {
          const textColor = getContrastColor(color.hex);
          const isDarkText = textColor === '#121212';
          return (
            <div 
              key={index} 
              className="color-column"
              style={{ backgroundColor: color.hex }}
            >
              <div className="color-info" style={{ color: textColor }}>
                <span 
                  className={`hex-code ${isDarkText ? 'dark-text' : ''}`}
                  onClick={() => copyToClipboard(color.hex)}
                  title="Click to copy"
                  style={{cursor: 'pointer'}}
                >
                  {color.hex}
                </span>
                <button 
                  className="lock-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  style={{ color: textColor }}
                  title={color.locked ? "Unlock" : "Lock"}
                >
                  {color.locked ? '🔒' : '🔓'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="instruction">Press spacebar to generate new palettes</div>

      {/* Drawer */}
      <div className={`drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)}>
        <div className="drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-header">
            <h2 className="drawer-title">Saved Palettes</h2>
            <button className="close-btn" onClick={() => setIsDrawerOpen(false)}>✕</button>
          </div>
          
          <div className="saved-list">
            {savedPalettes.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No palettes saved yet. Save a palette to see it here.</p>
            ) : (
              savedPalettes.map(palette => (
                <div key={palette.id || palette.createdAt} className="saved-palette">
                  <div className="saved-colors">
                    {palette.colors.map((hex, i) => (
                      <div 
                        key={i} 
                        className="saved-color" 
                        style={{ backgroundColor: hex }}
                        title={hex}
                      ></div>
                    ))}
                  </div>
                  <div className="saved-date">
                    {new Date(palette.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`toast ${toastMsg ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  );
}

export default App;
