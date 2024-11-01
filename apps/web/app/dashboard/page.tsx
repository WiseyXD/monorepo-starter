import React from "react";
import { signOut } from "../../auth";

export default function page() {
  return (
    <div>
      Dashboard
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
