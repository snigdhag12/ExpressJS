import passport from 'passport';
import { Strategy } from 'passport-discord';
import { DiscordUser } from '../mongoose/schemas/discord-user.js';

passport.serializeUser((user, done) => {
    console.log('serialize section');
    done(null, user.id);//pass something unique that can retrieve the user
})

passport.deserializeUser(async (id, done) => {
    console.log('deserialize section');
    try {
        const findUser = await DiscordUser.findById(id);
        //const findUser = mockUsers.find((user) => user.id === id);
        if(!findUser) throw new Error("user not found");
        done(null, findUser);
    }catch(err) {
        done(err, null);
    }
})

export default passport.use(
    new Strategy({
        clientID: '1257903423521554493',
        clientSecret: '2gIIXDeG9Ifk5t-J2JARU68lBK_OOZ_l',
        callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
        scope: ['identify', 'guilds'],
    }, 
    async (accessToken, refreshToken, profile, done) => {
       // console.log(profile);
       let findUser;
       try{
        findUser = await DiscordUser.findOne({discordId: profile.id});
       }catch(err){
            return done(err, null);
       }

       try{
       if(!findUser){
        const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
        });
    const newSavedUser  = await newUser.save();
    return done(null, newSavedUser);
}
return done(null, findUser);
       }catch(err){
         return done(err, null);
       }
    }
    )
)