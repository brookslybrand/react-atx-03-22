import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export function action({ request }: ActionArgs) {
  console.log("logging out!");
  return logout(request);
}

export function loader() {
  return redirect("/login");
}
