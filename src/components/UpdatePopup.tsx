import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Rocket, Sparkles, ChevronRight, Zap, ShieldCheck } from 'lucide-react-native';
import { colors, layout, typography, radius, spacing } from '../constants/theme';
import GlassLayer from '../components/GlassLayer';

interface UpdatePopupProps {
    isVisible: boolean;
    onUpdate: () => void;
}

const UpdatePopup: React.FC<UpdatePopupProps> = ({ isVisible, onUpdate }) => {

    return (
        <Modal visible={isVisible} transparent animationType="none">
            <View style={styles.overlay}>
                {/* <GlassLayer  radius={16}/> */}
                <View
                    style={styles.cardWrapper} >
                    <View style={styles.cardTint} />
                    <View style={styles.card}>
                        <View style={styles.graphicContainer}>
                            <View style={styles.iconCircle}>
                                <Rocket size={42} color={colors.primary} strokeWidth={1.5} style={styles.rocketIcon} />
                            </View>
                            <View style={styles.sparkleOne}>
                                <Sparkles size={20} color={colors.primary} strokeWidth={2} opacity={0.9} />
                            </View>
                            <View style={styles.sparkleTwo}>
                                <Sparkles size={14} color={colors.primary} strokeWidth={2} opacity={0.6} />
                            </View>
                        </View>

                        <View style={styles.content}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>REQUIRED UPDATE</Text>
                            </View>

                            <Text style={styles.title}>Update Available</Text>
                            <Text style={styles.message}>
                                We've been working hard to make Ahaari better for you.
                            </Text>

                            <View style={styles.featureList}>
                                <View style={styles.featureItem}>
                                    <Zap size={16} color={colors.successBright} strokeWidth={2.5} />
                                    <Text style={styles.featureText}>Lightning fast performance</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Sparkles size={16} color={colors.accentCoral} strokeWidth={2.5} />
                                    <Text style={styles.featureText}>Fresh new UI improvements</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <ShieldCheck size={16} color={colors.blue} strokeWidth={2.5} />
                                    <Text style={styles.featureText}>Security enhancements</Text>
                                </View>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={onUpdate}
                                    activeOpacity={0.85}
                                >
                                    <Text style={styles.primaryButtonText}>Update Now</Text>
                                    <ChevronRight size={22} color={colors.onPrimaryDeep} strokeWidth={2.5} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.82)' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: layout.screenPadding,
        zIndex: 9999,
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 350,
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: Platform.OS === 'android' ? '#14161B' : 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOpacity: 0.5,
        shadowRadius: 35,
        shadowOffset: { width: 0, height: 20 },
        elevation: 24,
    },
    cardTint: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Platform.OS === 'ios' ? 'rgba(20, 22, 27, 0.7)' : 'transparent',
    },
    card: {
        padding: spacing.xl,
        paddingTop: spacing.xl * 1.8,
    },
    graphicContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
        position: 'relative',
        height: 110,
    },
    glow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.primary,
        opacity: 0.12,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: 'rgba(255, 176, 0, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 176, 0, 0.25)',
    },
    rocketIcon: {
        marginLeft: 4,
        marginTop: -2,
    },
    sparkleOne: {
        position: 'absolute',
        top: 5,
        right: 80,
    },
    sparkleTwo: {
        position: 'absolute',
        bottom: 25,
        left: 75,
    },
    content: {
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'rgba(255, 176, 0, 0.15)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 176, 0, 0.3)',
    },
    badgeText: {
        color: colors.primary,
        fontSize: typography.captionPlus,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
    title: {
        color: colors.textPrimary,
        fontSize: typography.displayCard,
        fontWeight: '800',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    message: {
        color: colors.textMutedCool,
        fontSize: typography.bodyPlus,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.sm,
    },
    featureList: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: radius.md,
        padding: spacing.lg,
        marginBottom: spacing.xl * 1.2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        color: colors.textSecondary,
        fontSize: typography.body,
        fontWeight: '500',
        marginLeft: spacing.md,
    },
    buttonContainer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg + 2,
        borderRadius: radius.lg,
        width: '100%',
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    primaryButtonText: {
        color: colors.onPrimaryDeep,
        fontSize: typography.mdPlus,
        fontWeight: '800',
        marginRight: spacing.sm,
    },
});

export default UpdatePopup;
