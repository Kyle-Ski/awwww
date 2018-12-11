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
            if(post.preview.reddit_video_preview){
                videoPosts.id = i
                videoPosts.video = post.preview.reddit_video_preview.fallback_url
                array.push(videoPosts)
                i++
                // console.log("preview",post.preview.reddit_video_preview.fallback_url)
            } else if(post.secure_media){
                videoPosts.id = i
                videoPosts.video = post.secure_media.reddit_video.fallback_url
                array.push(videoPosts)
                i++
                // console.log("no video", post.secure_media.reddit_video.fallback_url)
            }
        })
    return res.json({aww: array})
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

// const posts = [
//     {
//         id: 1,
//         video: 'https://v.redd.it/c3av66gwcn321/DASH_2_4_M?source=fallback'
//     },
//     { 
//         id: 2, 
//         video: 'https://v.redd.it/fneeqqxvsm321/DASH_4_8_M' 
//     },
//     {
//         id: 3,
//         video: 'https://v.redd.it/ccsmw5yw7m321/DASH_4_8_M?source=fallback'
//     },
//     { 
//         id: 4, 
//         video: 'https://v.redd.it/usbihiu22n321/DASH_4_8_M' 
//     },
//     {
//         id: 5,
//         video: 'https://v.redd.it/pa4ohbar3n321/DASH_2_4_M?source=fallback'
//     },
//     {
//         id: 6,
//         video: 'https://v.redd.it/v3lnatpxrm321/DASH_1_2_M?source=fallback'
//     },
//     {
//         id: 7,
//         video: 'https://v.redd.it/2pwa0djt8l321/DASH_4_8_M?source=fallback'
//     },
//     {
//         id: 8,
//         video: 'https://v.redd.it/n9flk92jpj321/DASH_9_6_M?source=fallback'
//     },
//     { 
//         id: 9, 
//         video: 'https://v.redd.it/fe5m64ytdk321/DASH_9_6_M' 
//     } 
// ]