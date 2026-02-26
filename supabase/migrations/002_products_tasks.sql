-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  brand         TEXT,
  category      TEXT,
  price         NUMERIC(12, 2),
  stock         INT DEFAULT 0,
  description   TEXT,
  sku           TEXT,
  active        BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deal_id     UUID REFERENCES deals(id) ON DELETE SET NULL,
  contact_id  UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  due_date    TIMESTAMPTZ,
  done        BOOLEAN DEFAULT FALSE,
  priority    TEXT DEFAULT 'medium',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Novos campos nos deals
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'whatsapp';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

-- RLS nas novas tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_data" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deal_id ON tasks(deal_id);
CREATE INDEX IF NOT EXISTS idx_deals_source ON deals(source);
CREATE INDEX IF NOT EXISTS idx_deals_product_id ON deals(product_id);
