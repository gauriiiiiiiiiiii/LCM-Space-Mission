/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';

type GameState = 'setup' | 'running' | 'finished';

// Helper function to calculate GCD (for LCM calculation)
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
// Helper function to calculate LCM
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const App: React.FC = () => {
  const [num1, setNum1] = useState<string>('3');
  const [num2, setNum2] = useState<string>('4');
  const [error, setError] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>('setup');
  const [lcmResult, setLcmResult] = useState<number | null>(null);
  const [maxPlanet, setMaxPlanet] = useState<number>(0);
  const [revealedPlanets, setRevealedPlanets] = useState<number>(0);
  const [showResultBox, setShowResultBox] = useState<boolean>(false);

  const parsedNum1 = parseInt(num1);
  const parsedNum2 = parseInt(num2);

  const multiples1 = useMemo(() => {
    if (isNaN(parsedNum1) || maxPlanet === 0) return new Set();
    const multiples = new Set<number>();
    for (let i = parsedNum1; i <= maxPlanet; i += parsedNum1) {
      multiples.add(i);
    }
    return multiples;
  }, [parsedNum1, maxPlanet]);

  const multiples2 = useMemo(() => {
    if (isNaN(parsedNum2) || maxPlanet === 0) return new Set();
    const multiples = new Set<number>();
    for (let i = parsedNum2; i <= maxPlanet; i += parsedNum2) {
      multiples.add(i);
    }
    return multiples;
  }, [parsedNum2, maxPlanet]);

  useEffect(() => {
    if (gameState === 'running' && revealedPlanets < maxPlanet) {
      const timer = setTimeout(() => {
        setRevealedPlanets(prev => prev + 1);
      }, 75); // Animation speed
      return () => clearTimeout(timer);
    }
    if (gameState === 'running' && revealedPlanets >= maxPlanet) {
      setGameState('finished');
    }
  }, [gameState, revealedPlanets, maxPlanet]);

  useEffect(() => {
    if (gameState === 'finished') {
      // After animation ends, LCM planet is highlighted. Wait a bit before showing the result box.
      const timer = setTimeout(() => {
        setShowResultBox(true);
      }, 1500); // 1.5 second delay
      return () => clearTimeout(timer);
    }
  }, [gameState]);


  const handleStart = () => {
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    if (isNaN(n1) || isNaN(n2) || n1 < 1 || n2 < 1 || n1 > 20 || n2 > 20) {
      setError('Please enter two numbers between 1 and 20.');
      return;
    }
    if (n1 === n2) {
      setError('Please enter two different numbers.');
      return;
    }

    setError('');
    const result = lcm(n1, n2);
    setLcmResult(result);
    setMaxPlanet(result > 30 ? result + 5 : Math.max(30, n1 * 2, n2 * 2));
    setRevealedPlanets(0);
    setShowResultBox(false);
    setGameState('running');
  };

  const handleReset = () => {
    setGameState('setup');
    setError('');
    setLcmResult(null);
    setRevealedPlanets(0);
    setShowResultBox(false);
  };

  const renderPlanets = () => {
    const planets = [];
    for (let i = 1; i <= maxPlanet; i++) {
      if (i > revealedPlanets && gameState === 'running') break;

      const isMultiple1 = multiples1.has(i);
      const isMultiple2 = multiples2.has(i);
      const isLcm = i === lcmResult;
      
      let planetClass = 'w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-2 border-gray-600 bg-gray-800/50 transition-all duration-300 planet';
      
      if (isLcm && gameState === 'finished') {
        planetClass += ' highlight-lcm text-black';
      } else if (isMultiple1 && isMultiple2) {
        // When a number is a multiple of both, it gets a combined visual
        planetClass += ' highlight-1 highlight-2';
      } else if (isMultiple1) {
        planetClass += ' highlight-1';
      } else if (isMultiple2) {
        planetClass += ' highlight-2';
      }
      
      planets.push(
        <div key={i} className={planetClass} style={{ animationDelay: `${(i % 10) * 0.05}s` }}>
          {i}
        </div>
      );
    }
    return planets;
  };
  
  const SetupScreen = () => (
    <div className="text-center bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl flex flex-col items-center max-w-lg">
        <h1 className="text-5xl font-bold mb-4 alien-glow">LCM Space Mission</h1>
        <p className="text-gray-300 mb-6">Teach Math via Games and Activities! Help our alien friends find the first planet they can both visit.</p>
        <div className="bg-gray-800 p-4 rounded-lg mb-6 w-full">
            <p className="text-indigo-300">Concept: Least Common Multiple (LCM)</p>
            <p className="text-sm text-gray-400 mt-2">The smallest positive number that is a multiple of two or more numbers.</p>
        </div>

        <div className="flex gap-4 mb-4 items-center">
          <div className="flex flex-col items-center">
            <label htmlFor="num1" className="text-blue-400 mb-2">Alien Ship #1</label>
            <input 
              id="num1" 
              type="number" 
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-24 p-2 text-center text-2xl bg-gray-900 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              min="1"
              max="20"
            />
          </div>
          <div className="text-4xl text-gray-500 mt-8">×</div>
          <div className="flex flex-col items-center">
            <label htmlFor="num2" className="text-green-400 mb-2">Alien Ship #2</label>
            <input 
              id="num2" 
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-24 p-2 text-center text-2xl bg-gray-900 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              min="1"
              max="20"
            />
          </div>
        </div>

        {error && <p className="text-red-400 my-4">{error}</p>}
        
        <button onClick={handleStart} className="w-full mt-4 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xl transition-transform transform hover:scale-105">
          Start Mission!
        </button>
    </div>
  );

  const GameScreen = () => (
    <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6 bg-black/40 p-4 rounded-xl border border-gray-700">
            <h2 className="text-3xl font-bold">Mission in Progress...</h2>
            <p className="text-gray-300">Finding common landing zone for Ship <span className="text-blue-400 font-bold">{num1}</span> and Ship <span className="text-green-400 font-bold">{num2}</span>.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {renderPlanets()}
        </div>
        
        {showResultBox && (
          <div className="mt-8 text-center bg-black/60 p-8 rounded-2xl border-2 border-yellow-400 animate-planet-pop-in">
              <h2 className="text-4xl font-bold text-yellow-300 mb-4">Mission Accomplished!</h2>
              <p className="text-xl">
                The first common planet is <span className="font-bold text-2xl text-white">{lcmResult}</span>.
              </p>
              <p className="text-xl mt-2">
                The LCM of {num1} and {num2} is <span className="font-bold text-2xl text-white">{lcmResult}</span>!
              </p>
              <button onClick={handleReset} className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-lg transition-transform transform hover:scale-105">
                Play Again
              </button>
          </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen text-gray-200 flex flex-col items-center justify-center p-4">
      {gameState === 'setup' ? <SetupScreen /> : <GameScreen />}
    </div>
  );
};

export default App;
