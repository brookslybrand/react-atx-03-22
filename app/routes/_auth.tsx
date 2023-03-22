import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserId } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  // You can only be on these pages if you're not authenticated
  if (userId) {
    return redirect("/");
  }
  return {};
}

export default function AuthLayout() {
  return <Outlet />;
}
