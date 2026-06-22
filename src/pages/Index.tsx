import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  Clock, 
  Euro, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Gen', ricavi: 45000, costi: 32000 },
  { name: 'Feb', ricavi: 52000, costi: 38000 },
  { name: 'Mar', ricavi: 48000, costi: 35000 },
  { name: 'Apr', ricavi: 61000, costi: 42000 },
  { name: 'Mag', ricavi: 55000, costi: 40000 },
  { name: 'Giu', ricavi: 67000, costi: 45000 },
];

const StatCard = ({ title, value, subValue, icon: Icon, trend, trendValue }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' ? (
              <ArrowUpRight size={14} className="text-emerald-500" />
            ) : (
              <ArrowDownRight size={14} className="text-rose-500" />
            )}
            <span className={trend === 'up' ? 'text-emerald-600 text-xs font-medium' : 'text-rose-600 text-xs font-medium'}>
              {trendValue}
            </span>
            <span className="text-slate-400 text-xs ml-1">{subValue}</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          <Icon size={20} className="text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Direzionale</h1>
        <p className="text-slate-500">Benvenuto in ImpresaOS. Ecco la panoramica della tua azienda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Commesse Attive" 
          value="12" 
          subValue="vs mese scorso" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="+2" 
        />
        <StatCard 
          title="Ricavi Mese" 
          value="€ 67.400" 
          subValue="vs mese scorso" 
          icon={Euro} 
          trend="up" 
          trendValue="+12%" 
        />
        <StatCard 
          title="Margine Medio" 
          value="24.5%" 
          subValue="vs target 22%" 
          icon={CheckCircle2} 
          trend="up" 
          trendValue="+2.5%" 
        />
        <StatCard 
          title="Alert Urgenti" 
          value="4" 
          subValue="documenti scaduti" 
          icon={AlertCircle} 
          trend="down" 
          trendValue="-1" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Andamento Economico</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="ricavi" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Ricavi" />
                <Bar dataKey="costi" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Costi" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Attività Recenti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { label: 'Nuovo rapportino', project: 'Cantiere Monza', time: '10 min fa', icon: Clock },
                { label: 'Fattura approvata', project: 'Forniture Edili Srl', time: '1 ora fa', icon: CheckCircle2 },
                { label: 'Documento in scadenza', project: 'DURC - Impresa Rossi', time: '3 ore fa', icon: AlertCircle },
                { label: 'Messaggio WhatsApp', project: 'Capocantiere Luca', time: '5 ore fa', icon: MessageSquare },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <item.icon size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.project} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;