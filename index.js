'use strict';
require('dotenv').config();
const Snoowrap = require('snoowrap');
const express = require('express')
const app = express()
const port = process.env.PORT || 3131
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const r = new Snoowrap({
    userAgent: 'Cute-app',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
})


app.get('/', (req, res, next) => {
    res.json({
        message: 'Running'
    })
})
app.get('/awww', (req, res, next) => {
    r.getHot('aww').map(post => post).then(post => {
        const newposts = post.splice(2)
        let i = 1
        let array = []
        newposts.map((post) => {
            let videoPosts = new Object()
            let urlEnd = post.url.slice(-3)
            if(post.preview.reddit_video_preview !== undefined){
                // post.preview.reddit_video_preview !== undefined
                videoPosts.id = i
                videoPosts.video = post.preview.reddit_video_preview.fallback_url
                videoPosts.title = post.title
                array.push(videoPosts)
                i++
                // console.log("preview",post.preview.reddit_video_preview.fallback_url)
            } else if(post.secure_media && post.secure_media.reddit_video !== undefined){
                videoPosts.id = i
                videoPosts.video = post.secure_media.reddit_video.fallback_url
                videoPosts.title = post.title
                array.push(videoPosts)
                i++
                // console.log("no video", post.secure_media.reddit_video.fallback_url)
            } else if(urlEnd === 'gif'){
                videoPosts.id = i
                videoPosts.video = post.url
                videoPosts.title = post.title
                array.push(videoPosts)
                i++ 
            }
        })
    return res.json({aww: array})
    })
    .catch(err => console.error('before general error:',err))
})

app.get('/starwars', (req, res, next) => {
    r.getHot('PrequelMemes').map(post => post).then(post => {
        const newposts = post.splice(2)
        let i = 1
        let array = []
        newposts.map((post) => {
            let urlPre = post.url.slice(8,14)
            if(post.url && (urlPre !== 'i.imgu' && urlPre !=='imgur.' && urlPre !== 'v.redd')){
            let videoPosts = new Object()
                videoPosts.id = i
                videoPosts.image = post.url
                videoPosts.title = post.title
                array.push(videoPosts)
                i++
            } 
        })
    return res.json({meme: array})
    })
    .catch(err => console.error('before general error:',err))
})


app.use(notFound);
app.use(errorHandler);

function notFound(err, req, res, next) {
    res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl})
}

function errorHandler(err, req, res, next) {
    console.error('NOPE, LOL', err)
    const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined
    res.status(500).send({error: err.message, stack, url: req.originalUrl})
}


app.listen(port, () => {
    process.env.NODE_ENV !== 'production' ?
    console.log(`I got you on http://localhost:${port}`) :
    console.log(`I got you on https://`)
})

