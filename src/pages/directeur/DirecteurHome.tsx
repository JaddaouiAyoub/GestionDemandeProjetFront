import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DirecteurDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);

  useEffect(() => {
    axios.get('/stats').then(res => {
      setStats(res.data.stats);
      setCharts(res.data.charts);
    });
  }, []);

  if (!stats || !charts) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      {/* Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card title="Utilisateurs" value={stats.usersCount} />
        <Card title="Demandes" value={stats.demandesCount} />
        <Card title="Dossiers Étude" value={stats.dossiersEtudeCount} />
        <Card title="Dossiers Exécution" value={stats.dossiersExecutionCount} />
        <Card title="Taux Acceptation" value={`${stats.tauxAcceptation}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Demandes par Mois</h2>
          <Bar
            data={{
              labels: charts.demandesParMois.map((d: any) => `Mois ${d.mois}`),
              datasets: [{
                label: 'Demandes',
                data: charts.demandesParMois.map((d: any) => d.total),
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
              }]
            }}
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Demandes par Type</h2>
          <Pie
            data={{
              labels: charts.demandesParType.map((d: any) => d.type),
              datasets: [{
                data: charts.demandesParType.map((d: any) => d._count.type),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
