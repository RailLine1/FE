// 오늘, 어제, 그 이전은 월.일로 보여준다.
export function formatRelativeDate(value: string) {
  const date = new Date(value);
  const startOfDay = (target: Date) =>
    new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / (24 * 60 * 60 * 1000));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return `${date.getMonth() + 1}.${date.getDate()}`;
}
