import React, { memo } from 'react'
import create from 'zustand'
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query'
import shallow from 'zustand/shallow'
import produce from 'immer'
import Button from '@material-ui/core/Button'
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
const wait = delay => new Promise(resolve => setTimeout(resolve, delay))
const immer = config => (set, get) => config(fn => set(produce(fn)), get)
const useStore = create(immer(set => ({
  bears: {
    loading: false,
    second: 'ds',
    count: 0,
    details: '',
  },
  inc: async () => {
    await wait(1000)
    set(state => void state.obj.count++)
  },
  change: () => set(state => void (state.bears.bar_room_name = 'NUOVO')),
  change2: () => set(state => void (state.bears.second = new Date())),
  set: fn => set(fn), //generico con immer
})))

const Child = memo(props => {
  const { bar_room_name} = useStore(state => ({ bar_room_name: state.bears.bar_room_name }), shallow)
  return <h1>{bar_room_name} around here ...</h1>
})

const Rou = memo(() => {
  const respDoc = useQuery(['docs/get_by_id', { docId: 'general_configuration' }], { suspense: true })
  useStore.setState({ bears: respDoc.data.results })
  const change = useStore(state => state.change)
  return (
    <>
      <Child/>
      <Button onClick={change}>
        AGGIORNA
      </Button>
    </>
  )
})

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      queryFn: defaultQueryFn,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

const App8 = memo(() => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <React.Suspense fallback={<div>loading...</div>}>
          <Rou/>
        </React.Suspense>
      </ErrorBoundary>
    </ReactQueryCacheProvider>
  )
})

//App6.whyDidYouRender = true

export default App8