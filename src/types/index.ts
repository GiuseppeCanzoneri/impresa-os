export type UserRole = 
  | 'super_admin' 
  | 'company_admin' 
  | 'direzione' 
  | 'amministrazione' 
  | 'tecnico' 
  | 'capocantiere' 
  | 'operaio' 
  | 'consulente';

export interface Company {
  id: string;
  name: string;
  vat_number: string;
  logo_url?: string;
  settings: Record<string, any>;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  company_id: string;
}

export interface Project {
  id: string;
  company_id: string;
  name: string;
  client_name: string;
  status: 'active' | 'completed' | 'on_hold' | 'planned';
  budget: number;
  costs_to_date: number;
  margin_estimated: number;
  progress: number;
  manager_id: string;
  start_date: string;
  end_date?: string;
  alerts_count: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  project_id?: string;
  type: 'active' | 'passive';
  number: string;
  entity_name: string; // Fornitore o Cliente
  amount: number;
  due_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approver_id?: string;
}

export interface IncomingMessage {
  id: string;
  sender_name: string;
  sender_phone: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  suggested_project_id?: string;
  category?: 'rapportino' | 'ddt' | 'foto' | 'nota' | 'ore';
  status: 'new' | 'processed' | 'archived';
}

export interface DailyReport {
  id: string;
  project_id: string;
  date: string;
  workers_count: number;
  hours_total: number;
  description: string;
  materials?: string[];
  photos?: string[];
  status: 'draft' | 'verified';
}

export interface DeliveryNote {
  id: string;
  project_id: string;
  supplier_id: string;
  number: string;
  date: string;
  items: string[];
  file_url?: string;
  invoice_id?: string;
}

export interface SafetyDocument {
  id: string;
  type: 'POS' | 'PSC' | 'DURC' | 'attestato' | 'visita_medica';
  title: string;
  expiry_date: string;
  project_id?: string;
  worker_id?: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}