-- =============================================
-- US Chinese Community Database Schema
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
    is_banned INTEGER DEFAULT 0,
    daily_post_count INTEGER DEFAULT 0,
    last_post_date TEXT,
    daily_comment_count INTEGER DEFAULT 0,
    last_comment_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_admin_only INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    state TEXT,
    city TEXT,
    phone TEXT,
    wechat TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'active', 'rejected', 'expired')),
    is_sticky INTEGER DEFAULT 0,
    sticky_order INTEGER DEFAULT 0,
    extra_fields TEXT,
    view_count INTEGER DEFAULT 0,
    expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Post images table
CREATE TABLE IF NOT EXISTS post_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories(id),
    position TEXT NOT NULL,
    title TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    is_active INTEGER DEFAULT 1,
    is_global INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

-- KV Store for site configuration
CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- Indexes
-- =============================================

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_expires_at ON posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_posts_is_sticky ON posts(is_sticky);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
