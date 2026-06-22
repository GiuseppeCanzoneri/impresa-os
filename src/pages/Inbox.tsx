import { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  MessageSquare,
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

const statusLabel: Record<string, string> = {
  received: 'Ricevuto',
  to_classify: 'Da classificare',
  classified: 'Classificato',
  converted: 'Convertito',
  archived: 'Archiviato',
  error: 'Errore',
};

const categoryLabel: Record<string, string> = {
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
  const { activeCompanyId, activeCompany, loading: companyLoading, error: companyError, isDemoFallback } = useCompany();
  const [messages, setMessages] = useState<IncomingMessage[]>(mockIncomingMessages);
  const [selectedMessageId, setSelectedMessageId] = useState(mockIncomingMessages[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      const shouldUseDemo = !isSupabaseConfigured || isDemoFallback || !activeCompanyId || !isValidUuid(activeCompanyId);

      if (shouldUseDemo) {
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
        setError(null);
        setLoading(false);
        return;
      }

      if (!supabase) {
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
        setError(null);
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
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
        setError('Dati demo attivi: impossibile leggere i messaggi reali.');
      } else {
        const nextMessages = (data ?? []).map((row) => normalizeMessage(row as Record<string, unknown>));
        const finalMessages = nextMessages.length > 0 ? nextMessages : mockIncomingMessages;
        setMessages(finalMessages);
        setSelectedMessageId(finalMessages[0]?.id ?? '');
      }

      setLoading(false);
    }

    loadMessages();
  }, [activeCompanyId, isDemoFallback]);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? messages[0],
    [messages, selectedMessageId]
  );

  async function updateStatus(id: string, status: IncomingMessageStatus) {
    setMessages((previous) => previous.map((message) => (message.id === id ? { ...message, status } : message)));

    if (supabase && isSupabaseConfigured && isValidUuid(id)) {
      const { error: updateError } = await supabase.from('incoming_messages').update({ status }).eq('id', id);
      if (updateError) setError(updateError.message);
    }
  }

  const pendingMessages = messages.filter((message) => message.status !== 'converted' && message.status !== 'archived').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Inbox Cantiere / WhatsApp</h1>
          <p className="mt-1 text-slate-500">
            {activeCompany ? `Messaggi operativi per ${activeCompany.name}.` : 'Messaggi demo pronti per la presentazione.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-50 text-blue-700">{pendingMessages} da elaborare</Badge>
          <Badge className="bg-slate-950 text-white">Classificazione AI mock</Badge>
        </div>
      </div>

      {(companyError || error || isDemoFallback) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {error ?? companyError ?? 'Modalità demo attiva per la presentazione.'}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Messaggi ricevuti</CardTitle>
            {(loading || companyLoading) && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message) => {
              const isSelected = message.id === selectedMessage?.id;
              return (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => setSelectedMessageId(message.id)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition-colors',
                    isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-950">{message.sender_name}</div>
                      <div className="text-xs text-slate-500">{message.sender_phone}</div>
                    </div>
                    <Badge variant="outline" className={getStatusClass(message.status)}>
                      {statusLabel[message.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{message.text}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Messaggio selezionato
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">{selectedMessage.sender_name}</h2>
                      <p className="text-sm text-slate-500">{new Date(selectedMessage.timestamp).toLocaleString('it-IT')}</p>
                    </div>
                    <Badge variant="outline" className={getStatusClass(selectedMessage.status)}>
                      {statusLabel[selectedMessage.status]}
                    </Badge>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div>
                      <div className="text-xs font-semibold uppercase text-slate-400">Commessa suggerita</div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {selectedMessage.suggested_project_name ?? 'Commessa non rilevata'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-slate-400">Categoria</div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {selectedMessage.category ? categoryLabel[selectedMessage.category] : 'Da classificare'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-slate-400">Confidenza AI</div>
                      <div className="mt-1 font-semibold text-slate-900">
                        {selectedMessage.confidence ? `${Math.round(selectedMessage.confidence * 100)}%` : 'Non disponibile'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 whitespace-pre-line">
                  {selectedMessage.text}
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900">Allegati ricevuti</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.attachments.map((attachment) => (
                        <Badge key={attachment.id} variant="outline" className="gap-2 px-3 py-2">
                          {attachment.mime_type?.startsWith('image') ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          {attachment.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => updateStatus(selectedMessage.id, 'converted')} className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Converti in rapportino
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'classified')}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Collega a commessa
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                    Crea DDT
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'to_classify')}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Riclassifica
                  </Button>
                  <Button variant="ghost" onClick={() => updateStatus(selectedMessage.id, 'archived')}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archivia
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                Seleziona un messaggio.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
