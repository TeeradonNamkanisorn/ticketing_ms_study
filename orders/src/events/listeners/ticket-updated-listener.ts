import {
  TicketUpdatedEvent,
  Listener,
  Subjects,
  NotFoundError,
} from "@theme256_study/common";
import { Ticket } from "../../model/ticket";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    try {
      const { price, title, id, version } = data;

      const ticket = await Ticket.findOne({
        _id: id,
        version: version - 1,
      });

      if (!ticket) {
        throw new Error("ticket not found");
      }

      ticket.set({ title, price });

      await ticket.save();

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
