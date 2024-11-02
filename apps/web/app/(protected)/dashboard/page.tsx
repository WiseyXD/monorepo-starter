"use client";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  console.log(session?.user);

  const handleConnectHono = async () => {
    try {
      const resp = await fetch("/api/connect-hono");
      const data = await resp.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      User here with the user name - {session?.user?.name}
      <div>
        <button onClick={handleConnectHono}>Connect Hono</button>
      </div>
    </>
  );
}
