import { 
    AuthResponse,
    LoginInput,
    MeResponse,
    RegisterInput,
    ToggleInput, 
    ToggleResponse 
} from '../inputs/user.inputs';
import { ObjectId } from '@mikro-orm/mongodb';
import { GqlContext } from '../constants';
import { User } from '../entities/user.entity';
import { 
    loginSchema,
    registerSchema
} from '../validations/user.validation';
import { sign } from 'jsonwebtoken';
import { hash, verify } from 'argon2';
import { AvailableIndexes, indexDocument } from '../utils/indexer';

export async function registerService(
    { res, em, options, elastic }: GqlContext & { options: RegisterInput }
): Promise<AuthResponse> {
    if(!process.env.JWT_SECRET) {
        return {
            errors: [{
                message: "Something went wrong during authentication, please try again later."
            }]
        }
    }

    const { error } = registerSchema.validate(options, {
        abortEarly: false
    });
    if(error) {
        return {
            errors: error.details.map(el => {
                return {
                    message: el.message,
                    field: el.path.toString()
                }
            })
        }
    }

    const newUser = em.create(User, <any>options);

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
    res.setHeader("Set-Cookie", `token=Bearer ${token};`);

    return {
        user: newUser
    };
}

export async function loginService(
    { res, em, options }: GqlContext & { options: LoginInput }
): Promise<AuthResponse> {
    if(!process.env.JWT_SECRET) {
        return {
            errors: [{
                message: "Something went wrong during authentication, please try again later."
            }]
        }
    }

    const { error } = loginSchema.validate(options, {
        abortEarly: false
    });
    if(error) {
        return {
            errors: error.details.map(el => {
                return {
                    message: el.message,
                    field: el.path.toString()
                }
            })
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
    res.setHeader("Set-Cookie", `token=Bearer ${token};`);

    return {
        user: user
    };
}

export async function meService(
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

export async function toggleAnimeStatusService(
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

    return {
        success: true
    };
}