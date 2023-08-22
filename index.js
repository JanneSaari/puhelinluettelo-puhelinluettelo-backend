const express = require('express')
const app = express()
const morgan = require('morgan')

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

let phonenumbers = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

  app.get('/info', (req, res) => {
    const count = phonenumbers.length
    res.send(`<p>Phonebook has info for ${count} people</p>`)
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(phonenumbers)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const number = phonenumbers.find(number => number.id === id)
    
    if (number) {
      res.json(number)
    } else {
      res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    numbers = phonenumbers.filter(number => number.id !== id)
    phonenumbers = numbers
  
    res.status(204).end()
  })

  app.post('/api/persons', (req, res) => {
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

    if(phonenumbers.some(person => person.name === body.name)){
      return res.status(400).json({
        error: `person with name: ${body.name} is already in phonebook`
      })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateID()
    }

    phonenumbers = phonenumbers.concat(person)
    res.json(person)
  })

  const generateID = () => {
    const maxID = 1000000
    return Math.floor((Math.random() * maxID))
  }
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })