# RELATÓRIO TÉCNICO DE ENGENHARIA E INTEGRAÇÃO
## Projeto CardioIA – Plataforma de Inteligência Cardíaca Total
**Instituição**: FIAP – Pós-Tech em Inteligência Artificial  
**Módulo**: Fase 7 – Da Construção de Módulos à Solução Integrada  
**Grupo**: 83  
**Integrante**: Bruno Gambarini (RM561517)  

---

## 1. INTRODUÇÃO E OBJETIVOS DO PROJETO
O projeto **CardioIA** tem como propósito enfrentar uma das principais causas de óbito globais: as doenças cardiovasculares e os eventos isquêmicos agudos. Ao longo das Fases 1 a 6, foram construídos módulos analíticos isolados (coleta IoT, classificação com redes neurais, visão computacional para laudos, assistente conversacional e sistema multiagente preditivo).

Nesta **Fase 7**, a solução atinge o patamar de **MVP Integrado de Nível Hospitalar**, unindo:
1. **Computação em Borda (Edge Computing)** com **MicroPython** em ESP32.
2. **Back-end Integrador** orquestrado em **Python/FastAPI**.
3. **Motores de IA** operando de forma síncrona (Machine Learning Preditivo e LLM Especialista).
4. **Interfaces de Usuário (Web & Mobile)** com usabilidade refinada e esteiras de **CI/CD** ativas.

---

## 2. ARQUITETURA FINAL DO ECOSSISTEMA
O fluxo contínuo de dados é estruturado em quatro camadas operacionais fundamentais:

```
+-------------------------------------------------------------------------+
|                        CAMADA DE BORDA (IoT)                            |
|  Sensores Fisiológicos (BPM / Temp) -> ESP32 MicroPython -> OLED / LED  |
+-------------------------------------------------------------------------+
                                    |
                                    v (HTTP JSON / REST)
+-------------------------------------------------------------------------+
|                  CAMADA DE INTEGRAÇÃO (BACK-END PYTHON)                 |
|  FastAPI Hub -> Ingestão de Telemetria -> Despacho para Motores de IA   |
+-------------------------------------------------------------------------+
         |                                                 |
         v                                                 v
+-------------------------------+         +-------------------------------+
|     MOTOR PREDITIVO (ML)      |         |   ASSISTENTE CONVERSACIONAL   |
| Random Forest - Risco Crítico |         |  Triagem Clínica de Sintomas  |
+-------------------------------+         +-------------------------------+
         |                                                 |
         +------------------------+------------------------+
                                  |
                                  v
+-------------------------------------------------------------------------+
|                     CAMADA DE APRESENTAÇÃO (UI/UX)                      |
|  - Web Portal (React + Vite) [Deploy Vercel com vercel.json]            |
|  - Mobile App (React Native) [Build .apk via Expo EAS]                  |
+-------------------------------------------------------------------------+
```

### 2.1. Transição de Hardware para MicroPython (Simulador Wokwi)
- **Motivação**: A substituição da programação monolítica em C/C++ por MicroPython viabiliza maior agilidade de prototipagem, manutenibilidade do código e compatibilidade com processadores robustos (como ESP32 e Raspberry Pi).
- **Tratamento Local**: O firmware em MicroPython realiza a leitura dos conversores ADC (pinos 34 e 35), faz o mapeamento para grandezas clínicas e executa lógica de segurança: se `BPM > 110` ou `BPM < 55`, ou `Temperatura >= 37.8°C`, aciona imediatamente o LED vermelho de alerta e o sinalizador sonoro, além de atualizar o display OLED local via barramento I2C.
- **Link da Simulação no Wokwi**: [https://wokwi.com/projects/480329730912505857](https://wokwi.com/projects/480329730912505857)

### 2.2. Núcleo Integrador Python (FastAPI)
- Endpoints padronizados com validação estrita de esquemas via **Pydantic**:
  - `POST /api/telemetria`: Ingestão contínua e manutenção do buffer de sinais vitais.
  - `POST /api/predicao/risco`: Avaliação preditiva probabilística de crises.
  - `POST /api/chat`: Agente conversacional treinado com contexto clínico e salvaguardas éticas.

### 2.3. Distribuição e Deploy Profissional
- **Web SPA**: Implementado com **React + Vite** e estilização via **Tailwind CSS**. A aplicação está publicada e acessível em: [https://fiap-cardioia-fase7.vercel.app/](https://fiap-cardioia-fase7.vercel.app/). Foi adicionado o arquivo `vercel.json` com regra de *rewrites* para evitar erros 404 em rotas diretas da aplicação.
- **Mobile Expo**: Configurado com `app.json` definindo o identificador de pacote único `br.com.fiap.cardioia` e arquivo `eas.json` parametrizado no perfil `preview` com geração direta de artefato executável `.apk`.

---

## 3. VALIDAÇÃO DOS RESULTADOS E DISCUSSÃO
1. **Desempenho da Aplicação Web**: O bundle de produção foi gerado com sucesso (zero erros de TypeScript/JSX), pronto para publicação e entrega de métricas com gráficos em tempo real (`recharts`).
2. **Integridade dos Modelos**: O preditor de risco categoriza pacientes em Baixo, Moderado ou Crítico, disparando alertas proativos e recomendações clínicas embasadas.
3. **Experiência do Paciente**: A interface conversacional reconhece termos de urgência (como *"dor no peito irradiando para o braço"*) e aciona protocolos imediatos de socorro médico (SAMU 192).

---

## 4. ROTEIRO PARA VÍDEO DEMONSTRATIVO (Até 5 Minutos)
- **Minuto 0:00 - 1:00**: Apresentação dos integrantes, tema da Fase 7 e objetivo do MVP Integrado.
- **Minuto 1:00 - 2:00**: Demonstração do hardware no simulador Wokwi (variação de potenciômetros, exibição no OLED e disparo do LED de alerta).
- **Minuto 2:00 - 3:30**: Apresentação do Dashboard Web na Vercel: visualização dos sinais vitais em tempo real e teste do Chatbot Clínico.
- **Minuto 3:30 - 4:30**: Demonstração do aplicativo Mobile e explicação do pipeline de build no Expo EAS gerando o `.apk`.
- **Minuto 4:30 - 5:00**: Conclusão da arquitetura integrada e encerramento.

---

**FIAP • Engenharia de Software e Inteligência Artificial • 2026**

