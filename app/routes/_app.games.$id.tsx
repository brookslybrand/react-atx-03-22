import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export async function loader({ params }: LoaderArgs) {
  invariant(typeof params.id === "string", "No game ID found");

  const rawReviews = await db.review.findMany({
    where: {
      gameId: params.id,
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
    },
  });

  const reviews = rawReviews.map(
    ({ gameId, userId, User, rating, text, updatedAt }) => {
      const date = new Date(updatedAt);
      return {
        id: `${gameId}-${userId}`,
        reviewer: User.name,
        rating,
        text,
        lastUpdated: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
      };
    }
  );

  return json({ reviews });
}

export default function Game() {
  const { reviews } = useLoaderData<typeof loader>();

  console.log(reviews);
  return (
    <>
      <h2 className="text-xl font-medium">Reviews</h2>
      <ul className="space-y-4 pt-4 pb-6">
        {reviews.map(({ id, reviewer, rating, text, lastUpdated }) => (
          <li
            key={id}
            className="flex divide-x divide-teal-300 divide-opacity-50 gap-2"
          >
            <div className="w-28 space-y-1">
              <span className="font-semibold text-teal-800">{reviewer}</span>
              <span className="font-extralight block">{rating} / 5</span>
            </div>
            <p className="pl-2 text-lg font-light text-gray-800">
              {text}
              <span className="italic font-thin block pt-2 text-sm text-gray-900">
                Last updated on {lastUpdated}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
