import { Publisher, Subjects } from "@theme256_study/common";
import { TicketUpdatedEvent } from "@theme256_study/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
