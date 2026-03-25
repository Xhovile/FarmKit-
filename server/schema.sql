-- Ensure required extension for UUID generation exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    location TEXT,
    bio TEXT,
    avatar TEXT,
    primary_role TEXT NOT NULL,
    roles TEXT[] NOT NULL,
    status TEXT DEFAULT 'basic',
    email_verified BOOLEAN DEFAULT FALSE,
    seller_profile JSONB,
    organization_profile JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Market Listings table
CREATE TABLE IF NOT EXISTS market_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    unit TEXT NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    available_quantity DECIMAL(12, 2) NOT NULL,
    sold_quantity DECIMAL(12, 2) DEFAULT 0,
    location TEXT NOT NULL,
    delivery_method TEXT,
    description TEXT,
    business_name TEXT,
    phone TEXT,
    seller_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    seller_name TEXT,
    seller_status TEXT,
    verified BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    image_urls TEXT[],
    specs JSONB,
    views_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buyer Requests table
CREATE TABLE IF NOT EXISTS buyer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    unit TEXT NOT NULL,
    quantity_found DECIMAL(12, 2) DEFAULT 0,
    price_range TEXT,
    location TEXT NOT NULL,
    urgency TEXT DEFAULT 'normal',
    needed_by TEXT,
    buyer_type TEXT,
    delivery_preference TEXT,
    contact_method TEXT,
    description TEXT,
    reference_image_url TEXT,
    buyer_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    buyer_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saved Listings table
CREATE TABLE IF NOT EXISTS saved_listings (
    user_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    listing_id UUID REFERENCES market_listings(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, listing_id)
);

-- Hidden Listings table
CREATE TABLE IF NOT EXISTS hidden_listings (
    user_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    listing_id UUID REFERENCES market_listings(id) ON DELETE CASCADE,
    hidden_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, listing_id)
);
