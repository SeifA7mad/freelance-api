import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { CreateUserDto } from 'src/module/users/dto/create-user.dto';
import { UserGooglePayload } from '../dto/user-google-payload.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // const user = {
    //   provider: 'google',
    //   providerId: id,
    //   email: emails[0].value,
    //   name: `${name.givenName} ${name.familyName}`,
    //   picture: photos[0].value,
    // };

    const user: UserGooglePayload = {
      firstName: name.givenName,
      lastName: name.familyName,
      profilePicture: photos[0].value,
      account: {
        email: emails[0].value,
        userName: `${name.givenName}_${name.familyName}`,
      },
    };

    done(null, user);
  }
}
