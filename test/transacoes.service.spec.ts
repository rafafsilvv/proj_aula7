import { TransacoesService } from '../src/transacoes/transacoes.service';
import { TransacaoTipo } from '../src/transacoes/schemas/transacao.schema';

describe('TransacoesService', () => {
  let service: TransacoesService;
  let modelMock: any;

  beforeEach(() => {
    modelMock = Object.assign(
      jest.fn().mockImplementation((dados) => ({
        ...dados,
        save: jest.fn().mockResolvedValue({ _id: 'id-teste', ...dados }),
      })),
      { find: jest.fn() },
    );

    service = new TransacoesService(modelMock);
  });

  it('deve cadastrar uma transação', async () => {
    const dados = {
      descricao: 'Salário',
      valor: 2500,
      tipo: TransacaoTipo.RECEITA,
      categoria: 'Renda',
      consumoConsciente: true,
    };

    const resultado = await service.criar(dados);

    expect(modelMock).toHaveBeenCalledWith(dados);
    expect(resultado).toMatchObject({ _id: 'id-teste', ...dados });
  });

  it('deve retornar histórico e calcular as métricas financeiras', async () => {
    const historico = [
      {
        descricao: 'Salário',
        valor: 3000,
        tipo: TransacaoTipo.RECEITA,
        categoria: 'Renda',
        consumoConsciente: true,
      },
      {
        descricao: 'Aluguel',
        valor: 1000,
        tipo: TransacaoTipo.DESPESA,
        categoria: 'Moradia',
        consumoConsciente: true,
      },
      {
        descricao: 'Compra por impulso',
        valor: 125.5,
        tipo: TransacaoTipo.DESPESA,
        categoria: 'Lazer',
        consumoConsciente: false,
      },
    ];

    const exec = jest.fn().mockResolvedValue(historico);
    const sort = jest.fn().mockReturnValue({ exec });
    modelMock.find.mockReturnValue({ sort });

    const resultado = await service.listar();

    expect(modelMock.find).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(resultado.historico).toEqual(historico);
    expect(resultado.metricas).toEqual({
      saldoTotal: 1874.5,
      totalDespesas: 1125.5,
      totalGastoImpulso: 125.5,
    });
  });

  it('deve retornar métricas zeradas quando não houver transações', async () => {
    const exec = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ exec });
    modelMock.find.mockReturnValue({ sort });

    const resultado = await service.listar();

    expect(resultado).toEqual({
      historico: [],
      metricas: {
        saldoTotal: 0,
        totalDespesas: 0,
        totalGastoImpulso: 0,
      },
    });
  });
});
