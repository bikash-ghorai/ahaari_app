import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { AlertTriangle } from 'lucide-react-native';
import { colors, layout, typography } from '../constants/theme';

type Props = {
  title?: string;
  description?: string;
  isVisible: boolean;
  onBtn1Press?: () => void;
  onBtn2Press?: () => void;
  hideBtn1?: boolean;
  hideBtn2?: boolean;
  btn1Name?: string;
  btn2Name?: string;
  btn1Style?: any;
  btn2Style?: any;
};

const PopupMessage: React.FC<Props> = ({
  title,
  description,
  isVisible,
  onBtn1Press = () => {},
  onBtn2Press = () => {},
  btn1Name = 'Cancel',
  btn2Name = 'Okay',
  hideBtn1 = false,
  hideBtn2 = false,
  btn1Style,
  btn2Style,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalIconWrap}>
            <AlertTriangle
              size={24}
              color={colors.accentTan}
              strokeWidth={2.2}
            />
          </View>

          <Text style={styles.deleteModalTitle}>{title}</Text>
          <Text style={styles.deleteModalSubtitle}>{description}</Text>

          <View style={styles.deleteModalActions}>
            {hideBtn1 ? null : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.deleteModalCancelButton,
                  btn1Style && { ...btn1Style },
                ]}
                onPress={onBtn1Press}
              >
                <Text style={styles.deleteModalCancelText}>{btn1Name}</Text>
              </TouchableOpacity>
            )}

            {hideBtn2 ? null : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.deleteModalDeleteButton,
                  btn2Style && { ...btn2Style },
                ]}
                onPress={onBtn2Press}
              >
                <Text style={styles.deleteModalDeleteText}>{btn2Name}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
  },
  deleteModalContainer: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 20,
  },
  deleteModalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.24)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  deleteModalTitle: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteModalSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteModalCancelText: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontWeight: '700',
  },
  deleteModalDeleteButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: 'rgb(255, 254, 254)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteModalDeleteText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: '800',
  },
});

export default PopupMessage;
