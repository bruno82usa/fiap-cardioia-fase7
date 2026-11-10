# CardioIA - Plataforma Integrada de Inteligência Cardíaca
### FIAP - Fase 7: Cap 1 - Da Construção de Módulos à Solução Integrada
**Grupo 83**: Bruno Gambarini (RM561517)

---

## 📌 Visão Geral do Projeto
A **CardioIA** é um ecossistema holístico para detecção precoce de anomalias cardíacas, monitoramento contínuo em tempo real e auxílio à tomada de decisão clínica. 
Nesta **Fase 7**, integramos todos os módulos desenvolvidos ao longo do curso em um produto funcional com alta usabilidade, orquestrado por um backend unificador em Python.

---

## 🏗️ Arquitetura do Sistema Fim-a-Fim
O fluxo completo de dados opera da seguinte forma:
$$\text{Sensores Fisiológicos} \longrightarrow \text{Edge (MicroPython / Wokwi)} \longrightarrow \text{Backend Integrador (Python/FastAPI)} \longrightarrow \text{Motores de IA} \longrightarrow \text{Aplicações (Web & Mobile)}$$

1. **IoT / Borda (MicroPython)**:
   - Coleta de frequência cardíaca (BPM) e temperatura corporal via conversão ADC de alta fidelidade.
   - Processamento de borda com filtragem de limiares (Taquicardia, Bradicardia, Febre).
   - Feedback visual imediato com display OLED SSD1306 e sinalização de alarme via LED/Buzzer.
   - **Aplicação Web em Produção (Vercel)**: [https://fiap-cardioia-fase7.vercel.app/](https://fiap-cardioia-fase7.vercel.app/)
- **Repositório Privado (GitHub)**: [https://github.com/bruno82usa/fiap-cardioia-fase7](https://github.com/bruno82usa/fiap-cardioia-fase7)
- **Simulação Wokwi**: [Link da Simulação no Wokwi](https://wokwi.com/projects/new/micropython-esp32) *(utilizar arquivos da pasta `/iot`)*.

2. **Backend Integrador (Python / FastAPI)**:
   - API de telemetria em tempo real (`/api/telemetria`).
   - Motor de Machine Learning da Fase 6 (`/api/predicao/risco`): Classificador calibrado de risco crítico baseado em diretrizes da SBC.
   - Assistente Conversacional da Fase 5 (`/api/chat`): Triagem inteligente de sintomas e acolhimento do paciente.

3. **Front-End Web (React + Vite + Tailwind CSS)**:
   - Dashboard médico com monitoramento de ECG / BPM em tempo real (Recharts).
   - Cartões de risco preditivo e chat interativo com a IA.
   - **Deploy Vercel**: `vercel.json` pré-configurado com regras de reescrita para Single Page Application (SPA) e CI/CD habilitado.

4. **Mobile (React Native + Expo)**:
   - Aplicativo para acompanhamento móvel do paciente.
   - `app.json` com `package` invertido (`br.com.fiap.cardioia`).
   - `eas.json` com perfil `preview` para geração automatizada do `.apk` via Expo Application Services.

---

## 🚀 Como Executar Localmente

### 1. Backend Integrador (Python)
```bash
cd backend
pip install -r requirements.txt
python main.py
# Servidor disponível em: http://localhost:8000 (Docs: http://localhost:8000/docs)
```

### 2. Front-End Web (React)
```bash
cd web
npm install
npm run dev
# Aplicação disponível em: http://localhost:5173
```

### 3. Build & Deploy Web (Vercel)
A aplicação possui suporte nativo à Vercel:
```bash
cd web
npm run build
# Para deploy via CLI:
npx vercel --prod
```

### 4. Build Mobile (.apk via Expo EAS)
```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

---

## 📁 Estrutura de Diretórios
```
.
├── backend/          # API FastAPI, modelo preditivo e assistente LLM
├── iot/              # Código MicroPython (main.py) e esquema Wokwi (diagram.json)
├── web/              # Aplicação React + Vite + Tailwind + vercel.json
├── mobile/           # Aplicação Expo + app.json + eas.json
├── docs/             # Relatório técnico e documentação complementar
└── README.md
```

---

## 👥 Integrantes
- **Bruno Gambarini** - RM561517 - Grupo 83

