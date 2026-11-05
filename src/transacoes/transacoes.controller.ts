import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CriarTransacaoDto } from './dto/criar-transacao.dto';
import { RespostaTransacoes, TransacoesService } from './transacoes.service';
import { TransacaoDocument } from './schemas/transacao.schema';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  criar(@Body() dados: CriarTransacaoDto): Promise<TransacaoDocument> {
    return this.transacoesService.criar(dados);
  }

  @Get()
  listar(): Promise<RespostaTransacoes> {
    return this.transacoesService.listar();
  }
}
