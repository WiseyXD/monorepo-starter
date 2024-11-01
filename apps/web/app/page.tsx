import { signIn } from "../auth";

export default function Home() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitter", { redirectTo: "/dashboard" });
      }}
    >
      <button type="submit">Signin with Twitter</button>
    </form>
  );
}
