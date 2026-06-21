import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  Euro, 
  Clock, 
  FileText, 
  Camera, 
  ShieldCheck, 
  History,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-8 space-y-8 ml-64">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">Cantiere Monza - Residenziale</h1>
            <Badge className="bg-emerald-500">In Corso</Badge>
          </div>
          <p className="text-slate-500">Commessa #2024-001 • Immobiliare Nord Srl</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Euro size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Budget Totale</p>
              <p className="text-xl font-bold">€ 450.000</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Costi Attuali</p>
              <p className="text-xl font-bold">€ 125.400</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Avanzamento</p>
              <p className="text-xl font-bold">35%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Alert Attivi</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="panoramica" className="w-full">
        <TabsList className="bg-white border p-1 h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="panoramica" className="gap-2"><History size={14} /> Panoramica</TabsTrigger>
          <TabsTrigger value="costi" className="gap-2"><Euro size={14} /> Costi & Ricavi</TabsTrigger>
          <TabsTrigger value="ore" className="gap-2"><Clock size={14} /> Ore & Personale</TabsTrigger>
          <TabsTrigger value="rapportini" className="gap-2"><FileText size={14} /> Rapportini</TabsTrigger>
          <TabsTrigger value="foto" className="gap-2"><Camera size={14} /> Foto</TabsTrigger>
          <TabsTrigger value="sicurezza" className="gap-2"><ShieldCheck size={14} /> Sicurezza</TabsTrigger>
        </TabsList>

        <TabsContent value="panoramica" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dettagli Commessa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Responsabile</span>
                  <span className="font-medium">Ing. Marco Rossi</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Data Inizio</span>
                  <span className="font-medium">15 Gennaio 2024</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Data Fine Prevista</span>
                  <span className="font-medium">20 Dicembre 2024</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-slate-500">Indirizzo</span>
                  <span className="font-medium">Via delle Industrie 12, Monza</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline Attività</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { t: 'Oggi', d: 'Completamento gettata pilastri piano 2', s: 'done' },
                    { t: 'Ieri', d: 'Arrivo fornitura ferro ditta Siderurgica Srl', s: 'done' },
                    { t: '12 Mag', d: 'Inizio lavori di carpenteria', s: 'done' },
                    { t: 'Prossima sett.', d: 'Inizio posa impianti idraulici', s: 'planned' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-24 text-xs text-slate-400 font-medium">{item.t}</div>
                      <div className="flex-1 text-sm text-slate-700">{item.d}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="costi" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center text-slate-400">
              <Euro size={48} className="mx-auto mb-4 opacity-20" />
              <p>Modulo Analisi Costi & Ricavi in fase di caricamento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;