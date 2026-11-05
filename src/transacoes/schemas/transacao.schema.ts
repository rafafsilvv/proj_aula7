import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum TransacaoTipo {
  RECEITA = 'receita',
  DESPESA = 'despesa',
}

export type TransacaoDocument = HydratedDocument<Transacao>;

@Schema({ timestamps: true, versionKey: false })
export class Transacao {
  @Prop({ type: String, required: true, trim: true })
  descricao: string;

  @Prop({ type: Number, required: true, min: 0.01 })
  valor: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(TransacaoTipo),
    lowercase: true,
    trim: true,
  })
  tipo: TransacaoTipo;

  @Prop({ type: String, required: true, trim: true })
  categoria: string;

  @Prop({ type: Boolean, required: true, default: true })
  consumoConsciente: boolean;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
