import React, { useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockIncomingMessages } from '@/data/mockData';
import type { IncomingMessage } from '@/types';
import { cn } from '@/lib/utils';

const statusLabel: Record<IncomingMessage['status'], string> = {
  received: 'Ricevuto',
  to_classify: 'Da classificare',
  classified: 'Classificato',
  converted: 'Convertito',
  archived: 'Archiviato',
  error: 'Errore',
};

const categoryLabel: Record<NonNullable<IncomingMessage['category']>, string> = {
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

function getStatusClass(status: IncomingMessage['status']) {
  if (status === 'converted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'classified') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'to_classify') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'error') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export default function Inbox() {
  const [messages, setMessages] = useState<IncomingMessage[]>(mockIncomingMessages);
  const [selectedMessageId, setSelectedMessageId] = useState(messages[0]?.id ?? '');
  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? messages[0],
    [messages, selectedMessageId]
  );

  function updateStatus(id: string, status: IncomingMessage['status']) {
    setMessages((previous) => previous.map((message) => (message.id === id ? { ...message, status } : message)));
  }

  const pendingMessages = messages.filter((message) => message.status !== 'converted' && message.status !== 'archived').length;

  return (
    <div className="space-y-6 p-4 lg:ml-64 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-slate-900">Inbox Cantiere / WhatsApp</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Simulatore pronto per futura WhatsApp Cloud API: riceve messaggi, li classifica e li converte in dati operativi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">{pendingMessages} da elaborare</Badge>
          <Badge variant="outline" className="gap-1">
            <Sparkles size={13} /> Classificazione AI mock
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-white">
            <CardTitle className="text-base">Messaggi ricevuti</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[calc(100vh-220px)] space-y-2 overflow-y-auto p-3">
            {messages.map((message) => {
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
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{message.sender_name}</p>
                      <p className="truncate text-xs text-slate-500">{message.sender_phone}</p>
                    </div>
                    <Badge className={cn('border text-[10px]', getStatusClass(message.status))}>
                      {statusLabel[message.status]}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{message.text}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {selectedMessage && (
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedMessage.sender_name}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedMessage.sender_phone} · {new Date(selectedMessage.timestamp).toLocaleString('it-IT')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{selectedMessage.suggested_project_name ?? 'Commessa non rilevata'}</Badge>
                  <Badge className="bg-slate-900 text-white hover:bg-slate-900">
                    {selectedMessage.category ? categoryLabel[selectedMessage.category] : 'Da classificare'}
                  </Badge>
                  {selectedMessage.confidence && <Badge variant="outline">AI {Math.round(selectedMessage.confidence * 100)}%</Badge>}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-5">
              <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {selectedMessage.text}
              </div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-900">Allegati ricevuti</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMessage.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm">
                        {attachment.mime_type?.startsWith('image') ? (
                          <ImageIcon size={16} className="text-blue-600" />
                        ) : (
                          <FileText size={16} className="text-red-600" />
                        )}
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Button onClick={() => updateStatus(selectedMessage.id, 'converted')} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <PlusCircle size={16} /> Converti in rapportino
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                  <LinkIcon size={16} /> Collega a commessa
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => updateStatus(selectedMessage.id, 'converted')}>
                  <FileText size={16} /> Crea DDT
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => updateStatus(selectedMessage.id, 'archived')}>
                  <Archive size={16} /> Archivia
                </Button>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-blue-700" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Prossimo step tecnico</p>
                    <p className="mt-1 text-sm text-blue-800">
                      Dopo il database Supabase, questi pulsanti creeranno record reali in daily_reports, delivery_notes,
                      project_costs e documents, sempre filtrati per company_id.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="ghost" className="gap-2 text-slate-500" onClick={() => updateStatus(selectedMessage.id, 'classified')}>
                <RefreshCw size={16} /> Riclassifica messaggio con AI mock
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
