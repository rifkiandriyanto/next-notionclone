import React, { useEffect } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

const LogoutPage: React.FC = () => {
  useEffect(() => {
    const logoutOnServer = async () => {
      const router = useRouter();
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/users/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        router.push("/login");
      } catch (err) {
        console.log(err);
      }
    };
    logoutOnServer();
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;

  if (!token) {
    res?.writeHead(302, { Location: "/login" });
    res?.end();
  }

  return { props: {} };
};

export default LogoutPage;
