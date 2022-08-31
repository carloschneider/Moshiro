import * as activity from './activity.entity';
import * as anime from './anime.entity';
import * as character from './character.entity';
import * as post from './post.entity';
import * as relationship from './relationship.entity';
import * as user from './user.entity';

export default [
    activity.Activity,
    activity.ActivityType,
    anime.Anime,
    character.Character,
    post.Post,
    relationship.Relationship,
    relationship.RelationshipType,
    user.User
];