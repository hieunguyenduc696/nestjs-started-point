import { NestMiddleware, Injectable } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { UsersService } from 'users/users.service';
import { UserEntity } from 'users';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.user = user;
    }

    next();
  }
}
