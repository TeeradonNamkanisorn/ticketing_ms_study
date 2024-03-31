import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect(`ticketing`, "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connect to nats");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

  try {
    await ticketCreatedPublisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }

  // stan.publish("ticket:created", data, () => {
  //   console.log("event published");
  // });
});
