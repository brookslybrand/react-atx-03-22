import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { clsx } from "clsx";
import invariant from "tiny-invariant";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  // None of the app is accessible if you're not logged in
  if (!user) throw redirect("/login");

  const games = await db.game.findMany();

  if (games.length <= 0) {
    throw redirect("/");
  }

  return json({ games });
}

export default function Games() {
  const { games } = useLoaderData<typeof loader>();
  const { id: selectedGameId } = useParams();
  invariant(selectedGameId, "How did we end up like this?");

  const selectedGame = games.find(({ id }) => id === selectedGameId);
  invariant(selectedGame, "How did we end up like this?");

  return (
    <div className="flex w-full gap-8">
      <aside className="w-[900px] p-4">
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
                    className={clsx(
                      "w-32 h-32 object-cover mx-auto",
                      selectedGameId === id && "ring-4 ring-purple-400"
                    )}
                  />
                ) : (
                  <span>{name}</span>
                )}
              </li>
            </Link>
          ))}
        </ul>
      </aside>
      <div>
        <div className="w-2/3 space-y-4">
          <h1 className="text-4xl font-extralight">{selectedGame.name}</h1>
          {selectedGame.imageUrl ? (
            <img alt="" src={selectedGame.imageUrl} />
          ) : null}
          <p>{selectedGame.description}</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
