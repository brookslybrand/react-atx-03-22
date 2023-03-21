import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return json({ name: user.name });
}

export default function DashboardLayout() {
  const { name } = useLoaderData<typeof loader>();
  return (
    <main>
      <Form action="/logout">
        <button type="submit">Log out</button>
      </Form>
      <h1>Welcome {name}!</h1>
      <Outlet />
    </main>
  );
}
