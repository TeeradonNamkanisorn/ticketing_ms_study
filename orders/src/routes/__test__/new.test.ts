import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../model/ticket";
import { Order, OrderStatus } from "../../model/order";
import { OrderCreatedPublisher } from "../../events/publishers/order-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .send({
      ticketId,
    })
    .set("Cookie", signin())
    .expect(404);
});
it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "concert",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asdgsd",
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});
it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "cocert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // new OrderCreatedPublisher(natsWrapper.client).publish({
  //     id: order.id,
  //     status: order.status,
  //     expiresAt:
  // })
});

it("publishes an event", async () => {
  const ticket = Ticket.build({
    title: "cocert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
