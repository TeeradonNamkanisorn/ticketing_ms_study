import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  private client: Stan;
  protected ackWait = 5000;
  abstract queueGroupName: string;
  abstract subject: T["subject"];

  abstract onMessage(data: T["data"], msg: Message): void;

  constructor(client: Stan) {
    this.client = client;
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      const parsedData = this.parseData(msg);

      this.onMessage(parsedData, msg);
      msg.ack();
    });
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName)
      .setManualAckMode(true)
      .setAckWait(this.ackWait);
  }

  parseData(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
