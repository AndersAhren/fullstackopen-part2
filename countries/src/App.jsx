import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const capital = country.capital[0]

  useEffect(() => {
    if (!apiKey) {
      return
    }

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
  }, [capital, apiKey])

  if (!apiKey) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Missing OpenWeather API key</p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>loading weather...</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} width="150" />

      <Weather country={country} />
    </div>
  )
}

const Countries = ({ countries, handleShowCountry }) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (countries.length === 1) {
    return (
      <Country country={countries[0]} />
    )
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShowCountry(country)}>
            show
          </button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  const handleShowCountry = country => {
    setFilter(country.name.common)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries
        countries={countriesToShow}
        handleShowCountry={handleShowCountry}
      />
    </div>
  )
}

export default App