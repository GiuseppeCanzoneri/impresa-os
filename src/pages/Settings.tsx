import React from 'react';
import { Settings as SettingsIcon, Bell, Lock, Globe, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Settings = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Impostazioni</h1>
        <p className="text-slate-500">Configura il tuo profilo e le preferenze aziendali.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-white border shadow-sm">
            <SettingsIcon size={18} /> Profilo Aziendale
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Bell size={18} /> Notifiche
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Lock size={18} /> Sicurezza & Password
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Globe size={18} /> Integrazioni (WhatsApp, AI)
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profilo Aziendale</CardTitle>
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
              <Button className="bg-blue-600">Salva Modifiche</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;