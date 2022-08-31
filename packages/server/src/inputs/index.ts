import * as activity from './activity.inputs';
import * as anime from './anime.inputs';
import * as character from './character.inputs';
import * as post from './post.input';
import * as relation from './relationship.inputs';
import * as user from './user.inputs';

export default [
    activity.FetchActivitiesInput,
    activity.FetchActivitiesResponse,
    activity.FetchActivityInput,
    activity.FetchActivityResponse,

    anime.CreateAnimeInput,
    anime.DeleteAnimeResponse,
    anime.ErrorType,
    anime.FetchAnimeInput,
    anime.FetchAnimeResponse,

    character.AnimeCharacterListInput,
    character.CharacterSort,
    character.CharactersFetchInput,
    character.CreateCharacterInput,
    character.DeleteCharacterInput,

    post.FetchType,
    post.PostCreateInput,
    post.PostDeleteInput, 
    post.PostFetchInput,
    post.PostModifyInput,

    relation.createRelationInput,
    relation.deleteRelationInput,
    relation.fetchRelationInput,

    user.AuthResponse,
    user.InputActivityType,
    user.ListInput,
    user.LoginInput,
    user.MeResponse,
    user.RegisterInput,
    user.ToggleInput,
    user.ToggleResponse
];