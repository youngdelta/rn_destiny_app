// 십이지신 (띠)
export const ZODIAC_ANIMALS = [
  { name: '쥐띠', emoji: '🐀', element: '수(水)' },
  { name: '소띠', emoji: '🐂', element: '토(土)' },
  { name: '호랑이띠', emoji: '🐅', element: '목(木)' },
  { name: '토끼띠', emoji: '🐇', element: '목(木)' },
  { name: '용띠', emoji: '🐉', element: '토(土)' },
  { name: '뱀띠', emoji: '🐍', element: '화(火)' },
  { name: '말띠', emoji: '🐎', element: '화(火)' },
  { name: '양띠', emoji: '🐑', element: '토(土)' },
  { name: '원숭이띠', emoji: '🐵', element: '금(金)' },
  { name: '닭띠', emoji: '🐓', element: '금(金)' },
  { name: '개띠', emoji: '🐕', element: '토(土)' },
  { name: '돼지띠', emoji: '🐷', element: '수(水)' },
];

// 12시진 (태어난 시간)
export const BIRTH_HOURS = [
  { name: '자시', time: '23:00-01:00', description: '밤 11시 ~ 새벽 1시' },
  { name: '축시', time: '01:00-03:00', description: '새벽 1시 ~ 새벽 3시' },
  { name: '인시', time: '03:00-05:00', description: '새벽 3시 ~ 새벽 5시' },
  { name: '묘시', time: '05:00-07:00', description: '새벽 5시 ~ 아침 7시' },
  { name: '진시', time: '07:00-09:00', description: '아침 7시 ~ 아침 9시' },
  { name: '사시', time: '09:00-11:00', description: '아침 9시 ~ 오전 11시' },
  { name: '오시', time: '11:00-13:00', description: '오전 11시 ~ 오후 1시' },
  { name: '미시', time: '13:00-15:00', description: '오후 1시 ~ 오후 3시' },
  { name: '신시', time: '15:00-17:00', description: '오후 3시 ~ 오후 5시' },
  { name: '유시', time: '17:00-19:00', description: '오후 5시 ~ 저녁 7시' },
  { name: '술시', time: '19:00-21:00', description: '저녁 7시 ~ 밤 9시' },
  { name: '해시', time: '21:00-23:00', description: '밤 9시 ~ 밤 11시' },
];

// 별자리
export const ZODIAC_SIGNS = [
  { name: '물병자리', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, emoji: '♒' },
  { name: '물고기자리', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, emoji: '♓' },
  { name: '양자리', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, emoji: '♈' },
  { name: '황소자리', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, emoji: '♉' },
  { name: '쌍둥이자리', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21, emoji: '♊' },
  { name: '게자리', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22, emoji: '♋' },
  { name: '사자자리', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, emoji: '♌' },
  { name: '처녀자리', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, emoji: '♍' },
  { name: '천칭자리', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, emoji: '♎' },
  { name: '전갈자리', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, emoji: '♏' },
  { name: '사수자리', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, emoji: '♐' },
  { name: '염소자리', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, emoji: '♑' },
];

export interface FortuneResult {
  type: string;
  emoji: string;
  score: number;
  description: string;
  advice: string;
  luckyItem: string;
}

export interface DailyFortune {
  date: string;
  zodiacSign: typeof ZODIAC_SIGNS[0];
  overallScore: number;
  message: string;
  luckyNumber: number;
  luckyColor: string;
  fortunes: FortuneResult[];
}

export interface DetailedFortune {
  birthDate: Date;
  calendarType: 'solar' | 'lunar';
  birthHour: typeof BIRTH_HOURS[0];
  zodiacAnimal: typeof ZODIAC_ANIMALS[0];
  zodiacSign: typeof ZODIAC_SIGNS[0];
  fortunes: FortuneResult[];
}

// 띠 계산
export function getZodiacAnimal(year: number): typeof ZODIAC_ANIMALS[0] {
  const index = (year - 4) % 12;
  return ZODIAC_ANIMALS[index];
}

// 별자리 계산
export function getZodiacSign(month: number, day: number): typeof ZODIAC_SIGNS[0] {
  for (const sign of ZODIAC_SIGNS) {
    if (sign.startMonth === sign.endMonth) {
      if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) {
        return sign;
      }
    } else if (sign.endMonth < sign.startMonth) {
      // 염소자리 처럼 연도를 넘어가는 경우
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    } else {
      if ((month === sign.startMonth && day >= sign.startDay) ||
          (month === sign.endMonth && day <= sign.endDay)) {
        return sign;
      }
    }
  }
  return ZODIAC_SIGNS[0];
}

