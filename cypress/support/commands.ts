import '@testing-library/cypress/add-commands';

Cypress.Commands.add('addEvent', (data) => {
  const { title, date, startTime, endTime, description, location, category, repeat } = data;
  // 제목 입력
  cy.findByLabelText('제목').type(title);

  // 날짜 선택
  cy.findByLabelText('날짜').type(date);

  // 시작 시간 선택
  cy.findByLabelText('시작 시간').type(startTime);

  // 종료 시간 선택
  cy.findByLabelText('종료 시간').type(endTime);

  // 설명 입력
  cy.findByLabelText('설명').type(description);

  // 위치 입력
  cy.findByLabelText('위치').type(location);

  // 카테고리 선택
  cy.findByLabelText('카테고리').select(category);

  // 반복 설정
  cy.get('.chakra-checkbox__label').click();
  cy.findByRole('button', { name: /일정 추가/i }).click();
});

Cypress.Commands.add('checkEvent', (view, title) => {
  const viewTestId = view === 'month' ? 'month-view' : 'week-view';
  cy.findByTestId(viewTestId).findByText(title).should('be.visible');
});
