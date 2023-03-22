import type { Review } from "@prisma/client";

// Here for a quick fix, stolen from https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
function roundRating(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function getReviewCountAndRating(reviews: Pick<Review, "rating">[]) {
  const reviewCount = reviews.length;
  return {
    reviewCount,
    avgRating:
      reviewCount > 0
        ? roundRating(
            reviews.reduce((sum, { rating }) => sum + rating, 0) / reviewCount
          )
        : null,
  };
}
