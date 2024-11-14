import { formatDate } from '../support/utils';

before(() => {
  cy.task('resetDb');
});

describe('반복 일정 시나리오 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
    // 꼬임 방직를 위해 일정이 로딩된 후 작업 시작
    cy.findByText('일정 로딩 완료!').should('be.visible');
  });
  it('일간 반복 일정을 추가합니다.', () => {
    // 당월의 1일 설정
    const currentDate = formatDate(new Date(), 1);

    cy.addEvent({
      title: '일정 한번 추가해보자',
      date: currentDate,
      startTime: '10:00',
      endTime: '11:00',
      description: '일정 한번 추가해보자 설명',
      location: '일정 한번 추가해보자 위치',
      category: '업무',
      repeat: { type: 'daily', interval: 20 },
      notificationTime: 10,
    });

    cy.checkEvent('month', '일정 한번 추가해보자', true, 2);
  });
  it('하나의 반복 일정을 수정 시 일반적인 일정으로 바뀝니다.', () => {
    const currentDate = formatDate(new Date(), 1);
    cy.findAllSearchedEvent('일정 한번 추가해보자').findByLabelText('Edit event').first().click();

    cy.eventFormTitle('일정 수정').should('be.visible');

    cy.editEvent({
      title: '일정 한번 수정해보자',
      repeat: { type: 'none', interval: 0 },
    });

    cy.checkEvent('month', `일정 한번 수정해보자`, true);
    cy.checkEvent('month', `반복 일정 캘린더 ${currentDate}`, false);
  });

  it('방금 수정한 일정을 삭제합니다.', () => {
    cy.deleteEvent('일정 한번 수정해보자');

    cy.checkEvent('month', '일정 한번 수정해보자', false);

    cy.findByText('일정이 삭제되었습니다.').should('be.visible');
  });
});
