-- ============================================================
-- CalmSpace — Schéma complet
-- ============================================================

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    civility VARCHAR(20) NOT NULL DEFAULT 'Monsieur',
    lastname VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    phone VARCHAR(20),
    birthdate TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    pseudo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    created TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table admins
CREATE TABLE IF NOT EXISTS admins (
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    added TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table moderators
CREATE TABLE IF NOT EXISTS moderators (
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    added TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table super_admins
CREATE TABLE IF NOT EXISTS super_admins (
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    added TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table emotions
CREATE TABLE IF NOT EXISTS emotions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emotion VARCHAR(50) NOT NULL,
    emoji VARCHAR(10),
    color VARCHAR(100),
    logged_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table favorites
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fact_text TEXT NOT NULL,
    fact_type VARCHAR(50) NOT NULL CHECK (fact_type IN ('reassuring', 'fun')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, fact_text, fact_type)
);

-- Table stress_assessments
CREATE TABLE IF NOT EXISTS stress_assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    selected_events JSONB DEFAULT '[]',
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_emotions_user_id ON emotions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_stress_assessments_user_id ON stress_assessments(user_id);