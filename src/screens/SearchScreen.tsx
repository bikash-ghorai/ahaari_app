import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ArrowUpLeft, History, Menu, Search } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, typography } from '../constants/theme';

type RecentSearch = {
  id: string;
  title: string;
  subtitle: string;
};

const trendingSearches = ['Truffle Burger', 'Sushi', 'Vegan Bowl', 'Spicy Ramen', 'Artisan Pizza'];

const recentSearches: RecentSearch[] = [
  { id: 'blueberry-cheesecake', title: 'Blueberry Cheesecake', subtitle: 'Dessert  -  2 days ago' },
  { id: 'pasta-carbonara', title: 'Pasta Carbonara', subtitle: 'Italian  -  Last week' },
  { id: 'smoothie-king', title: 'Smoothie King', subtitle: 'Drinks  -  Last week' },
];

const GlassLayer = ({ radius, androidTint = 'rgba(8, 12, 18, 0.18)' }: { radius: number; androidTint?: string }) => (
  <>
    <BlurView
      pointerEvents="none"
      style={[{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        borderRadius: radius
      }]}
      blurType="dark"
      blurAmount={30}
      reducedTransparencyFallbackColor="rgba(18, 20, 24, 0.36)"
    />

    {Platform.OS === 'android' ? (
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
            backgroundColor: androidTint,
          },
        ]}
      />
    ) : null}
  </>
);

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileBlock}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXLAZpp1C5cMSy2_JHLk3TeaArbYCqDpiJOg3E7XeqYA8-s9sXC43O1upoTYYHPgUucBt0gg5jauS5_upvK4n9BlUY4Ui8aNOC_8juc3ZmjChJigqWdfxWhzGw2SEYhhOd3FaujfSau09-FXMwxEifgkJJtZLHRhMU9a7oQRqvZ6LqXhH8Tuvs_bmlyeAfwyZtYM_FIeGNw4E3LxzIfyb926TPNJbLi_QDKPqn1A2yd-Y544saFiSoAZtsQJkS98ZAr9pVm0NiFwE' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.brandBlock}>
              <Text style={styles.brandTitle}>LUMINA EATS</Text>
              <Text style={styles.brandLocation}>San Francisco, CA</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuButton} activeOpacity={0.85}>
            {/* <GlassLayer radius={16} /> */}
            <Menu size={20} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          <View style={styles.heroSearchSection}>
            <View style={styles.heroHeadingContainer}>
              <Text style={styles.heroHeading}>
                What are you{`\n`}
                <Text style={styles.heroHeadingAccent}>craving</Text>
                <Text style={styles.heroHeading}> tonight?</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.searchFieldContainer} activeOpacity={0.9}>
              <View pointerEvents="none" style={styles.searchGlow} />

              <View style={styles.searchFieldCard}>
                {/* <GlassLayer radius={24} /> */}

                <View style={styles.searchFieldContent}>
                  <View style={styles.searchIconSlot}>
                    <Search size={18} color={colors.primary} strokeWidth={2.5} />
                  </View>

                  <Text style={styles.searchPlaceholder}>Search for dishes or restaurants</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeadingTrending}>Trending Searches</Text>
              <View style={styles.sectionDividerPad}>
                <View style={styles.sectionDivider} />
              </View>
            </View>

            <View style={styles.chipsWrap}>
              {trendingSearches.map(item => (
                <TouchableOpacity key={item} style={styles.searchChip} activeOpacity={0.88}>
                  {/* <GlassLayer radius={16} /> */}
                  <Text style={styles.searchChipText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.recentSectionBlock}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.sectionHeadingRecent}>Recent Searches</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentList}>
              {recentSearches.map(item => (
                <TouchableOpacity key={item.id} style={styles.recentCard} activeOpacity={0.9}>
                  {/* <GlassLayer radius={24} androidTint="rgba(8, 12, 18, 0.16)" /> */}

                  <View style={styles.recentCardLeft}>
                    <View style={styles.recentIconShell}>
                      <History size={18} color="#71717A" strokeWidth={2.3} />
                    </View>

                    <View style={styles.recentCopyBlock}>
                      <Text style={styles.recentTitle}>{item.title}</Text>
                      <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>

                  <ArrowUpLeft size={15} color="#52525B" strokeWidth={2.2} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
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
    paddingBottom: 150,
  },
  header: {
    width: '100%',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  brandBlock: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  brandLocation: {
    marginTop: 0,
    color: colors.textMuted,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '400',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  main: {
    paddingHorizontal: layout.screenPadding,
    gap: 40,
  },
  heroSearchSection: {
    width: '100%',
    gap: 32,
  },
  heroHeadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heroHeading: {
    width: 275,
    color: colors.textPrimary,
    fontSize: typography.display2xl,
    lineHeight: 45,
    letterSpacing: -0.9,
    fontWeight: '800',
  },
  heroHeadingAccent: {
    color: colors.primary,
    fontStyle: 'italic',
    fontWeight: '800',
  },
  searchFieldContainer: {
    position: 'relative',
    width: '100%',
    height: 101,
  },
  searchGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 350,
    height: 109,
    borderRadius: 24,
    // backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  searchFieldCard: {
    width: '100%',
    height: 101,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: layout.screenPadding,
    overflow: 'hidden',
  },
  searchFieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  searchIconSlot: {
    width: 34,
    marginRight: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  searchPlaceholder: {
    width: 234,
    color: colors.textTertiary,
    fontSize: typography.lg,
    lineHeight: 28,
    fontWeight: '500',
  },
  sectionBlock: {
    width: '100%',
    gap: 24,
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeadingTrending: {
    color: 'rgba(245, 158, 11, 0.8)',
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  sectionDividerPad: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  sectionDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  chipsWrap: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  searchChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  searchChipText: {
    color: colors.textSoftLight,
    fontSize: typography.body,
    lineHeight: 20,
    fontWeight: '600',
  },
  recentSectionBlock: {
    width: '100%',
    paddingTop: 8,
    gap: 24,
  },
  recentHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeadingRecent: {
    color: colors.textTertiary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  clearAllText: {
    color: 'rgba(245, 158, 11, 0.6)',
    fontSize: typography.caption,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  recentList: {
    width: '100%',
    gap: 16,
  },
  recentCard: {
    width: '100%',
    height: 82,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  recentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recentIconShell: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCopyBlock: {
    justifyContent: 'center',
  },
  recentTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    lineHeight: 24,
    fontWeight: '700',
  },
  recentSubtitle: {
    color: colors.textTertiary,
    fontSize: typography.sm,
    lineHeight: 16,
    fontWeight: '400',
  },
});

export default SearchScreen;
