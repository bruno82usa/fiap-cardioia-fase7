import time
import random
import ujson
try:
    import network
    import urequests
except ImportError:
    network = None
    urequests = None

from machine import Pin, I2C, ADC
import ssd1306

# ==========================================
# CONFIGURAÇÕES DE HARDWARE (ESP32 / WOKWI)
# ==========================================
# Display OLED I2C 128x64 (SDA=Pin 21, SCL=Pin 22)
i2c = I2C(0, scl=Pin(22), sda=Pin(21))
try:
    oled = ssd1306.SSD1306_I2C(128, 64, i2c)
except Exception as e:
    print("OLED init warning:", e)
    oled = None

# LEDs de Status e Alerta
led_normal = Pin(2, Pin.OUT)   # LED Verde/Azul: Status Normal
led_alerta = Pin(4, Pin.OUT)   # LED Vermelho: Alerta Crítico
buzzer = Pin(15, Pin.OUT)      # Buzzer para avisos sonoros

# Entradas Analógicas simuladas (Potenciômetros no Wokwi)
# ADC 34: Simula Frequência Cardíaca (BPM)
# ADC 35: Simula Temperatura Corporal (°C)
adc_bpm = ADC(Pin(34))
adc_bpm.atten(ADC.ATTN_11DB)

adc_temp = ADC(Pin(35))
adc_temp.atten(ADC.ATTN_11DB)

# URL do Backend Integrador
BACKEND_URL = "http://localhost:8000/api/telemetria"

def exibir_display(bpm, temp, status, alerta):
    """Atualiza o display OLED com os sinais vitais e diagnóstico local"""
    if not oled:
        return
    oled.fill(0)
    oled.text("=== CARDIO-IA ===", 0, 0)
    oled.text("BPM: {:3d}".format(int(bpm)), 0, 16)
    oled.text("Temp: {:.1f} C".format(temp), 0, 28)
    oled.text("Diag: {}".format(status[:10]), 0, 42)
    
    if alerta:
        oled.text("! ALERTA MEDICO !", 0, 54)
    else:
        oled.text("Sinais Estaveis", 0, 54)
    oled.show()

def processar_sinais_locais(bpm, temp):
    """
    Processamento em Borda (Edge Computing) com MicroPython:
    Detecta taquicardia, bradicardia, febre ou pico de risco imediato.
    """
    alerta = False
    status = "Normal"
    
    if bpm > 110:
        status = "Taquicardia"
        alerta = True
    elif bpm < 55:
        status = "Bradicardia"
        alerta = True
        
    if temp >= 37.8:
        status = "Febre/Critico" if alerta else "Febre"
        alerta = True
        
    # Atuação nos atuadores (LEDs e Alarme)
    if alerta:
        led_normal.value(0)
        led_alerta.value(1)
        buzzer.value(1)
        time.sleep_ms(100)
        buzzer.value(0)
    else:
        led_normal.value(1)
        led_alerta.value(0)
        buzzer.value(0)
        
    return status, alerta

def ler_sensores():
    """Lê os conversores ADCs e mapeia para valores fisiológicos realistas"""
    # Valor ADC 0 - 4095
    val_bpm = adc_bpm.read()
    val_temp = adc_temp.read()
    
    # Mapeamento:
    # BPM de 45 a 160
    bpm = int(45 + (val_bpm / 4095.0) * 115)
    # Temp de 35.0°C a 40.5°C
    temp = round(35.0 + (val_temp / 4095.0) * 5.5, 1)
    
    return bpm, temp

def enviar_telemetria(payload):
    """Tenta enviar dados para a API do backend se conectado à rede"""
    if urequests:
        try:
            headers = {'content-type': 'application/json'}
            res = urequests.post(BACKEND_URL, data=ujson.dumps(payload), headers=headers)
            res.close()
        except Exception:
            pass  # Modo offline tolerante a falhas

print("Iniciando Módulo CardioIA Edge (MicroPython)...")

while True:
    bpm, temp = ler_sensores()
    status, alerta = processar_sinais_locais(bpm, temp)
    
    exibir_display(bpm, temp, status, alerta)
    
    payload = {
        "dispositivo_id": "ESP32-CARDIO-01",
        "bpm": bpm,
        "temperatura": temp,
        "status_borda": status,
        "alerta_ativo": alerta,
        "timestamp": time.time()
    }
    
    print("[EDGE MicroPython] BPM: {:3d} | Temp: {:.1f}C | Status: {}".format(bpm, temp, status))
    enviar_telemetria(payload)
    
    time.sleep(1.5)
