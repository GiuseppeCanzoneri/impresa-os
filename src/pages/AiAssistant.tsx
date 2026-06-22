import React, { useMemo, useState } from 'react';
import { Bot, Euro, FileText, HardHat, Search, Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockInvoices, mockProjects, formatEuro } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  { icon: Euro, text: 'Quanto stiamo spendendo sul cantiere Monza?' },
  { icon: FileText, text: 'Quali fatture passive sono da approvare?' },
  { icon: Search, text: 'Mostrami i documenti e le scadenze critiche' },
  { icon: HardHat, text: 'Crea un rapportino per il cantiere Ceprano' },
];

function getMockAiAnswer(input: string): string {
  const normalized = input.toLowerCase();

  if (normalized.includes('monza') || normalized.includes('spendendo')) {
    const project = mockProjects.find((item) => item.id === 'prj-monza');
    if (!project) return 'Non trovo il cantiere Monza nei dati mock.';

    return `Sul cantiere ${project.name} risultano ${formatEuro(project.costs_to_date)} di costi registrati su ${formatEuro(
      project.contract_amount
    )} di importo contrattuale. Avanzamento lavori: ${project.progress}%. Margine stimato: ${project.margin_estimated}%. Alert aperti: ${project.alerts_count}.`;
  }

  if (normalized.includes('fattur')) {
    const pending = mockInvoices.filter((invoice) => invoice.type === 'passive' && invoice.status === 'pending');
    const total = pending.reduce((sum, invoice) => sum + invoice.amount, 0);

    return `Ci sono ${pending.length} fatture passive da approvare, per un totale di ${formatEuro(
      total
    )}. La priorità è verificare l'abbinamento tra fattura, DDT e commessa prima di mandarle in pagamento.`;
  }

  if (normalized.includes('rapportino') || normalized.includes('ceprano')) {
    return 'Posso predisporre un rapportino per Ceprano. Campi suggeriti: 2 operai, 16 ore totali, attività: prove impianto e verifica quadro elettrico locale tecnico. Quando collegheremo Supabase, questa azione creerà un record reale in daily_reports.';
  }

  if (normalized.includes('scaden')) {
    return 'Scadenze mock rilevate: DURC fornitore Monza in scadenza entro 20 giorni, polizza cantiere da verificare, 2 documenti sicurezza senza allegato. Nella fase Supabase creeremo alert automatici per expiry_date.';
  }

  return 'Ho ricevuto la richiesta. In questa fase uso risposte mock. Il prossimo step sarà collegare questa chat alle tabelle Supabase e poi a una Edge Function AI per interrogare commesse, fatture, messaggi e documenti.';
}

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Ciao. Sono l’assistente ImpresaOS. Posso aiutarti a leggere costi, commesse, fatture, rapportini e messaggi cantiere. Ora lavoro in modalità mock, pronta per Supabase + AI reale.',
    },
  ]);
  const [input, setInput] = useState('');
  const quickStats = useMemo(() => {
    const activeProjects = mockProjects.filter((project) => project.status === 'active').length;
    const passiveInvoices = mockInvoices.filter((invoice) => invoice.type === 'passive' && invoice.status === 'pending').length;
    const totalCosts = mockProjects.reduce((sum, project) => sum + project.costs_to_date, 0);

    return { activeProjects, passiveInvoices, totalCosts };
  }, []);

  function handleSend(value = input) {
    if (!value.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: value };
    const assistantMessage: ChatMessage = { role: 'assistant', content: getMockAiAnswer(value) };

    setMessages((previous) => [...previous, userMessage, assistantMessage]);
    setInput('');
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50">
      <div className="border-b bg-white px-4 py-4 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="text-blue-600" size={22} />
              <h1 className="text-xl font-bold text-slate-900">Assistente AI Impresa</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">Chat centrale per interrogare dati aziendali e cantieri.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Card className="px-3 py-2">
              <p className="font-bold text-slate-900">{quickStats.activeProjects}</p>
              <p className="text-slate-500">commesse</p>
            </Card>
            <Card className="px-3 py-2">
              <p className="font-bold text-slate-900">{quickStats.passiveInvoices}</p>
              <p className="text-slate-500">fatture</p>
            </Card>
            <Card className="px-3 py-2">
              <p className="font-bold text-slate-900">{formatEuro(quickStats.totalCosts)}</p>
              <p className="text-slate-500">costi</p>
            </Card>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-5">
          {messages.map((message, index) => (
            <div key={index} className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}>
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  message.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                )}
              >
                {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm',
                  message.role === 'assistant' ? 'bg-white text-slate-800' : 'bg-blue-600 text-white'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-white p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-3">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSend(suggestion.text)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-xs text-slate-600 transition-colors hover:bg-slate-100"
              >
                <suggestion.icon size={15} className="shrink-0 text-blue-600" />
                <span>{suggestion.text}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Chiedi qualsiasi cosa su commesse, fatture, cassa, documenti o rapportini..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSend()}
              className="h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500"
            />
            <Button onClick={() => handleSend()} className="h-12 rounded-xl bg-blue-600 px-5 hover:bg-blue-700">
              <Send size={19} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}