import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.js";

passport.serializeUser((user, done) => {
    console.log('serialize section');
    done(null, user.id);//pass something unique that can retrieve the user
})

passport.deserializeUser((id, done) => {
    console.log('deserialize section');
    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if(!findUser) throw new Error("user not found");
        done(null, findUser);
    }catch(err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy((username, password, done) =>{
        try{
            const findUser = mockUsers.find((user) => user.username === username);
        if(!findUser) throw new Error("user not found");
        if(findUser.password !== password){
            throw new Error("Invalid Credentials");
        }
        done(null, findUser);
        }catch(err){
            done(err, null);
        }  
    } )
);