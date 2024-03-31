import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { OrderStatus } from "@theme256_study/common";
import { stripe } from "../../stripe";
import { Payment } from "../../../models/payment";
import { PaymentCreatedPublisher } from "../../../events/publishers/payment-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

jest.mock("../../stripe");

it("Returns a 404 when purchasing non existent order", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "123",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Returns a 401 when purchasing an order that doesn't belong the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "123",
      orderId: order.id,
    })
    .expect(401);
});

it("Returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    version: 0,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "123",
      orderId: order.id,
    })
    .expect(400);
});

it("Returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    version: 0,
    status: OrderStatus.Created,
  });

  await order.save();

  //   console.log(stripe.charges.create);

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);
  expect(stripe.charges.create).toHaveBeenCalled();

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toBe("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
});
