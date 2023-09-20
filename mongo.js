// const res = require('express/lib/response')
const mongoose = require('mongoose')

// Too few arguments
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
else if(process.argv.length > 5) {
  console.log('Too many arguments')
  process.exit(1)
}
else if (process.argv.length === 4) {
  console.log('Not enough arguments, give password, name and number, or just a password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://phonebook:${password}@phonebook.hywuyjy.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Number = mongoose.model('Number', numberSchema)


//Only one argument(pw), print phonebook
if(process.argv.length === 3) {
  Number.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(number => {
      console.log(`${number.name} ${number.number}`)
    })
    mongoose.connection.close()
  })
}
//3 extra arguments(pw, name, number), add person to the phonebook
else if (process.argv.length === 5){
  const name = process.argv[3]
  const number = process.argv[4]

  console.log(name)
  console.log(number)
  const newNumber = new Number({
    name: name,
    number: number,
  })
  newNumber.save().then(result => {
    console.log(result)
    console.log(`added ${name} to the phonebook!`)
    mongoose.connection.close()
  })
}