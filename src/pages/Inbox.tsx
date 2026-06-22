import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompany } from '@/hooks/useCompany';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { mockIncomingMessages } from '@/data/mockData';
import { isValidUuid } from '@/utils/uuid';
import type { IncomingMessage, IncomingMessageCategory, IncomingMessageStatus } from '@/types';
import { cn } from '@/lib/utils';

const statusLabel: Record<IncomingMessageStatus, string> = {
  received: 'Ricevuto',
  to_classify: 'Da classificare',
  classified: 'Classificato',
  converted: 'Convertito',
  archived: 'Archiviato',
  error: 'Errore',
};

const categoryLabel: Record<IncomingMessageCategory, string> = {
  daily_report: 'Rapportino',
  delivery_note: 'DDT / Bolla',
  site_photo: 'Foto cantiere',
  hours: 'Ore personale',
  material: 'Materiale',
  safety: 'Sicurezza',
  invoice_approval: 'Approvazione fattura',
  note: 'Nota cantiere',
  unknown: 'Da capire',
};

function getStatusClass(status: IncomingMessageStatus) {
  if (status === 'converted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'classified') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'to_classify') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'error') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

function normalizeMessage(row: Record<string, unknown>): IncomingMessage {
  return {
    id: String(row.id),
    company_id: String(row.company_id),
    channel: (row.channel as IncomingMessage['channel']) ?? 'whatsapp_mock',
    sender_name: String(row.sender_name ?? 'Mittente non indicato'),
    sender_phone: row.sender_phone ? String(row.sender_phone) : null,
    text: String(row.text ?? ''),
    timestamp: String(row.timestamp ?? row.received_at ?? row.created_at ?? new Date().toISOString()),
    attachments: (row.attachments as IncomingMessage['attachments']) ?? null,
    suggested_project_id: row.suggested_project_id ? String(row.suggested_project_id) : null,
    suggested_project_name: row.suggested_project_name ? String(row.suggested_project_name) : null,
    category: (row.category as IncomingMessageCategory | null) ?? 'unknown',
    confidence: typeof row.confidence === 'number' ? row.confidence : Number(row.confidence ?? 0) || null,
    status: (row.status as IncomingMessageStatus) ?? 'received',
  };
}

export default function Inbox() {
  const { activeCompanyId, activeCompany, loading: companyLoading, error: companyError } = useCompany();
  const [messages, setMessages] = useState<IncomingMessage[]>(isSupabaseConfigured ? [] : mockIncomingMessages);
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      if (!isSupabaseConfigured) {
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
        setError(null);
        return;
      }

      if (!supabase) {
        setMessages([]);
        setSelectedMessageId('');
        setError('Supabase non configurato.');
        return;
      }

      if (!activeCompanyId) {
        setMessages([]);
        setSelectedMessageId('');
        setError(null);
        return;
      }

      if (!isValidUuid(activeCompanyId)) {
        setMessages([]);
        setSelectedMessageId('');
        setError(`ID azienda non valido: ${activeCompanyId}. Ricarica la pagina o cancella la cache del browser.`);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: messagesError } = await supabase
        .from('incoming_messages')
        .select('*')
        .eq('company_id', activeCompanyId)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Errore caricamento inbox:', messagesError.message);
        setError(messagesError.message);
        setMessages([]);
        setSelectedMessageId('');
      } else {
        const nextMessages = (data ?? []).map((row) => normalizeMessage(row as Record<string, unknown>));
        setMessages(nextMessages);
        setSelectedMessageId(nextMessages[0]?.id ?? '');
      }

      setLoading(false);
    }

    loadMessages();
  }, [activeCompanyId]);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? messages[0],
    [messages, selectedMessageId]
  );

  async function updateStatus(id: string, status: IncomingMessageStatus) {
    setMessages((previous) => previous.map((message) => (message.id === id ? { ...message, status } : message)));

    if (supabase && isSupabaseConfigured && isValidUuid(id)) {
      const { error: updateError } = await supabase.from('incoming_messages').update({ status }).eq('id', id);
      if (updateError) {
        console.error('Errore aggiornamento stato messaggio:', updateError.message);
        setError(updateError.message);
      }
    }
  }

  const pendingMessages = messages.filter((message) => message.status !== 'converted' && message.status !== 'archived').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Inbox Cantiere / WhatsApp</h1>
          <p className="mt-1 text-slate-500">
            {activeCompany
              ? `Messaggi operativi per ${activeCompany.name}. La pagina legge la tabella incoming_messages.`
              : companyLoading
                ? 'Caricamento azienda attiva...'
                : 'Nessuna azienda attiva disponibile.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white px-3 py-2">
            {pendingMessages} da elaborare
          </Badge>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 px-3 py-2 text-blue-700">
            <Sparkles className="mr-1 h-3 w-3" /> Classificazione AI mock
          </Badge>
        </div>
      </div>

      {companyError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Errore caricamento azienda: {companyError}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Errore Supabase: {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5" />
              Messaggi ricevuti
              {(loading || companyLoading) && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[680px] space-y-3 overflow-auto p-4">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
                Nessun messaggio presente. Esegui il seed demo oppure collega WhatsApp in futuro.
              </div>
            ) : (
              messages.map((message) => {
                const isSelected = message.id === selectedMessage?.id;
                return (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessageId(message.id)}
                    className={cn(
                      'w-full rounded-xl border p-3 text-left transition-colors',
                      isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{message.sender_name}</p>
                        <p className="text-xs text-slate-500">{message.sender_phone}</p>
                      </div>
                      <Badge variant="outline" className={getStatusClass(message.status)}>
                        {statusLabel[message.status]}
                      </Badge>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{message.text}</p>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Messaggio selezionato</p>
                    <h2 className="text-2xl font-bold text-slate-950">{selectedMessage.sender_name}</h2>
                    <p className="text-sm text-slate-500">{new Date(selectedMessage.timestamp).toLocaleString('it-IT')}</p>
                  </div>
                  <Badge variant="outline" className={getStatusClass(selectedMessage.status)}>
                    {statusLabel[selectedMessage.status]}
                  </Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-400">Commessa suggerita</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedMessage.suggested_project_name ?? 'Commessa non rilevata'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-400">Categoria</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedMessage.category ? categoryLabel[selectedMessage.category] : 'Da classificare'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs uppercase text-slate-400">Confidenza AI</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedMessage.confidence ? `${Math.round(selectedMessage.confidence * 100)}%` : 'Non disponibile'}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5">
                  <p className="whitespace-pre-line text-slate-700">{selectedMessage.text}</p>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <p className="mb-2 font-semibold text-slate-950">Allegati ricevuti</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-3 rounded-xl border p-3">
                          {attachment.mime_type?.startsWith('image') ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-slate-500" />
                          )}
                          <span className="text-sm font-medium text-slate-700">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t pt-5">
                  <Button onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Converti in rapportino
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'classified')}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Collega a commessa
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                    <FileText className="mr-2 h-4 w-4" /> Crea DDT
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Crea nota cantiere
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'to_classify')}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Riclassifica
                  </Button>
                  <Button variant="ghost" onClick={() => updateStatus(selectedMessage.id, 'archived')}>
                    <Archive className="mr-2 h-4 w-4" /> Archivia
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-10 text-center text-slate-500">Seleziona un messaggio.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
