import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { Locate, MapPin } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';
import { useDispatch, useSelector } from '../redux/store';
import { addAddress, getMyProfile } from '../redux/user/userAction';
import { IAddressAddReq } from '../types';
import { showToaster } from '../utils/toaster';
import { goBack } from '../utils/navigationRef';
import MapStyle from '../utils/MapStyle';
import { Constant } from '../constants/Constant';

const { height } = Dimensions.get('window');

// Two snap heights: collapsed = 55 %, expanded = 90 %
const MAP_CONTAINER_HEIGHT = height * 0.35;
const SNAP_COLLAPSED = height * 0.55;
const SNAP_EXPANDED = height * 0.8;

const AddressType: any = [
  { label: 'Home', value: 'Home' },
  { label: 'Work', value: 'Work' },
  { label: 'Other', value: 'Other' },
];

// ─── Custom Bottom Sheet ──────────────────────────────────────────────────────
interface CustomBottomSheetProps {
  visible: boolean;
  children: React.ReactNode;
}

// translateY=0 → fully expanded (SNAP_EXPANDED tall, top edge high)
// translateY=OFFSET → collapsed (only SNAP_COLLAPSED visible)
const OFFSET = SNAP_EXPANDED - SNAP_COLLAPSED; // px the sheet slides down when collapsed

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  children,
}) => {
  // useNativeDriver:true → runs on native thread → buttery 60 fps
  const translateY = useRef(new Animated.Value(SNAP_EXPANDED)).current;
  // JS-side ref to know current committed position (0=expanded, OFFSET=collapsed)
  const currentTY = useRef(OFFSET);

  const snapTo = (target: number, velocity = 0) => {
    currentTY.current = target;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
      overshootClamping: true,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
      velocity,
    }).start();
  };

  // Entrance: slide up from below screen on mount
  useEffect(() => {
    if (visible) {
      translateY.setValue(SNAP_EXPANDED); // start below screen
      snapTo(OFFSET); // settle at collapsed position
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 4,
      onPanResponderGrant: () => {
        // Freeze animation at current native position so drag feels instant
        translateY.stopAnimation(val => {
          currentTY.current = val;
          translateY.setOffset(val);
          translateY.setValue(0);
        });
      },
      onPanResponderMove: (_, gs) => {
        // Clamp so sheet can't go above expanded or below collapsed
        const raw = gs.dy;
        const clamped = Math.min(
          OFFSET,
          Math.max(0, currentTY.current + raw - currentTY.current),
        );
        // With offset set: value 0 + gesture delta
        const delta = Math.min(
          OFFSET - currentTY.current,
          Math.max(-currentTY.current, raw),
        );
        translateY.setValue(delta);
      },
      onPanResponderRelease: (_, gs) => {
        translateY.flattenOffset();
        const goExpand = gs.dy < -20 || gs.vy < -0.4;
        const goCollapse = gs.dy > 20 || gs.vy > 0.4;
        if (goExpand) {
          snapTo(0, gs.vy);
        } else if (goCollapse) {
          snapTo(OFFSET, gs.vy);
        } else {
          // Snap to nearest
          snapTo(currentTY.current < OFFSET / 2 ? 0 : OFFSET, gs.vy);
        }
      },
    }),
  ).current;

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.sheetWrapper,
        { height: SNAP_EXPANDED, transform: [{ translateY }] },
      ]}
    >
      {/* ── Drag handle (gesture zone) ── */}
      <View style={styles.sheetHandleWrap} {...panResponder.panHandlers}>
        <View style={styles.sheetHandle} />
      </View>

      {/* Amber top glow */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(245, 158, 11, 0.12)', 'rgba(18, 20, 24, 0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.sheetGlow}
      />

      {children}
    </Animated.View>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const AddAddressScreen = () => {
  const dispatch = useDispatch();
  const mapRef = useRef<null | any>(null);
  const googlePlacesRef = useRef<null | any>(null);
  const { userData } = useSelector((state: any) => state.user);
  const safeAreaInstance = useSafeAreaInsets();

  const isUserNameAvailable =
    userData && userData?.first_name && userData?.last_name;

  // Location state
  const [location, setLocation] = useState({
    latitude: 22.3912558,
    longitude: 87.5631036,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Form state
  const [type, setType] = useState<IAddressAddReq['type']>(
    AddressType[0].value,
  );
  const [first_name, setFirstName] = useState<IAddressAddReq['first_name']>('');
  const [last_name, setLastName] = useState<IAddressAddReq['last_name']>('');
  const [address, setAddress] = useState<IAddressAddReq['address']>('');
  const [landmark, setLandmark] = useState<IAddressAddReq['landmark']>('');
  const [pincode, setPincode] = useState<IAddressAddReq['pincode']>('');
  const [phone_no, setPhoneNo] = useState<IAddressAddReq['phone_no']>('');

  // Request location permission and get current location
  const requestLocationPermission = async () => {
    try {
      setIsLoadingLocation(true);
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to show the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          showToaster('Location permission denied');
          setIsLoadingLocation(false);
        }
      } else {
        getCurrentLocation();
      }
    } catch (err) {
      console.log('Permission error:', err);
      setIsLoadingLocation(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newLocation = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };

        setLocation(newLocation);
        if (mapRef?.current) {
          mapRef.current.animateToRegion(newLocation, 1000);
        }
        reverseGeocodeLocation(latitude, longitude);
        setIsLoadingLocation(false);
      },
      error => {
        console.log('Geolocation error:', error);
        showToaster('Unable to fetch location');
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const reverseGeocodeLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Constant.MapKey}`,
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setAddress(result.formatted_address);

        // Extract city and postal code
        let postalCode = '';

        result.address_components.forEach((component: any) => {
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        setPincode(postalCode);
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };

  const handleMapRegionChange = (newLocation: any) => {
    setLocation(newLocation);
    reverseGeocodeLocation(newLocation.latitude, newLocation.longitude);
  };

  const handlePlaceSelected = (data: any, details: any = null) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const newLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };

      setLocation(newLocation);
      setAddress(data.description);

      if (mapRef?.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }

      // Extract postal code from details
      details.address_components.forEach((component: any) => {
        if (component.types.includes('postal_code')) {
          setPincode(component.long_name);
        }
      });
    }
  };

  // Get current location on mount
  useEffect(() => {
    requestLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveAddress = () => {
    if (!address || !address.trim()) {
      showToaster('Please enter the address');
      return;
    }
    if (!isUserNameAvailable) {
      if (!first_name || !first_name.trim()) {
        showToaster('Please enter the first name');
        return;
      }
      if (!last_name || !last_name.trim()) {
        showToaster('Please enter the last name');
        return;
      }
    }
    if (!pincode || !pincode.trim()) {
      showToaster('Please enter the ZIP code');
      return;
    }

    const params: IAddressAddReq = {
      type,
      address,
      landmark,
      pincode,
      phone_no,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    };
    if (!isUserNameAvailable) {
      params.first_name = first_name;
      params.last_name = last_name;
    }

    dispatch(addAddress(params)).then(() => {
      dispatch(getMyProfile());
      goBack();
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <Header
        title="Add Address"
        showBackButton={true}
        containerStyle={{ paddingHorizontal: layout.screenPadding }}
      />

      {/* Map fills remaining space above the sheet */}
      <View style={[styles.mapContainer, { height: MAP_CONTAINER_HEIGHT }]}>
        {isLoadingLocation && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching your location...</Text>
          </View>
        )}

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          initialRegion={location}
          onRegionChangeComplete={handleMapRegionChange}
          style={styles.map}
          customMapStyle={MapStyle}
        />
        {/* Center pin indicator */}
        <View style={styles.mapCenterPin}>
          <MapPin
            size={52}
            color={colors.primary}
            fill={colors.primary}
            strokeWidth={1.8}
          />
        </View>
        {/* Search bar overlay */}
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Search your address..."
          onPress={handlePlaceSelected}
          query={{
            key: Constant.MapKey,
            language: 'en',
            components: 'country:in',
          }}
          styles={googlePlacesStyles}
          textInputProps={{
            placeholderTextColor: colors.textMutedAlt2,
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={300}
          enablePoweredByContainer={false}
          listViewDisplayed="auto"
          keyboardShouldPersistTaps="handled"
          isRowScrollable={true}
          minLength={2}
          fetchDetails={true}
        />

        {/* Current location button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={requestLocationPermission}
          activeOpacity={0.8}
        >
          <Locate size={20} color={colors.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── Custom Bottom Sheet ── */}
      <CustomBottomSheet visible={true}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <KeyboardAvoidingView behavior="padding">
            <Text style={styles.formTitle}>Delivery Address</Text>
            <Text style={styles.formSubtitle}>
              Where should we drop your gourmet dining experience?
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ADDRESS TAG</Text>
              <View style={styles.tagRow}>
                {AddressType.map((item: any) => (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.9}
                    style={[
                      styles.tagChip,
                      type === item.value && styles.tagChipActive,
                    ]}
                    onPress={() => setType(item.value)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        type === item.value && styles.tagTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>STREET ADDRESS *</Text>
              <View style={[styles.inputShell, styles.inputTall]}>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="House number, street name, area, colony, etc."
                  placeholderTextColor={colors.textMuted}
                  multiline={true}
                  style={[styles.inputText, styles.inputMultiline]}
                  editable={false}
                />
              </View>
            </View>
            {isUserNameAvailable ? null : (
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>First Name *</Text>
                  <View style={styles.inputShell}>
                    <TextInput
                      value={first_name}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      placeholderTextColor={colors.textMuted}
                      style={styles.inputText}
                    />
                  </View>
                </View>

                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Last Name *</Text>
                  <View style={styles.inputShell}>
                    <TextInput
                      value={last_name}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      placeholderTextColor={colors.textMuted}
                      style={styles.inputText}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.inputShell}>
                  <TextInput
                    value={phone_no}
                    onChangeText={setPhoneNo}
                    placeholder="Phone number"
                    placeholderTextColor={colors.textMuted}
                    style={styles.inputText}
                  />
                </View>
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>ZIP CODE *</Text>
                <View style={styles.inputShell}>
                  <TextInput
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="ZIP CODE"
                    placeholderTextColor={colors.textMuted}
                    style={styles.inputText}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Landmark</Text>
              <View style={styles.inputShell}>
                <TextInput
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="Landmark"
                  placeholderTextColor={colors.textMuted}
                  style={styles.inputText}
                />
              </View>
            </View>

            <View
              style={[
                styles.actionArea,
                {
                  paddingBottom: height * 0.12 + (safeAreaInstance.bottom || 0),
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.95}
                style={styles.primaryButton}
                onPress={handleSaveAddress}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primary]}
                  start={{ x: 0.47, y: 1 }}
                  end={{ x: 0.53, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Save Address</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.actionHint}>
                You can edit this anytime from Address List.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </CustomBottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    position: 'relative',
    backgroundColor: '#999',
  },
  map: {
    flex: 1,
  },
  mapCenterPin: {
    position: 'absolute',
    top: '48%',
    left: '50%',
    marginLeft: -26,
    marginTop: -26,
    pointerEvents: 'none',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    color: colors.textPrimary,
    marginTop: 12,
    fontSize: typography.body,
    fontWeight: '600',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Custom bottom sheet ──
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 6,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  sheetGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  // ── Form ──
  formContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 150,
  },
  formTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    marginTop: 6,
    width: 248,
    color: colors.textMuted,
    fontSize: typography.smPlus,
    lineHeight: 20,
    fontWeight: '500',
  },
  fieldGroup: {
    marginTop: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tagChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(19, 22, 28, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChipActive: {
    borderColor: 'rgba(245, 158, 11, 0.55)',
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  tagText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  tagTextActive: {
    color: colors.primary,
  },
  fetchedAddressText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '600',
    lineHeight: 20,
  },
  fetchedCityText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 4,
    fontWeight: '500',
  },
  rowFields: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '47%',
  },
  fieldLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputShell: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputTall: {
    minHeight: 68,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputMultiline: {
    minHeight: 48,
    textAlignVertical: 'top',
  },
  inputText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionArea: {
    marginTop: 26,
    alignItems: 'center',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: typography.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
    paddingVertical: 20,
  },
  actionHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 16,
    textAlign: 'center',
  },
});

const googlePlacesStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: layout.screenPadding,
    right: layout.screenPadding,
    // zIndex: 1000,
  },
  textInput: {
    height: 55,
    paddingHorizontal: 16,
    borderRadius: 28,
    marginHorizontal: 0,
    marginVertical: 0,
    overflow: 'hidden',
    padding: 0,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    backgroundColor: 'rgba(12, 14, 18, 0.6)',
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 18,
    fontWeight: '500',
  },
  listView: {
    position: 'absolute',
    top: 62,
    left: 0,
    right: 0,
    maxHeight: 300,
    borderRadius: 16,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    zIndex: 1001,
  },
  row: {
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.body,
    fontWeight: '500',
    marginBottom: 3,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
  },
  predefinedPlacesDescription: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '500',
  },
  poweredContainer: {
    justifyContent: 'flex-start',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  powered: {
    height: 16,
    resizeMode: 'contain',
  },
});

export default AddAddressScreen;
