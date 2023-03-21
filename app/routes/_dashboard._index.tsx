import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export async function loader() {
  const users = await db.user.findMany();

  return json(users);
}

export default function Index() {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <ul>
        {users.map(({ id, email }) => (
          <li key={id}>{email}</li>
        ))}
      </ul>
    </div>
  );
}
