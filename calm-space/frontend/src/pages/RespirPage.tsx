import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

const RespirPage = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [counter, setCounter] = useState(7);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'));
          return 7;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const toggleBreathing = () => {
    if (!isBreathing) {
      setPhase('inhale');
      setCounter(7);
    }
    setIsBreathing(!isBreathing);
  };

  return (
    <div className="min-h-screen calm-bg">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Exercice de Respiration
          </h1>
          <p className="text-gray-500 text-lg">
            Suis la bulle pour calmer ton esprit et réduire le stress
          </p>
        </div>

        {/* Breathing bubble */}
        <div className="relative flex items-center justify-center min-h-[480px]">
          {/* Outer glow rings */}
          {isBreathing && (
            <>
              <div
                className={`absolute rounded-full bg-purple-200 opacity-20 transition-transform ${
                  isBreathing ? (phase === 'inhale' ? 'scale-150' : 'scale-90') : 'scale-100'
                }`}
                style={{
                  width: '360px',
                  height: '360px',
                  transitionDuration: '7000ms',
                  transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                }}
              />
              <div
                className={`absolute rounded-full bg-purple-300 opacity-15 transition-transform ${
                  isBreathing ? (phase === 'inhale' ? 'scale-150' : 'scale-90') : 'scale-100'
                }`}
                style={{
                  width: '300px',
                  height: '300px',
                  transitionDuration: '7000ms',
                  transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </>
          )}

          {/* Main bubble */}
          <div
            className="relative w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))',
              boxShadow: '0 0 60px rgba(147,89,210,0.4)',
              transform: isBreathing
                ? phase === 'inhale' ? 'scale(1.5)' : 'scale(0.8)'
                : 'scale(1)',
              transition: isBreathing
                ? 'transform 7000ms cubic-bezier(0.4,0,0.2,1)'
                : 'transform 700ms ease-out',
            }}
          >
            <div className="text-center text-white">
              {isBreathing ? (
                <>
                  <div className="text-4xl mb-2">🌬️</div>
                  <p className="text-xl font-semibold">
                    {phase === 'inhale' ? 'Inspire' : 'Expire'}
                  </p>
                  <p className="text-5xl font-bold mt-2">{counter}</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">🌬️</div>
                  <p className="text-lg font-medium">Prêt(e) ?</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center mt-8">
          <button
            onClick={toggleBreathing}
            className="btn-primary text-base py-3 px-10 inline-flex items-center gap-2"
          >
            {isBreathing ? (
              <>
                <span>⏸</span> Pause
              </>
            ) : (
              <>
                <span>▶️</span> Commencer
              </>
            )}
          </button>

          {!isBreathing && (
            <p className="text-sm text-gray-400 mt-4">
              Inspire pendant 7 secondes, puis expire pendant 7 secondes
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 calm-card p-6 animate-fade-in">
          <h2 className="font-semibold text-gray-800 mb-3">💡 Conseils</h2>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>• Installe-toi confortablement, assis ou allongé</li>
            <li>• Respire par le nez en inspirant, par la bouche en expirant</li>
            <li>• Pratique au moins 5 cycles pour ressentir les bienfaits</li>
            <li>• Ferme les yeux pour une relaxation optimale</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RespirPage;
