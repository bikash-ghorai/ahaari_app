import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';

import { colors, layout, typography } from '../constants/theme';

type PlaceholderScreenProps = {
  title: string;
  subtitle: string;
  primaryActionLabel: string;
};

const PlaceholderScreen = ({
  title,
  subtitle,
  primaryActionLabel,
}: PlaceholderScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Screen in progress</Text>
          <Text style={styles.cardBody}>
            This tab is wired and styled to match the BiteO visual system.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{primaryActionLabel}</Text>
            <ArrowRight size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 18,
    paddingBottom: 120,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.displayLg,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 20,
    gap: 10,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
  },
  cardBody: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: colors.black,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
});

export default PlaceholderScreen;
