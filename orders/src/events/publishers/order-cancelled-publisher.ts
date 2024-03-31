import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@theme256_study/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
