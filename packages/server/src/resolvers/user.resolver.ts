import { 
    Arg, 
    Authorized, 
    Ctx, 
    Mutation, 
    Query, 
    Resolver, 
    UseMiddleware
} from 'type-graphql';
import { 
    GqlContext 
} from '../constants';
import { 
    RegisterInput, 
    LoginInput, 
    AuthResponse,
    MeResponse,
    ToggleResponse,
    ToggleInput
} from '../inputs/user.inputs';
import { Service } from 'typedi';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Ratelimiter } from '../middleware/ratelimit';

@Service()
@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly service: UserService,
    ){}

    @Authorized(["USER"])
    @Mutation(() => ToggleResponse)
    async toggleAnimeStatus(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: ToggleInput
    ): Promise<ToggleResponse> {
        return this.service.toggleAnimeStatus({ em, req, res, redis, elastic, options });
    }

    @Authorized(["USER"])
    @Query(() => MeResponse)
    async me(
        @Ctx() { em, req, res, redis, elastic }: GqlContext
    ): Promise<MeResponse> {
        return this.service.me({ em, req, res, redis, elastic });
    }

    @Mutation(() => AuthResponse)
    @UseMiddleware(Ratelimiter({ time: 5 }))
    async register(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: RegisterInput
    ): Promise<AuthResponse> {
        return this.service.register({ req, em, options, res, redis, elastic });
    }

    @Mutation(() => AuthResponse)
    async login(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: LoginInput
    ): Promise<AuthResponse> {
        return this.service.login({ req, em, options, res, redis, elastic });
    }
}