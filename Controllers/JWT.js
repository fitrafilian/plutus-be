const JWT = require("jsonwebtoken");
const SecretKey = process.env.Key;

const JWTCreate = (Data = null, res = null) => {
  let TokenData = JWT.sign(Data, SecretKey);
  return TokenData;
};

const JWTCheck = (Data = null, res = null) => {
  let JWTCheckData = JWT.verify(Data, SecretKey, (err, JWTResult) => {
    if (err) return { message: "jwt error", status: 403 };
    if (JWTResult)
      return {
        message: "success to checking jwt",
        data: JWTResult,
        status: 200,
      };
  });

  return JWTCheckData;
};

const getUserData = (authToken) => {
  return JWT.verify(authToken, SecretKey);
};

module.exports = { JWTCreate, JWTCheck, getUserData };