// 시드 기반 랜덤 생성기
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// 오늘의 운세 생성
export function generateDailyFortune(month: number, day: number): DailyFortune {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + month * 31 + day;
  const random = seededRandom(seed);

  const zodiacSign = getZodiacSign(month, day);

  const fortuneTypes = [
    { type: '전체운', emoji: '🌟' },
    { type: '애정운', emoji: '💕' },
    { type: '금전운', emoji: '💰' },
    { type: '건강운', emoji: '💪' },
    { type: '직장운', emoji: '💼' },
  ];

  const descriptions = {
    전체운: [
      '오늘은 당신에게 특별한 기운이 감도는 날입니다.',
      '긍정적인 에너지가 당신을 감싸고 있습니다.',
      '조용히 자신을 되돌아보는 시간이 필요합니다.',
      '새로운 가능성이 열리는 하루가 될 것입니다.',
      '주변 사람들과의 조화가 중요한 날입니다.',
    ],
    애정운: [
      '사랑하는 사람과 깊은 대화를 나눠보세요.',
      '새로운 만남의 기회가 찾아올 수 있습니다.',
      '소중한 인연에게 마음을 표현해보세요.',
      '관계에서 작은 서프라이즈가 큰 기쁨을 줍니다.',
      '상대방의 입장에서 생각해보는 것이 좋겠습니다.',
    ],
    금전운: [
      '예상치 못한 수입이 생길 수 있습니다.',
      '충동적인 지출은 자제하는 것이 좋겠습니다.',
      '투자보다는 저축에 집중하세요.',
      '금전적인 행운이 따르는 날입니다.',
      '계획적인 소비가 필요한 시기입니다.',
    ],
    건강운: [
      '충분한 휴식이 필요한 하루입니다.',
      '가벼운 운동으로 활력을 찾아보세요.',
      '건강에 특별히 신경 쓰지 않아도 좋은 날입니다.',
      '스트레스 관리에 신경 쓰세요.',
      '규칙적인 식사가 중요한 시기입니다.',
    ],
    직장운: [
      '업무에서 좋은 성과를 낼 수 있는 날입니다.',
      '동료들과의 협업이 빛을 발할 것입니다.',
      '새로운 프로젝트를 시작하기 좋은 타이밍입니다.',
      '상사에게 인정받을 수 있는 기회가 옵니다.',
      '조용히 자신의 일에 집중하는 것이 좋겠습니다.',
    ],
  };

  const advices = {
    전체운: ['긍정적인 마음가짐을 유지하세요.', '오늘의 결정이 미래에 영향을 줍니다.', '직감을 믿으세요.'],
    애정운: ['진심을 담아 소통하세요.', '상대방을 이해하려 노력하세요.', '작은 배려가 큰 감동을 줍니다.'],
    금전운: ['지출 내역을 점검해보세요.', '장기적인 관점에서 판단하세요.', '무리한 투자는 피하세요.'],
    건강운: ['충분히 수분을 섭취하세요.', '스트레칭으로 긴장을 풀어보세요.', '일찍 잠자리에 드세요.'],
    직장운: ['팀워크를 중시하세요.', '새로운 아이디어를 제안해보세요.', '꼼꼼한 업무 처리가 필요합니다.'],
  };

  const luckyItems = {
    전체운: ['네잎클로버', '보라색 물건', '은반지'],
    애정운: ['분홍색 꽃', '하트 모양 액세서리', '커플 아이템'],
    금전운: ['황금색 지갑', '동전', '복주머니'],
    건강운: ['녹색 채소', '운동화', '물병'],
    직장운: ['파란색 펜', '수첩', '명함지갑'],
  };

  const fortunes: FortuneResult[] = fortuneTypes.map((ft) => {
    const descList = descriptions[ft.type as keyof typeof descriptions];
    const adviceList = advices[ft.type as keyof typeof advices];
    const itemList = luckyItems[ft.type as keyof typeof luckyItems];
    
    return {
      type: ft.type,
      emoji: ft.emoji,
      score: Math.floor(random() * 40) + 60, // 60-100
      description: descList[Math.floor(random() * descList.length)],
      advice: adviceList[Math.floor(random() * adviceList.length)],
      luckyItem: itemList[Math.floor(random() * itemList.length)],
    };
  });

  const luckyColors = ['빨강', '주황', '노랑', '초록', '파랑', '보라', '분홍', '흰색', '검정', '금색'];
  const messages = [
    `오늘 ${zodiacSign.name}에게 행운이 가득할 것입니다!`,
    `${zodiacSign.name}의 매력이 빛나는 하루입니다.`,
    `차분하게 하루를 보내면 좋은 일이 생길 거예요.`,
    `새로운 기회를 놓치지 마세요!`,
    `주변 사람들에게 감사를 표현해보세요.`,
  ];

  return {
    date: dateString,
    zodiacSign,
    overallScore: Math.round(fortunes.reduce((sum, f) => sum + f.score, 0) / fortunes.length),
    message: messages[Math.floor(random() * messages.length)],
    luckyNumber: Math.floor(random() * 100) + 1,
    luckyColor: luckyColors[Math.floor(random() * luckyColors.length)],
    fortunes,
  };
}

