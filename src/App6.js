import React, { memo } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import create from 'zustand'

/*const useStore = create(set => ({
  bears: 10,
}))*/

const useStore = create(set => ({
  fishes: [],
  fetch: async pond => {
    const response = await axios.post('http://localhost:7000/api/queries/query_by_id', {
      id: 'general_configuration',
      columns: ['cover_default'],
    })
    set({ fishes: response.results })
  },
}))

const About = memo(() => {
  console.log('%cRENDER_ABOUT', 'color: orange')
  const fishes = useStore(state => state.fetch)
  return <pre>{JSON.stringify(fishes, null, 2)}</pre>
})
About.displayName = 'About'
About.whyDidYouRender = true

const Rou = memo(() => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about">
            <About/>
          </Route>
          <Route path="/users">
            <Users/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
})

const App6 = memo(() => {
  return (
    <Rou/>
  )
})

function Home () {
  console.log('%cRENDER_HOME', 'color: yellow')
  return <h2>Home</h2>
}

function Users () {
  console.log('%cRENDER_USER', 'color: pink')
  return <h2>Users</h2>
}

//App6.whyDidYouRender = true

export default App6