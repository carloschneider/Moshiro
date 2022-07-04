import { 
    Arg, 
    Authorized, 
    Ctx, 
    Mutation, 
    Query, 
    Resolver 
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
import { 
    toggleAnimeStatusService,
    meService,
    loginService,
    registerService
} from '../services/user.service';

@Resolver()
export class UserResolver {
    @Authorized(["USER"])
    @Mutation(() => ToggleResponse)
    async toggleAnimeStatus(
        @Ctx() { req, res, em, redis, elastic }: GqlContext,
        @Arg('options') options: ToggleInput
    ): Promise<ToggleResponse> {
        return toggleAnimeStatusService({ req, em, res, options, redis, elastic });
    }

    @Authorized(["USER"])
    @Query(() => MeResponse)
    async me(
        @Ctx() { em, req, res, redis, elastic }: GqlContext
    ): Promise<MeResponse> {
        return meService({ em, req, res, redis, elastic });
    }

    @Mutation(() => AuthResponse)
    async register(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: RegisterInput
    ): Promise<AuthResponse> {
        return registerService({ req, em, options, res, redis, elastic });
    }

    @Mutation(() => AuthResponse)
    async login(
        @Ctx() { em, res, req, redis, elastic }: GqlContext,
        @Arg('options') options: LoginInput
    ): Promise<AuthResponse> {
        return loginService({ res, em, options, req, redis, elastic });
    }
}