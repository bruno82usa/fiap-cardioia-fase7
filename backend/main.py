from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import time

from ml_model import predictor
from llm_service import assistant_llm

app = FastAPI(
    title="CardioIA Integrator API",
    description="Núcleo unificador da plataforma CardioIA (Fase 7 FIAP)",
    version="1.0.0"
)

# Habilitar CORS para comunicação com a Vercel e Expo Mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado em memória da última telemetria recebida do IoT / Wokwi
telemetria_atual = {
    "dispositivo_id": "ESP32-CARDIO-01",
    "bpm": 74,
    "temperatura": 36.6,
    "status_borda": "Normal",
    "alerta_ativo": False,
    "timestamp": time.time()
}

historico_telemetria: List[dict] = [telemetria_atual]

class TelemetriaInput(BaseModel):
    dispositivo_id: Optional[str] = "ESP32-CARDIO-01"
    bpm: int
    temperatura: float
    status_borda: Optional[str] = "Normal"
    alerta_ativo: Optional[bool] = False

class PredicaoInput(BaseModel):
    idade: int = 58
    bpm: int = 80
    pas: int = 135
    pad: int = 85
    temperatura: float = 36.6
    colesterol: int = 210
    glicemia: int = 110

class ChatInput(BaseModel):
    mensagem: str
    incluir_sinais_vitais: Optional[bool] = True

@app.get("/")
def home():
    return {
        "status": "online",
        "servico": "CardioIA Core Integrator",
        "fase": "Fase 7 - FIAP",
        "integrantes": "Bruno Gambarini (Grupo 83)"
    }

# 1. Endpoint de Telemetria (Recepção do IoT / Wokwi)
@app.post("/api/telemetria")
def receber_telemetria(dados: TelemetriaInput):
    global telemetria_atual
    telemetria_atual = {
        "dispositivo_id": dados.dispositivo_id,
        "bpm": dados.bpm,
        "temperatura": dados.temperatura,
        "status_borda": dados.status_borda,
        "alerta_ativo": dados.alerta_ativo,
        "timestamp": time.time()
    }
    historico_telemetria.append(telemetria_atual)
    if len(historico_telemetria) > 50:
        historico_telemetria.pop(0)
    return {"status": "sucesso", "dados_recebidos": telemetria_atual}

@app.get("/api/telemetria/atual")
def obter_telemetria_atual():
    return telemetria_atual

@app.get("/api/telemetria/historico")
def obter_historico():
    return historico_telemetria[-20:]

# 2. Endpoint Preditivo de Risco Cardíaco (Fase 6 ML)
@app.post("/api/predicao/risco")
def calcular_risco(dados: PredicaoInput):
    resultado = predictor.prever(dados.model_dump())
    return {
        "paciente_dados": dados.model_dump(),
        "diagnostico_ia": resultado,
        "timestamp": time.time()
    }

# 3. Endpoint Conversacional / Assistente LLM (Fase 5)
@app.post("/api/chat")
def conversar_assistente(dados: ChatInput):
    telemetria_ref = telemetria_atual if dados.incluir_sinais_vitais else None
    resposta_ia = assistant_llm.responder(dados.mensagem, telemetria_ref)
    return resposta_ia

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

