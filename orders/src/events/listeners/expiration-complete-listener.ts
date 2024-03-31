import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  OrderStatus,
} from "@theme256_study/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    try {
      const order = await Order.findById(data.orderId).populate("ticket");
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === OrderStatus.Complete) {
        return msg.ack();
      }

      order.set({
        status: OrderStatus.Cancelled,
      });

      await order.save();

      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
          id: order.ticket.id,
        },
        version: order.version,
      });

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
