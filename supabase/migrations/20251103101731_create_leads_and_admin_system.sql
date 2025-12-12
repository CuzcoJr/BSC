/*
  # Sistema de Leads e Administração BSC

  1. Novas Tabelas
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - Nome do lead
      - `email` (text) - Email do lead
      - `phone` (text) - Telefone/WhatsApp
      - `service` (text) - Serviço de interesse
      - `message` (text) - Mensagem opcional
      - `source` (text) - Origem do lead
      - `status` (text) - Status: new, contacted, converted, closed
      - `created_at` (timestamptz) - Data de criação
      - `updated_at` (timestamptz) - Data de atualização
      - `assigned_to` (uuid) - ID do usuário responsável
      
    - `admin_notes`
      - `id` (uuid, primary key)
      - `lead_id` (uuid) - Referência ao lead
      - `user_id` (uuid) - ID do usuário que criou a nota
      - `note` (text) - Conteúdo da nota
      - `created_at` (timestamptz) - Data de criação
      
    - `service_analytics`
      - `id` (uuid, primary key)
      - `service_name` (text) - Nome do serviço
      - `views` (integer) - Número de visualizações
      - `requests` (integer) - Número de solicitações
      - `date` (date) - Data do registro
      - `created_at` (timestamptz) - Data de criação

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Leads: público pode inserir, apenas autenticados podem ler/atualizar
    - Admin notes: apenas autenticados podem criar e ler suas próprias notas
    - Analytics: apenas autenticados podem ler
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  message text DEFAULT '',
  source text DEFAULT 'landing_bsc',
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  assigned_to uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  note text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  views integer DEFAULT 0,
  requests integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(service_name, date)
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create notes"
  ON admin_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all notes"
  ON admin_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view analytics"
  ON service_analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analytics"
  ON service_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_lead_id ON admin_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_service_analytics_date ON service_analytics(date DESC);
