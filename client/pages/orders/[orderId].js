import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

function OrderShow({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    body: {
      orderId: order.id,
    },
    method: "post",
    url: "/api/payments",
    onSuccess: () => {
      Router.push("/orders");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [order]);
  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }
  return (
    <div>
      Seconds until order expires: {timeLeft}
      {
        <StripeCheckout
          token={({ id }) => {
            console.log(id);
            doRequest({
              token: id,
            });
          }}
          stripeKey={
            "pk_test_51OyDW12KHvJXlA7MPeAxWYaMzveNv6Ez4SIVzH0yPZn5JjjpY3oqfDu2UY0oI9qTw1CWgSI73I5h6GzyorEoN0AY00bfFsaBPH"
          }
          amount={order.ticket.price * 100}
          currency="USD"
          email={currentUser.email}
        />
      }
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const res = await client.get(`/api/orders/${orderId}`);

  return {
    order: res.data,
  };
};

export default OrderShow;
