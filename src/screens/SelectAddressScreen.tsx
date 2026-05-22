import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Briefcase, Check, House, Plus, Users } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import GlassLayer from '../components/GlassLayer';

const palette = {
  page: colors.background,
  header: colors.background,
  white: colors.textPrimary,
  textMain: colors.textPrimary,
  textBody: colors.textMuted,
  cardFill: 'rgba(35, 38, 44, 0.4)',
  cardBorder: 'rgba(255,255,255,0.10)',
  iconBg: colors.black,
  amber: colors.primary,
  amberStrong: colors.primary,
  iconMuted: '#BCC0C8',
};

type AddressTag = 'Home' | 'Office' | "Parents' House";
type AddressIconType = 'home' | 'office' | 'parents';

type AddressItem = {
  id: string;
  tag: AddressTag;
  address: string;
  icon: AddressIconType;
};

const addresses: AddressItem[] = [
  {
    id: 'home',
    tag: 'Home',
    address: '2468 Amber Crescent, Sunset Valley,\nSan Francisco, CA 94103',
    icon: 'home',
  },
  {
    id: 'work',
    tag: 'Office',
    address: 'Radiant Heights Tech Tower, Suite 402,\nMarket Street, SF 94105',
    icon: 'office',
  },
  {
    id: 'parents',
    tag: "Parents' House",
    address: '15 Nocturne Lane, Golden Hill,\nOakland, CA 94611',
    icon: 'parents',
  },
];

const AddressIcon = ({ type }: { type: AddressIconType }) => {
  if (type === 'home') {
    return <House size={30} color={palette.amber} strokeWidth={2.6} fill={palette.amber} />;
  }

  if (type === 'office') {
    return <Briefcase size={30} color={palette.amber} strokeWidth={2.5} fill={palette.amber} />;
  }

  return <Users size={30} color={palette.amber} strokeWidth={2.4} />;
};

const SelectAddressScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedId, setSelectedId] = useState(addresses[0]?.id ?? '');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Select Address"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <LinearGradient
            colors={[palette.amber, palette.amberStrong]}
            start={{ x: 0.47, y: 1 }}
            end={{ x: 0.53, y: 0 }}
            style={styles.addButtonGradient}
          >
            <View style={styles.addButtonContent}>
              <Plus size={21} color="#000000" strokeWidth={2.4} />
              <Text style={styles.addButtonText}>Add New Address</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.addressList}>
          {addresses.map(item => {
            const isSelected = item.id === selectedId;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.92}
                style={[styles.addressCard, isSelected ? styles.addressCardActive : null]}
                onPress={() => setSelectedId(item.id)}
              >
                <GlassLayer radius={16} />

                {isSelected ? (
                  <View style={styles.selectedBadge} pointerEvents="none">
                    <Check size={14} color={colors.black} strokeWidth={2.8} />
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                ) : null}

                <View style={styles.addressContentRow}>
                  <View style={styles.cardIconWrap}>
                    <View style={styles.cardIconBg}>
                      <AddressIcon type={item.icon} />
                    </View>
                  </View>

                  <View style={styles.addressTextWrap}>
                    <Text style={styles.addressTag}>{item.tag}</Text>
                    <Text style={styles.addressLine}>{item.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.95}
          style={styles.continueButton}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={[palette.amber, palette.amberStrong]}
            start={{ x: 0.47, y: 1 }}
            end={{ x: 0.53, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 260,
  },
  addressList: {
    gap: 24,
  },
  addressCard: {
    width: 342,
    minHeight: 150.25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.cardBorder,
    overflow: 'hidden',
    backgroundColor: palette.cardFill,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 24,
  },
  addressCardActive: {
    borderColor: 'rgba(245, 158, 11, 0.5)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  selectedBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  selectedBadgeText: {
    color: colors.black,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  addressContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardIconWrap: {
    width: 70,
    alignItems: 'flex-start',
  },
  cardIconBg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: palette.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressTextWrap: {
    flex: 1,
    paddingTop: 1,
    paddingRight: 6,
  },
  addressTag: {
    color: palette.white,
    fontSize: typography.titlePlus,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  addressLine: {
    color: palette.textBody,
    fontSize: typography.bodyPlus,
    lineHeight: 26 / 1.3,
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    width: 342,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 10,
  },
  addButtonGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: colors.black,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
  },
  continueButton: {
    width: 342,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 28,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 34,
    elevation: 10,
  },
  continueButtonGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.black,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
  },
});

export default SelectAddressScreen;
