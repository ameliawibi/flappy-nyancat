import model from "../src/models";

//create current score & best score of a player in game state

export async function createScore(req, res) {
  const userID = req.cookies.userID;
  try {
    const currentGame = await model.Game.update(
      {
        gameState: {
          status: "active",
          bestScore: 0,
          currentScore: [{ player: userID, score: 0 }],
        },
      },
      {
        where: {
          id: 1,
        },
        returning: true,
      }
    );
    console.log(currentGame[1][0].dataValues);

    const mainPlayer =
      currentGame[1][0].dataValues.gameState.currentScore.filter(function (el) {
        return el.player === userID;
      });

    console.log(mainPlayer[0].score);

    res.send({
      id: currentGame[1][0].dataValues.id,
      status: currentGame[1][0].dataValues.gameState.status,
      bestScore: currentGame[1][0].dataValues.gameState.bestScore,
      currentScore: mainPlayer[0].score,
    });
  } catch (error) {
    console.log(error);
  }
}

//update the current score of the player (increase score)

//get current score and update best score
