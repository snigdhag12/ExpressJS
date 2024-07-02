import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.js";
import { mockUsers } from "../utils/constants.js";
import { comparePass } from '../utils/helpers.js'

passport.serializeUser((user, done) => {
    console.log('serialize section');
    done(null, user.id);//pass something unique that can retrieve the user
})

passport.deserializeUser(async (id, done) => {
    console.log('deserialize section');
    try {
        const findUser = await User.findById(id);
        //const findUser = mockUsers.find((user) => user.id === id);
        if(!findUser) throw new Error("user not found");
        done(null, findUser);
    }catch(err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy(async (username, password, done) => {
        try{
            
        //     const findUser = mockUsers.find((user) => user.username === username);

        const findUser = await User.findOne({username});
        if(!findUser) throw new Error("user not found");
        if(!comparePass(password, findUser.password)){
             throw new Error("Invalid Credentials");
        }
        done(null, findUser);
        }catch(err){
            done(err, null);
        }  
    } )
);