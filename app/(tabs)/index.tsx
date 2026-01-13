import React, { useState, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { generateDailyFortune, getScoreGrade, ZODIAC_SIGNS } from '@/utils/fortune';

const { width } = Dimensions.get('window');

export default function DailyFortuneScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fortune = useMemo(() => {
    return generateDailyFortune(selectedMonth, selectedDay);
  }, [selectedMonth, selectedDay]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 날짜 선택 */}
        <TouchableOpacity 
          style={styles.dateSelector}
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Text style={styles.dateSelectorLabel}>생일 선택</Text>
          <Text style={styles.dateSelectorValue}>
            {selectedMonth}월 {selectedDay}일 {fortune.zodiacSign.emoji} {fortune.zodiacSign.name}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            <View style={styles.pickerRow}>
              <Text style={styles.pickerLabel}>월</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.pickerScroll}
              >
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      selectedMonth === month && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedMonth(month)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedMonth === month && styles.pickerItemTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.pickerRow}>
              <Text style={styles.pickerLabel}>일</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.pickerScroll}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      selectedDay === day && styles.pickerItemSelected
                    ]}
                    onPress={() => setSelectedDay(day)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedDay === day && styles.pickerItemTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {/* 오늘의 메시지 */}
        <View style={styles.messageCard}>
          <Text style={styles.todayDate}>
            {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
          </Text>
          <Text style={styles.zodiacEmoji}>{fortune.zodiacSign.emoji}</Text>
          <Text style={styles.zodiacName}>{fortune.zodiacSign.name}</Text>
          <Text style={styles.messageText}>{fortune.message}</Text>
          
          <View style={styles.luckyInfoContainer}>
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>행운의 숫자</Text>
              <Text style={styles.luckyValue}>{fortune.luckyNumber}</Text>
            </View>
            <View style={styles.luckyDivider} />
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>행운의 색</Text>
              <Text style={styles.luckyValue}>{fortune.luckyColor}</Text>
            </View>
            <View style={styles.luckyDivider} />
            <View style={styles.luckyItem}>
              <Text style={styles.luckyLabel}>종합 점수</Text>
              <Text style={[styles.luckyValue, { color: getScoreGrade(fortune.overallScore).color }]}>
                {fortune.overallScore}점
              </Text>
            </View>
          </View>
        </View>

        {/* 운세 카드들 */}
        <Text style={styles.sectionTitle}>오늘의 운세</Text>
        
        {fortune.fortunes.map((item, index) => {
          const grade = getScoreGrade(item.score);
          return (
            <View key={index} style={styles.fortuneCard}>
              <View style={styles.fortuneHeader}>
                <View style={styles.fortuneTitleContainer}>
                  <Text style={styles.fortuneEmoji}>{item.emoji}</Text>
                  <Text style={styles.fortuneType}>{item.type}</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreText, { color: grade.color }]}>
                    {item.score}점
                  </Text>
                  <Text style={[styles.gradeText, { color: grade.color }]}>
                    {grade.grade}
                  </Text>
                </View>
              </View>
              
              <View style={styles.scoreBarBackground}>
                <View 
                  style={[
                    styles.scoreBarFill, 
                    { width: `${item.score}%`, backgroundColor: grade.color }
                  ]} 
                />
              </View>
              
              <Text style={styles.fortuneDescription}>{item.description}</Text>
              
              <View style={styles.fortuneFooter}>
                <View style={styles.adviceContainer}>
                  <Text style={styles.adviceLabel}>조언</Text>
                  <Text style={styles.adviceText}>{item.advice}</Text>
                </View>
                <View style={styles.luckyItemContainer}>
                  <Text style={styles.luckyItemLabel}>행운 아이템</Text>
                  <Text style={styles.luckyItemText}>{item.luckyItem}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  dateSelector: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateSelectorLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  dateSelectorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    color: colors.muted,
    width: 30,
    marginRight: 8,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  pickerItemSelected: {
    backgroundColor: colors.purple,
  },
  pickerItemText: {
    fontSize: 14,
    color: colors.text,
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  todayDate: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
  },
  zodiacEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  zodiacName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  luckyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  luckyItem: {
    alignItems: 'center',
    flex: 1,
  },
  luckyDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.cardBorder,
  },
  luckyLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  luckyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.purple,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  fortuneCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  fortuneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fortuneTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fortuneEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  fortuneType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scoreBarBackground: {
    height: 8,
    backgroundColor: colors.cardBorder,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  fortuneDescription: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  fortuneFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 12,
  },
  adviceContainer: {
    marginBottom: 8,
  },
  adviceLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
  },
  adviceText: {
    fontSize: 14,
    color: colors.text,
  },
  luckyItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luckyItemLabel: {
    fontSize: 12,
    color: colors.muted,
    marginRight: 8,
  },
  luckyItemText: {
    fontSize: 14,
    color: colors.purple,
    fontWeight: '500',
  },
});
