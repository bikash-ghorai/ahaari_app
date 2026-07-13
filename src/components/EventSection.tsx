import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, layout, typography } from '../constants/theme';
import { Constant } from '../constants/Constant';
import { HomeEventSlide } from '../types';

type EventContentProps = {
  slide: HomeEventSlide | undefined;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  onAction: (slide: HomeEventSlide) => void;
};

const EventContent = ({ slide, fadeAnim, slideAnim, onAction }: EventContentProps) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!slide?.start_at) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      if (!slide?.start_at) {
        return null;
      }

      // Format is "2026-07-18 01:05:00"
      const parts = slide.start_at.match(/(\d+)-(\d+)-(\d+)\s+(\d+):(\d+):(\d+)/);
      if (!parts) {
        return null;
      }

      const year = parseInt(parts[1], 10);
      const month = parseInt(parts[2], 10) - 1; // 0-indexed month
      const day = parseInt(parts[3], 10);
      const hours = parseInt(parts[4], 10);
      const minutes = parseInt(parts[5], 10);
      const seconds = parseInt(parts[6], 10);

      const targetDate = new Date(year, month, day, hours, minutes, seconds);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return null;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      if (d > 0) {
        return d === 1 ? '1 day left' : `${d} days left`;
      }

      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => String(num).padStart(2, '0');
      const partsArray = [];
      if (h > 0) {
        partsArray.push(`${pad(h)}h`);
      }
      partsArray.push(`${pad(m)}m`);
      partsArray.push(`${pad(s)}s`);

      return `Starts in ${partsArray.join(' ')}`;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [slide?.start_at]);

  const hasStartAt = !!(slide?.start_at && slide.start_at.trim());
  const showButton = hasStartAt || !!slide?.have_button;

  const buttonText = timeLeft || slide?.button_text || 'Plan Party';

  return (
    <Animated.View
      style={[
        eventContentStyles.heroContent,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {slide?.tag ? (
        <View style={eventContentStyles.eventBadge}>
          <Calendar size={12} color="#FFB000" />
          <Text style={eventContentStyles.eventBadgeText}>{slide.tag}</Text>
        </View>
      ) : null}
      {slide?.title ? (
        <Text style={eventContentStyles.heroTitle} numberOfLines={1}>
          {slide.title}
        </Text>
      ) : null}
      {slide?.subtitle ? (
        <Text style={eventContentStyles.heroSubtitle} numberOfLines={2}>
          {slide.subtitle}
        </Text>
      ) : null}
      {showButton ? (
        <TouchableOpacity
          style={[
            eventContentStyles.planButton,
            timeLeft
              ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: colors.glassBorder,
                  borderWidth: 1,
                  shadowOpacity: 0,
                  elevation: 0,
                }
              : null,
          ]}
          disabled={!!timeLeft}
          onPress={() => onAction(slide)}
        >
          <Text
            style={[
              eventContentStyles.planButtonText,
              timeLeft ? { color: colors.textMuted } : null,
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

type EventSectionProps = {
  eventSlides: HomeEventSlide[];
  onAction: (slide: HomeEventSlide) => void;
};

export const EventSection = ({ eventSlides, onAction }: EventSectionProps) => {
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [displayedSlide, setDisplayedSlide] = useState<HomeEventSlide | undefined>(undefined);

  const eventScrollX = useRef(new Animated.Value(0)).current;
  const eventContentFadeAnim = useRef(new Animated.Value(0)).current;
  const eventContentSlideAnim = useRef(new Animated.Value(12)).current;
  const eventCarouselRef = useRef<FlatList<HomeEventSlide>>(null);

  const { width: windowWidth } = useWindowDimensions();
  const carouselWidth = windowWidth - layout.screenPadding * 2;

  // Reset active index when slides change
  useEffect(() => {
    setActiveEventIndex(0);
  }, [eventSlides.length]);

  // Autoplay functionality
  useEffect(() => {
    if (eventSlides.length < 2) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveEventIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % eventSlides.length;

        eventCarouselRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [eventSlides.length]);

  // Monitor active target slide and trigger fade-out / content swap when index or data changes
  useEffect(() => {
    const targetSlide = eventSlides[activeEventIndex];

    if (!targetSlide) {
      Animated.parallel([
        Animated.timing(eventContentFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(eventContentSlideAnim, {
          toValue: 12,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDisplayedSlide(undefined);
      });
      return;
    }

    if (!displayedSlide) {
      setDisplayedSlide(targetSlide);
      return;
    }

    const isDifferent =
      displayedSlide.id !== targetSlide.id ||
      displayedSlide.title !== targetSlide.title ||
      displayedSlide.subtitle !== targetSlide.subtitle ||
      displayedSlide.tag !== targetSlide.tag;

    if (isDifferent) {
      Animated.parallel([
        Animated.timing(eventContentFadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(eventContentSlideAnim, {
          toValue: 12,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDisplayedSlide(targetSlide);
      });
    }
  }, [activeEventIndex, eventSlides, eventContentFadeAnim, eventContentSlideAnim, displayedSlide]);

  // Handle fade-in and slide-up transition after displayedSlide changes
  useEffect(() => {
    if (displayedSlide) {
      eventContentFadeAnim.setValue(0);
      eventContentSlideAnim.setValue(12);
      Animated.parallel([
        Animated.timing(eventContentFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(eventContentSlideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [displayedSlide, eventContentFadeAnim, eventContentSlideAnim]);

  const renderEventSlide = useCallback(
    (eventItem: HomeEventSlide, index: number) => {
      const inputRange = [
        carouselWidth * (index - 1),
        carouselWidth * index,
        carouselWidth * (index + 1),
      ];

      const imageTranslateX =
        eventSlides.length > 1
          ? eventScrollX.interpolate({
              inputRange,
              outputRange: [12, 0, -12],
              extrapolate: 'clamp',
            })
          : 0;

      return (
        <View key={eventItem?.id ?? index} style={[styles.heroSlide, { width: carouselWidth }]}>
          {eventItem?.image ? (
            <Animated.Image
              source={{ uri: Constant.ImageURL + eventItem?.image }}
              style={[styles.heroImage, { transform: [{ translateX: imageTranslateX }] }]}
            />
          ) : null}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.35)']}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroOverlay}
            pointerEvents="none"
          />
        </View>
      );
    },
    [eventScrollX, eventSlides.length, carouselWidth]
  );

  if (eventSlides.length === 0) {
    return null;
  }

  return (
    <View style={styles.heroCard}>
      {eventSlides.length > 1 ? (
        <Animated.FlatList
          ref={eventCarouselRef}
          data={eventSlides}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          snapToInterval={carouselWidth}
          snapToAlignment="start"
          scrollEventThrottle={16}
          onMomentumScrollEnd={event => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
            setActiveEventIndex(nextIndex);
          }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: eventScrollX } } }], {
            useNativeDriver: true,
          })}
          getItemLayout={(_, index) => ({
            length: carouselWidth,
            offset: carouselWidth * index,
            index,
          })}
          renderItem={({ item, index }) => renderEventSlide(item, index)}
        />
      ) : eventSlides[0] ? (
        renderEventSlide(eventSlides[0], 0)
      ) : null}

      {eventSlides.length > 1 ? (
        <View style={styles.heroDots} pointerEvents="none">
          {eventSlides.map((slide, index) => (
            <View
              key={slide?.id ?? index}
              style={[styles.heroDot, index === activeEventIndex ? styles.heroDotActive : null]}
            />
          ))}
        </View>
      ) : null}

      <EventContent
        slide={displayedSlide}
        fadeAnim={eventContentFadeAnim}
        slideAnim={eventContentSlideAnim}
        onAction={onAction}
      />
    </View>
  );
};

export default EventSection;

const eventContentStyles = StyleSheet.create({
  heroContent: {
    padding: 24,
    gap: 16,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 176, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  eventBadgeText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
  },
  planButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 24,
    paddingHorizontal: layout.screenPadding,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
    width: '100%',
  },
  planButtonText: {
    color: colors.black,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  heroCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.glass,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heroSlide: {
    aspectRatio: 16 / 10,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroDots: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  heroDotActive: {
    width: 20,
    backgroundColor: colors.primary,
    borderColor: 'rgba(255, 176, 0, 0.5)',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});
