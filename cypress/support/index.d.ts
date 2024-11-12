/* eslint-disable no-unused-vars */
type EventData = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: boolean;
  exceptionDates?: string[];
};

declare namespace Cypress {
  interface Chainable {
    addEvent(data: EventData): Chainable<Element>;
    checkEvent(view: 'month' | 'week', title: string): Chainable<Element>;
  }
}
