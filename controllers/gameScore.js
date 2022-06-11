import model from "../src/models";

//update the current score & personal best of the player (increase score)
export async function increaseScore(req, res) {
  const loggedInUserID = req.cookies.userID;
  const currentScore = 2;
  let updatedPersonalBest;
  try {
    const user = await model.User.findByPk(loggedInUserID);
    if (user.personalBest < currentScore) {
      updatedPersonalBest = currentScore;
    } else {
      updatedPersonalBest = user.personalBest;
    }

    const updatedUser = await model.User.update(
      {
        currentScore,
        personalBest: updatedPersonalBest,
      },
      {
        where: {
          id: Number(loggedInUserID),
        },
        returning: true,
      }
    );

    const updatedUserData = updatedUser[1].map((Item) => ({
      ...Item.dataValues,
    }));
    console.log(updatedUserData);

    res.send({
      currentScore: updatedUserData[0].currentScore,
      personalBest: updatedUserData[0].personalBest,
    });
  } catch (error) {
    console.log(error);
  }
}
//get current score and update best score
export async function displayScore(req, res) {
  const loggedInUserID = req.cookies.userID;
  try {
    const users = await model.User.findAll();

    const loggedInUser = users.find(
      (user) => user.id === Number(loggedInUserID)
    );

    const leader = users.reduce(function (prev, current) {
      return prev.currentScore > current.currentScore ? prev : current;
    });

    res.send({
      bestScore: leader.currentScore,
      bestPlayer: leader.name,
      currentScore: loggedInUser.currentScore,
      personalBest: loggedInUser.personalBest,
    });
  } catch (error) {
    console.log(error);
  }
}

//reset current score to 0
export async function gameOver(req, res) {
  const loggedInUserID = req.cookies.userID;
  try {
    const updatedUser = await model.User.update(
      {
        currentScore: 0,
      },
      {
        where: {
          id: Number(loggedInUserID),
        },
        returning: true,
      }
    );

    res.send({ updatedUser });
  } catch (error) {
    console.log(error);
  }
}
