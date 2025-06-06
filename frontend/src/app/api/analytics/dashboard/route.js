import { NextResponse } from 'next/server';

// Função para obter dados do dashboard de análises
export async function GET() {
  try {
    // Em produção, esta função fará uma chamada à API do backend
    // const response = await fetch(`${process.env.BACKEND_URL}/api/analytics/dashboard`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}` // Token obtido do cookie ou localStorage
    //   }
    // });
    // const data = await response.json();
    // return NextResponse.json(data);

    // Dados de exemplo para desenvolvimento
    const sampleData = {
      qualificacao: [
        { x: 'Seg', y: 20 },
        { x: 'Ter', y: 15 },
        { x: 'Qua', y: 25 },
        { x: 'Qui', y: 18 },
        { x: 'Sex', y: 22 },
        { x: 'Sáb', y: 17 },
        { x: 'Dom', y: 29 }
      ],
      prospeccao: [
        { x: 'Seg', y: 15 },
        { x: 'Ter', y: 18 },
        { x: 'Qua', y: 16 },
        { x: 'Qui', y: 22 },
        { x: 'Sex', y: 26 },
        { x: 'Sáb', y: 24 },
        { x: 'Dom', y: 28 }
      ],
      expansao: [
        { x: 'Seg', y: 8 },
        { x: 'Ter', y: 10 },
        { x: 'Qua', y: 12 },
        { x: 'Qui', y: 9 },
        { x: 'Sex', y: 11 },
        { x: 'Sáb', y: 10 },
        { x: 'Dom', y: 14 }
      ],
      distribuicao: [
        { name: 'Frio', value: 30 },
        { name: 'Morno', value: 45 },
        { name: 'Quente', value: 25 }
      ],
      agendamentos: [
        { name: 'Agendados', value: 65 },
        { name: 'Não Agendados', value: 35 }
      ],
      conversao: [
        { name: 'Convertidos', value: 75 },
        { name: 'Não Convertidos', value: 25 }
      ],
      ticketMedio: [
        { mes: 'Jan', valor: 1500 },
        { mes: 'Fev', valor: 1800 },
        { mes: 'Mar', valor: 1650 },
        { mes: 'Abr', valor: 2100 }
      ],
      txGanhoQualificacao: [
        { mes: 'Jan', total: 100, agendados: 40 },
        { mes: 'Fev', total: 120, agendados: 55 },
        { mes: 'Mar', total: 150, agendados: 75 }
      ],
      txGanhoProspeccao: [
        { mes: 'Jan', total: 100, propostas: 30 },
        { mes: 'Fev', total: 120, propostas: 45 },
        { mes: 'Mar', total: 150, propostas: 60 }
      ],
      ticketTrimestral: [
        { mes: 'Jan', valor: 1500 },
        { mes: 'Fev', valor: 1800 },
        { mes: 'Mar', valor: 2200 }
      ]
    };

    return NextResponse.json({ 
      success: true, 
      data: sampleData,
      client: {
        id: 1,
        name: 'Cliente Exemplo'
      }
    });
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao obter dados do dashboard', error: error.message },
      { status: 500 }
    );
  }
}
