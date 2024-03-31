import { OrderCreatedEvent, Publisher, Subjects } from "@theme256_study/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
