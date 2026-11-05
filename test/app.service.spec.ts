import { AppService } from '../src/app.service';

describe('AppService', () => {
  it('deve retornar a mensagem inicial da API', () => {
    const service = new AppService();
    expect(service.getHello()).toBe('Olá Mundo! API de Controle Financeiro Pessoal');
  });
});
