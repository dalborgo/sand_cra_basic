import React, { memo } from 'react'
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query'
import { atom, RecoilRoot, useRecoilValue } from 'recoil'

const axiosLocalInstance = axios.create({
  baseURL: 'http://localhost:7000',
  params: {
    _key: 'astenposServer',
  },
  paramsSerializer: params => {
    return qs.stringify(params)
  },
  validateStatus: function (status) {
    return (status >= 200 && status < 300) || status === 412 //il 412 lo uso come identificativo di una risposta errata
  },
})

axiosLocalInstance.interceptors.request.use(function (config) {
  config.timeData = { start: moment().toISOString() }
  return config
}, function (error) {
  return Promise.reject(error)
})
axiosLocalInstance.interceptors.response.use(function (response) {
  const duration = moment.duration(moment().diff(moment(response.config['timeData'].start)))
  response.config['timeData'].responseTimeInMilli = duration.asMilliseconds()
  return response
}, function (error) {
  return Promise.reject(error)
})

const defaultQueryFn = async (key, params) => {
  const { data } = await axiosLocalInstance(`/api/${key}`, {
    params,
  })
  return data
}
const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 1,
});
const Child = memo(props => {
  console.log('RENDER')
  const todoList = useRecoilValue(currentUserIDState);
  return <h1>around here ...</h1>
})
Child.displayName = 'CHILD'
Child.whyDidYouRender = true


const Rou = memo(() => {
  const respDoc = useQuery(['docs/get_by_id', { docId: 'general_configuration' }], {
    onSuccess: () => console.log('SUCC'),
  })
  if (!respDoc.isLoading) {
    console.log('respDoc:', respDoc)
  }
  
  return (
    <>
      <Child/>
      {/*<Button onClick={change}>
        AGGIORNA
      </Button>*/}
    </>
  )
})
Rou.whyDidYouRender = true

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function ErrorFallback ({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

const App9 = memo(() => {
  return (
    <RecoilRoot>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <React.Suspense fallback={<div>loading...</div>}>
            <Rou/>
          </React.Suspense>
        </ErrorBoundary>
      </ReactQueryCacheProvider>
    </RecoilRoot>
  )
})

//App6.whyDidYouRender = true

export default App9