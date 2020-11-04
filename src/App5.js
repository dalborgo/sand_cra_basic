import React, { memo, useState } from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import { RecoilRoot, selector, useRecoilValue } from 'recoil'

const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({ get }) => {
    const response = await axios.post('http://localhost:7000/api/queries/query_by_id', {
      id: 'general_configuration',
      columns: ['cover_default'],
    })
    return response.data.results[0].cover_default
  },
})

const About = memo(function Miao () {
  // eslint-disable-next-line no-unused-vars
  const [_, setBase] = useState(null)
  console.log('%cRENDER_ABOUT', 'color: orange')
  const val = useRecoilValue(currentUserNameQuery)
  return (
    <>
      <button onClick={() => setBase('')}>prova</button>
      <pre>{val}</pre>
    </>
  )
})
About.whyDidYouRender = true
const Rou = memo(() => {
  return (
    <>
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
    </>
  
  )
})

const App5 = memo(() => {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Rou/>
      </React.Suspense>
    </RecoilRoot>
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

//App5.whyDidYouRender = true

export default App5