import numpy as np
from sklearn.ensemble import RandomForestClassifier

class CardioRiskPredictor:
    """
    Modelo preditivo treinado para detecção e classificação de pico de risco cardíaco.
    Features: [idade, bpm, pressao_sistolica, pressao_diastolica, temperatura, colesterol, glicemia]
    Classes: 0: Baixo Risco, 1: Risco Moderado, 2: Risco Crítico (Emergência)
    """
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self._treinar_modelo_base()

    def _treinar_modelo_base(self):
        # Base sintética de calibração baseada em diretrizes clínicas da SBC / AHA
        np.random.seed(42)
        n_samples = 600

        # Idade: 20 a 85 anos
        idade = np.random.randint(20, 85, n_samples)
        # BPM: 50 a 150
        bpm = np.random.randint(50, 150, n_samples)
        # PA Sistólica: 90 a 190
        pas = np.random.randint(90, 190, n_samples)
        # PA Diastólica: 60 a 120
        pad = np.random.randint(60, 120, n_samples)
        # Temperatura: 36.0 a 39.5
        temp = np.round(np.random.uniform(36.0, 39.5, n_samples), 1)
        # Colesterol total: 150 a 320
        col = np.random.randint(150, 320, n_samples)
        # Glicemia: 70 a 250
        glic = np.random.randint(70, 250, n_samples)

        X = np.column_stack([idade, bpm, pas, pad, temp, col, glic])

        # Rótulo clínico fundamentado
        y = []
        for i in range(n_samples):
            score = 0
            if bpm[i] > 115 or bpm[i] < 55: score += 2
            if pas[i] >= 140 or pad[i] >= 90: score += 2
            if pas[i] >= 170: score += 3
            if temp[i] >= 38.0: score += 1
            if col[i] > 240: score += 1
            if glic[i] > 180: score += 1
            if idade[i] > 65: score += 1

            if score <= 2:
                y.append(0) # Baixo
            elif score <= 5:
                y.append(1) # Moderado
            else:
                y.append(2) # Crítico

        self.model.fit(X, y)

    def prever(self, dados: dict):
        x_input = np.array([[
            dados.get('idade', 55),
            dados.get('bpm', 75),
            dados.get('pas', 120),
            dados.get('pad', 80),
            dados.get('temperatura', 36.5),
            dados.get('colesterol', 190),
            dados.get('glicemia', 95)
        ]])

        classe_idx = int(self.model.predict(x_input)[0])
        probabilidades = self.model.predict_proba(x_input)[0]

        mapa_classes = {
            0: {"nivel": "Baixo Risco", "cor": "green", "recomendacao": "Sinais vitais normais. Manter acompanhamento de rotina."},
            1: {"nivel": "Risco Moderado", "cor": "yellow", "recomendacao": "Atenção clínica requerida. Monitorar pressão e frequência nas próximas 2 horas."},
            2: {"nivel": "Risco Crítico", "cor": "red", "recomendacao": "ALERTA DE EMERGÊNCIA: Encaminhar imediatamente para triagem médica ou pronto-socorro."}
        }

        resultado = mapa_classes[classe_idx]
        return {
            "nivel_risco": resultado["nivel"],
            "codigo_risco": classe_idx,
            "cor": resultado["cor"],
            "probabilidade_critico": round(float(probabilidades[2] if len(probabilidades) > 2 else 0.0) * 100, 1),
            "recomendacao": resultado["recomendacao"]
        }

predictor = CardioRiskPredictor()
