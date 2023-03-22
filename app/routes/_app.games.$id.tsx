import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getReviewCountAndRating } from "~/utils/data.server";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  invariant(typeof params.id === "string", "No game ID found");

  const gameData = await db.game.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Review: true,
    },
  });

  if (!gameData) {
    throw json({}, { status: 404 });
  }

  const { Review, ...game } = gameData;

  return json({ ...game, ...getReviewCountAndRating(Review), reviews: Review });
}

export default function Game() {
  const { name, imageUrl, description } = useLoaderData<typeof loader>();
  return (
    <div className="p-4 flex flex-1">
      <div className="space-y-4">
        <h1 className="text-4xl font-extralight">{name}</h1>
        {imageUrl ? <img alt="" src={imageUrl} /> : null}
        <p>{description}</p>
      </div>
    </div>
  );
}
