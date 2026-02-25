-- Companies
CREATE TABLE companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  website     TEXT,
  industry    TEXT,
  size        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id  UUID REFERENCES companies(id) ON DELETE SET NULL,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  role        TEXT,
  avatar_url  TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline Stages
CREATE TABLE pipeline_stages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  position    INT NOT NULL,
  color       TEXT DEFAULT '#6366f1'
);

-- Deals
CREATE TABLE deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id          UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id          UUID REFERENCES companies(id) ON DELETE SET NULL,
  stage_id            UUID REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  title               TEXT NOT NULL,
  value               NUMERIC(12, 2),
  currency            TEXT DEFAULT 'USD',
  priority            TEXT DEFAULT 'medium',
  expected_close_date DATE,
  position            INT DEFAULT 0,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Activities
CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deal_id     UUID REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  contact_id  UUID REFERENCES contacts(id) ON DELETE SET NULL,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  due_date    TIMESTAMPTZ,
  done        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage_id ON deals(stage_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
CREATE INDEX idx_companies_user_id ON companies(user_id);

-- Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON companies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_data" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_data" ON deals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_data" ON activities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_data" ON pipeline_stages FOR ALL USING (auth.uid() = user_id);

-- Auto-update updated_at on deals
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create default pipeline stages for new users
CREATE OR REPLACE FUNCTION create_default_stages()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pipeline_stages (user_id, name, position, color) VALUES
    (NEW.id, 'Lead', 1, '#94a3b8'),
    (NEW.id, 'Qualified', 2, '#60a5fa'),
    (NEW.id, 'Proposal', 3, '#f59e0b'),
    (NEW.id, 'Negotiation', 4, '#a78bfa'),
    (NEW.id, 'Closed Won', 5, '#22c55e'),
    (NEW.id, 'Closed Lost', 6, '#f87171');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_stages();
