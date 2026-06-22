export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'direzione'
  | 'amministrazione'
  | 'tecnico'
  | 'capocantiere'
  | 'operaio'
  | 'consulente';

export type CompanyPlan = 'free' | 'base' | 'professional' | 'enterprise';
export type CompanyStatus = 'active' | 'trial' | 'suspended' | 'archived';

export interface CompanySettings {
  modules?: string[];
  timezone?: string;
  currency?: string;
  ai_enabled?: boolean;
  whatsapp_enabled?: boolean;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  name: string;
  vat_number?: string | null;
  fiscal_code?: string | null;
  logo_url?: string | null;
  plan: CompanyPlan;
  status: CompanyStatus;
  settings: CompanySettings;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  default_company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  profile_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  company?: Company;
  profile?: Profile;
}

export interface Project {
  id: string;
  company_id: string;
  code?: string | null;
  name: string;
  client_name: string;
  location?: string | null;
  status: 'planned' | 'active' | 'on_hold' | 'completed' | 'archived';
  contract_amount: number;
  costs_to_date: number;
  revenues_to_date: number;
  margin_estimated: number;
  progress: number;
  manager_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  alerts_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectCost {
  id: string;
  company_id: string;
  project_id: string;
  category: 'materials' | 'labor' | 'equipment' | 'subcontractors' | 'services' | 'other';
  description: string;
  amount: number;
  source_type?: 'invoice' | 'daily_report' | 'delivery_note' | 'manual' | null;
  source_id?: string | null;
  date: string;
}

export interface ProjectRevenue {
  id: string;
  company_id: string;
  project_id: string;
  description: string;
  amount: number;
  source_type?: 'invoice' | 'sal' | 'manual' | null;
  source_id?: string | null;
  date: string;
}

export interface Invoice {
  id: string;
  company_id: string;
  project_id?: string | null;
  type: 'active' | 'passive';
  number: string;
  entity_name: string;
  amount: number;
  issue_date?: string | null;
  due_date: string;
  status: 'draft' | 'pending' | 'assigned' | 'approved' | 'rejected' | 'to_pay' | 'paid';
  approver_id?: string | null;
  notes?: string | null;
  file_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashflowMovement {
  id: string;
  company_id: string;
  project_id?: string | null;
  invoice_id?: string | null;
  type: 'income' | 'expense';
  amount: number;
  expected_date: string;
  actual_date?: string | null;
  status: 'planned' | 'confirmed' | 'paid' | 'overdue';
  description: string;
}

export interface DocumentFile {
  id: string;
  company_id?: string | null;
  project_id?: string | null;
  name: string;
  path?: string | null;
  url?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  category?: string | null;
  created_at?: string | null;
}

export type IncomingMessageCategory =
  | 'daily_report'
  | 'delivery_note'
  | 'site_photo'
  | 'hours'
  | 'material'
  | 'safety'
  | 'invoice_approval'
  | 'note'
  | 'unknown';

export type IncomingMessageStatus =
  | 'received'
  | 'to_classify'
  | 'classified'
  | 'converted'
  | 'archived'
  | 'error';

export interface IncomingMessage {
  id: string;
  company_id: string;
  channel: 'whatsapp_mock' | 'whatsapp_cloud_api' | 'telegram' | 'internal_chat';
  sender_name: string;
  sender_phone?: string | null;
  text: string;
  timestamp: string;
  attachments?: DocumentFile[] | null;
  suggested_project_id?: string | null;
  suggested_project_name?: string | null;
  category?: IncomingMessageCategory | null;
  confidence?: number | null;
  status: IncomingMessageStatus;
}

export interface WhatsAppThread {
  id: string;
  company_id: string;
  sender_name: string;
  sender_phone: string;
  project_id?: string | null;
  last_message_at: string;
  status: 'open' | 'closed';
}

export interface DailyReport {
  id: string;
  company_id: string;
  project_id: string;
  date: string;
  workers_count: number;
  hours_total: number;
  description: string;
  materials?: string[] | null;
  equipment?: string[] | null;
  photos?: DocumentFile[] | null;
  source_message_id?: string | null;
  status: 'draft' | 'to_verify' | 'verified' | 'rejected';
  created_at: string;
}

export interface DeliveryNote {
  id: string;
  company_id: string;
  project_id?: string | null;
  supplier_id?: string | null;
  number: string;
  date: string;
  items: string[];
  file_url?: string | null;
  invoice_id?: string | null;
  status: 'received' | 'matched' | 'to_match' | 'archived';
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  vat_number?: string | null;
  email?: string | null;
  phone?: string | null;
  category?: string | null;
  rating?: number | null;
}

export interface PurchaseOrder {
  id: string;
  company_id: string;
  project_id?: string | null;
  supplier_id?: string | null;
  number: string;
  amount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface SafetyDocument {
  id: string;
  company_id: string;
  type: 'POS' | 'PSC' | 'DURC' | 'attestato' | 'visita_medica' | 'DPI' | 'polizza' | 'altro';
  title: string;
  expiry_date?: string | null;
  project_id?: string | null;
  worker_id?: string | null;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  file_url?: string | null;
}

export interface AiConversation {
  id: string;
  company_id: string;
  title: string;
  created_by: string;
  created_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id?: string | null;
  company_id?: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown> | null;
}
