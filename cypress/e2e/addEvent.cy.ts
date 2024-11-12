describe('이벤트를 추가합니다.', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('일정 추가 타이틀이 있는지 확인 합니다', () => {
    cy.get('.css-1onf1gt > .chakra-heading').should('be.visible');
  });
  it('일정을 추가합니다.', () => {
    cy.addEvent({
      title: '일정 추가 테스트',
      date: '2024-11-13',
      startTime: '10:00',
      endTime: '11:00',
      description: '일정 추가 테스트 설명',
      location: '일정 추가 테스트 위치',
      category: '업무',
      repeat: true,
    });
  });
  it('추가된 일정을 확인합니다.', () => {
    cy.checkEvent('month', '일정 추가 테스트');
  });
});
