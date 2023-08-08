const express = require('express')
const app = express()

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
    },
    {
      "name": "Test Name",
      "number": "39-23-6423122",
      "id": 5
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
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })