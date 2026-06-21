import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Globe, CreditCard, User, MessageSquare, Bot, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profilo');

  const menuItems = [
    { id: 'profilo', label: 'Profilo Aziendale', icon: SettingsIcon },
    { id: 'notifiche', label: 'Notifiche', icon: Bell },
    { id: 'sicurezza', label: 'Sicurezza', icon: Lock },
    { id: 'integrazioni', label: 'Integrazioni', icon: Globe },
  ];

  return (
    <div className="p-8 space-y-8 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Impostazioni</h1>
        <p className="text-slate-500">Configura il tuo profilo e le preferenze aziendali.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button 
              key={item.id}
              variant="ghost" 
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-11",
                activeTab === item.id ? "bg-white border shadow-sm text-blue-600" : "text-slate-600"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profilo' && (
            <Card>
              <CardHeader>
                <CardTitle>Profilo Aziendale</CardTitle>
                <CardDescription>Informazioni legali e di contatto della tua azienda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ragione Sociale</Label>
                    <Input defaultValue="Edilizia S.p.A." />
                  </div>
                  <div className="space-y-2">
                    <Label>Partita IVA</Label>
                    <Input defaultValue="IT01234567890" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Amministrazione</Label>
                  <Input defaultValue="admin@edilizia.it" />
                </div>
                <div className="space-y-2">
                  <Label>Indirizzo Sede Legale</Label>
                  <Input defaultValue="Via Roma 123, 20100 Milano (MI)" />
                </div>
                <Button className="bg-blue-600">Salva Modifiche</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifiche' && (
            <Card>
              <CardHeader>
                <CardTitle>Preferenze Notifiche</CardTitle>
                <CardDescription>Scegli come e quando ricevere aggiornamenti dal sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="space-y-0.5">
                      <Label className="text-base">Notifiche Email</Label>
                      <p className="text-sm text-slate-500">Ricevi report giornalieri e alert scadenze via email.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="space-y-0.5">
                      <Label className="text-base">Alert WhatsApp</Label>
                      <p className="text-sm text-slate-500">Ricevi notifiche urgenti direttamente sul tuo telefono.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="space-y-0.5">
                      <Label className="text-base">Approvazione Fatture</Label>
                      <p className="text-sm text-slate-500">Notifica quando una nuova fattura passiva richiede approvazione.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button className="bg-blue-600">Salva Preferenze</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sicurezza' && (
            <Card>
              <CardHeader>
                <CardTitle>Sicurezza Account</CardTitle>
                <CardDescription>Gestisci la tua password e l'autenticazione a due fattori.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password Attuale</Label>
                    <Input type="password" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nuova Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Conferma Nuova Password</Label>
                      <Input type="password" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                  <ShieldCheck className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-blue-900">Autenticazione a due fattori (2FA)</p>
                    <p className="text-xs text-blue-700 mt-1">Aumenta la sicurezza del tuo account attivando la 2FA tramite app o SMS.</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600 text-xs font-bold mt-2">Attiva ora</Button>
                  </div>
                </div>
                <Button className="bg-blue-600">Aggiorna Password</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'integrazioni' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="text-emerald-500" size={20} />
                        WhatsApp Cloud API
                      </CardTitle>
                      <CardDescription>Connessione per ricevere rapportini e foto dai cantieri.</CardDescription>
                    </div>
                    <Badge className="bg-emerald-500">Connesso</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p><strong>Numero collegato:</strong> +39 02 1234567</p>
                    <p><strong>Stato Webhook:</strong> Attivo</p>
                    <Button variant="outline" size="sm" className="mt-4">Configura Webhook</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="text-blue-500" size={20} />
                        OpenAI / LLM Engine
                      </CardTitle>
                      <CardDescription>Motore di intelligenza artificiale per l'analisi dei dati.</CardDescription>
                    </div>
                    <Badge className="bg-emerald-500">Attivo</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p><strong>Modello:</strong> GPT-4o</p>
                    <p><strong>Utilizzo Mese:</strong> 12.450 token</p>
                    <Button variant="outline" size="sm" className="mt-4">Gestisci API Key</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;