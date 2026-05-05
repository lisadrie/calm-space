import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const features = [
  {
    emoji: '✨',
    title: 'Faits Réconfortants',
    description: 'Vérités rassurantes ou faits amusants pour apaiser ton esprit.',
    link: '/faits',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    emoji: '🌬️',
    title: 'Exercices de Respiration',
    description: 'Suis la bulle animée pour pratiquer des techniques de respiration apaisantes.',
    link: '/respiration',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    emoji: '😊',
    title: 'Suivi des Émotions',
    description: 'Note tes sentiments et transforme la conscience émotionnelle en quelque chose de positif.',
    link: '/emotions',
    gradient: 'from-yellow-400 to-orange-400',
  },
  {
    emoji: '🧠',
    title: 'Diagnostic de Stress',
    description: 'Évalue ton niveau de stress avec le questionnaire Holmes-Rahe.',
    link: '/diagnostic',
    gradient: 'from-red-400 to-rose-400',
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-16"
        style={{
          backgroundImage: 'url(/hero-calm.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay léger pour lisibilité du texte */}
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.45)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Trouvez Votre
              <span className="block gradient-text">Espace Calme</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Un espace réconfortant conçu pour vous aider à vous sentir plus calme,
              plus positif et en contrôle lors des moments d'anxiété.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/respiration">
                <button className="btn-primary text-base py-3 px-8 w-full sm:w-auto flex items-center justify-center gap-2">
                  Commencer à Respirer
                  <span>→</span>
                </button>
              </Link>
              <Link to="/faits">
                <button className="btn-outline text-base py-3 px-8 w-full sm:w-auto">
                  Explorer les Faits
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, hsl(250,100%,98%), hsl(265,90%,96%))' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Outils pour Votre Bien-être
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            Des moyens simples et efficaces pour gérer le stress et l'anxiété
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="block animate-scale-in hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="calm-card p-6 h-full hover:shadow-glow transition-shadow">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-2xl`}>
                    {feature.emoji}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="calm-card max-w-3xl mx-auto p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Prêt à Vous Sentir Plus Calme ?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Créez votre compte pour sauvegarder votre progression et personnaliser votre expérience
          </p>
          <Link to="/inscription">
            <button className="btn-primary text-base py-3 px-8 gap-2 inline-flex items-center">
              Commencer
              <span>→</span>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
