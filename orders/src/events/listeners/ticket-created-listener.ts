import { Listener, Subjects, TicketCreatedEvent } from "@theme256_study/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, price, title } = data;
    const ticket = Ticket.build({
      id,
      price,
      title,
    });

    await ticket.save();

    msg.ack();
  }
}
