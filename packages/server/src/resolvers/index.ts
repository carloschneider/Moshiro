import * as activity from './activity.resolver';
import * as anime from './anime.resolver';
import * as character from './character.resolver';
import * as post from './post.resolver';
import * as relationship from './relationship.resolver';
import * as user from './user.resolver';

export default [
    activity.ActivityResolver,
    anime.AnimeResolver,
    character.CharacterResolver,
    post.PostResolver,
    relationship.RelationshipResolver,
    user.UserResolver
];