import re

class CardioAssistantLLM:
    """
    Agente Conversacional Especialista em Saúde Cardiológica (Fase 5).
    Fornece acolhimento, triagem de sintomas e orientações seguras.
    """
    def __init__(self):
        self.contexto_sistema = (
            "Você é o assistente virtual inteligente da plataforma CardioIA. "
            "Suas orientações são de caráter informativo e de triagem, não substituindo o médico."
        )

    def responder(self, mensagem_usuario: str, telemetria_atual: dict = None) -> dict:
        msg = mensagem_usuario.lower()
        
        # Análise de urgência imediata
        sintomas_urgentes = ['dor no peito', 'dor no braço', 'falta de ar', 'desmaio', 'tontura forte', 'dormência']
        urgente = any(s in msg for s in sintomas_urgentes)
        
        bpm_atual = telemetria_atual.get('bpm', 75) if telemetria_atual else 75
        temp_atual = telemetria_atual.get('temperatura', 36.5) if telemetria_atual else 36.5

        if urgente:
            resposta = (
                "⚠️ **ATENÇÃO - SINAIS DE ALERTA DETECTADOS** ⚠️\n\n"
                f"Você mencionou sintomas sugestivos de emergência cardiovascular. "
                f"No momento, seu sensor indica BPM de {bpm_atual} e temperatura de {temp_atual}°C.\n\n"
                "**Recomendações Imediatas:**\n"
                "1. Sente-se ou deite-se com a cabeça elevada.\n"
                "2. Não faça esforços físicos.\n"
                "3. Chame o SAMU (192) ou procure a emergência mais próxima imediatamente."
            )
            categoria = "urgencia"
        elif "palpitação" in msg or "coração acelerado" in msg or bpm_atual > 110:
            resposta = (
                f"Identifiquei que seus batimentos estão em {bpm_atual} BPM (acima da média basal de repouso). "
                "Palpitações podem ser decorrentes de ansiedade, consumo de cafeína ou arritmias. "
                "Recomendo repousar por 15 minutos em ambiente calmo. Se persistir, consulte seu cardiologista."
            )
            categoria = "atencao"
        elif "alimentação" in msg or "dieta" in msg or "pressão" in msg:
            resposta = (
                "Para manter o coração saudável e a pressão arterial controlada:\n"
                "• Reduza a ingestão de sódio (sal refinado e ultraprocessados).\n"
                "• Priorize vegetais, azeite de oliva, peixes ricos em Ômega-3 e fibras.\n"
                "• Mantenha hidratação constante e pratique atividade física orientada."
            )
            categoria = "orientacao"
        elif "remédio" in msg or "medicamento" in msg:
            resposta = (
                "Nunca altere ou interrompa o uso de medicamentos anti-hipertensivos ou anticoagulantes por conta própria. "
                "Caso esteja sentindo efeitos adversos, contate o médico que prescreveu a receita."
            )
            categoria = "medicacao"
        else:
            resposta = (
                f"Olá! Sou o Assistente CardioIA. Seus sinais vitais atuais estão com {bpm_atual} BPM e {temp_atual}°C. "
                "Como posso ajudar você hoje com seus cuidados cardiovasculares?"
            )
            categoria = "geral"

        return {
            "resposta": resposta,
            "categoria": categoria,
            "sinais_vitais_referencia": {"bpm": bpm_atual, "temp": temp_atual}
        }

assistant_llm = CardioAssistantLLM()

