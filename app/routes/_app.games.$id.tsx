import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  invariant(typeof params.id === "string", "No game ID found");

  const reviews = await db.review.findMany({
    where: {
      gameId: params.id,
    },
  });

  return json({ reviews });
}

export default function Game() {
  const { reviews } = useLoaderData<typeof loader>();
  return <h2>Reviews</h2>;
}
