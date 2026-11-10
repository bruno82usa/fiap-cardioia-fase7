# Módulo IoT - MicroPython (CardioIA Edge)

Este módulo simula o processamento em borda (Edge Computing) de sinais vitais de pacientes cardiológicos utilizando **MicroPython** em um ESP32.

## Componentes Simulados
- **ESP32** executando MicroPython
- **Display OLED SSD1306 (I2C)**: Exibe em tempo real o BPM, Temperatura e Diagnóstico local
- **Potenciômetro 1 (Pino 34)**: Simula o sensor de frequência cardíaca (BPM de 45 a 160)
- **Potenciômetro 2 (Pino 35)**: Simula o sensor de temperatura corporal (35.0°C a 40.5°C)
- **LED Verde (Pino 2)**: Indica sinais vitais estáveis
- **LED Vermelho (Pino 4) + Buzzer (Pino 15)**: Alerta imediato de Taquicardia, Bradicardia ou Febre Crítica

## Como Executar no Wokwi
1. Acesse: [https://wokwi.com/projects/new/micropython-esp32](https://wokwi.com/projects/new/micropython-esp32)
2. Substitua o conteúdo do arquivo `diagram.json` pelo conteúdo de `iot/diagram.json`.
3. Substitua o conteúdo de `main.py` pelo conteúdo de `iot/main.py`.
4. Clique em **Start Simulation** (botão verde de Play).
5. Ajuste os potenciômetros para testar os limiares de alarme em tempo real!
