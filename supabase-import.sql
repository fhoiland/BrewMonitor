-- Create tables for Supabase import
-- Copy and paste this into Supabase SQL Editor

-- Sessions table for session storage
CREATE TABLE IF NOT EXISTS sessions (
    sid varchar PRIMARY KEY,
    sess jsonb NOT NULL,
    expire timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    username varchar UNIQUE NOT NULL,
    password varchar NOT NULL,
    email varchar UNIQUE,
    first_name varchar,
    last_name varchar,
    profile_image_url varchar,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Brewing data table
CREATE TABLE IF NOT EXISTS brewing_data (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    kettle_temperature real NOT NULL,
    malt_temperature real NOT NULL,
    mode text NOT NULL,
    power integer NOT NULL,
    time_gmt text NOT NULL,
    fermenter_beer_type text NOT NULL,
    fermenter_temperature real NOT NULL,
    fermenter_gravity real NOT NULL,
    fermenter_total text NOT NULL,
    fermenter_time_remaining text NOT NULL,
    fermenter_progress integer NOT NULL,
    updated_at timestamp DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    summary text NOT NULL,
    content text NOT NULL,
    image_url text,
    published boolean NOT NULL DEFAULT false,
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
    id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    total_batches integer NOT NULL,
    liters_produced integer NOT NULL,
    active_fermenters integer NOT NULL,
    days_since_last_batch integer NOT NULL,
    updated_at timestamp DEFAULT NOW()
);

-- Insert admin user (password: admin123)
INSERT INTO users (username, password) VALUES 
('admin', '$2b$10$42fY5xVSpcfIAre64ZN62.hc8HNeMHICi5t6k4v6rvJDDAz64tyb.');

-- Insert sample brewing data
INSERT INTO brewing_data (kettle_temperature, malt_temperature, mode, power, time_gmt, fermenter_beer_type, fermenter_temperature, fermenter_gravity, fermenter_total, fermenter_time_remaining, fermenter_progress) VALUES 
(65.5, 68.2, 'Mashing', 75, '2024-08-25T10:30:00Z', 'IPA', 20.1, 1.045, '23L', '5 days', 85);

-- Insert stats
INSERT INTO stats (total_batches, liters_produced, active_fermenters, days_since_last_batch) VALUES 
(47, 1200, 3, 2);

-- Insert blog posts with images
INSERT INTO blog_posts (title, summary, content, image_url, published) VALUES 
('Første brygg med Prefab Brew Crew', 
 'En kort oppsummering av vårt første brygg sammen som gruppe',
 'Hei bryggere! I dag deler vi historien om vårt aller første brygg som Prefab Brew Crew. Det var en lærerik opplevelse med mye skum, litt søl, og heldigvis også godt øl til slutt! Vi brukte en klassisk IPA-oppskrift og lærte masse underveis. Her er våre tips til andre nybegynnere...', 
 '/src/assets/first-brewing.png',
 true),
('Tips for hjemmebrygging på vinteren', 
 'Hvordan opprettholde riktig temperatur når det er kaldt ute',
 'Vinteren byr på unike utfordringer for hjemmebryggerene. Temperaturen kan påvirke gjæringen dramatisk, så her er våre beste tips for å brygge i kulda. Fra isolering til oppvarming - vi deler alt vi har lært!', 
 '/src/assets/winter-brewing.png',
 true);