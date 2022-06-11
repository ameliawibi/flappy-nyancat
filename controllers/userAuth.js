import "dotenv/config";
import { getHashString, getHashedCookie } from "../utility/hash";
import model from "../src/models";

const salt = process.env.SECRET_KEY;

export async function postSignup(req, res) {
  try {
    if (req.body.psw2 === null || req.body.uname2 === null) {
      return;
    }
    const hashedPassword = getHashString(req.body.psw2);

    await model.User.create({
      name: req.body.uname2,
      password: hashedPassword,
    });
    return res.status(200).send({
      message: "Signed up successfully.",
    });
  } catch (error) {
    console.log(error);
    console.log("Not signed up");
  }
}

export async function postLogin(req, res) {
  try {
    const values = [req.body.uname.toLowerCase()];
    const userLoggedIn = await model.User.findOne({ where: { name: values } });
    if (userLoggedIn === null) {
      console.log("Not logged in");
      return;
    }
    const hashedPassword = getHashString(req.body.psw);
    if (userLoggedIn.password === hashedPassword) {
      res.cookie("userID", `${userLoggedIn.id}`);
      const hashedCookieString = getHashedCookie(userLoggedIn.id, salt);
      res.cookie("loggedInHash", hashedCookieString);
      res.send({ userLoggedIn });
    } else {
      console.log("Not logged in");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function logout(_req, res) {
  res.clearCookie("loggedInHash");
  res.clearCookie("userID");
  res.end();
}
