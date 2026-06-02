import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(null), 4000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existing) {
      const confirmUpdate = window.confirm(`${existing.name} is already added. Replace the old number?`)
      if (confirmUpdate) {
        const updated = { ...existing, number: newNumber }
        personService.update(existing.id, updated)
          .then(returned => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returned))
            showMessage(`Updated ${returned.name}`)
          })
          .catch(() => {
            showMessage(`Information of ${existing.name} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existing.id))
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService.create(newPerson)
      .then(returned => {
        setPersons(persons.concat(returned))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${returned.name}`)
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${name}`)
        })
        .catch(() => {
          showMessage(`Information of ${name} was already removed`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <div>
        filter shown with <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App
