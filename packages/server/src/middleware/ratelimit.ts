import { Request } from "express";
import { MiddlewareFn, NextFn, ResolverData } from "type-graphql";
import { redis } from '../index'

interface IOptions {
    time: number,
}

export function Ratelimiter(options: IOptions): MiddlewareFn {
    return async (self: ResolverData<{}>, next: NextFn) => {
      const result = await next();

      let op: string = self.info.operation.operation;
      let name: string = self.info.operation.name?.value || "";

      const contextRequest: Request = (<any>self.context).req;
      const ip = contextRequest.headers['x-forwarded-for'] || contextRequest.socket.remoteAddress;

      const count: string | null = await redis.get(`${op}_${name}_${ip}`);
      if(count) {
        if((parseInt(count)) > options.time) {
            throw new Error("You are being ratelimited!");
        }

        redis.incrBy(`${op}_${name}_${ip}`, 1);
      } else {
        redis.setEx(
            `${op}_${name}_${ip}`,
            60,
            "2"
        );
      }

      return result;
    };
  }