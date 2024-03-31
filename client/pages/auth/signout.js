import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const SignoutPage = () => {
  const { doRequest } = useRequest({
    body: {},
    method: "post",
    url: "/api/users/signout",
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignoutPage;
