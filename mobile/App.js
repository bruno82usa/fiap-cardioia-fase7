import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [bpm, setBpm] = useState(76);
  const [temperatura, setTemperatura] = useState(36.5);
  const [status, setStatus] = useState('Estável');
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const variacao = Math.floor(Math.random() * 5) - 2;
      setBpm(prev => {
        const novo = Math.min(135, Math.max(55, prev + variacao));
        const alerta = novo > 110 || novo < 58;
        setIsAlert(alerta);
        setStatus(alerta ? 'Atenção Requerida' : 'Sinais Normais');
        return novo;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CardioIA Mobile</Text>
          <Text style={styles.subtitle}>Monitoramento Inteligente • Grupo 83 FIAP</Text>
        </View>

        {/* Card Status Geral */}
        <View style={[styles.statusCard, isAlert ? styles.statusCardAlert : styles.statusCardNormal]}>
          <Text style={styles.statusLabel}>STATUS CARDÍACO</Text>
          <Text style={styles.statusValue}>{status}</Text>
          <Text style={styles.statusSub}>Dispositivo: ESP32-CARDIO-01</Text>
        </View>

        {/* Métricas Principais */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>FREQUÊNCIA</Text>
            <Text style={[styles.metricNumber, { color: '#f43f5e' }]}>{bpm}</Text>
            <Text style={styles.metricUnit}>BPM</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TEMPERATURA</Text>
            <Text style={[styles.metricNumber, { color: '#fbbf24' }]}>{temperatura}</Text>
            <Text style={styles.metricUnit}>°C</Text>
          </View>
        </View>

        {/* Avaliação Preditiva (Fase 6) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diagnóstico Preditivo (IA)</Text>
          <Text style={styles.cardText}>
            Classificador Random Forest calibrado: Probabilidade de crise aguda estimada em 14%. Sinais vitais em conformidade fisiológica.
          </Text>
        </View>

        {/* Assistente Clínico (Fase 5) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assistente CardioIA (LLM)</Text>
          <Text style={styles.cardText}>
            "Olá! Identifiquei batimentos em repouso adequados. Lembre-se de tomar a medicação no horário prescrito."
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Falar com o Assistente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusCardNormal: {
    backgroundColor: '#064e3b22',
    borderColor: '#059669',
  },
  statusCardAlert: {
    backgroundColor: '#88133722',
    borderColor: '#e11d48',
  },
  statusLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  statusSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  metricNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 8,
  },
  metricUnit: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});
