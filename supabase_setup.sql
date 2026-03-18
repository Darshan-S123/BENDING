-- Run this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/ghjjkkporzqotciudzaq/sql/new

-- ============================================================
-- LOANS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS loans (
    id BIGINT PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    phone TEXT,
    "principalAmount" TEXT,
    "interestRate" TEXT,
    "interestType" TEXT DEFAULT 'Simple',
    "interestBasis" TEXT DEFAULT 'Monthly',
    "borrowDate" TEXT,
    "dueDate" TEXT,
    status TEXT DEFAULT 'Pending',
    interest TEXT DEFAULT '0.00',
    "totalAmount" TEXT DEFAULT '0.00',
    "settlementMonth" TEXT,
    "settledDate" TEXT,
    "customSettlement" BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- LEDGER TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS ledger (
    id BIGINT PRIMARY KEY,
    date TIMESTAMPTZ DEFAULT NOW(),
    "customerName" TEXT,
    amount TEXT,
    type TEXT,
    category TEXT,
    status TEXT DEFAULT 'Completed'
);

-- ============================================================
-- Disable Row Level Security (RLS) so app can read/write freely
-- (safe for a private personal finance app)
-- ============================================================
ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
ALTER TABLE ledger DISABLE ROW LEVEL SECURITY;
