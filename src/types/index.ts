export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject { [key: string]: JsonValue; }

export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'direzione'
  | 'amministrazione'
  | 'tecnico'
  | 'capocantiere'
  | 'operaio'
  | 'consulente';

export type SubscriptionPlan = 'free' | 'base' | 'professional' | 'enterprise';
export type CompanyStatus = 'active' | 'suspended' | 'trial' | 'cancelled';

export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  fiscal_code?: string;
  logo_url?: string;
  plan: SubscriptionPlan;
  status: CompanyStatus;
  settings: JsonObject;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role?: UserRole;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  profile_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ModuleKey =
  | 'dashboard'
  | 'ai_assistant'
  | 'inbox'
  | 'projects'
  | 'invoices'
  | 'cashflow'
  | 'daily_reports'
  | 'delivery_notes'
  | 'quotes'
  | 'procurement'
  | 'safety'
  | 'documents'
  | 'admin'
  | 'settings';

export interface Module {
  id: string;
  key: ModuleKey;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  company_id: string;
  plan: SubscriptionPlan;
  status: CompanyStatus;
  starts_at: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'planned' | 'cancelled';

export interface Project {
  id: string;
  company_id: string;
  code?: string;
  name: string;
  client_name: string;
  location?: string;
  status: ProjectStatus;
  contract_amount: number;
  budget?: number;
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
  category: 'labor' | 'materials' | 'equipment' | 'supplier' | 'subcontractor' | 'general' | 'other';
  amount: number;
  description: string;
  source_type?: 'invoice' | 'daily_report' | 'delivery_note' | 'manual';
  source_id?: string;
  cost_date: string;
  created_at: string;
}

export interface ProjectRevenue {
  id: string;
  company_id: string;
  project_id: string;
  amount: number;
  description: string;
  source_type?: 'invoice' | 'sal' | 'manual';
  source_id?: string;
  revenue_date: string;
  created_at: string;
}

export type InvoiceType = 'active' | 'passive';
export type InvoiceStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'to_pay'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface Invoice {
  id: string;
  company_id: string;
  project_id?: string;
  type: InvoiceType;
  number: string;
  entity_name: string;
  amount: number;
  issue_date?: string;
  due_date: string;
  status: InvoiceStatus;
  approver_id?: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type CashflowType = 'income' | 'expense';
export type CashflowStatus = 'planned' | 'confirmed' | 'paid' | 'overdue' | 'cancelled';

export interface CashflowMovement {
  id: string;
  company_id: string;
  project_id?: string;
  invoice_id?: string;
  type: CashflowType;
  amount: number;
  expected_date: string;
  actual_date?: string;
  status: CashflowStatus;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttachmentFile {
  id: string;
  name: string;
  mime_type: string;
  size_bytes?: number;
  url?: string;
}

export type IncomingChannel = 'whatsapp_mock' | 'whatsapp' | 'telegram' | 'email' | 'manual';
export type IncomingCategory =
  | 'daily_report'
  | 'delivery_note'
  | 'photo'
  | 'note'
  | 'hours'
  | 'invoice'
  | 'safety'
  | 'purchase_request'
  | 'unknown';
export type IncomingStatus =
  | 'received'
  | 'to_classify'
  | 'classified'
  | 'converted_to_report'
  | 'linked_to_project'
  | 'archived'
  | 'error';

export interface IncomingMessage {
  id: string;
  company_id: string;
  channel: IncomingChannel;
  sender_name: string;
  sender_phone?: string;
  sender_email?: string;
  text: string;
  timestamp: string;
  attachments?: AttachmentFile[];
  suggested_project_id?: string;
  suggested_project_name?: string;
  category: IncomingCategory;
  confidence?: number;
  status: IncomingStatus;
  created_at?: string;
  updated_at?: string;
}

export type DailyReportStatus = 'draft' | 'submitted' | 'verified' | 'rejected';

export interface DailyReport {
  id: string;
  company_id: string;
  project_id: string;
  date: string;
  workers_count: number;
  hours_total: number;
  description: string;
  materials?: string[];
  photos?: AttachmentFile[];
  status: DailyReportStatus;
  created_by?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
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
  status?: 'to_match' | 'matched' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  company_id: string;
  name: string;
  vat_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  company_id: string;
  project_id?: string;
  supplier_id?: string;
  number: string;
  amount?: number;
  status: PurchaseOrderStatus;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type SafetyDocumentType = 'POS' | 'PSC' | 'DURC' | 'attestato' | 'visita_medica' | 'DPI' | 'polizza' | 'altro';
export type SafetyDocumentStatus = 'valid' | 'expiring' | 'expired' | 'missing' | 'to_verify';

export interface SafetyDocument {
  id: string;
  company_id: string;
  type: SafetyDocumentType;
  title: string;
  expiry_date?: string;
  project_id?: string;
  worker_id?: string;
  supplier_id?: string;
  file_url?: string;
  status: SafetyDocumentStatus;
  created_at: string;
  updated_at: string;
}

export interface DocumentFile {
  id: string;
  company_id: string;
  project_id?: string;
  invoice_id?: string;
  supplier_id?: string;
  employee_id?: string;
  vehicle_id?: string;
  safety_document_id?: string;
  name: string;
  category: string;
  mime_type: string;
  size_bytes?: number;
  file_url: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AiConversation {
  id: string;
  company_id: string;
  profile_id?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id?: string;
  company_id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: JsonObject;
}
