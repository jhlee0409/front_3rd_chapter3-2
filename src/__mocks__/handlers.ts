import { http, HttpResponse } from 'msw';

import { Event, EventForm } from '../types';
import { createEventResolver, deleteEventResolver, updateEventResolver } from './handlersUtils';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', async () => {
    return HttpResponse.json({ events });
  }),

  http.post('/api/events', async ({ request }) => {
    const event = (await request.json()) as EventForm;
    const { newEventWithId } = createEventResolver(events as Event[], event);
    return HttpResponse.json(newEventWithId, { status: 201 });
  }),

  http.put('/api/events/:id', async ({ request }) => {
    const event = (await request.json()) as Event;
    const { status, updatedEvent, message } = updateEventResolver(events as Event[], event);

    if (status === 404) {
      return HttpResponse.json({ message }, { status });
    }

    return HttpResponse.json(updatedEvent, { status });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const id = params.id as string;
    deleteEventResolver(events as Event[], id);
    return new Response(null, { status: 204 });
  }),
];
