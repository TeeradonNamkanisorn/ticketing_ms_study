import { Listener, OrderCreatedEvent, Subjects } from "@theme256_study/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../queues/expiration-queues";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    try {
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
      console.log("waiting this ms to create a job", delay);
      await expirationQueue.add(
        {
          orderId: data.id,
        },
        {
          delay,
        }
      );

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
