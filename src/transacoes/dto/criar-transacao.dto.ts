import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { TransacaoTipo } from '../schemas/transacao.schema';

export class CriarTransacaoDto {
  @IsString()
  @MinLength(1)
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;

  @IsEnum(TransacaoTipo, {
    message: 'tipo deve ser "receita" ou "despesa".',
  })
  tipo: TransacaoTipo;

  @IsString()
  @MinLength(1)
  categoria: string;

  @IsBoolean()
  consumoConsciente: boolean;
}
