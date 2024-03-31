import nats, { Stan } from "node-nats-streaming";

// const stan = nats.connect(`ticketing`, "abcd", {
//   url: "http://nats-srv:4222",
// });

// stan.on("connect", async () => {
//   console.log("publisher connect to nats");
// });

// stan.on("error", (error) => {
//   console.error(error);
// });

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw Error("Cannot connext to NATS client before connecting");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url,
    });

    return new Promise((resolve, reject) => {
      //   console.log(this._client);
      this._client?.on("connect", () => {
        console.log("Connected to nats");
        resolve();
      });

      this._client?.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
