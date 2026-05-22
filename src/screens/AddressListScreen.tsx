import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ArrowLeft,
  Briefcase,
  House,
  MoreVertical,
  Pencil,
  Plus,
  Users,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

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
type AddressIcon = 'home' | 'office' | 'parents';

type AddressItem = {
  id: string;
  tag: AddressTag;
  address: string;
  icon: AddressIcon;
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

const GlassLayer = ({ radius, style }: { radius: number; style?: StyleProp<ViewStyle> }) => (
  <>
    {Platform.OS === 'ios' ? (
      <BlurView
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: radius
          }, style]}
        blurType="dark"
        blurAmount={30}
        reducedTransparencyFallbackColor="rgba(10, 12, 18, 0.5)"
      />
    ) : null}

    <View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: radius,
          backgroundColor: palette.cardFill,
        },
        style,
      ]}
    />
  </>
);

const AddressIcon = ({ type }: { type: AddressIcon }) => {
  if (type === 'home') {
    return <House size={30} color={palette.amber} strokeWidth={2.6} fill={palette.amber} />;
  }

  if (type === 'office') {
    return <Briefcase size={30} color={palette.amber} strokeWidth={2.5} fill={palette.amber} />;
  }

  return <Users size={30} color={palette.amber} strokeWidth={2.4} />;
};

const AddressListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header title="Restaurant Details" showBackButton={true} containerStyle={{ paddingHorizontal: layout.screenPadding }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.addressList}>
          {addresses.map(item => (
            <TouchableOpacity key={item.id} activeOpacity={0.92} style={styles.addressCard}>
              <GlassLayer radius={16} />

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

                <View style={styles.editWrap}>
                  <TouchableOpacity activeOpacity={0.85} style={styles.editButton}>
                    <Pencil size={22} color={palette.iconMuted} strokeWidth={2.35} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity activeOpacity={0.95} style={styles.addButton} onPress={() => navigation.navigate('AddAddress')}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ambientLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  glowRight: {
    position: 'absolute',
    top: -116,
    right: -39,
    width: 234,
    height: 693,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 173, 58, 0.10)',
  },
  glowLeft: {
    position: 'absolute',
    top: 462,
    left: -58,
    width: 195,
    height: 577,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 10, 0.05)',
  },
  bottomGlowGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 462,
  },
  header: {
    height: 60,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  menuButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -3,
  },
  headerTitle: {
    color: palette.white,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.xl,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
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
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.titlePlus,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  addressLine: {
    color: palette.textBody,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.bodyPlus,
    lineHeight: 26 / 1.3,
    fontWeight: '500',
    marginTop: 2,
  },
  editWrap: {
    width: 28,
    alignItems: 'flex-end',
    paddingTop: 7,
  },
  editButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 342,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 40,
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
    fontFamily: 'Plus Jakarta Sans',
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
  },
});

export default AddressListScreen;
