import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Euro, 
  Clock, 
  FileText, 
  Camera, 
  ShieldCheck, 
  History,
  TrendingUp,
  AlertTriangle,
  FileStack,
  Receipt,
  Truck,
  Activity,
  TrendingDown,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ProjectDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Cantiere Monza - Residenziale</h1>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">In Corso</Badge>
            </div>
            <p className="text-slate-500">Commessa #2024-001 • Immobiliare Nord Srl</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <FileText size={18} /> Report PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} /> Azione Rapida
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Euro size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Budget</p>
              <p className="text-2xl font-bold text-slate-900">€ 450.000</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Costi</p>
              <p className="text-2xl font-bold text-slate-900">€ 125.400</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Progresso</p>
              <p className="text-2xl font-bold text-slate-900">35%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Alert</p>
              <p className="text-2xl font-bold text-slate-900">2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs System */}
      <Tabs defaultValue="panoramica" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-white p-1">
          <TabsList className="bg-transparent h-10 gap-1">
            <TabsTrigger value="panoramica" className="gap-2 px-4"><History size={14} /> Panoramica</TabsTrigger>
            <TabsTrigger value="costi" className="gap-2 px-4"><TrendingDown size={14} /> Costi</TabsTrigger>
            <TabsTrigger value="ricavi" className="gap-2 px-4"><TrendingUp size={14} /> Ricavi</TabsTrigger>
            <TabsTrigger value="ore" className="gap-2 px-4"><Clock size={14} /> Ore</TabsTrigger>
            <TabsTrigger value="documenti" className="gap-2 px-4"><FileStack size={14} /> Documenti</TabsTrigger>
            <TabsTrigger value="rapportini" className="gap-2 px-4"><FileText size={14} /> Rapportini</TabsTrigger>
            <TabsTrigger value="foto" className="gap-2 px-4"><Camera size={14} /> Foto</TabsTrigger>
            <TabsTrigger value="fatture" className="gap-2 px-4"><Receipt size={14} /> Fatture</TabsTrigger>
            <TabsTrigger value="fornitori" className="gap-2 px-4"><Truck size={14} /> Fornitori</TabsTrigger>
            <TabsTrigger value="sicurezza" className="gap-2 px-4"><ShieldCheck size={14} /> Sicurezza</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2 px-4"><Activity size={14} /> Timeline</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Tab Contents */}
        <TabsContent value="panoramica" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Dettagli Generali</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase">Responsabile</p>
                  <p className="font-semibold text-slate-900">Ing. Marco Rossi</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase">Cliente</p>
                  <p className="font-semibold text-slate-900">Immobiliare Nord Srl</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase">Data Inizio</p>
                  <p className="font-semibold text-slate-900">15 Gennaio 2024</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase">Fine Prevista</p>
                  <p className="font-semibold text-slate-900">20 Dicembre 2024</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-slate-500 font-medium uppercase">Indirizzo</p>
                  <p className="font-semibold text-slate-900">Via delle Industrie 12, Monza (MB)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Stato Avanzamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lavori Strutturali</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Impiantistica</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Finiture</span>
                    <span className="font-bold">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costi" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Analisi Costi</CardTitle>
              <Button size="sm" variant="outline">Aggiungi Voce</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Materiali Edili', amount: 45000, budget: 120000 },
                  { label: 'Noli e Macchinari', amount: 28000, budget: 50000 },
                  { label: 'Manodopera Interna', amount: 35000, budget: 150000 },
                  { label: 'Subappalti', amount: 17400, budget: 80000 },
                ].map((item, i) => (
                  <div key={i} className="p-4 border rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{item.label}</span>
                      <span className="text-sm font-bold">€ {item.amount.toLocaleString()} / € {item.budget.toLocaleString()}</span>
                    </div>
                    <Progress value={(item.amount / item.budget) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ricavi" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Stato Fatturazione Attiva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Fatturato</p>
                    <p className="text-xl font-bold">€ 150.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Incassato</p>
                    <p className="text-xl font-bold text-emerald-600">€ 120.000</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Residuo</p>
                    <p className="text-xl font-bold text-blue-600">€ 300.000</p>
                  </div>
                </div>
                <p className="text-center text-slate-400 py-8">Elenco SAL e Fatture attive...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ore" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Riepilogo Ore Lavorate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Mario Rossi', role: 'Capocantiere', hours: 160, cost: 4800 },
                  { name: 'Luca Bianchi', role: 'Operaio Specializzato', hours: 145, cost: 3625 },
                  { name: 'Giuseppe Verdi', role: 'Operaio', hours: 120, cost: 2400 },
                ].map((worker, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{worker.name}</p>
                        <p className="text-xs text-slate-500">{worker.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{worker.hours} ore</p>
                      <p className="text-xs text-slate-500">Costo: € {worker.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documenti" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Documentazione Tecnica</CardTitle>
              <Button size="sm" className="gap-2"><Plus size={14} /> Carica</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Planimetria_Esecutiva.dwg', 'Relazione_Geologica.pdf', 'Computo_Metrico_V2.xlsx', 'Contratto_Appalto.pdf'].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileStack className="text-blue-500" size={20} />
                      <span className="text-sm font-medium">{doc}</span>
                    </div>
                    <Badge variant="secondary">Download</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rapportini" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Ultimi Rapportini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '15/05/2024', desc: 'Gettata pilastri piano 2 e armatura', status: 'Verificato' },
                  { date: '14/05/2024', desc: 'Carpenteria e posa ferro', status: 'Verificato' },
                  { date: '13/05/2024', desc: 'Scavi e preparazione sottofondo', status: 'Bozza' },
                ].map((rep, i) => (
                  <div key={i} className="p-4 border rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold">{rep.date}</p>
                      <p className="text-sm text-slate-600">{rep.desc}</p>
                    </div>
                    <Badge className={rep.status === 'Verificato' ? 'bg-emerald-500' : 'bg-amber-500'}>{rep.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foto" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Galleria Cantiere</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                    <Camera className="text-slate-300" size={32} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fatture" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Fatture Collegate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { num: 'FPR 12/24', ent: 'Forniture Edili Srl', val: 12450, status: 'Approvata' },
                  { num: 'FPR 45/24', ent: 'Noleggi Pro', val: 3200, status: 'In Attesa' },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border-b">
                    <div>
                      <p className="text-sm font-bold">{inv.num}</p>
                      <p className="text-xs text-slate-500">{inv.ent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">€ {inv.val.toLocaleString()}</p>
                      <Badge variant="outline" className="text-[10px]">{inv.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fornitori" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Fornitori Attivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Edilizia Srl', cat: 'Materiali', contact: 'Luca +39 333...' },
                  { name: 'Siderurgica Srl', cat: 'Ferro', contact: 'Marco +39 334...' },
                ].map((f, i) => (
                  <div key={i} className="p-4 border rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg"><Truck size={20} /></div>
                    <div>
                      <p className="text-sm font-bold">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.cat} • {f.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sicurezza" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Documenti Sicurezza</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'POS - Piano Operativo Sicurezza', status: 'Valido', expiry: '31/12/2024' },
                { title: 'PSC - Piano Sicurezza Coordinamento', status: 'Valido', expiry: '31/12/2024' },
                { title: 'DURC Aziendale', status: 'In Scadenza', expiry: '15/06/2024' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={s.status === 'Valido' ? 'text-emerald-500' : 'text-amber-500'} size={20} />
                    <div>
                      <p className="text-sm font-bold">{s.title}</p>
                      <p className="text-xs text-slate-500">Scadenza: {s.expiry}</p>
                    </div>
                  </div>
                  <Badge className={s.status === 'Valido' ? 'bg-emerald-500' : 'bg-amber-500'}>{s.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Cronologia Attività</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  { date: 'Oggi', title: 'Completamento gettata pilastri', desc: 'Verificato da Ing. Rossi' },
                  { date: '14 Mag', title: 'Arrivo fornitura ferro', desc: 'DDT #456/24 registrato' },
                  { date: '12 Mag', title: 'Inizio lavori carpenteria', desc: 'Squadra A operativa' },
                ].map((t, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <Activity size={16} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <time className="font-medium text-blue-600 text-xs">{t.date}</time>
                      </div>
                      <div className="text-slate-500 text-sm">{t.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;