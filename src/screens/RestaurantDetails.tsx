import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ArrowLeft, Clock3, Heart, Minus, Plus, Search, Star } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import { colors, layout, typography } from '../constants/theme';
import Header from '../components/Header';

type MenuItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  calories: string;
  image: string;
};

type SommelierItem = {
  id: string;
  title: string;
  description: string;
  tag: string;
  price: string;
  image: string;
};

type PreviewItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  metaLabel: string;
  metaCaption: string;
};

const categories = ['For You', 'Appetizers', 'Main Courses', "Sommelier's Choice", 'Desserts'];

const signatureDishes: MenuItem[] = [
  {
    id: 'truffle-zen-garden',
    title: 'Truffle Zen Garden',
    description: 'Micro-greens, black truffle shavings,\nand honey balsamic glaze.',
    price: '$24',
    calories: '180 kcal',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'midnight-wagyu',
    title: 'Midnight Wagyu',
    description: 'A5 Grade Wagyu with a charcoal-\ninfused butter reduction.',
    price: '$85',
    calories: '420 kcal',
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'saffron-scallops',
    title: 'Saffron Scallops',
    description: 'Hand-dived scallops with a molecular\nsaffron cloud.',
    price: '$42',
    calories: '210 kcal',
    image:
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=320&q=80',
  },
];

const sommelierSelection: SommelierItem[] = [
  {
    id: 'vintage-bordeaux',
    title: 'Vintage Bordeaux 2015 - Château Margaux',
    description: 'Full-bodied with notes of dark\ncherry and aged oak.',
    tag: 'Glass',
    price: '$120',
    image:
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'golden-hour',
    title: 'The Golden Hour',
    description: 'Bourbon infused with honeycomb\nand smoked rosemary.',
    tag: 'Craft',
    price: '$18',
    image:
      'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=320&q=80',
  },
];

