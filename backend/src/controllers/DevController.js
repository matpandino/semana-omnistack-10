const axios = require('axios')
const Dev = require('../models/Dev')
const { findConnections } = require('../websocket')
const parseStringAsArray = require('../utils/parseStringAsArray')

// index, show, store, update, destroy

module.exports = {
    async index(req, res) {
    
        const devs = await Dev.find()

        return res.json(devs)    
    },

    async show(req, res) {
    
        const github_username = req.params.id

        console.log(github_username)
        
        let dev = await Dev.findOne({ github_username })

        if (dev) {
            return res.json({ dev })
        } else {
            return res.json('Developer Not found' )
        }
    },

    async destroy(req, res) {
    
        const github_username = req.params.id

        console.log(github_username)
        
        let dev = await Dev.findOneAndDelete({ github_username })

        if (dev) {
            return res.json({ dev })
        } else {
            return res.json('Developer Not found' )
        }
    },

    async store(req, res) {
        
        const { github_username, techs, latitude, longitude } = req.body
        
        let dev = await Dev.findOne({ github_username })

        if (!dev) {
    
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = apiResponse.data
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
            
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )
    
            console.log(sendSocketMessageTo)
        }

        return res.json({ dev })
    },

    async update(req, res) {
        
        const { github_username, techs, latitude, longitude } = req.body
        
        let dev = await Dev.findOne({ github_username })

        if (dev) {
    
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = apiResponse.data
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.findOneAndUpdate( github_username, {
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            }, { new: true, useFindAndModify: false })
        } else {
            return res.json('Developer do not exists')
        }

        return res.json({ dev })
    }
}