import { checkIsRepeatEvent } from '@/entities/event/lib/repeat';
import { formatDate } from '@/features/event/lib/dateUtils';
import { Event, EventForm, RepeatType } from '@/types';

// 두 날짜 간의 시간 차이 계산
export const diffDate = (date1: Date, date2: Date) => {
  return date1.getTime() - date2.getTime();
};

// 기준 날짜와 비교 날짜의 일자가 같은지 확인
export const skipDateByBaseDay = (baseDate: string, targetDate: string) => {
  const baseDay = new Date(baseDate).getDate();
  const targetDay = new Date(targetDate).getDate();
  return baseDay === targetDay;
};

// endDate가 있을 때 date가 종료일을 넘었는지 확인
export const checkIsOverEnd = (date: string, endDate?: string) => {
  return endDate ? diffDate(new Date(date), new Date(endDate)) > 0 : false;
};

// 두 날짜 간의 일수 계산
export const calculateDaysBetween = (startDate: Date, endDate: Date): number => {
  const oneDay = 86400000;
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.round(diffTime / oneDay);
};

// endDate가 없을 때 기본 종료일 설정

export const defaultEndDate = (): Record<RepeatType, Date> => {
  // 2030년까지
  return {
    none: new Date(2030, 12, 31),
    daily: new Date(2030, 12, 31),
    weekly: new Date(2030, 12, 31),
    monthly: new Date(2030, 12, 31),
    yearly: new Date(2030, 12, 31),
  };
};

// interval 계산을 위한 함수
export const divideCountByType = (count: number, type: RepeatType) => {
  if (type === 'daily') return count;
  if (type === 'weekly') return count / 7;
  if (type === 'monthly') return count / 30;
  if (type === 'yearly') return count / 365;
  return 0;
};

// 반복 일정 생성을 위한 날짜 생성
export const newRepeatDate = (eDate: Date, type: RepeatType, i: number, interval: number) => {
  if (type === 'daily')
    return new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate() + i * interval);
  if (type === 'weekly')
    return new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate() + i * interval * 7);
  if (type === 'monthly')
    return new Date(eDate.getFullYear(), eDate.getMonth() + i * interval, eDate.getDate());
  if (type === 'yearly')
    return new Date(eDate.getFullYear() + i * interval, eDate.getMonth(), eDate.getDate());
  return new Date();
};

// 반복 일정 생성을 위한 데이터 생성
export const createRepeatEventsData = (event: Event | EventForm) => {
  const eDate = new Date(event.date);
  const lastDate = event.repeat.endDate
    ? new Date(event.repeat.endDate)
    : defaultEndDate()[event.repeat.type];
  const count = divideCountByType(calculateDaysBetween(eDate, lastDate), event.repeat.type);
  const interval = event.repeat.interval;

  return { count, interval, newRepeatDate };
};

// 반복 일정 패턴에 따른 반복 일정 생성을 위한 데이터 생성
export const createRepeatEvents = (event: Event | EventForm, count: number, interval: number) => {
  return Array.from({ length: count + 1 }, (_, i) => {
    const date = newRepeatDate(new Date(event.date), event.repeat.type, i, interval);
    return { ...event, date: formatDate(date) };
  }).filter((event) => !checkIsOverEnd(event.date, event.repeat.endDate));
};

// 반복 일정 타입에 따른 반복 일정 생성
// ================================================
export const createDailyRepeatEvents = (event: Event | EventForm) => {
  const { count, interval } = createRepeatEventsData(event);
  const dailyEvents = createRepeatEvents(event, count, interval);
  return dailyEvents;
};

export const createWeeklyRepeatEvents = (event: Event | EventForm) => {
  const { count, interval } = createRepeatEventsData(event);
  const weeklyEvents = createRepeatEvents(event, count, interval);
  return weeklyEvents;
};

export const createMonthlyRepeatEvents = (event: Event | EventForm) => {
  const { count, interval } = createRepeatEventsData(event);
  const monthlyEvents = createRepeatEvents(event, count, interval).filter((event, _, arr) =>
    skipDateByBaseDay(arr[0].date, event.date)
  );
  return monthlyEvents;
};

export const createYearlyRepeatEvents = (event: Event | EventForm) => {
  const { count, interval } = createRepeatEventsData(event);
  const yearlyEvents = createRepeatEvents(event, count, interval).filter((event, _, arr) =>
    skipDateByBaseDay(arr[0].date, event.date)
  );
  return yearlyEvents;
};
// ================================================
// 반복 일정 타입에 따른 반복 일정 생성

export const createRepeatEventsByType = (
  event: Event | EventForm
): (Event | EventForm)[] | undefined => {
  if (event.repeat.type === 'daily') return createDailyRepeatEvents(event);
  if (event.repeat.type === 'weekly') return createWeeklyRepeatEvents(event);
  if (event.repeat.type === 'monthly') return createMonthlyRepeatEvents(event);
  if (event.repeat.type === 'yearly') return createYearlyRepeatEvents(event);
};

// 반복 일정 패턴에 따른 반복 일정 생성

export const createRepeatEventsByPattern = (events: (Event | EventForm)[]) => {
  const repeatEvents = events.filter(checkIsRepeatEvent).reduce(
    (acc, event) => {
      const repeatEvents = createRepeatEventsByType(event) ?? [];
      return [...acc, ...repeatEvents];
    },
    [] as (Event | EventForm)[]
  );
  return repeatEvents;
};
