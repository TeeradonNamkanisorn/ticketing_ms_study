import React from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

function TicketShow({ ticket }) {
  const { doRequest, errors } = useRequest({
    body: {
      ticketId: ticket.id,
    },
    method: "post",
    url: "/api/orders",
    onSuccess: (order) => {
      Router.push("/orders/[orderId]", `/orders/${order.id}`);
    },
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
}
TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;

  const res = await client.get(`/api/tickets/${ticketId}`);

  return {
    ticket: res.data,
  };
};

export default TicketShow;
