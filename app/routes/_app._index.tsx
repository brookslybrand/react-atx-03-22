import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

import { getUser } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);

  // None of the app is accessible if you're not logged in
  if (!user) throw redirect("/login");

  const rawGames = await db.game.findMany({
    include: {
      Review: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Here for a quick fix, stolen from https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
  const roundRating = (n: number) =>
    Math.round((n + Number.EPSILON) * 100) / 100;

  const games = rawGames.map(({ Review, ...game }) => {
    const reviewCount = Review.length;

    return {
      ...game,
      reviewCount,
      avgRating:
        reviewCount > 0
          ? roundRating(
              Review.reduce((sum, { rating }) => sum + rating, 0) / reviewCount
            )
          : null,
    };
  });

  return json({ userName: user.name, games });
}

export default function Index() {
  const { userName, games } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl font-extralight leading-6 text-gray-900 self-start p-6">
        Welcome {userName}, check out these games!
      </h1>
      {games.map((game) => (
        <GameCard key={game.id} {...game} />
      ))}
    </div>
  );
}

function GameCard({
  name,
  description,
  imageUrl,
  reviewCount,
  avgRating,
}: SerializeFrom<typeof loader>["games"][0]) {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg md:w-5/6 lg:w-3/4 xl:w-1/2">
      <Link
        to="/"
        className="px-4 py-5 sm:px-6 flex items-center justify-between hover:bg-teal-100 border sm:rounded-t-lg  border-transparent focus:outline-none focus:border-teal-500"
      >
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          {name}
        </h2>
        {imageUrl ? (
          <img alt="" src={imageUrl} className="w-24 h-24 object-cover" />
        ) : null}
      </Link>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Average Rating
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {avgRating} / 5{" "}
              <Link to="/ratings" className="text-teal-600 hover:text-teal-400">
                based on {reviewCount} {reviewCount > 1 ? "reviews" : "review"}
              </Link>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {description}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
