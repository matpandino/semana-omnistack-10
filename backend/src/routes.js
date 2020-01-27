const { Router } = require('express')
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router()

routes.post('/devs', DevController.store)
routes.put('/devs', DevController.update)
routes.get('/devs', DevController.index)

routes.get('/dev/:id', DevController.show)
routes.delete('/dev/:id', DevController.destroy)

routes.get('/search', SearchController.index)

module.exports = routes