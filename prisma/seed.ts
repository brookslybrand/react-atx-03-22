import type { Game } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const userPromise = prisma.user.create({
    data: {
      name: "Brooks",
      email: "brookslybrand@gmail.com",
      password: await bcrypt.hash("remixrox", 10),
      role: "admin",
    },
  });

  const gameTransactions = gamesData.map((game) =>
    prisma.game.create({ data: game })
  );
  const gamesPromise = prisma.$transaction(gameTransactions);
  const [user, games] = await Promise.all([userPromise, gamesPromise]);

  await createReviews(prisma, user.id, games);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

function createReviews(prisma: PrismaClient, userId: string, games: Game[]) {
  let reviewTransactions = [];
  for (const game of games) {
    const createReviewData = ({
      text,
      rating,
    }: {
      text: string;
      rating: number;
    }) => ({
      data: { userId, gameId: game.id, text, rating },
    });
    switch (game.name) {
      case "Frosthaven": {
        reviewTransactions.push(
          prisma.review.create(
            createReviewData({
              text: "Really enjoying playing this game! Already put an embarrasing amount of time into it and I've only had it for 2 weeks",
              rating: 5,
            })
          )
        );
        break;
      }
      case "Gloomhaven": {
        reviewTransactions.push(
          prisma.review.create(
            createReviewData({
              text: "I have played through an entire campaign and almost all the way through another. I have maybe played this game too much...",
              rating: 5,
            })
          )
        );
        break;
      }
      case "Codenames": {
        reviewTransactions.push(
          prisma.review.create(
            createReviewData({
              text: "This game is mediocre, I don't know why people like it so much",
              rating: 3,
            })
          )
        );
        break;
      }
      case "Patchwork": {
        reviewTransactions.push(
          prisma.review.create(
            createReviewData({
              text: "Really enjoyable 2 player game. Perfect length of time, blending competition and problem solving.",
              rating: 5,
            })
          )
        );
        break;
      }
      case "CATAN": {
        reviewTransactions.push(
          prisma.review.create(
            createReviewData({
              text: "It probably deserves less starts, but it was my first love",
              rating: 4,
            })
          )
        );
        break;
      }
    }
  }
  return prisma.$transaction(reviewTransactions);
}

//  For demo purposes, I'm stealing from BoardGameGeek.com
const gamesData: Omit<Game, "id">[] = [
  {
    name: "Frosthaven",
    description:
      "Frosthaven is the story of a small outpost far to the north of the capital city of White Oak, an outpost barely surviving the harsh weather as well as invasions from forces both known and unknown. There, a group of mercenaries at the end of their rope will help bring back this settlement from the edge of destruction. Not only will they have to deal with the harsh elements, but there are other, far more dangerous threats out in the unforgiving cold as well. There are Algox, the bigger, more yeti-like cousins of the Inox, attacking from the mountains; Lurkers flooding in from the northern sea; and rumors of machines that wander the frozen wastes of their own free will. The party of mercenaries must face all of these perils, and perhaps in doing so, make peace with these new races so they can work together against even more sinister forces.",
    imageUrl:
      "https://cf.geekdo-images.com/iEBr5o8AbJi9V9cgQcYROQ__imagepage/img/3h7303cwluGrIhEN6x-wNEWqbng=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6177719.jpg",
  },
  {
    name: "Gloomhaven",
    description:
      "Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and their own reasons for traveling to this dark corner of the world. Players must work together out of necessity to clear out menacing dungeons and forgotten ruins. In the process, they will enhance their abilities with experience and loot, discover new locations to explore and plunder, and expand an ever-branching story fueled by the decisions they make.",
    imageUrl:
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__imagepage/img/pBaOL7vV402nn1I5dHsdSKsFHqA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2437871.jpg",
  },
  {
    name: "Codenames",
    description: `Codenames is an easy party game to solve puzzles.
      The game is divided into red and blue, each side has a team leader, the team leader's goal is to lead their team to the final victory.
      At the beginning of the game, there will be 25 cards on the table with different words. Each card has a corresponding position, representing different colors.
      Only the team leader can see the color of the card. The team leader should prompt according to the words, let his team members find out the cards of their corresponding colors, and find out all the cards of their own colors to win.`,
    imageUrl:
      "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__imagepage/img/rc_Do8f5v41nWEGcwHE1eKAkIfI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2582929.jpg",
  },
  {
    name: "Patchwork",
    description:
      "In Patchwork, two players compete to build the most aesthetic (and high-scoring) patchwork quilt on a personal 9x9 game board. To start play, lay out all of the patches at random in a circle and place a marker directly clockwise of the 2-1 patch. Each player takes five buttons — the currency/points in the game — and someone is chosen as the start player.",
    imageUrl:
      "https://cf.geekdo-images.com/wLW7pFn0--20lEizEz5p3A__imagepage/img/qDuX2TRjK3utCghPRUfrG42fcFk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2270442.jpg",
  },
  {
    name: "CATAN",
    description:
      "In CATAN (formerly The Settlers of Catan), players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what resources the island produces. Players build by spending resources (sheep, wheat, wood, brick and ore) that are depicted by these resource cards; each land type, with the exception of the unproductive desert, produces a specific resource: hills produce brick, forests produce wood, mountains produce ore, fields produce wheat, and pastures produce sheep.",
    imageUrl:
      "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__imagepage/img/M_3Vg1j2HlNgkv7PL2xl2BJE2bw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2419375.jpg",
  },
];
