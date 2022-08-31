import * as activity from './activity.service';
import * as anime from './anime.service';
import * as character from './character.service';
import * as post from './post.service';
import * as relationship from './relationship.service';
import * as user from './user.service';

export default [
    activity.ActivityService,
    anime.AnimeService,
    anime.fetchAnimeCharacters,
    anime.getUsersAnimeList,
    character.CharacterService,
    post.PostService,
    relationship.RelationshipService,
    user.UserService
];