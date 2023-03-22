import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  // You can only be on these pages if you're not authenticated
  if (user) {
    return redirect("/");
  }
  return {};
}

export default function AuthLayout() {
  return <Outlet />;
}
