import {
  TicketCreatedEvent,
  Publisher,
  Subjects,
} from "@theme256_study/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
