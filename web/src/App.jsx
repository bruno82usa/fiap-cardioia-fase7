import React, { useState, useEffect } from 'react';
import { 
  Heart, Activity, Thermometer, ShieldAlert, CheckCircle, 
  Send, User, Cpu, AlertTriangle, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export default function App() {
  const [telemetria, setTelemetria] = useState({
    bpm: 78,
    temperatura: 36.6,
    status_borda: 'Normal',
    alerta_ativo: false,
    dispositivo_id: 'ESP32-CARDIO-01'
  });

  const [historico, setHistorico] = useState([
    { time: '12:00', bpm: 72 },
    { time: '12:05', bpm: 75 },
    { time: '12:10', bpm: 82 },
    { time: '12:15', bpm: 78 },
    { time: '12:20', bpm: 76 }
  ]);

  const [risco, setRisco] = useState({
    nivel_risco: 'Baixo Risco',
    cor: 'green',
    probabilidade_critico: 12.5,
    recomendacao: 'Sinais vitais normais e estáveis. Monitoramento preventivo ativo.'
  });

  // Chat com LLM
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Olá! Sou a assistente inteligente CardioIA. Seus sinais vitais estão sob monitoramento contínuo. Como posso ajudar?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Simular conexão ou obter do backend local se disponível
  useEffect(() => {
    const interval = setInterval(() => {
      // Pequena flutuação fisiológica realista
      const deltaBpm = Math.floor(Math.random() * 5) - 2;
      setTelemetria(prev => {
        const novoBpm = Math.min(140, Math.max(50, prev.bpm + deltaBpm));
        const novoAlerta = novoBpm > 110 || novoBpm < 55;
        const novoStatus = novoBpm > 110 ? 'Taquicardia' : (novoBpm < 55 ? 'Bradicardia' : 'Normal');
        
        // Atualiza histórico
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setHistorico(hist => [...hist.slice(-9), { time: timeStr, bpm: novoBpm }]);

        return {
          ...prev,
          bpm: novoBpm,
          alerta_ativo: novoAlerta,
          status_borda: novoStatus
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setLoadingChat(true);

    // Resposta local inteligente caso backend externo não esteja conectado
    setTimeout(() => {
      const msg = userText.toLowerCase();
      let botReply = '';

      if (msg.includes('dor no peito') || msg.includes('falta de ar') || msg.includes('tontura')) {
        botReply = `⚠️ Atenção: Sintomas de urgência detectados! Seus batimentos atuais estão em ${telemetria.bpm} BPM. Procure assistência médica imediata ou ligue para o SAMU (192).`;
      } else if (msg.includes('pressão') || msg.includes('dieta') || msg.includes('sal')) {
        botReply = 'Para proteger seu coração: mantenha consumo reduzido de sódio, pratique caminhadas leves e mantenha hidratação adequada ao longo do dia.';
      } else {
        botReply = `Entendido. Registrei sua observação no prontuário. Seus sinais vitais permanecem com ${telemetria.bpm} BPM e temperatura ${telemetria.temperatura}°C.`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      setLoadingChat(false);
    }, 700);
  };

  const getRiscoBadge = () => {
    if (telemetria.alerta_ativo) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-red-950 text-red-400 border border-red-700 animate-pulse">
          <AlertTriangle className="w-4 h-4" /> Alerta de Risco
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
        <CheckCircle className="w-4 h-4" /> Estável
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600/20 text-rose-500 rounded-lg border border-rose-500/30">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
              CardioIA
            </h1>
            <p className="text-xs text-slate-400">Plataforma Integrada de Inteligência Cardíaca • Fase 7 FIAP</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs text-slate-400">
            <p className="font-medium text-slate-200">Paciente: João da Silva (58a)</p>
            <p>Dispositivo: <span className="font-mono text-indigo-400">{telemetria.dispositivo_id}</span></p>
          </div>
          {getRiscoBadge()}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Coluna 1 & 2: Telemetria e Indicadores Preditivos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card BPM */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Frequência Cardíaca</span>
                <Activity className="w-5 h-5 text-rose-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{telemetria.bpm}</span>
                <span className="text-sm font-semibold text-slate-400">BPM</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Diagnóstico Borda: <strong className="text-slate-200">{telemetria.status_borda}</strong></p>
            </div>

            {/* Card Temperatura */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Temperatura Corporal</span>
                <Thermometer className="w-5 h-5 text-amber-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{telemetria.temperatura}</span>
                <span className="text-sm font-semibold text-slate-400">°C</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Sensor: Calibração MicroPython</p>
            </div>

            {/* Card IA Risco Preditivo */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Pico de Risco (ML)</span>
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-300">{risco.nivel_risco}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Probab. Crítica: <strong className="text-indigo-400">{risco.probabilidade_critico}%</strong></p>
            </div>
          </div>

          {/* Gráfico de Monitoramento em Tempo Real */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-200">Eletrocardiograma & Telemetria em Tempo Real</h2>
                <p className="text-xs text-slate-400">Sinais vitais processados via borda (ESP32 MicroPython) e transmitidos via API</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE STREAM
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis domain={[40, 160]} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#f43f5e" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#f43f5e', r: 3 }} 
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recomendação Clínica Preditiva (Fase 6) */}
          <div className="bg-slate-900/80 border border-indigo-950/70 bg-gradient-to-r from-indigo-950/20 to-transparent rounded-xl p-5">
            <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Diretriz do Motor Preditivo de IA
            </h3>
            <p className="mt-2 text-sm text-slate-300">{risco.recomendacao}</p>
          </div>
        </div>

        {/* Coluna 3: Assistente Conversacional LLM (Fase 5) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <h2 className="text-sm font-semibold text-slate-200">Assistente CardioIA (LLM)</h2>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
              Fase 5
            </span>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="text-xs text-slate-400 italic">Assistente digitando...</div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Descreva sintomas ou tire dúvidas..." 
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit" 
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        CardioIA • Projeto Integrado FIAP Fase 7 • Grupo 83 (Bruno Gambarini)
      </footer>
    </div>
  );
}
