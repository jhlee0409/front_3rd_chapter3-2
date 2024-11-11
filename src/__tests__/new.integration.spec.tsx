import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { setupCreateHandler } from '@/__mocks__/handlersUtils';
import App from '@/App';
import { Providers } from '@/app/providers';
import { Event, EventForm } from '@/types';

const Provider = ({ children }: { children: React.ReactNode }) => <Providers>{children}</Providers>;

const initialEvents = [
  {
    id: '1',
    title: '기존 회의',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
] as Event[];

const renderComponent = () =>
  render(
    <Provider>
      <App />
    </Provider>
  );

describe.only('반복 일정 테스트', () => {
  beforeEach(() => {
    renderComponent();
  });
  const getElement = () => {
    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const descriptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categoryInput = screen.getByLabelText('카테고리');
    const repeatCheckbox = screen.getByLabelText('반복 일정');
    const notificationTimeSelect = screen.getByLabelText('알림 설정');

    // 반복 일정 체크 시 추가되는 요소들
    const repeatTypeSelect = screen.queryByLabelText('반복 유형');
    const repeatIntervalInput = screen.queryByLabelText('반복 간격');

    // 일정 추가 버튼
    const addEventButton = screen.getByTestId('event-submit-button');
    return {
      titleInput,
      dateInput,
      startTimeInput,
      endTimeInput,
      descriptionInput,
      locationInput,
      categoryInput,
      repeatCheckbox,
      notificationTimeSelect,
      repeatTypeSelect,
      repeatIntervalInput,
      addEventButton,
    };
  };

  const saveEvent = async (els: ReturnType<typeof getElement>, newEvent: EventForm) => {
    const {
      titleInput,
      dateInput,
      startTimeInput,
      endTimeInput,
      descriptionInput,
      locationInput,
      categoryInput,
      notificationTimeSelect,
      repeatCheckbox,
      repeatTypeSelect,
      repeatIntervalInput,
      addEventButton,
    } = els;
    // 제목을 지우고 수정된 제목 입력
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, newEvent.title);

    // 날짜를 지우고 수정된 날짜 입력
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, newEvent.date);

    // 시작 시간을 지우고 수정된 시작 시간 입력
    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, newEvent.startTime);

    // 종료 시간을 지우고 수정된 종료 시간 입력
    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, newEvent.endTime);

    // 설명을 지우고 수정된 설명 입력
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, newEvent.description);

    // 장소를 지우고 수정한 장소 입력
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, newEvent.location);

    // 카테고리를 수정된 카테고리 입력
    await userEvent.selectOptions(categoryInput, newEvent.category);

    // 알림 시간을 수정된 알림 시간 입력
    await userEvent.selectOptions(notificationTimeSelect, newEvent.notificationTime.toString());

    // 반복 일정 체크 시 반복 유형과 반복 간격 설정

    await userEvent.click(repeatCheckbox);

    if (repeatTypeSelect) {
      await userEvent.selectOptions(repeatTypeSelect, newEvent.repeat.type);
    }
    if (repeatIntervalInput) {
      await userEvent.type(repeatIntervalInput, newEvent.repeat.interval.toString());
    }

    // 일정 추가
    await userEvent.click(addEventButton);
  };

  const dailyEvent = {
    type: 'daily',
    name: '2일간 반복 일정',
    interval: 2,
    expectDate: ['2024-10-15', '2024-10-17', '2024-10-19'],
  };

  const weeklyEvent = {
    type: 'weekly',
    name: '2주간 반복 일정',
    interval: 2,
    expectDate: ['2024-10-15', '2024-10-22', '2024-10-29'],
  };

  const monthlyEvent = {
    type: 'monthly',
    name: '2달간 반복 일정',
    interval: 2,
    expectDate: ['2024-10-15', '2024-12-15', '2025-02-15'],
  };

  const yearlyEvent = {
    type: 'yearly',
    name: '2년간 반복 일정',
    interval: 2,
    expectDate: ['2024-10-15', '2026-10-15', '2028-10-15'],
  };

  it.only('반복 일정 적용 시 캘린더에 아이콘이 노출된다.', async () => {
    const _initialEvents = [...initialEvents];
    setupCreateHandler(_initialEvents);

    const newEvent = {
      title: '새로운 일정',
      date: '2024-10-15',
      startTime: '10:00',
      endTime: '11:00',
      description: '새로운 일정 설명',
      location: '새로운 장소',
      category: '업무',
      notificationTime: 10,
      repeat: { type: 'daily', interval: 10 },
    } as EventForm;

    const els = getElement();

    await saveEvent(els, newEvent);

    await screen.findAllByText('일정이 추가되었습니다.');

    const calendarView = screen.getByTestId('month-view');

    screen.debug(within(calendarView).getAllByText(/반복 일정 캘린더/i));

    await waitFor(() => {
      expect(within(calendarView).getAllByText('반복 일정 캘린더')).toHaveLength(8);
    });
  });
  test.skip.each([dailyEvent, weeklyEvent, monthlyEvent, yearlyEvent])(
    '$name 반복 일정 생성 시 리스트에 정확히 노출된다.',
    async ({ type, interval, expectDate }) => {
      const _initialEvents = [...initialEvents];
      setupCreateHandler(_initialEvents);

      const newEvent = {
        title: '새로운 일정',
        date: '2024-10-15',
        startTime: '10:00',
        endTime: '11:00',
        description: '새로운 일정 설명',
        location: '새로운 장소',
        category: '업무',
        notificationTime: 10,
        repeat: { type, interval },
      } as EventForm;

      const els = getElement();

      await saveEvent(els, newEvent);

      const eventList = screen.getByTestId('event-list');

      if (type === 'daily' || type === 'weekly') {
        expectDate.forEach((date) => {
          expect(within(eventList).getAllByText(date)[0]).toBeInTheDocument();
        });
      }

      //TODO: 월간 반복 일정 테스트
      if (type === 'monthly') {
        expect(within(eventList).getAllByText(expectDate[0])[0]).toBeInTheDocument();
      }

      //TODO: 연간 반복 일정 테스트
      if (type === 'yearly') {
        expect(within(eventList).getAllByText(expectDate[0])[0]).toBeInTheDocument();
      }
    }
  );
});
