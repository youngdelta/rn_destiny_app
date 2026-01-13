import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { generateDetailedFortune, getScoreGrade, BIRTH_HOURS } from '@/utils/fortune';

export default function FortuneResultScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams<{
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    calendarType: string;
    birthHourIndex: string;
  }>();

  const fortune = useMemo(() => {
    return generateDetailedFortune(
      parseInt(params.birthYear || '1990'),
      parseInt(params.birthMonth || '1'),
      parseInt(params.birthDay || '1'),
      (params.calendarType as 'solar' | 'lunar') || 'solar',
      parseInt(params.birthHourIndex || '0')
    );
  }, [params]);

  const handleShare = async () => {
    const overallScore = Math.round(
      fortune.fortunes.reduce((sum, f) => sum + f.score, 0) / fortune.fortunes.length
    );
    
    try {
      await Share.share({
        message: `🔮 나의 운세 결과\n\n` +
          `${fortune.zodiacAnimal.emoji} ${fortune.zodiacAnimal.name} | ${fortune.zodiacSign.emoji} ${fortune.zodiacSign.name}\n\n` +
          `종합 점수: ${overallScore}점\n\n` +
          fortune.fortunes.map(f => `${f.emoji} ${f.type}: ${f.score}점`).join('\n'),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const styles = createStyles(colors);

  const overallScore = Math.round(
    fortune.fortunes.reduce((sum, f) => sum + f.score, 0) / fortune.fortunes.length
  );
  const overallGrade = getScoreGrade(overallScore);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 사용자 정보 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileZodiacContainer}>
              <View style={styles.profileZodiacItem}>
                <Text style={styles.profileZodiacEmoji}>{fortune.zodiacAnimal.emoji}</Text>
                <Text style={styles.profileZodiacName}>{fortune.zodiacAnimal.name}</Text>
                <Text style={styles.profileZodiacSub}>{fortune.zodiacAnimal.element}</Text>
              </View>
              <View style={styles.profileZodiacDivider} />
              <View style={styles.profileZodiacItem}>
                <Text style={styles.profileZodiacEmoji}>{fortune.zodiacSign.emoji}</Text>
                <Text style={styles.profileZodiacName}>{fortune.zodiacSign.name}</Text>
                <Text style={styles.profileZodiacSub}>별자리</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileInfoText}>
              {params.birthYear}년 {params.birthMonth}월 {params.birthDay}일 ({params.calendarType === 'solar' ? '양력' : '음력'})
            </Text>
            <Text style={styles.profileInfoText}>
              {BIRTH_HOURS[parseInt(params.birthHourIndex || '0')].name} ({BIRTH_HOURS[parseInt(params.birthHourIndex || '0')].description})
            </Text>
          </View>

          <View style={styles.overallScoreContainer}>
            <Text style={styles.overallScoreLabel}>종합 운세</Text>
            <View style={styles.overallScoreCircle}>
              <Text style={[styles.overallScoreValue, { color: overallGrade.color }]}>
                {overallScore}
              </Text>
              <Text style={[styles.overallScoreGrade, { color: overallGrade.color }]}>
                {overallGrade.grade}
              </Text>
            </View>
          </View>
        </View>

        {/* 운세 상세 */}
        <Text style={styles.sectionTitle}>상세 운세</Text>

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
                  <Text style={styles.adviceLabel}>오늘의 조언</Text>
                  <Text style={styles.adviceText}>{item.advice}</Text>
                </View>
                <View style={styles.luckyItemContainer}>
                  <Text style={styles.luckyItemLabel}>행운의 아이템</Text>
                  <Text style={styles.luckyItemText}>{item.luckyItem}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* 버튼들 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>결과 공유하기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>다시 보기</Text>
          </TouchableOpacity>
        </View>
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  profileHeader: {
    marginBottom: 16,
  },
  profileZodiacContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  profileZodiacItem: {
    alignItems: 'center',
    flex: 1,
  },
  profileZodiacDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.cardBorder,
  },
  profileZodiacEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  profileZodiacName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileZodiacSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.cardBorder,
  },
  profileInfoText: {
    fontSize: 14,
    color: colors.muted,
    marginVertical: 2,
  },
  overallScoreContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  overallScoreLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
  },
  overallScoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.purple,
  },
  overallScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  overallScoreGrade: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  adviceLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
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
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  shareButton: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