// 상세 운세 생성
export function generateDetailedFortune(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  calendarType: 'solar' | 'lunar',
  birthHourIndex: number
): DetailedFortune {
  const today = new Date();
  const seed = birthYear + birthMonth * 31 + birthDay + birthHourIndex + 
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const random = seededRandom(seed);

  const zodiacAnimal = getZodiacAnimal(birthYear);
  const zodiacSign = getZodiacSign(birthMonth, birthDay);
  const birthHour = BIRTH_HOURS[birthHourIndex];

  const fortuneTypes = [
    { type: '전체운', emoji: '🌟' },
    { type: '건강운', emoji: '💪' },
    { type: '애정운', emoji: '💕' },
    { type: '직장운', emoji: '💼' },
    { type: '재물운', emoji: '💎' },
    { type: '학업운', emoji: '📚' },
  ];

  const detailedDescriptions = {
    전체운: [
      `${zodiacAnimal.name}의 ${zodiacAnimal.element} 기운이 강하게 작용하는 시기입니다. 전반적으로 운세가 상승세에 있으며, 특히 대인관계에서 좋은 기운이 느껴집니다.`,
      `${birthHour.name}에 태어난 당신은 직관력이 뛰어나며, 오늘은 그 능력이 빛을 발할 것입니다. 중요한 결정을 내리기에 좋은 시기입니다.`,
      `${zodiacSign.name}의 영향으로 창의력이 높아지는 시기입니다. 새로운 아이디어나 프로젝트를 시작하면 좋은 결과를 얻을 수 있습니다.`,
      `전반적인 기운이 안정적입니다. 급하게 서두르기보다 차분하게 일을 처리하면 좋은 결과가 따를 것입니다.`,
    ],
    건강운: [
      `${zodiacAnimal.element} 기운의 영향으로 소화기 건강에 신경을 써야 합니다. 규칙적인 식사와 충분한 수분 섭취가 중요합니다.`,
      `전체적으로 건강운이 양호합니다. 가벼운 운동을 꾸준히 하면 체력이 더욱 좋아질 것입니다.`,
      `스트레스 관리가 필요한 시기입니다. 명상이나 요가 같은 이완 활동을 추천합니다.`,
      `충분한 수면이 건강의 핵심입니다. 일찍 잠자리에 드는 습관을 들여보세요.`,
    ],
    애정운: [
      `${zodiacSign.name}의 매력이 돋보이는 시기입니다. 새로운 인연을 만날 가능성이 높으며, 기존 관계도 더욱 깊어질 수 있습니다.`,
      `솔직한 감정 표현이 관계 발전의 열쇠입니다. 마음을 열고 상대방에게 다가가보세요.`,
      `연인이 있다면 함께 새로운 경험을 하면 좋습니다. 여행이나 새로운 취미 활동을 추천합니다.`,
      `인내심을 가지고 상대방을 이해하려는 노력이 필요합니다. 작은 오해가 생길 수 있으니 소통에 신경 쓰세요.`,
    ],
    직장운: [
      `${birthHour.name}에 태어난 사람들은 리더십이 강합니다. 팀을 이끄는 역할에서 두각을 나타낼 수 있는 시기입니다.`,
      `새로운 프로젝트나 업무를 맡게 될 가능성이 있습니다. 도전을 두려워하지 마세요.`,
      `동료들과의 협력이 중요한 시기입니다. 팀워크를 발휘하면 좋은 성과를 얻을 수 있습니다.`,
      `꾸준한 노력이 인정받는 시기입니다. 성실하게 업무에 임하면 승진이나 보상이 따를 것입니다.`,
    ],
    재물운: [
      `${zodiacAnimal.name}의 재물운이 상승하는 시기입니다. 투자보다는 저축에 집중하면 좋겠습니다.`,
      `예상치 못한 수입이 생길 수 있습니다. 단, 충동적인 지출은 피하세요.`,
      `계획적인 재정 관리가 필요한 시기입니다. 불필요한 지출을 줄이고 저축을 늘려보세요.`,
      `금전적인 행운이 따르는 시기입니다. 복권이나 작은 투자에서 기대 이상의 결과를 얻을 수 있습니다.`,
    ],
    학업운: [
      `집중력이 높아지는 시기입니다. 새로운 것을 배우거나 자격증 취득에 도전하면 좋은 결과가 있을 것입니다.`,
      `${zodiacSign.name}의 지적 호기심이 빛을 발합니다. 독서나 강연 참석을 추천합니다.`,
      `꾸준한 노력이 실력 향상으로 이어지는 시기입니다. 포기하지 말고 계속 정진하세요.`,
      `새로운 분야에 관심을 가져보세요. 의외의 분야에서 재능을 발견할 수 있습니다.`,
    ],
  };

  const detailedAdvices = {
    전체운: [
      '아침에 일어나서 스트레칭으로 하루를 시작해보세요.',
      '오늘 하루 감사한 일 3가지를 적어보세요.',
      '중요한 결정은 오후에 내리는 것이 좋습니다.',
    ],
    건강운: [
      '하루 8잔 이상의 물을 마시세요.',
      '30분 이상의 걷기 운동을 추천합니다.',
      '충분한 숙면을 취하세요.',
    ],
    애정운: [
      '사랑하는 사람에게 진심 어린 칭찬을 해보세요.',
      '함께하는 시간을 소중히 여기세요.',
      '작은 선물이나 편지로 마음을 표현해보세요.',
    ],
    직장운: [
      '중요한 미팅은 오전에 잡으세요.',
      '업무 우선순위를 정리하고 하루를 시작하세요.',
      '점심시간을 활용해 네트워킹을 해보세요.',
    ],
    재물운: [
      '이번 달 지출 내역을 점검해보세요.',
      '충동구매를 피하고 24시간 생각한 후 결정하세요.',
      '장기적인 저축 계획을 세워보세요.',
    ],
    학업운: [
      '집중이 안 될 때는 장소를 바꿔보세요.',
      '포모도로 기법으로 공부 효율을 높여보세요.',
      '배운 내용을 다른 사람에게 설명해보세요.',
    ],
  };

  const luckyItems = {
    전체운: ['자수정', '보라색 양초', '라벤더 향'],
    건강운: ['녹차', '러닝화', '요가매트'],
    애정운: ['장미꽃', '향수', '커플링'],
    직장운: ['파란색 넥타이', '고급 펜', '다이어리'],
    재물운: ['황금색 지갑', '복주머니', '행운의 동전'],
    학업운: ['형광펜 세트', '노트북', '독서등'],
  };

  const fortunes: FortuneResult[] = fortuneTypes.map((ft) => {
    const descList = detailedDescriptions[ft.type as keyof typeof detailedDescriptions];
    const adviceList = detailedAdvices[ft.type as keyof typeof detailedAdvices];
    const itemList = luckyItems[ft.type as keyof typeof luckyItems];
    
    return {
      type: ft.type,
      emoji: ft.emoji,
      score: Math.floor(random() * 35) + 65, // 65-100
      description: descList[Math.floor(random() * descList.length)],
      advice: adviceList[Math.floor(random() * adviceList.length)],
      luckyItem: itemList[Math.floor(random() * itemList.length)],
    };
  });

  return {
    birthDate: new Date(birthYear, birthMonth - 1, birthDay),
    calendarType,
    birthHour,
    zodiacAnimal,
    zodiacSign,
    fortunes,
  };
}

// 점수에 따른 등급 반환
export function getScoreGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: '대길', color: '#FFD700' };
  if (score >= 80) return { grade: '길', color: '#32CD32' };
  if (score >= 70) return { grade: '중길', color: '#4169E1' };
  if (score >= 60) return { grade: '소길', color: '#FFA500' };
  return { grade: '평', color: '#808080' };
}
