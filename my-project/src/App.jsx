import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(12);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charAllowed, setCharAllowed] = useState(true);
  const [customChars, setCustomChars] = useState("!@#$%^&*()_+-=[]{}|:;,.<>?");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const passwordRef = useRef(null);

  const calculateStrength = useCallback((pwd) => {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score === 0) return "Weak";
    if (score === 1) return "Moderate";
    return "Strong";
  }, []);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += customChars;

    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
    setStrength(calculateStrength(pass));
  }, [length, numberAllowed, charAllowed, customChars, calculateStrength]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, customChars, passwordGenerator]);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-r from-indigo-400 to-violet-400 text-black'}`}>
      <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-all`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🔐 Password Generator</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm px-3 py-1 rounded-full border transition hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex mb-4 shadow-inner rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <input
            type="text"
            value={password}
            ref={passwordRef}
            readOnly
            className="w-full px-4 py-2 text-lg text-black dark:text-white bg-white dark:bg-gray-800 outline-none"
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 transition font-semibold"
          >
            Copy
          </button>
        </div>

        <div className="text-sm mb-4 font-medium">
          Strength:
          <span className={`ml-2 font-bold ${strength === "Weak" ? "text-red-500" : strength === "Moderate" ? "text-yellow-400" : "text-green-500"}`}>
            {strength}
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-x-3">
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
            <span className="font-semibold">Length: {length}</span>
          </div>

          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
              id="numbers"
              className="w-4 h-4"
            />
            <label htmlFor="numbers">Include Numbers</label>
          </div>

          <div className="flex items-center gap-x-3">
            <input
              type="checkbox"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
              id="specials"
              className="w-4 h-4"
            />
            <label htmlFor="specials">Include Special Characters</label>
          </div>

          {charAllowed && (
            <div>
              <label className="block font-semibold mb-1">Custom Special Characters</label>
              <input
                type="text"
                value={customChars}
                onChange={(e) => setCustomChars(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
          )}

          <button
            onClick={passwordGenerator}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold transition"
          >
            🔁 Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
