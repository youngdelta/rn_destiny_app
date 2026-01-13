import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BIRTH_HOURS, getZodiacAnimal, getZodiacSign } from '@/utils/fortune';

export default function DetailedFortuneScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [birthHourIndex, setBirthHourIndex] = useState(0);
  
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showHourPicker, setShowHourPicker] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const zodiacAnimal = getZodiacAnimal(birthYear);
  const zodiacSign = getZodiacSign(birthMonth, birthDay);

  const handleViewFortune = () => {
    const href = {
      pathname: '/fortune-result',
      params: {
        birthYear: birthYear.toString(),
        birthMonth: birthMonth.toString(),
        birthDay: birthDay.toString(),
        calendarType,
        birthHourIndex: birthHourIndex.toString(),
      },
    } as Href;
    router.push(href);
  };

  const styles = createStyles(colors);

  const renderPicker = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: { value: number | string; label: string }[],
    selectedValue: number | string,
    onSelect: (value: number) => void
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseText}>완료</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  selectedValue === item.value && styles.modalItemSelected
                ]}
                onPress={() => {
                  onSelect(typeof item.value === 'number' ? item.value : parseInt(item.value as string));
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.headerCard}>
          <Text style={styles.headerEmoji}>🔮</Text>
          <Text style={styles.headerTitle}>나만의 운세 보기</Text>
          <Text style={styles.headerSubtitle}>
            생년월일과 태어난 시간을 입력하면{'\n'}상세한 운세를 확인할 수 있어요
          </Text>
        </View>

        {/* 생년월일 입력 */}
        <Text style={styles.sectionTitle}>생년월일</Text>
        
        <View style={styles.dateInputContainer}>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.dateInputLabel}>년</Text>
            <Text style={styles.dateInputValue}>{birthYear}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.dateInputLabel}>월</Text>
            <Text style={styles.dateInputValue}>{birthMonth}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDayPicker(true)}
          >
            <Text style={styles.dateInputLabel}>일</Text>
            <Text style={styles.dateInputValue}>{birthDay}</Text>
          </TouchableOpacity>
        </View>

        {/* 양력/음력 선택 */}
        <Text style={styles.sectionTitle}>달력 종류</Text>
        
        <View style={styles.calendarTypeContainer}>
          <TouchableOpacity 
            style={[
              styles.calendarTypeButton,
              calendarType === 'solar' && styles.calendarTypeButtonSelected
            ]}
            onPress={() => setCalendarType('solar')}
          >
            <Text style={styles.calendarTypeEmoji}>☀️</Text>
            <Text style={[
              styles.calendarTypeText,
              calendarType === 'solar' && styles.calendarTypeTextSelected
            ]}>
              양력
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.calendarTypeButton,
              calendarType === 'lunar' && styles.calendarTypeButtonSelected
            ]}
            onPress={() => setCalendarType('lunar')}
          >
            <Text style={styles.calendarTypeEmoji}>🌙</Text>
            <Text style={[
              styles.calendarTypeText,
              calendarType === 'lunar' && styles.calendarTypeTextSelected
            ]}>
              음력
            </Text>
          </TouchableOpacity>
        </View>

        {/* 태어난 시간 선택 */}
        <Text style={styles.sectionTitle}>태어난 시간 (시진)</Text>
        
        <TouchableOpacity 
          style={styles.timeSelector}
          onPress={() => setShowHourPicker(true)}
        >
          <View style={styles.timeSelectorContent}>
            <Text style={styles.timeSelectorName}>
              {BIRTH_HOURS[birthHourIndex].name}
            </Text>
            <Text style={styles.timeSelectorTime}>
              {BIRTH_HOURS[birthHourIndex].description}
            </Text>
          </View>
          <Text style={styles.timeSelectorArrow}>▼</Text>
        </TouchableOpacity>

        {/* 띠와 별자리 표시 */}
        <View style={styles.zodiacInfoContainer}>
          <View style={styles.zodiacInfoCard}>
            <Text style={styles.zodiacInfoEmoji}>{zodiacAnimal.emoji}</Text>
            <Text style={styles.zodiacInfoTitle}>{zodiacAnimal.name}</Text>
            <Text style={styles.zodiacInfoSubtitle}>{zodiacAnimal.element}</Text>
          </View>
          
          <View style={styles.zodiacInfoCard}>
            <Text style={styles.zodiacInfoEmoji}>{zodiacSign.emoji}</Text>
            <Text style={styles.zodiacInfoTitle}>{zodiacSign.name}</Text>
            <Text style={styles.zodiacInfoSubtitle}>별자리</Text>
          </View>
        </View>

        {/* 운세 보기 버튼 */}
        <TouchableOpacity 
          style={styles.viewFortuneButton}
          onPress={handleViewFortune}
        >
          <Text style={styles.viewFortuneButtonText}>운세 보기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Pickers */}
      {renderPicker(
        showYearPicker,
        () => setShowYearPicker(false),
        '출생 년도',
        years.map(y => ({ value: y, label: `${y}년` })),
        birthYear,
        setBirthYear
      )}

      {renderPicker(
        showMonthPicker,
        () => setShowMonthPicker(false),
        '출생 월',
        months.map(m => ({ value: m, label: `${m}월` })),
        birthMonth,
        setBirthMonth
      )}

      {renderPicker(
        showDayPicker,
        () => setShowDayPicker(false),
        '출생 일',
        days.map(d => ({ value: d, label: `${d}일` })),
        birthDay,
        setBirthDay
      )}

      {renderPicker(
        showHourPicker,
        () => setShowHourPicker(false),
        '태어난 시간',
        BIRTH_HOURS.map((h, i) => ({ 
          value: i, 
          label: `${h.name} (${h.description})` 
        })),
        birthHourIndex,
        setBirthHourIndex
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  dateInputLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  dateInputValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  calendarTypeButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  calendarTypeButtonSelected: {
    borderColor: colors.purple,
    backgroundColor: colors.purple + '10',
  },
  calendarTypeEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  calendarTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  calendarTypeTextSelected: {
    color: colors.purple,
  },
  timeSelector: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 24,
  },
  timeSelectorContent: {
    flex: 1,
  },
  timeSelectorName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  timeSelectorTime: {
    fontSize: 14,
    color: colors.muted,
  },
  timeSelectorArrow: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 8,
  },
  zodiacInfoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  zodiacInfoCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  zodiacInfoEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  zodiacInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  zodiacInfoSubtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  viewFortuneButton: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  viewFortuneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.purple,
    fontWeight: '600',
  },
  modalScroll: {
    padding: 8,
  },
  modalItem: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  modalItemSelected: {
    backgroundColor: colors.purple + '20',
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  modalItemTextSelected: {
    color: colors.purple,
    fontWeight: '600',
  },
});
