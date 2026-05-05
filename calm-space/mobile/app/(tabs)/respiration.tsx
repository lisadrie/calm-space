import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, Easing } from 'react-native-reanimated';
import Header from '../../components/Header';
import PageTransition from '../../components/PageTransition';

const TECHNIQUES = [
    { key: '4-7-8', label: '4-7-8', desc: 'Anti-stress', inhale: 4, hold: 7, exhale: 8 },
    { key: 'box', label: 'Carrée', desc: 'Équilibre', inhale: 4, hold: 4, exhale: 4, hold2: 4 },
    { key: '365', label: '3-6-5', desc: 'Relaxation', inhale: 3, hold: 0, exhale: 6 },
];

export default function RespirationTab() {
    const [selected, setSelected] = useState(TECHNIQUES[0]);
    const [running, setRunning] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold2'>('inhale');
    const [countdown, setCountdown] = useState(0);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scale = useSharedValue(1);

    const phaseLabels = { inhale: 'Inspirez', hold: 'Retenez', exhale: 'Expirez', hold2: 'Pause' };
    const phaseColors = { inhale: '#7c3aed', hold: '#3b82f6', exhale: '#10b981', hold2: '#f59e0b' };

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const runCycle = () => {
        const tech = selected;
        const phases: Array<{ name: typeof phase; duration: number }> = [
            { name: 'inhale', duration: tech.inhale },
            ...(tech.hold ? [{ name: 'hold' as typeof phase, duration: tech.hold }] : []),
            { name: 'exhale', duration: tech.exhale },
            ...((tech as any).hold2 ? [{ name: 'hold2' as typeof phase, duration: (tech as any).hold2 }] : []),
        ];

        let phaseIdx = 0;
        let timeLeft = phases[0].duration;
        setPhase(phases[0].name);
        setCountdown(timeLeft);

        scale.value = withTiming(1.4, { duration: phases[0].duration * 1000, easing: Easing.inOut(Easing.ease) });

        intervalRef.current = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft <= 0) {
                phaseIdx = (phaseIdx + 1) % phases.length;
                if (phaseIdx === 0) setCycles(c => c + 1);
                timeLeft = phases[phaseIdx].duration;
                const nextPhase = phases[phaseIdx].name;
                setPhase(nextPhase);

                if (nextPhase === 'inhale') {
                    scale.value = withTiming(1.4, { duration: timeLeft * 1000, easing: Easing.inOut(Easing.ease) });
                } else if (nextPhase === 'exhale') {
                    scale.value = withTiming(0.8, { duration: timeLeft * 1000, easing: Easing.inOut(Easing.ease) });
                }
            }
            setCountdown(timeLeft);
        }, 1000);
    };

    const start = () => { setRunning(true); setCycles(0); runCycle(); };
    const stop = () => {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPhase('inhale');
        setCountdown(0);
        scale.value = withTiming(1, { duration: 400 });
    };

    useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#f5f0ff]" edges={[]}>
            <Header />
            <PageTransition>
                <View className="flex-1 px-4 pt-6">
                    <Text className="text-2xl font-bold text-gray-900 mb-1">Respiration guidée</Text>
                    <Text className="text-sm text-gray-500 mb-5">Apaisez votre système nerveux en quelques minutes</Text>

                    {/* Sélection technique */}
                    <View className="flex-row mb-6" style={{ gap: 8 }}>
                        {TECHNIQUES.map(t => (
                            <TouchableOpacity
                                key={t.key}
                                onPress={() => { if (!running) setSelected(t); }}
                                className={`flex-1 items-center py-3 rounded-xl border ${selected.key === t.key ? 'bg-[#7c3aed] border-[#7c3aed]' : 'bg-white border-gray-200'}`}
                                activeOpacity={0.8}
                            >
                                <Text className={`text-sm font-bold ${selected.key === t.key ? 'text-white' : 'text-gray-800'}`}>{t.label}</Text>
                                <Text className={`text-xs ${selected.key === t.key ? 'text-purple-200' : 'text-gray-500'}`}>{t.desc}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Cercle animé */}
                    <View className="flex-1 items-center justify-center">
                        <View className="items-center justify-center" style={{ width: 240, height: 240 }}>
                            {/* Cercle extérieur */}
                            <View className="absolute w-60 h-60 rounded-full bg-[#ede9fe] opacity-40" />
                            <Animated.View
                                style={[animStyle, {
                                    width: 180, height: 180, borderRadius: 90,
                                    backgroundColor: running ? (phaseColors[phase] + '30') : '#ede9fe',
                                    borderWidth: 3,
                                    borderColor: running ? phaseColors[phase] : '#7c3aed',
                                    alignItems: 'center', justifyContent: 'center',
                                }]}
                            >
                                <Text className="text-4xl font-bold text-gray-900">
                                    {running ? countdown : '∞'}
                                </Text>
                                <Text className="text-sm font-medium mt-1" style={{ color: running ? phaseColors[phase] : '#7c3aed' }}>
                                    {running ? phaseLabels[phase] : 'Prêt'}
                                </Text>
                            </Animated.View>
                        </View>

                        {running && (
                            <Text className="text-gray-500 text-sm mt-4">Cycle {cycles + 1}</Text>
                        )}

                        <TouchableOpacity
                            onPress={running ? stop : start}
                            className={`mt-8 px-12 py-4 rounded-2xl ${running ? 'bg-gray-200' : 'bg-[#7c3aed]'}`}
                            style={running ? {} : { shadowColor: '#7c3aed', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 }}
                            activeOpacity={0.85}
                        >
                            <Text className={`text-base font-bold ${running ? 'text-gray-700' : 'text-white'}`}>
                                {running ? 'Arrêter' : 'Commencer'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info technique */}
                    <View className="bg-white rounded-xl p-4 mb-6" style={{ borderLeftWidth: 3, borderLeftColor: '#7c3aed' }}>
                        <Text className="text-xs font-bold text-gray-900 mb-1">
                            Technique {selected.label} · {selected.desc}
                        </Text>
                        <Text className="text-xs text-gray-600">
                            {selected.inhale}s inspiration
                            {selected.hold ? ` · ${selected.hold}s rétention` : ''}
                            {` · ${selected.exhale}s expiration`}
                            {(selected as any).hold2 ? ` · ${(selected as any).hold2}s pause` : ''}
                        </Text>
                    </View>
                </View>
            </PageTransition>
        </SafeAreaView>
    );
}
