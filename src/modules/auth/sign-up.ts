
import { getDBManager } from 'src/config/database-connection';
import { BadRequestError } from 'src/errors/BadRequest';
import { MoreThan } from 'typeorm';
import {  SignUpEndpoint, SignUpRequest, SignUpResponse } from '../../../ft-talk-shared/modules/auth/sign-up'
import { UserModel } from '../users/_models/user.model';

export const signUp: SignUpEndpoint = async ({ username, password, phoneNumber }) => {
    let user = await getDBManager().findOne(UserModel, {
        where: [
          {
            username,
            verified: true,
          }
        ],
      });
      if (user) {
        throw new BadRequestError(`USERNAME_ALREADY_EXISTS`);
      }

      user = await getDBManager().findOne(UserModel, {
        phoneNumber,
        verified: true,
      });
      if (user) {
        throw new BadRequestError(`PHONE_NUMBER_ALREADY_EXISTS`);
      }

      user = await getDBManager().findOne(UserModel, {
        lastVerificationDate: MoreThan(new Date(Date.now() - 30_000)),
      })

      if (user) {
        throw new BadRequestError(`TOO_FREQUENT_VERIFICATION_REQUESTS`);
      }
      await requestVerification(phoneNumber);

      await getDBManager().delete(UserModel, {
        verified: false,
        phoneNumber,
        username,
      });
      await getDBManager().save(
        new UserModel({
          username,
          phoneNumber,
          password,
          verified: false,
          lastVerificationDate: new Date(),
        })
      );
      return {
          success: true,
        message: "Verification requested",
      };
}

function requestVerification(phoneNumber: string) {
    throw new Error('Function not implemented.');
}
