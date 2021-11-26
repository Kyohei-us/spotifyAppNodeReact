import { NextFunction, Request, Response, Router } from 'express';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
// import { getArtistTopTracks, getCurrent, searchArtist } from './Spotify';
import passport from 'passport';
import { googleAuthCallback, youtubeGetDLURLWrapper, youtubeGetLikedVideosWrapper, youtubeGetPlaylists, youtubeListVideoDLURLs, youtubeGetChannel, youtubeGetTopPopularVideosForChannelById, youtubeGetLikedVideosEjs, youtubeListVideoDLURLSEjs, youtubeGetSubscriptions } from './Youtube';

// User-route
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);


function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    console.log("check if authed")
    if (req.isAuthenticated()) {
        console.log("authed")
        return next();
    }
    console.log("not authed")
    res.redirect('/login')
}


// Youtube-route
const youtubeRouter = Router();
youtubeRouter.get('/auth/youtube', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/youtube.readonly']
}));
youtubeRouter.get('/auth/youtube/callback', passport.authenticate('google', {
    failureRedirect: '/',
    session: true
}), googleAuthCallback);
youtubeRouter.get('/getPlaylists', ensureAuthenticated, youtubeGetPlaylists)
youtubeRouter.get('/getChannels', ensureAuthenticated, youtubeGetChannel)
youtubeRouter.get('/getLikedVideos', ensureAuthenticated, youtubeGetLikedVideosWrapper)
youtubeRouter.get('/getLikedVideosEjs', ensureAuthenticated, youtubeGetLikedVideosEjs) // return ejs
youtubeRouter.get('/getURL/:video_id', ensureAuthenticated, youtubeGetDLURLWrapper); // return html
youtubeRouter.get('/listLiked', ensureAuthenticated, youtubeListVideoDLURLs) // return html
youtubeRouter.get('/listLikedEjs', ensureAuthenticated, youtubeListVideoDLURLSEjs) // return ejs
youtubeRouter.get('/getPopularVideosByChannelId/:channel_id', ensureAuthenticated, youtubeGetTopPopularVideosForChannelById);
youtubeRouter.get('/getSubscriptions', ensureAuthenticated, youtubeGetSubscriptions)

// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', userRouter);
// baseRouter.use('/spotify', spotifyRouter)
baseRouter.use('/youtube', youtubeRouter)
export default baseRouter;
