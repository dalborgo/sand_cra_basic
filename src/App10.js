import React, { memo } from 'react'
import axios from 'axios'
import moment from 'moment'

const Rou = memo(() => {
 
  return (
    <>
     PROVA
    </>
  )
})
Rou.whyDidYouRender = true


const App10 = memo(() => {
  return (
    
    <Rou/>
  
  )
})

//App6.whyDidYouRender = true

export default App10