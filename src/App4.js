import React, { memo, useState } from 'react'

const Mio = memo(function MIO ({ ind }) {
  return (
    <div>
      {ind}
    </div>
  )
})
Mio.whyDidYouRender = true
const App4 = () => {
  const [ind, setInd] = useState('')
  return (
    <div>
      <button onClick={() => setInd((new Date()).toISOString())}>premi</button>
      <Mio ind={ind}/>
    </div>
  )
}
App4.whyDidYouRender = true

export default App4