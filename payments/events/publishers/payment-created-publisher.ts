import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@theme256_study/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
