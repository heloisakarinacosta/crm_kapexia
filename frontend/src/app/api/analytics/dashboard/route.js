import { NextResponse } from 'next/server';

// Função para obter dados do dashboard de análises
export async function GET(request) {
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
        { dia: 'Seg', valor: 20 },
        { dia: 'Ter', valor: 15 },
        { dia: 'Qua', valor: 25 },
        { dia: 'Qui', valor: 18 },
        { dia: 'Sex', valor: 22 },
        { dia: 'Sáb', valor: 17 },
        { dia: 'Dom', valor: 29 }
      ],
      prospeccao: [
        { dia: 'Seg', valor: 15 },
        { dia: 'Ter', valor: 18 },
        { dia: 'Qua', valor: 16 },
        { dia: 'Qui', valor: 22 },
        { dia: 'Sex', valor: 26 },
        { dia: 'Sáb', valor: 24 },
        { dia: 'Dom', valor: 28 }
      ],
      expansao: [
        { dia: 'Seg', valor: 8 },
        { dia: 'Ter', valor: 10 },
        { dia: 'Qua', valor: 12 },
        { dia: 'Qui', valor: 9 },
        { dia: 'Sex', valor: 11 },
        { dia: 'Sáb', valor: 10 },
        { dia: 'Dom', valor: 14 }
      ],
      distribuicao: [
        { nome: 'Frio', valor: 30 },
        { nome: 'Morno', valor: 45 },
        { nome: 'Quente', valor: 25 }
      ],
      agendamentos: [
        { nome: 'Agendados', valor: 65 },
        { nome: 'Não Agendados', valor: 35 }
      ],
      conversao: [
        { nome: 'Convertidos', valor: 75 },
        { nome: 'Não Convertidos', valor: 25 }
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
