import { NextFunction, Request, Response } from "npm:express";
import { UserRules } from "./UserRules.ts";
import { QueryOptions } from "mongoose";
import { UserService } from "./UserService.ts";
import { User } from '../../models/User/User.ts'
import { IUser } from '../../models/User/IUser.ts'

export class UserController {
  private userService: UserService;

  private rules: UserRules;

  constructor({
    userService = new UserService(),
    rules = new UserRules(),
  } = {}) {
    this.userService = userService;
    this.rules = rules;
  }

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;

      const found = await this.userService.findById(id);

      return res.send_ok("Usuário encontrado", {
        user: found,
      });
    } catch (error) {
      next(error);
      return error;
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let options: QueryOptions = {};

      if (req.pagination) {
        if (req.pagination) {
          const limit = req.pagination.limit ?? 10;
          const page = Math.max(1, req.pagination.page ?? 1);
          const skip = (page - 1) * limit; 

          options = {
            limit,
            skip,
          };
        }
      }

      const found = await this.userService.findAll(options);

      return res.send_ok("Usuários encontrados", {
        users: found,
      });
    } catch (error) {
      next(error);
      return error;
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, balance } = req.body;

      this.rules.validate(
        { name },
        { email },
        { password },
        { balance, isRequiredField: false }
      );

      const newUser = new User({ name, email, password, balance });

      const created = await this.userService.create(newUser);

      return res.send_created("Usuário criado", {
        user: created,
      });
    } catch (error) {
      next(error);
      return error;
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;

      const { name, email, balance } = req.body;

      this.rules.validate(
        { name, isRequiredField: false },
        { email, isRequiredField: false },
        { balance, isRequiredField: false }
      );

      const update: Partial<IUser> = {
        email,
        name,
        balance,
      };

      const updated = await this.userService.update(id, update);

      return res.send_ok("Usuário atualizado", {
        user: updated,
      });
    } catch (error) {
      next(error);
      return error;
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;

      const excluded = await this.userService.remove(id);

      return res.send_ok("Usuário removido", {
        user: excluded,
      });
    } catch (error) {
      next(error);
      return error;
    }
  };
}
