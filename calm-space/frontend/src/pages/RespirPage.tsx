import { useState, useEffect, useRef } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import Navigation from '../components/Navigation';

interface Phase {
  label: string;
  duration: number;
  scale: number;
}

interface Technique {
  id: string;
  name: string;
  tagline: string;
  phases: Phase[];
  tip: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: '7-7',
    name: '7 — 7',
    tagline: 'Inspire 7s · Expire 7s',
    phases: [
      { label: 'Inspire', duration: 7, scale: 1.5 },
      { label: 'Expire',  duration: 7, scale: 0.8 },
    ],
    tip: 'Idéal pour une pause rapide à tout moment de la journée.',
  },
  {
    id: '4-7-8',
    name: '4 — 7 — 8',
    tagline: 'Inspire 4s · Retiens 7s · Expire 8s',
    phases: [
      { label: 'Inspire',  duration: 4, scale: 1.5 },
      { label: 'Retiens',  duration: 7, scale: 1.5 },
      { label: 'Expire',   duration: 8, scale: 0.8 },
    ],
    tip: "Technique du Dr Andrew Weil — aide à s'endormir et réduit l'anxiété.",
  },
  {
    id: 'box',
    name: 'Cohérence',
    tagline: 'Inspire 4s · Retiens 4s · Expire 4s · Retiens 4s',
    phases: [
      { label: 'Inspire',  duration: 4, scale: 1.5 },
      { label: 'Retiens',  duration: 4, scale: 1.5 },
      { label: 'Expire',   duration: 4, scale: 0.8 },
      { label: 'Retiens',  duration: 4, scale: 0.8 },
    ],
    tip: 'Utilisée par les Navy SEALs — équilibre le système nerveux sous pression.',
  },
];

const RespirPage = () => {
  const [selectedId, setSelectedId] = useState('7-7');
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [counter, setCounter] = useState(TECHNIQUES[0].phases[0].duration);

  const technique = TECHNIQUES.find(t => t.id === selectedId)!;
  const currentPhase = technique.phases[phaseIndex];

  const internalRef = useRef({ phaseIndex: 0, counter: TECHNIQUES[0].phases[0].duration, technique: TECHNIQUES[0] });

  useEffect(() => { internalRef.current.technique = technique; }, [technique]);

  useEffect(() => {
    if (!isBreathing) return;

    const id = setInterval(() => {
      const s = internalRef.current;
      s.counter -= 1;

      if (s.counter < 1) {
        const nextPi = (s.phaseIndex + 1) % s.technique.phases.length;
        s.phaseIndex = nextPi;
        s.counter = s.technique.phases[nextPi].duration;
        setPhaseIndex(nextPi);
        setCounter(s.counter);
      } else {
        setCounter(s.counter);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [isBreathing]);

  const start = () => {
    const t = TECHNIQUES.find(t => t.id === selectedId)!;
    internalRef.current.technique = t;
    internalRef.current.phaseIndex = 0;
    internalRef.current.counter = t.phases[0].duration;
    setPhaseIndex(0);
    setCounter(t.phases[0].duration);
    setIsBreathing(true);
  };

  const stop = () => {
    setIsBreathing(false);
    const t = TECHNIQUES.find(t => t.id === selectedId)!;
    internalRef.current.phaseIndex = 0;
    internalRef.current.counter = t.phases[0].duration;
    setPhaseIndex(0);
    setCounter(t.phases[0].duration);
  };

  const selectTechnique = (id: string) => {
    if (isBreathing) setIsBreathing(false);
    setSelectedId(id);
    const t = TECHNIQUES.find(t => t.id === id)!;
    internalRef.current.technique = t;
    internalRef.current.phaseIndex = 0;
    internalRef.current.counter = t.phases[0].duration;
    setPhaseIndex(0);
    setCounter(t.phases[0].duration);
  };

  const bubbleScale = isBreathing ? currentPhase.scale : 1;
  const transitionDuration = isBreathing ? `${currentPhase.duration * 1000}ms` : '700ms';

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Exercice de Respiration</h1>
          <p className="text-gray-500 text-lg">Suis la bulle pour calmer ton esprit et réduire le stress</p>
        </div>

        {/* Technique selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TECHNIQUES.map(t => (
            <button
              key={t.id}
              onClick={() => selectTechnique(t.id)}
              className={`px-5 py-3 rounded-xl text-sm border-2 transition-colors text-center ${
                selectedId === t.id
                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-500 hover:border-purple-200 hover:text-purple-600'
              }`}
            >
              <span className="block font-bold">{t.name}</span>
              <span className="block text-xs font-normal opacity-70 mt-0.5">{t.tagline}</span>
            </button>
          ))}
        </div>

        {/* Breathing bubble */}
        <div className="relative flex items-center justify-center min-h-[400px]">
          <div
            className="absolute rounded-full bg-purple-200 opacity-20"
            style={{
              width: '360px', height: '360px',
              transform: `scale(${bubbleScale * 0.9})`,
              transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
            }}
          />
          <div
            className="absolute rounded-full bg-purple-300 opacity-15"
            style={{
              width: '300px', height: '300px',
              transform: `scale(${bubbleScale * 0.95})`,
              transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
            }}
          />

          <div
            className="relative w-52 h-52 md:w-60 md:h-60 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(265,75%,65%), hsl(200,85%,65%))',
              boxShadow: '0 0 60px rgba(147,89,210,0.4)',
              transform: `scale(${bubbleScale})`,
              transition: `transform ${transitionDuration} cubic-bezier(0.4,0,0.2,1)`,
            }}
          >
            <div className="text-center text-white select-none">
              {isBreathing ? (
                <>
                  <p className="text-xl font-semibold mb-2 tracking-wide">{currentPhase.label}</p>
                  <p className="text-6xl font-bold tabular-nums">{counter}</p>
                </>
              ) : (
                <p className="text-lg font-medium opacity-90">Prêt ?</p>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="text-center mt-6">
          {isBreathing ? (
            <button onClick={stop} className="btn-outline text-base py-3 px-10 gap-2">
              <StopIcon className="w-4 h-4" /> Arrêter
            </button>
          ) : (
            <button onClick={start} className="btn-primary text-base py-3 px-10 gap-2">
              <PlayIcon className="w-4 h-4" /> Commencer
            </button>
          )}

          {!isBreathing && (
            <p className="text-sm text-gray-400 mt-4">{technique.tagline}</p>
          )}
        </div>

        {/* Tip card */}
        <div className="mt-10 calm-card p-6 animate-fade-in">
          <h2 className="font-semibold text-gray-800 mb-2">{technique.name}</h2>
          <p className="text-sm text-gray-500 mb-4">{technique.tip}</p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>· Installe-toi confortablement, assis ou allongé</li>
            <li>· Respire par le nez en inspirant, par la bouche en expirant</li>
            <li>· Pratique au moins 5 cycles pour ressentir les bienfaits</li>
            <li>· Ferme les yeux pour une relaxation optimale</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RespirPage;
