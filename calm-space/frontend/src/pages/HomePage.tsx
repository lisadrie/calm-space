import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  CloudIcon,
  FaceSmileIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const features = [
  {
    Icon: SparklesIcon,
    title: 'Faits Réconfortants',
    description: 'Vérités rassurantes ou faits amusants pour apaiser ton esprit.',
    link: '/faits',
    from: 'from-purple-500', to: 'to-pink-400',
    bg: 'bg-purple-50', ring: 'ring-purple-200',
  },
  {
    Icon: CloudIcon,
    title: 'Exercices de Respiration',
    description: 'Suis la bulle animée pour pratiquer des techniques apaisantes.',
    link: '/respiration',
    from: 'from-blue-500', to: 'to-cyan-400',
    bg: 'bg-blue-50', ring: 'ring-blue-200',
  },
  {
    Icon: FaceSmileIcon,
    title: 'Suivi des Émotions',
    description: 'Note tes sentiments et observe tes tendances sur 7 jours.',
    link: '/emotions',
    from: 'from-amber-400', to: 'to-orange-400',
    bg: 'bg-amber-50', ring: 'ring-amber-200',
  },
  {
    Icon: ClipboardDocumentListIcon,
    title: 'Diagnostic de Stress',
    description: 'Évalue ton niveau de stress avec le questionnaire Holmes-Rahe.',
    link: '/diagnostic',
    from: 'from-rose-500', to: 'to-red-400',
    bg: 'bg-rose-50', ring: 'ring-rose-200',
  },
];

const steps = [
  { step: '01', title: 'Crée ton compte',    desc: 'Inscription rapide, sans engagement.' },
  { step: '02', title: 'Explore les outils', desc: 'Respiration, émotions, faits réconfortants…' },
  { step: '03', title: 'Suis ta progression',desc: 'Historique, favoris et diagnostic de stress.' },
];

const stats = [
  { Icon: SparklesIcon,            label: '35+ faits réconfortants' },
  { Icon: CloudIcon,               label: '3 techniques de respiration' },
  { Icon: ClipboardDocumentListIcon, label: 'Diagnostic Holmes-Rahe' },
];

const HomePage = () => {
  const { decoded } = useAuth();

  return (
    <div className="min-h-screen soft-bg">
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 min-h-[92vh] flex items-center">
        <div className="blob w-[520px] h-[520px] -top-32 -right-24 bg-purple-300" />
        <div className="blob w-[380px] h-[380px] top-1/3 -left-20 bg-cyan-200" style={{ animationDelay: '2s' }} />
        <div className="blob w-[260px] h-[260px] bottom-0 right-1/4 bg-pink-200" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-1.5 text-sm text-purple-600 font-medium mb-8 animate-fade-in shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
              Espace de bien-être mental
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in stagger-1">
              Trouvez Votre
              <span className="block gradient-text">Espace Calme</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed animate-fade-in stagger-2">
              Un espace conçu pour vous aider à vous sentir plus calme,
              plus ancré et en contrôle lors des moments d'anxiété.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-3">
              <Link to="/respiration">
                <button className="btn-primary text-base py-3.5 px-8 w-full sm:w-auto gap-2 rounded-2xl">
                  <CloudIcon className="w-5 h-5" />
                  Commencer à Respirer
                </button>
              </Link>
              <Link to={decoded ? '/emotions' : '/inscription'}>
                <button className="btn-outline text-base py-3.5 px-8 w-full sm:w-auto gap-2 rounded-2xl">
                  {decoded ? (
                    <><FaceSmileIcon className="w-5 h-5" /> Mes Émotions</>
                  ) : (
                    <>Créer mon compte <ArrowRightIcon className="w-4 h-4" /></>
                  )}
                </button>
              </Link>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-4 mt-14 animate-fade-in stagger-4">
              {stats.map(({ Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm">
                  <Icon className="w-4 h-4 text-purple-500" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(265,90%,97%)] to-transparent" />
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Vos outils bien-être
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Des moyens simples et efficaces pour gérer le stress au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Link key={i} to={f.link} className={`block animate-slide-up stagger-${i + 1}`}>
                <div className={`calm-card p-6 h-full group cursor-pointer ${f.bg} border-0 ring-1 ${f.ring} hover:ring-2 transition-all duration-200`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.from} ${f.to} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <f.Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold mb-2 text-gray-800">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-400 group-hover:text-purple-600 group-hover:gap-2 transition-all duration-150">
                    Découvrir <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Comment ça marche ?</h2>
            <p className="text-gray-500 text-lg">Démarrez en 3 étapes simples</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className={`calm-card p-7 text-center animate-slide-up stagger-${i + 1}`}>
                <div className="text-4xl font-black gradient-text mb-3">{s.step}</div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      {!decoded && (
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center text-white"
              style={{ background: 'linear-gradient(135deg, hsl(265,75%,62%), hsl(200,85%,58%))' }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

              <div className="relative">
                <p className="text-white/70 font-medium mb-3 text-sm uppercase tracking-wider">Prêt à commencer ?</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez CalmSpace</h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Créez votre compte gratuitement pour sauvegarder votre progression, vos favoris et votre historique d'émotions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/inscription">
                    <button className="bg-white text-purple-700 font-bold py-3.5 px-8 rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg w-full sm:w-auto inline-flex items-center gap-2">
                      Créer mon compte <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link to="/connexion">
                    <button className="border-2 border-white/40 text-white font-semibold py-3.5 px-8 rounded-2xl hover:bg-white/10 active:scale-[0.98] transition-all w-full sm:w-auto">
                      Déjà un compte
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-purple-100/60">
        <p>© {new Date().getFullYear()} CalmSpace — Votre espace de sérénité</p>
        <p className="mt-1.5 text-xs inline-flex items-center gap-1.5 justify-center">
          <PhoneIcon className="w-3.5 h-3.5 text-red-400" />
          Numéro national de prévention du suicide :
          <span className="font-semibold text-red-400">3114</span> · 24h/24
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
