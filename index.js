require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Phonenumber = require('./models/phonenumber')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  if(req.method === 'POST'){
    console.log('posting..')
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ')
}))

app.get('/info', (req, res, next) => {
  Phonenumber.find({})
    .then(numbers => {
      res.send(`<p>Phonebook has info for ${numbers.length} people</p>`)
    })
    .catch(error => {
      console.log('Failed to get phonenumbers')
      next(error)
    })
})
  
app.get('/api/persons', (req, res, next) => {
  Phonenumber.find({})
    .then(numbers => {
      res.json(numbers)
    })
    .catch(error => {
      console.log('Failed to get phonenumbers')
      next(error)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Phonenumber.findById(req.params.id)
    .then(number => {
      console.log(number)
      // res.json(number)
      if (number) {
        res.json(number)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Phonenumber.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log('Adding to phonebook:', body)

  if(!body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }
  if(!body.name){
    return res.status(400).json({
      error: 'name missing'
    })
  }

  const person = new Phonenumber({
    name: body.name,
    number: body.number
  })

  person.save().then(result => {
    console.log(result)
    res.json(person)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  console.log('updating...')
  const body = req.body

  const number = {
    name: body.name,
    number: body.number
  }
  Phonenumber.findByIdAndUpdate(req.params.id, number, {new: true})
  .then(updatedNumber => {
    console.log('Updated number: ', updatedNumber)
    res.json(updatedNumber)
  })
  .catch(error => next(error))
})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//#### Error handling #####

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  
  next(error)
}
// virheellisten pyyntöjen käsittely
app.use(errorHandler)