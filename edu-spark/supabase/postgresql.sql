-- Users (managed by superbase Auth, plus custom fields)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    streak_frozen BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMPTZ,
    parent_email TEXT,
    parent_consent BOOLEAN DEFAULT false,
    push_subscription JSONB, --Jsonb sores in binary format which is easier to query, filter and index.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Topics (linear withing subjects)
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects ON DELETE CASCADE,
    name TEXT NOT NULL, 
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT true, -- unlocked via gateway quiz
    gateway_quiz_required_score INTEGER DEFAULT 70 -- percentage
);

-- Lessons
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    is_offline_ready BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false -- 88% lessons are premium
);

-- Personal notes
CREATE TABLE user_note (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCE profiles(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERECES lesson ON DELETE CASCADE,
    note TEXT, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER REFERENCES topics ON DELETE CASCADE,
    text TEXT NOT NULL,
    options JSONB --array of strings
    correct_answer INTEGER, -- index of correct option
    explanation TEXT,
    difficulty INTEGER DEFAULT 1, -- 1=EASY, 2=Medium 3 - Hard
    year INTEGER,
    exam_type TEXT,
    is_active BOOLEAN DEFAULT true,
    flags_count INTEGER DEFAULT 0 -- number of students flagged as incorrect
);

-- Exam definition
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects ON DELETE CASCADE,
    title TEXT NOT NULL, 
    description TEXT,
    exam_type TEXT, -- WAEC, NECO, JAMB
    year INTEGER,
    duration_minutes INTEGER DEFAULT 120,
    is_active BOOLEAN DEFAULT true
);

-- Exam questions (many-to-many)
CREATE TABLE exam_questions (
    exam_id INTEGER REFERENCES exams ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions ON DELETE CASCADE,
    PRIMARY KEY (exam_id, question_id)
);

-- User progress (question attempts)
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERECES profile(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions ON DELETE CASCADE,
    is_correct BOOLEAN,
    xp_earned INTEGER DEFAULT 0,
    coin_earned INTEGER DEFAULT 0,
    attempt_time TIMESTAMPTZ DEFAULT NOW(),
    mode TEXT -- 'practice' or 'exam'
);

-- Exam attempts (track completion & retries)
CREATE TABLE exam_attempts (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCE profiles(id) ON DELETE CASCADE,
    exam_id INTEGER REFERENCES exam ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    final_score INTEGER,
    xp_earned INTEGER,
    coins_earned INTEGER,
    retry_data JSONB --store which questions were incorrect
);

-- User achievements (topics mastered)
CREATE TABLE mastered_topics (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCE topics ON DELETE CASCADE,
    mastered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);

-- Shop items 
CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, 
    description TEXT, 
    price_coins INTEGER NOT NULL,
    item_type TEXT, -- 'streak freeze', 'extra_heart', 'double_xp'
    duration_minutes INTEGER -- form temporary powerups
);

-- User inventory (purchased items)
CREATE TABLE user_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCE shop_items ON DELETE CASCADE,
    purchase_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Subscription (via Paystack)
CREATE TABLE subscription (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCE profile(id) ON DELETE CASCADE,
    paystack_subscription_code TEXT UNIQUE,
    status TEXT, -- active, cancelled, expired
    plan TEXT, -- monthly, yearly
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flagged questions (student reports)
CREATE TABLE flagged_questions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    question_id INTEGER REFEERNCES questions ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false
);

-- Admin activity log
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id UUID REFERENCES profile(id),
    action TEXT,
    target_type TEXT,
    target_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

