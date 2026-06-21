import React from 'react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  PlusCircle,
  Link as LinkIcon,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'Luca Bianchi (Capocantiere)',
    phone: '+39 333 1234567',
    text: 'Buongiorno, invio foto avanzamento lavori piano 2 e bolla cemento arrivata stamattina.',
    time: '09:15',
    attachments: ['foto_cantiere_1.jpg', 'bolla_123.pdf'],
    suggested_project: 'Cantiere Monza',
    category: 'rapportino',
    status: 'new'
  },
  {
    id: '2',
    sender: 'Marco Rossi (Operaio)',
    phone: '+39 333 7654321',
    text: 'Oggi abbiamo finito la gettata. Ore lavorate: 8 io, 8 Giuseppe.',
    time: '17:30',
    suggested_project: 'Ristrutturazione Via Roma',
    category: 'ore',
    status: 'new'
  }
];

const Inbox = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inbox Cantiere</h1>
          <p className="text-slate-500">Gestisci i messaggi in arrivo dai cantieri via WhatsApp.</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
          WhatsApp Cloud API: Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_MESSAGES.map((msg) => (
          <Card key={msg.id} className="overflow-hidden border-l-4 border-l-blue-500">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{msg.sender}</h3>
                    <p className="text-xs text-slate-500">{msg.phone} • {msg.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                    {msg.suggested_project}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {msg.category}
                  </Badge>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-slate-700 leading-relaxed">{msg.text}</p>
                {msg.attachments && (
                  <div className="flex gap-2 mt-3">
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md text-xs text-slate-600">
                        {att.endsWith('.jpg') ? <ImageIcon size={14} /> : <FileText size={14} />}
                        {att}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <PlusCircle size={16} />
                    Converti in Rapportino
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <LinkIcon size={16} />
                    Collega a Commessa
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <FileText size={16} />
                    Crea DDT
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900">
                    <Archive size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-900">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inbox;