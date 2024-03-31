import { Listener, Subjects, OrderCreatedEvent } from "@theme256_study/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  queueGroupName = queueGroupName;

  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    try {
      const ticket = await Ticket.findById(data.ticket.id);

      if (!ticket) throw new Error("ticket not found");

      ticket.set({
        orderId: data.id,
      });

      await ticket.save();

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
