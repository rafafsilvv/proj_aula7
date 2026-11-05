import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import {
  Transacao,
  TransacaoDocument,
  TransacaoTipo,
} from './schemas/transacao.schema';

export interface MetricasFinanceiras {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface RespostaTransacoes {
  historico: TransacaoDocument[];
  metricas: MetricasFinanceiras;
}

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<Transacao>,
  ) {}

  async criar(dados: CriarTransacaoDto): Promise<TransacaoDocument> {
    const novaTransacao = new this.transacaoModel(dados);
    return novaTransacao.save();
  }

  async listar(): Promise<RespostaTransacoes> {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    // O cálculo é feito no Service, conforme exigido no enunciado.
    // Somamos em centavos para evitar imprecisão comum de ponto flutuante.
    const totaisEmCentavos = historico.reduce(
      (totais, transacao) => {
        const valor = Math.round(Number(transacao.valor) * 100);

        if (transacao.tipo === TransacaoTipo.RECEITA) {
          totais.receitas += valor;
        }

        if (transacao.tipo === TransacaoTipo.DESPESA) {
          totais.despesas += valor;

          if (transacao.consumoConsciente === false) {
            totais.gastosImpulso += valor;
          }
        }

        return totais;
      },
      { receitas: 0, despesas: 0, gastosImpulso: 0 },
    );

    return {
      historico,
      metricas: {
        saldoTotal:
          (totaisEmCentavos.receitas - totaisEmCentavos.despesas) / 100,
        totalDespesas: totaisEmCentavos.despesas / 100,
        totalGastoImpulso: totaisEmCentavos.gastosImpulso / 100,
      },
    };
  }
}
