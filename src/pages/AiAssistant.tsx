import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Search, FileText, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  { icon: Euro, text: "Quanto stiamo spendendo sul cantiere Monza?" },
  { icon: FileText, text: "Quali fatture sono da approvare?" },
  { icon: Search, text: "Mostrami i documenti in scadenza" },
  { icon: Sparkles, text: "Crea un rapportino per il cantiere Ceprano" },
];

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Ciao! Sono il tuo assistente ImpresaOS. Posso aiutarti a monitorare i cantieri, gestire le fatture o analizzare i costi. Cosa desideri sapere oggi?' 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sto analizzando i dati... Sul cantiere Monza abbiamo registrato costi per €12.450 nell\'ultima settimana, principalmente per materiali e noli. Il margine attuale è del 22%.' 
      }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 ml-64">
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-4",
              msg.role === 'user' ? "flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'assistant' ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl max-w-[80%] shadow-sm",
                msg.role === 'assistant' ? "bg-white text-slate-800" : "bg-blue-600 text-white"
              )}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-white border-t">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s.text)}
                className="flex items-center gap-2 p-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-left"
              >
                <s.icon size={14} className="text-blue-500" />
                {s.text}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Chiedi qualsiasi cosa sui tuoi dati aziendali..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 py-6 px-4 rounded-xl border-slate-200 focus-visible:ring-blue-500"
            />
            <Button onClick={handleSend} className="h-auto px-6 rounded-xl bg-blue-600 hover:bg-blue-700">
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;