import { ObjectId } from "@mikro-orm/mongodb";
import { Service } from "typedi";
import { GqlContext } from "../constants";
import { Post } from "../entities/post.entity";
import { PostCreateInput, PostDeleteInput, PostFetchInput, PostModifyInput, FetchType } from "../inputs/post.input";

@Service()
export class PostService {
    async create(
        { em, options, req }: GqlContext & { options: PostCreateInput } 
    ): Promise<Post> {
        // Check if post that is user replying to exist
        if(options.isReplyTo) {
            const replyingTo: Post | null = await em.findOne(Post, {
                _id: new ObjectId(options.isReplyTo)
            });

            if(!replyingTo) throw new Error("Post you are replying to does not exist!");

            // TODO: Check if post is private and user is following him
        };

        options.author = req.user._id;
        let newPost: Post = em.create(Post, options);

        await em.persistAndFlush(newPost);

        return newPost;
    }

    async delete(
        { options, em, req }: GqlContext & { options: PostDeleteInput } 
    ): Promise<Boolean> {
        const found = await em.findOne(Post, {
            _id: new ObjectId(options._id)
        });

        if(!found) throw new Error("This post does not exist!");

        if(!found.author.equals(req.user._id)) {
            throw new Error("You don't have permissions to delete this post!");
        };

        await em.nativeDelete(Post, {
            _id: new ObjectId(options._id)
        });

        return false;
    }

    async modify(
        { options, em, req }: GqlContext & { options: PostModifyInput }
    ) {
        const found: Post | null = await em.findOne(Post, {
            _id: new ObjectId(options._id)
        });

        if(!found || !found.author.equals(req.user._id))
            throw new Error("You can't edit this post!");

        await em.nativeUpdate(
            Post,
            {
                _id: new ObjectId(options._id)
            },
            {
                content: !options.content || (options.content == found.content)
                    ? found.content
                    : options.content,

                private: options.private
                    ? options.private
                    : found.private,
            }
        );

        return found;
    }

    async fetch(
        { em, options }: GqlContext & { options: PostFetchInput }
    ): Promise<Post[]> {
        /*
            TODO: Show private posts of users that have request author in friends
            Only do after the friends part of this application is done
        */
        const query: any = {
            ...options['type'] == FetchType.GLOBAL && {
                private: false
            },
            ...options['type'] == FetchType.FEED && {
                author: new ObjectId(options.byUser)
            }
        };

        return await em.find(
            Post, 
            query,
            {
                offset: (options.page - 1) * options.perPage,
                limit: options.perPage
            }
        );
    }
}