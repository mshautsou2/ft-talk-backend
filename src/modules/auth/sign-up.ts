import { getDBManager } from "src/config/database-connection";
import { BadRequestError } from "src/errors/BadRequest";
import { MoreThan } from "typeorm";
import { UserModel } from "../users/_models/user.model";
import { SignUpEndpoint } from "../../../ft-talk-shared/src/functions/auth/sign-up";

export const signUpHandler: SignUpEndpoint = async ({
  username,
  password,
  phoneNumber,
  fullName,
}) => {
  console.log(username, password, phoneNumber);

  const userExists = await isUsernameTaken(username);
  if (userExists) {
    return {
      success: false,
      status: 'USERNAME_EXISTS',
    };
  }

  const phoneNumberExists = await isPhoneNumberTaken(phoneNumber);
  if (phoneNumberExists) {
      return {
          success: false,
          status: 'PHONE_NUMBER_EXISTS'
      }
  }

  await getDBManager().save(new UserModel({
    fullName,
    username,
    password,
    phoneNumber
  }))
  return {
      success: true,
      status: 'CREATED',
  }
};

function requestVerification(phoneNumber: string) {
  throw new Error("Function not implemented.");
}

async function isUsernameTaken(username: string) {
  return (
    (await getDBManager().findOne(UserModel, {
      where: [
        {
          username,
        },
      ],
    })) !== undefined
  );
}

async function isPhoneNumberTaken(phoneNumber: string) {
  return (
    (await getDBManager().findOne(UserModel, {
      where: [
        {
          phoneNumber,
        },
      ],
    })) !== undefined
  );
}
