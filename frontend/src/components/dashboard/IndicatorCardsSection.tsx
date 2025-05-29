import React from 'react';
import IndicatorCard from './IndicatorCard';

// Interface para os dados dos indicadores
interface IndicatorData {
  id: string;
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
}

const IndicatorCardsSection: React.FC = () => {
  // Dados estáticos para os indicadores - futuramente virão da API/backend
  const indicators: IndicatorData[] = [
    {
      id: 'leads-week',
      title: 'Novos Leads (Semana)',
      value: 42,
      icon: '👥',
      trend: {
        value: '12%',
        isPositive: true
      }
    },
    {
      id: 'conversion-rate',
      title: 'Taxa de Conversão',
      value: '8.5%',
      icon: '📈',
      trend: {
        value: '2.3%',
        isPositive: true
      }
    },
    {
      id: 'revenue-month',
      title: 'Receita (Mês)',
      value: 'R$ 38.450',
      icon: '💰',
      trend: {
        value: '5%',
        isPositive: false
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {indicators.map(indicator => (
        <IndicatorCard
          key={indicator.id}
          title={indicator.title}
          value={indicator.value}
          icon={indicator.icon}
          trend={indicator.trend}
        />
      ))}
    </div>
  );
};

export default IndicatorCardsSection;
