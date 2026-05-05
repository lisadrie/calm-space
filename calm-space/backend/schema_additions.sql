-- ============================================================
-- Calm Space - Additions au schéma de Claire Obscure
-- À exécuter après le schéma principal de Claire Obscure
-- ============================================================

-- Table des émotions enregistrées
CREATE TABLE IF NOT EXISTS emotions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion VARCHAR(50) NOT NULL,
    emoji VARCHAR(10),
    color VARCHAR(100),
    logged_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des favoris (faits réconfortants / amusants)
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fact_text TEXT NOT NULL,
    fact_type VARCHAR(50) NOT NULL CHECK (fact_type IN ('reassuring', 'fun')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, fact_text, fact_type)
);

-- Table des évaluations de stress Holmes-Rahe
CREATE TABLE IF NOT EXISTS stress_assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    selected_events JSONB DEFAULT '[]',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_emotions_user_id ON emotions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_stress_assessments_user_id ON stress_assessments(user_id);
