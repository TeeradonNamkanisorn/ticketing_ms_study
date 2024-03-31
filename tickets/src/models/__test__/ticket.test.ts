import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "new ticket",
    userId: "123",
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({
    price: 25,
  });

  await firstInstance?.save();

  try {
    secondInstance!.set({
      price: 30,
    });

    await secondInstance?.save();
  } catch (error) {
    return;
  }

  throw Error("Should not reach this point");
});

it("increments the correct version number on multiple saves", async () => {
  const ticket = Ticket.build({
    price: 20,
    title: "new ticket",
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
