type NewMaterial = { courseName?: string; count?: number };

export function greetingFor(hour: number) {
  if (hour >= 5 && hour < 12) return '좋은 아침이에요';
  if (hour >= 12 && hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

// 과목이 여러 개여도 시안대로 한 줄로 보여준다.
export function newMaterialsText(materials: NewMaterial[] = []) {
  const [first, ...rest] = materials;
  if (!first) return null;
  const total = materials.reduce((sum, { count = 0 }) => sum + count, 0);
  const courses = rest.length ? `${first.courseName} 외 ${rest.length}과목` : first.courseName;
  return `${courses}에 새 자료 ${total}개`;
}
