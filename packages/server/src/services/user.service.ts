import { AvailableIndexes, indexDocument } from '../utils/indexer';
import { Activity, ActivityType } from '../entities/activity.entity';
import { ObjectId } from '@mikro-orm/mongodb';
import { GqlContext } from '../constants';
import { User } from '../entities/user.entity';
import { sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { Service } from 'typedi';
import sharp from 'sharp';
import fs from 'node:fs';
import { 
    AuthResponse,
    LoginInput,
    MeResponse,
    RegisterInput,
    ToggleInput, 
    ToggleResponse 
} from '../inputs/user.inputs';
import * as uuid from 'uuid';

@Service()
export class UserService {
    async register(
        { res, em, options, elastic }: GqlContext & { options: RegisterInput }
    ): Promise<AuthResponse> {
        if(!process.env.JWT_SECRET) {
            return {
                errors: [{
                    message: "Something went wrong during authentication, please try again later."
                }]
            }
        }
    
        const newUser = em.create(User, <any>options);

        let avatarBase64: String | null = null;

        // Compress and resize avatar image if exists 
        if(options.avatar) {
            await sharp(Buffer.from(options.avatar || "", 'base64'), {
                animated: true
            })
                .resize(170, 170, {
                    fit: 'cover'
                })
                .png({
                    quality: 40,
                    compressionLevel: 9
                })
                .toBuffer()
                .then((data: Buffer) => {
                    avatarBase64 = data.toString('base64');
                })
                .catch(_ => {
                    throw new Error("Cannot process your avatar image");
                });
        }
    
        const existingUser = await em.findOne(User, {
            email: options.email
        });
        if(existingUser) {
            return {
                errors: [{
                    message: 'User with this email does already exist!',
                    field: 'email'
                }]
            }
        } 
    
        try {
            newUser.password = await hash(newUser.password);
        } catch(_) {
            return {
                errors: [{
                    field: 'password',
                    message: 'Server-side error happened while hashing password!'
                }]
            };
        }
    
        try {
            // Create index for the document and assign it to it
            const indexId: String = await indexDocument(
                AvailableIndexes.USER,
                newUser,
                elastic
            );
            newUser.index = indexId;
    
            await em.persistAndFlush(newUser);
        } catch(e_) {
            return {
                errors: [{
                    message: 'Error happened while saving user document!'
                }]
            }
        }
    
        const token = sign({ _id: newUser._id }, process.env.JWT_SECRET);
        res.setHeader("Set-Cookie", `token=Bearer ${token};SameSite=None; Secure;`);

        // Save user avatar
        if(avatarBase64) {
            options.avatar = uuid.v4();
            
            fs.writeFile(
                `static/avatar/${options.avatar}.png`, 
                Buffer.from(avatarBase64, 'base64'),
                function(_) {
                    return;
                }
            );
        }
    
        return {
            user: newUser
        };
    }

    async login(
        { res, em, options }: GqlContext & { options: LoginInput }
    ): Promise<AuthResponse> {
        if(!process.env.JWT_SECRET) {
            return {
                errors: [{
                    message: "Something went wrong during authentication, please try again later."
                }]
            }
        }
    
        const user = await em.findOne(User, {
            email: options.email
        });
    
        if(!user) {
            return {
                errors: [{
                    field: 'email',
                    message: 'User with this email does not exist!'
                }]
            }
        }
    
        const compared = await verify(user.password, options.password);
        if(!compared) {
            return {
                errors: [{
                    field: 'password',
                    message: 'The password you entered is not a valid one!'
                }]
            };
        }
        
        const token = sign({ _id: user._id }, process.env.JWT_SECRET);
        res.setHeader("Set-Cookie", `token=Bearer ${token};SameSite=None; Secure;`);
    
        return {
            user: user
        };
    }

    async me(
        { req, em }: GqlContext
    ): Promise<MeResponse> {
        if(!req.user) {
            return {
                errors: [{
                    message: "Cookie with your _id was not send, maybe the credential option is set to false!"
                }]
            };
        }
    
        const user = await em.findOne(User, {
            _id: req.user._id
        });
    
        if(!user) {
            return {
                errors: [{
                    message: "User cannot be found!"
                }]
            }
        }
    
        return {
            user: user
        };
    }

    async toggleAnimeStatus(
        { options, req, em }: GqlContext & { options: ToggleInput }
    ): Promise<ToggleResponse> {
        if(!["watching", "dropped", "completed", "planning"].includes(options.type)) {
            return {
                errors: [{
                    field: "type",
                    message: "Please provide a valid activity type!"
                }]
            }
        }
    
        if(!ObjectId.isValid(options.animeId.toString())) {
            return {
                errors: [{
                    field: "animeId",
                    message: "Provided id of anime is not valid!"
                }]
            };
        }
    
        const objectAnimeId = new ObjectId(options.animeId.toString());
    
        // Check if user is watches the anime or not
        if(req.user[options.type].filter((el: any) => el.equals(objectAnimeId)).length > 0) {
            const i: number = req.user[options.type].indexOf(objectAnimeId);
            req.user[options.type].splice(i, 1);
        } else {
            req.user?.[options.type].push(objectAnimeId);
        }
    
        await em.nativeUpdate(User, {
            _id: req.user?._id
        }, {
            [options.type]: req.user?.watching
        });
    
        const newActivity = em.create(Activity, {
            anime: objectAnimeId,
            boundTo: req.user._id,
            type: ActivityType.ANIME,
            animeActivityType: options.type
        });
        await em.persistAndFlush(newActivity);
    
        return {
            success: true
        };
    }
}