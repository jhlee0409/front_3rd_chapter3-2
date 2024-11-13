before(() => {
  cy.task('resetDb');
});

describe('일반적인 일정 시나리오 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
    // 꼬임 방직를 위해 일정이 로딩된 후 작업 시작
    cy.findByText('일정 로딩 완료!').should('be.visible');
  });

  it('일정을 추가합니다.', () => {
    cy.addEvent({
      title: '일정 한번 추가해보자',
      date: '2024-11-13',
      startTime: '10:00',
      endTime: '11:00',
      description: '일정 한번 추가해보자 설명',
      location: '일정 한번 추가해보자 위치',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    });

    cy.checkEvent('month', '일정 한번 추가해보자', true);
  });
  it('추가된 일정을 수정합니다.', () => {
    cy.findSearchedEvent('일정 한번 추가해보자').findByLabelText('Edit event').click();

    cy.eventFormTitle('일정 수정').should('be.visible');

    cy.editEvent({
      title: '일정 한번 수정해보자',
    });

    cy.checkEvent('month', '일정 한번 수정해보자', true);
  });

  it('방금 수정한 일정을 삭제합니다.', () => {
    cy.deleteEvent('일정 한번 수정해보자');

    cy.checkEvent('month', '일정 한번 수정해보자', false);

    cy.findByText('일정이 삭제되었습니다.').should('be.visible');
  });
});
