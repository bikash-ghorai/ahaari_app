/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Briefcase,
  Check,
  House,
  MapPin,
  Plus,
  Trash2Icon,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';
import type { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';
import GlassLayer from '../components/GlassLayer';
import { useDispatch, useSelector } from '../redux/store';
import {
  deleteAddress,
  getAddressList,
  setDefaultAddress,
} from '../redux/user/userAction';
import { IAddress } from '../types';
import { showToaster } from '../utils/toaster';
import { goBack } from '../utils/navigationRef';
import PopupMessage from '../components/PopupMessage';

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

type AddressIconType = 'home' | 'office' | 'other';
type IRouteFor = 'addressList' | 'checkout';

const AddressIcon = ({ type }: { type: AddressIconType }) => {
  if (type === 'home') {
    return (
      <House
        size={30}
        color={palette.amber}
        strokeWidth={2.6}
        fill={palette.amber}
      />
    );
  }

  if (type === 'office') {
    return (
      <Briefcase
        size={30}
        color={palette.amber}
        strokeWidth={2.5}
        fill={palette.amber}
      />
    );
  }

  return (
    <MapPin
      size={30}
      color={palette.amber}
      strokeWidth={2.5}
      fill={palette.amber}
    />
  );
};

const SelectAddressScreen = (props: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const { addresses } = useSelector(state => state.user);
  const routeFor: IRouteFor = props?.route?.params?.routeFor || 'addressList';
  const [selectedId, setSelectedId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<IAddress | null>(null);

  useEffect(() => {
    if (isFocused) {
      // Simulate fetching addresses from an API or local storage
      dispatch(getAddressList())
        .unwrap()
        .then(({ data }) => {
          let defaultAddress = data.find(
            (address: IAddress) => address.is_default === 1,
          );
          if (defaultAddress) {
            setSelectedId(defaultAddress.address_id);
          } else {
            setSelectedId('');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleContinue = () => {
    if (selectedId) {
      dispatch(setDefaultAddress({ address_id: selectedId }))
        .unwrap()
        .then(() => {
          goBack();
        })
        .catch(() => {
          showToaster('Failed to set default address. Please try again.');
        });
    } else {
      showToaster('Please select an address to continue');
    }
  };

  const handleDeleteAddress = () => {
    if (deleteTarget?.address_id) {
      dispatch(deleteAddress({ address_id: deleteTarget?.address_id }))
        .unwrap()
        .then(() => {
          dispatch(getAddressList());
        })
        .catch(() => {
          showToaster('Failed to delete address. Please try again.');
        })
        .finally(() => {
          setDeleteTarget(null);
        });
    } else {
      showToaster('Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title={routeFor === 'checkout' ? 'Select Address' : 'Addresses'}
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
          {addresses && addresses.length > 0 ? (
            addresses.map((item, ind) => {
              const isSelected =
                item?.address_id === selectedId && routeFor === 'checkout';

              return (
                <TouchableOpacity
                  key={ind}
                  activeOpacity={0.92}
                  style={[
                    styles.addressCard,
                    isSelected ? styles.addressCardActive : null,
                  ]}
                  onPress={() => setSelectedId(item?.address_id)}
                  disabled={routeFor === 'addressList'}
                >
                  <GlassLayer radius={16} />

                  {isSelected ? (
                    <View style={styles.selectedBadge} pointerEvents="none">
                      <Check size={14} color={colors.black} strokeWidth={2.8} />
                      <Text style={styles.selectedBadgeText}>Selected</Text>
                    </View>
                  ) : null}
                  {routeFor === 'addressList' ? (
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        right: 14,
                        top: 14,
                        padding: 6,
                      }}
                      activeOpacity={0.75}
                      onPress={() => setDeleteTarget(item)}
                    >
                      <Trash2Icon
                        size={18}
                        color={palette.iconMuted}
                        strokeWidth={2.5}
                      />
                    </TouchableOpacity>
                  ) : null}

                  <View style={styles.addressContentRow}>
                    <View style={styles.cardIconWrap}>
                      <View style={styles.cardIconBg}>
                        {item.type === 'Home' ? (
                          <AddressIcon type="home" />
                        ) : item.type === 'Work' ? (
                          <AddressIcon type="office" />
                        ) : (
                          <AddressIcon type="other" />
                        )}
                      </View>
                    </View>

                    <View style={styles.addressTextWrap}>
                      <Text style={styles.addressTag}>{item.type}</Text>
                      <Text style={styles.addressLine}>
                        {item?.address +
                          ', ' +
                          (item?.landmark ? item?.landmark + ', ' : '') +
                          item?.pincode}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconWrapper}>
                <LinearGradient
                  colors={[
                    'rgba(245, 158, 11, 0.12)',
                    'rgba(245, 158, 11, 0.06)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.emptyStateGradient}
                >
                  <MapPin size={48} color={colors.primary} strokeWidth={1.5} />
                </LinearGradient>
              </View>

              <Text style={styles.emptyStateTitle}>No Addresses Yet</Text>
              <Text style={styles.emptyStateMessage}>
                Add your first address to get started with fast and easy
                delivery.
              </Text>
            </View>
          )}
        </View>

        {routeFor === 'checkout' ? (
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.continueButton}
            onPress={handleContinue}
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
        ) : null}
      </ScrollView>

      <PopupMessage
        title={'Delete address?'}
        description={
          'This will remove the saved address from your account. You can add it again anytime.'
        }
        isVisible={!!deleteTarget}
        onBtn1Press={() => setDeleteTarget(null)}
        onBtn2Press={handleDeleteAddress}
        btn2Name="Delete"
        btn2Style={{ backgroundColor: 'rgb(240, 74, 74)' }}
      />
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

  /* -- Empty state -- */
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 80,
    minHeight: 400,
  },
  emptyStateIconWrapper: {
    marginBottom: 32,
  },
  emptyStateGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyStateMessage: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default SelectAddressScreen;