const RestaurantDetails = () => {
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const [selectedItem, setSelectedItem] = React.useState<PreviewItem | null>(null);
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['48%', '72%'], []);

  const getQty = (id: string) => quantities[id] ?? 0;

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => {
      const nextQty = Math.max(0, (prev[id] ?? 0) + delta);
      if (nextQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const openPreview = (item: PreviewItem) => {
    setSelectedItem(item);
    sheetRef.current?.snapToIndex(0);
  };

  const closePreview = () => {
    sheetRef.current?.close();
  };

  const selectedQty = selectedItem ? getQty(selectedItem.id) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Restaurant Details" showCartButton={true} containerStyle={{ paddingHorizontal: layout.screenPadding }} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
            }}
            style={styles.heroImage}
          />

          <View style={styles.heroGlowLarge} />
          <View style={styles.heroGlowSmall} />

          <LinearGradient
            colors={['rgba(12, 14, 18, 0.08)', 'rgba(12, 14, 18, 0.62)', 'rgba(12, 14, 18, 0.92)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroGradient}
          />

          <View style={styles.heroDetails}>
            <Text style={styles.heroKicker}>Fine Dining  -  Michelin Star</Text>
            <Text style={styles.heroTitle}>Lumiere Noire</Text>

            <View style={styles.metaRow}>
              <View style={styles.ratingRow}>
                <Star size={14} color={colors.primary} fill={colors.primary} strokeWidth={1.9} />
                <Text style={styles.metaStrong}>4.9</Text>
                <Text style={styles.metaMuted}>(2.4k reviews)</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.timeRow}>
                <Clock3 size={15} color={colors.textMuted} strokeWidth={2.1} />
                <Text style={styles.metaStrong}>25-35 min</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.stickySection}>
          <View style={styles.stickyCard}>
            <BlurView
              style={styles.bottomNavBlur}
              blurType="dark"
              blurAmount={15}
              blurRadius={10}
              downsampleFactor={1}
              overlayColor="transparent"
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0)"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map((category, index) => {
                const isActive = index === 0;

                return (
                  <TouchableOpacity
                    key={category}
                    activeOpacity={0.9}
                    style={isActive ? styles.categoryPillActive : styles.categoryPill}
                  >
                    <Text
                      style={isActive ? styles.categoryPillTextActive : styles.categoryPillText}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.searchBar}>
              <Search size={18} color="rgba(170, 171, 176, 0.7)" strokeWidth={2.1} />
              <Text style={styles.searchPlaceholder}>Search through 200+ delicacies...</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Signature Dishes</Text>
            <View style={styles.sectionDivider} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.signatureList}
          >
            {signatureDishes.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCardLarge}
                activeOpacity={0.92}
                onPress={() =>
                  openPreview({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    metaLabel: item.calories,
                    metaCaption: 'Calories',
                  })
                }
              >
                <View style={styles.menuCardLargeContent}>
                  <View style={styles.menuCardBody}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <View style={styles.itemBottomRow}>
                      <View>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                        <Text style={styles.itemTag}>{item.calories}</Text>
                      </View>
                      {getQty(item.id) === 0 ? (
                        <TouchableOpacity
                          style={styles.addButtonLarge}
                          activeOpacity={0.9}
                          onPress={() => updateQty(item.id, 1)}
                        >
                          <Plus size={12} color={colors.primary} strokeWidth={2.6} />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyPill}>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, -1)}
                          >
                            <Minus size={14} color={colors.primary} strokeWidth={2.6} />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{getQty(item.id)}</Text>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, 1)}
                          >
                            <Plus size={14} color={colors.primary} strokeWidth={2.6} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.menuImageOrbWrap}>
                    <View style={styles.menuImageOrbGlow} />
                    <Image source={{ uri: item.image }} style={styles.menuImageOrb} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeaderAlt}>
            <Text style={styles.sectionTitle}>Sommelier Selection</Text>
            <View style={styles.sectionDividerAlt} />
          </View>

          <View style={styles.sommelierList}>
            {sommelierSelection.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuCardSmall}
                activeOpacity={0.92}
                onPress={() =>
                  openPreview({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    metaLabel: item.tag,
                    metaCaption: 'Serve',
                  })
                }
              >
                <View style={styles.menuCardSmallContent}>
                  <Image source={{ uri: item.image }} style={styles.menuImageSmall} />

                  <View style={styles.smallTextArea}>
                    <View style={styles.smallTitleRow}>
                      <Text style={styles.smallTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.smallPrice}>{item.price}</Text>
                    </View>
                    <Text style={styles.smallDescription}>{item.description}</Text>
                    <View style={styles.smallBottomRow}>
                      <Text style={styles.smallTag}>{item.tag}</Text>
                      {getQty(item.id) === 0 ? (
                        <TouchableOpacity
                          style={styles.addButtonSmall}
                          activeOpacity={0.9}
                          onPress={() => updateQty(item.id, 1)}
                        >
                          <Plus size={12} color={colors.background} strokeWidth={3} />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.qtyPillSmall}>
                          <TouchableOpacity
                            style={styles.qtyButtonSmall}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, -1)}
                          >
                            <Minus size={12} color={colors.primary} strokeWidth={2.6} />
                          </TouchableOpacity>
                          <Text style={styles.qtyTextSmall}>{getQty(item.id)}</Text>
                          <TouchableOpacity
                            style={styles.qtyButtonSmall}
                            activeOpacity={0.85}
                            onPress={() => updateQty(item.id, 1)}
                          >
                            <Plus size={12} color={colors.primary} strokeWidth={2.6} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetHandle}
        onClose={() => setSelectedItem(null)}
      >
        <BlurView
            pointerEvents="none"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 10 }}
            blurType="dark"
            blurAmount={24}
            reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.22)"
          />
        <BottomSheetView style={styles.sheetContent}>
          
          {selectedItem ? (
            <>
              <View style={styles.sheetImageWrap}>
                <Image source={{ uri: selectedItem.image }} style={styles.sheetImage} />
                <LinearGradient
                  colors={['rgba(12, 14, 18, 0.1)', 'rgba(12, 14, 18, 0.6)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.sheetImageOverlay}
                />
              </View>

              <View style={styles.sheetBody}>
                <View style={styles.sheetTitleRow}>
                  <Text style={styles.sheetTitle}>{selectedItem.title}</Text>
                  <Text style={styles.sheetPrice}>{selectedItem.price}</Text>
                </View>
                <Text style={styles.sheetDescription}>{selectedItem.description}</Text>

                <View style={styles.sheetMetaRow}>
                  <View style={styles.sheetMetaPill}>
                    <Text style={styles.sheetMetaText}>{selectedItem.metaLabel}</Text>
                  </View>
                </View>

                <View style={styles.sheetActions}>
                  {selectedQty === 0 ? (
                    <TouchableOpacity
                      style={styles.sheetAddButton}
                      activeOpacity={0.9}
                      onPress={() => updateQty(selectedItem.id, 1)}
                    >
                      <LinearGradient
                        colors={[colors.primary, '#FFC94D']}
                        start={{ x: 0.35, y: 1 }}
                        end={{ x: 0.65, y: 0 }}
                        style={styles.sheetAddGradient}
                      >
                        <Plus size={16} color={colors.onPrimaryDeep} strokeWidth={2.6} />
                        <Text style={styles.sheetAddText}>Add to cart</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.sheetQtyPill}>
                      <TouchableOpacity
                        style={styles.sheetQtyButton}
                        activeOpacity={0.85}
                        onPress={() => updateQty(selectedItem.id, -1)}
                      >
                        <Minus size={16} color={colors.primary} strokeWidth={2.6} />
                      </TouchableOpacity>
                      <Text style={styles.sheetQtyText}>{selectedQty}</Text>
                      <TouchableOpacity
                        style={styles.sheetQtyButton}
                        activeOpacity={0.85}
                        onPress={() => updateQty(selectedItem.id, 1)}
                      >
                        <Plus size={16} color={colors.primary} strokeWidth={2.6} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity style={styles.sheetCloseButton} activeOpacity={0.9} onPress={closePreview}>
                    <Text style={styles.sheetCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomNavBlur: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    // backgroundColor: colors.overlayDarkStrong,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 128,
  },
  heroSection: {
    width: '100%',
    height: 397,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 384,
    height: 384,
    borderRadius: 999,
    right: -96,
    top: -96,
    backgroundColor: 'rgba(255, 173, 58, 0.1)',
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 256,
    height: 256,
    borderRadius: 999,
    left: -96,
    bottom: -58,
    backgroundColor: 'rgba(252, 183, 37, 0.05)',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroDetails: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 32,
  },
  heroKicker: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.display2xl,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -1.8,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaStrong: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  metaMuted: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stickySection: {
    width: '100%',
    // paddingTop: 16,
    // paddingHorizontal: layout.screenPadding,
    // paddingBottom: 24,
  },
  stickyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  categoryScroll: {
    height: 54,
  },
  categoryScrollContent: {
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
  },
  categoryPillActive: {
    height: 38,
    borderRadius: 99,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  categoryPill: {
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(29, 32, 37, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  categoryPillTextActive: {
    color: colors.onPrimaryDeep,
    fontSize: typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  categoryPillText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '500',
    lineHeight: 20,
  },
  searchBar: {
    marginTop: 16,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    overflow: 'hidden',
  },
  searchPlaceholder: {
    color: 'rgba(170, 171, 176, 0.5)',
    fontSize: typography.body,
    fontWeight: '400',
  },
  menuSection: {
    paddingTop: 16,
  },
  sectionHeader: {
    marginHorizontal: layout.screenPadding,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    marginLeft: 24,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  sectionHeaderAlt: {
    marginHorizontal: layout.screenPadding,
    marginTop: 16,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionDividerAlt: {
    flex: 1,
    height: 1,
    marginLeft: 24,
    backgroundColor: 'rgba(70, 72, 76, 0.3)',
  },
  signatureList: {
    paddingHorizontal: layout.screenPadding,
    paddingRight: layout.screenPadding,
    flexDirection: 'row',
    gap: 16,
  },
  menuCardLarge: {
    width: 320,
    height: 180,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  menuCardLargeContent: {
    flex: 1,
    marginHorizontal: layout.screenPadding,
    marginVertical: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  menuCardBody: {
    width: 228,
    height: 130,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: '700',
    lineHeight: 28,
  },
  itemDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '400',
    lineHeight: 19.5,
  },
  itemBottomRow: {
    marginTop: 4,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPrice: {
    color: colors.primary,
    fontSize: typography.lg,
    fontWeight: '700',
    lineHeight: 28,
  },
  itemTag: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  addButtonLarge: {
    width: 36,
    height: 36,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 173, 58, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyPill: {
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: colors.primary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  menuImageOrbWrap: {
    width: 80,
    height: 80,
    position: 'relative',
    marginTop: -15,
  },
  menuImageOrbGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  menuImageOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  sommelierList: {
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  menuCardSmall: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  menuCardSmallContent: {
    flex: 1,
    marginHorizontal: 13,
    marginVertical: 19,
    flexDirection: 'row',
  },
  menuImageSmall: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  smallTextArea: {
    marginLeft: 16,
    flex: 1,
  },
  smallTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flexWrap: 'wrap',
  },
  smallTitle: {
    flex: 1,
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
  },
  smallPrice: {
    marginLeft: 'auto',
    color: colors.primary,
    fontSize: typography.md,
    fontWeight: '700',
    lineHeight: 24,
    alignSelf: 'flex-start',
    textAlign: 'right',
  },
  smallDescription: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: '400',
    lineHeight: 19.5,
  },
  smallBottomRow: {
    marginTop: 4,
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallTag: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  addButtonSmall: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyPillSmall: {
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyButtonSmall: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyTextSmall: {
    color: colors.primary,
    fontSize: typography.smPlus,
    fontWeight: '700',
  },
  sheetBackground: {
    backgroundColor: colors.glass,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 18,
    gap: 16,
  },
  sheetImageWrap: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  sheetImage: {
    width: '100%',
    height: '100%',
  },
  sheetImageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheetBody: {
    gap: 12,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sheetTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
  },
  sheetPrice: {
    color: colors.primary,
    fontSize: typography.xl,
    fontWeight: '700',
    lineHeight: 28,
  },
  sheetDescription: {
    color: colors.textMuted,
    fontSize: typography.bodyPlus,
    lineHeight: 22,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetMetaPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  sheetMetaText: {
    color: colors.textPrimary,
    fontSize: typography.captionPlus,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  sheetMetaCaption: {
    color: colors.textMuted,
    fontSize: typography.captionPlus,
    fontWeight: '600',
  },
  sheetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetAddButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sheetAddGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sheetAddText: {
    color: colors.onPrimaryDeep,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  sheetQtyPill: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 176, 0, 0.3)',
    backgroundColor: 'rgba(255, 176, 0, 0.12)',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetQtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetQtyText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
  sheetCloseButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCloseText: {
    color: colors.textPrimary,
    fontSize: typography.bodyPlus,
    fontWeight: '700',
  },
});

export default RestaurantDetails;
