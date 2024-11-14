import { formatDate } from '../support/utils';

before(() => {
  cy.task('resetDb');
});

describe('다음달에 추가한 일정 시나리오 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('다음 달에 일정을 추가합니다.', () => {
    const currentDate = formatDate(new Date(), 13);
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    const formattedNextMonthDate = formatDate(nextMonthDate);

    cy.addEvent({
      title: '일정 한번 추가해보자',
      date: formattedNextMonthDate,
      startTime: '10:00',
      endTime: '11:00',
      description: '일정 한번 추가해보자 설명',
      location: '일정 한번 추가해보자 위치',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    });

    cy.navigateTo('next');

    cy.checkEvent('month', '일정 한번 추가해보자', 'visible');
  });
  it('추가된 일정을 이전 달로 수정합니다.', () => {
    const currentDate = formatDate(new Date(), 13);

    cy.navigateTo('next');
    cy.findSearchedEvent('일정 한번 추가해보자').findByLabelText('Edit event').click();
    cy.eventFormTitle('일정 수정').should('be.visible');
    cy.editEvent({
      title: '일정 한번 수정해보자',
      date: currentDate,
    });
    cy.navigateTo('prev');

    cy.checkEvent('month', '일정 한번 수정해보자', 'visible');
  });

  it('방금 수정한 일정을 삭제합니다.', () => {
    cy.deleteEvent('일정 한번 수정해보자');

    cy.checkEvent('month', '일정 한번 수정해보자', 'invisible');

    cy.findByText('일정이 삭제되었습니다.').should('be.visible');
  });
});
