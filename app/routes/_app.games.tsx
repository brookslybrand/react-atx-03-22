import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  // None of the app is accessible if you're not logged in
  if (!user) throw redirect("/login");

  const games = await db.game.findMany();

  return json(games);
}

export default function Games() {
  const games = useLoaderData<typeof loader>();
  return (
    <div className="flex">
      <aside className="w-72 p-4">
        <ul className="flex flex-col gap-8">
          {games.map(({ id, name, imageUrl }) => (
            <Link
              to={`/games/${id}`}
              key={id}
              className="w-full rounded-lg hover:bg-teal-100 border border-transparent focus:outline-none focus:border-teal-500"
            >
              <li>
                {imageUrl ? (
                  <img
                    alt=""
                    src={imageUrl}
                    className="w-32 h-32 object-cover mx-auto"
                  />
                ) : (
                  <span>{name}</span>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </aside>
      <Outlet />
    </div>
  );
}
