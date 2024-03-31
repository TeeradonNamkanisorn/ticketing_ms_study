import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subject";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = "payments-service";
  readonly subject = Subjects.TicketCreated;

  onMessage(eventData: TicketCreatedEvent["data"], msg: Message) {
    console.log("event data!", eventData);

    msg.ack();
  }
}
