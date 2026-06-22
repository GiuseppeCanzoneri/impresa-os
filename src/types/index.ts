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

export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  fiscal_code?: string;
  logo_url?: string;
  plan: CompanyPlan;
  status: CompanyStatus;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  default_company_id?: string;
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
}

export interface Project {
  id: string;
  company_id: string;
  code?: string;
  name: string;
  client_name: string;
  location?: string;
  status: 'planned' | 'active' | 'on_hold' | 'completed' | 'archived';
  contract_amount: number;
  costs_to_date: number;
  revenues_to_date: number;
  margin_estimated: number;
  progress: number;
  manager_id?: string;
  start_date?: string;
  end_date?: string;
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
  source_type?: 'invoice' | 'daily_report' | 'delivery_note' | 'manual';
  source_id?: string;
  date: string;
}

export interface ProjectRevenue {
  id: string;
  company_id: string;
  project_id: string;
  description: string;
  amount: number;
  source_type?: 'invoice' | 'sal' | 'manual';
  source_id?: string;
  date: string;
}

export interface Invoice {
  id: string;
  company_id: string;
  project_id?: string;
  type: 'active' | 'passive';
  number: string;
  entity_name: string;
  amount: number;
  issue_date?: string;
  due_date: string;
  status: 'draft' | 'pending' | 'assigned' | 'approved' | 'rejected' | 'to_pay' | 'paid';
  approver_id?: string;
  notes?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CashflowMovement {
  id: string;
  company_id: string;
  project_id?: string;
  invoice_id?: string;
  type: 'income' | 'expense';
  amount: number;
  expected_date: string;
  actual_date?: string;
  status: 'planned' | 'confirmed' | 'paid' | 'overdue';
  description: string;
}

export interface IncomingMessage {
  id: string;
  company_id: string;
  channel: 'whatsapp_mock' | 'whatsapp_cloud_api' | 'telegram' | 'internal_chat';
  sender_name: string;
  sender_phone?: string;
  text: string;
  timestamp: string;
  attachments?: DocumentFile[];
  suggested_project_id?: string;
  suggested_project_name?: string;
  category?: 'daily_report' | 'delivery_note' | 'site_photo' | 'hours' | 'material' | 'safety' | 'invoice_approval' | 'note' | 'unknown';
  confidence?: number;
  status: 'received' | 'to_classify' | 'classified' | 'converted' | 'archived' | 'error';
}

export interface WhatsAppThread {
  id: string;
  company_id: string;
  sender_name: string;
  sender_phone: string;
  project_id?: string;
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
  materials?: string[];
  equipment?: string[];
  photos?: DocumentFile[];
  source_message_id?: string;
  status: 'draft' | 'to_verify' | 'verified' | 'rejected';
  created_at: string;
}

export interface DeliveryNote {
  id: string;
  company_id: string;
  project_id?: string;
  supplier_id?: string;
  number: string;
  date: string;
  items: string[];
  file_url?: string;
  invoice_id?: string;
  status: 'received' | 'matched' | 'to_match' | 'archived';
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  vat_number?: string;
  email?: string;
  phone?: string;
  category?: string;
  rating?: number;
}

export interface PurchaseOrder {
  id: string;
  company_id: string;
  project_id?: string;
  supplier_id?: string;
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
  expiry_date?: string;
  project_id?: string;
  worker_id?: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  file_url?: string;
}

export interface DocumentFile {
  id: string;
  company_id?: string;
  project_id?: string;
  name: string;
  path?: string;
  url?: string;
  mime_type?: string;
  size_bytes?: number;
  category?: string;
  created_at?: string;
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
  conversation_id?: string;
  company_id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}
