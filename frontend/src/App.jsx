import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const [selectedOption, setSelectedOption] = useState('title')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [charCount, setCharCount] = useState(0)
  const inputRef = useRef(null);


  useEffect(() => {
    document.documentElement.className = darkMode ? 'dark' : 'light'
    document.body.style.backgroundColor = darkMode ? '#1a1a2e' : '#f8f9fa'
  }, [darkMode])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/generate',
        {
          text: inputText,
          option: selectedOption,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setResult(response.data.result);
    } catch (error) {
      setResult(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setCharCount(value.length);

    const isArabic = /[\u0600-\u06FF]/.test(value);
    if (inputRef.current) {
      inputRef.current.style.direction = isArabic ? 'rtl' : 'ltr';
      inputRef.current.style.textAlign = isArabic ? 'right' : 'left';
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <div className="header-container">
          <h1 className="title">Article Generator</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="generator-form">
          <div className="form-group full-width">
            <label htmlFor="text-input">
              Enter your article/idea:
              <span className="char-count"> {charCount}/5000</span>
            </label>
            <textarea
              id="text-input"
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              rows={6}
              maxLength={5000}
              placeholder="Type your article, idea, or paste an existing article here..."
            />
          </div>

          <div className="form-group full-width">
            <fieldset>
              <legend>Generation Options</legend>
              <div className="radio-group">
                {[
                  { value: 'title', label: 'Generate Title' },
                  { value: 'article', label: 'Generate Article' },
                  { value: 'summary', label: 'Generate Summary' }
                ].map((option) => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="generation-option"
                      value={option.value}
                      checked={selectedOption === option.value}
                      onChange={() => setSelectedOption(option.value)}
                    />
                    <span className="radio-custom"></span>
                    {option.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="form-group full-width center-button">
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="generate-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Generating...
                </>
              ) : 'Generate Content'}
            </button>
          </div>
        </form>

        {result && (
          <div className="result-card full-width">
            <div className="result-header">
              <h2>Generated Result</h2>
              <button onClick={copyToClipboard} className="copy-btn">
                Copy to Clipboard
              </button>
            </div>
            <div
              className="result-content"
              style={{
                direction: /[\u0600-\u06FF]/.test(result) ? 'rtl' : 'ltr',
                textAlign: /[\u0600-\u06FF]/.test(result) ? 'right' : 'left'
              }}
            >
              {result.split('\n').map((paragraph, i) => (
                <p key={i}>
                  {paragraph.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={index}>{part.slice(2, -2)}</strong>
                    }
                    return <React.Fragment key={index}>{part}</React.Fragment>
                  })}
                </p>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App