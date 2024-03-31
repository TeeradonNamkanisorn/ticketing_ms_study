import {
  PaymentCreatedEvent,
  Listener,
  Subjects,
  OrderStatus,
} from "@theme256_study/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    try {
      const order = await Order.findById(data.orderId);

      if (!order) {
        throw new Error("Order not found");
      }

      order.status = OrderStatus.Complete;

      await order.save();

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
