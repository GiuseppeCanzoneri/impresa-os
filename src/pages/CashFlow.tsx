import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mag', entrate: 45000, uscite: 32000, saldo: 13000 },
  { name: 'Giu', entrate: 52000, uscite: 38000, saldo: 27000 },
  { name: 'Lug', entrate: 48000, uscite: 55000, saldo: 20000 },
  { name: 'Ago', entrate: 30000, uscite: 25000, saldo: 25000 },
  { name: 'Set', entrate: 65000, uscite: 42000, saldo: 48000 },
  { name: 'Ott', entrate: 70000, uscite: 45000, saldo: 73000 },
];

const CashFlow = () => {
  return (
    <div className="p-8 space-y-8 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cash Flow</h1>
        <p className="text-slate-500">Monitora la liquidità aziendale e le scadenze future.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Saldo Attuale</p>
                <h3 className="text-2xl font-bold mt-1">€ 142.500</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Wallet size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Entrate Previste (30gg)</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">€ 85.000</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUp size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">Uscite Previste (30gg)</p>
                <h3 className="text-2xl font-bold mt-1 text-rose-600">€ 62.400</h3>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
                <TrendingDown size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Andamento Cassa Previsto</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="saldo" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSaldo)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlow;