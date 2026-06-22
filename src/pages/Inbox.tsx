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
    confidence: typeof row.confidence === 'number' ? row.confidence : null,
    status: (row.status as IncomingMessageStatus) ?? 'received',
  };
}

export default function Inbox() {
  const { activeCompanyId, activeCompany } = useCompany();
  const [messages, setMessages] = useState<IncomingMessage[]>(mockIncomingMessages);
  const [selectedMessageId, setSelectedMessageId] = useState(messages[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessages() {
      if (!supabase || !activeCompanyId) {
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
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
        setMessages(mockIncomingMessages);
        setSelectedMessageId(mockIncomingMessages[0]?.id ?? '');
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

    if (supabase && isSupabaseConfigured) {
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Inbox Cantiere / WhatsApp</h1>
          <p className="mt-1 text-slate-600">
            Messaggi operativi per <strong>{activeCompany?.name ?? 'azienda demo'}</strong>. Ora la pagina è pronta a leggere la tabella incoming_messages.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            <MessageSquare className="mr-1 h-3.5 w-3.5" /> {pendingMessages} da elaborare
          </Badge>
          <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Classificazione AI mock
          </Badge>
        </div>
      </div>

      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Errore Supabase: {error}. Mostro i dati demo.</div>}

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.35fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              Messaggi ricevuti
              {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Nessun messaggio presente.</div>
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
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">{message.sender_name}</p>
                        <p className="text-xs text-slate-500">{message.sender_phone}</p>
                      </div>
                      <Badge variant="outline" className={getStatusClass(message.status)}>{statusLabel[message.status]}</Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{message.text}</p>
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        {selectedMessage ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-col gap-2 text-lg sm:flex-row sm:items-center sm:justify-between">
                <span>{selectedMessage.sender_name}</span>
                <span className="text-sm font-normal text-slate-500">{new Date(selectedMessage.timestamp).toLocaleString('it-IT')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedMessage.suggested_project_name ?? 'Commessa non rilevata'}</Badge>
                <Badge variant="outline">{selectedMessage.category ? categoryLabel[selectedMessage.category] : 'Da classificare'}</Badge>
                {selectedMessage.confidence ? <Badge variant="outline">AI {Math.round(selectedMessage.confidence * 100)}%</Badge> : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 whitespace-pre-line">{selectedMessage.text}</div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">Allegati ricevuti</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedMessage.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-3 rounded-xl border bg-white p-3">
                        {attachment.mime_type?.startsWith('image') ? <ImageIcon className="h-5 w-5 text-blue-600" /> : <FileText className="h-5 w-5 text-slate-600" />}
                        <span className="truncate text-sm font-medium">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Button onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Converti in rapportino
                </Button>
                <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'classified')}>
                  <LinkIcon className="mr-2 h-4 w-4" /> Collega a commessa
                </Button>
                <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                  <FileText className="mr-2 h-4 w-4" /> Crea DDT
                </Button>
                <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Crea nota cantiere
                </Button>
                <Button variant="outline" onClick={() => updateStatus(selectedMessage.id, 'to_classify')}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Riclassifica
                </Button>
                <Button variant="ghost" onClick={() => updateStatus(selectedMessage.id, 'archived')}>
                  <Archive className="mr-2 h-4 w-4" /> Archivia
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-sm text-slate-500">Seleziona un messaggio.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
