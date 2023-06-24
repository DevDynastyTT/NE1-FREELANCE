const cookie = require('cookie')
const jwt = require('jsonwebtoken')

const secret = "my-secret";

export function setSession(res, session) {
  console.log('Session  going\n', res)
  const token = jwt.sign(session, secret);
  const cookieValue = cookie.serialize("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "strict",
    path: "/",
  });
  res.setHeader("Set-Cookie", cookieValue);
}

export function getSession(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.session;
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

export function destroySession(res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );
}
