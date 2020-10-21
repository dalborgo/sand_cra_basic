import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl'
import messages from './translations/en-US.json'
import { QueryCache, ReactQueryCacheProvider, useInfiniteQuery } from 'react-query'
import axios from 'axios'
import { ReactQueryDevtools } from 'react-query-devtools'
import useIntersectionObserver from './hooks/useIntersectionObserver'
import Link from '@material-ui/core/Link'

const queryCache = new QueryCache()

// eslint-disable-next-line no-unused-vars
function Main () {
  const intl = useIntl()
  return (
    <>
      <CssBaseline/>
      <Container maxWidth="lg">
        <Typography>
          <FormattedMessage
            defaultMessage="Prova"
            id="helper.prova"
          />
        </Typography>
        <Typography>
          {intl.formatNumber(1000, { style: 'currency', currency: 'EUR' })}
        </Typography>
        <Typography>
          {
            intl.formatDate('2021-01-05', {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })
          }
        </Typography>
      </Container>
    </>
  )
}

const LIMIT = 40
const fetchFunc = async (key, cursor) => {
  const { data } = await axios.get('http://localhost:7000/api/info/browser', {
    params: {
      limit: LIMIT,
      startkey: cursor,
    },
  })
  return data
}

function ListElem ({ text, value }) {
  const [first] = value
  const preventDefault = (event) => event.preventDefault()
  return (
    <Link
      component={'div'}
      href="#"
      onClick={preventDefault}
      style={{ color: first.includes('phone') ? 'blue' : 'gray' }}
      variant="body2"
    >
      {text}
    </Link>
  )
}

function MainList () {
  const { data, status, fetchMore, isFetchingMore, isFetching, canFetchMore } = useInfiniteQuery(['docs'], fetchFunc, {
    refetchOnWindowFocus: false,
    retry: false,
    getFetchMore: (lastGroup, allGroups) => {
      const { total_rows: totalRows, rows = [] } = lastGroup?.results
      const cursor = rows[rows.length - 1].key
      const rowsFetched = allGroups.length * LIMIT
      const isOver = !LIMIT || rowsFetched === totalRows || rows.length < LIMIT
      return isOver ? false : parseInt(cursor) + 1
    },
  })
  const loadMoreButtonRef = React.useRef()
  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
  })
  return (
    <>
      <CssBaseline/>
      <div>{status}</div>
      <Container maxWidth="lg">
        <div style={{ height: 600 }}>
          <div style={{ maxHeight: '100%', overflow: 'auto' }}>
            {
              (data) &&
              data.map((page, i) => (
                <React.Fragment key={i}>
                  {
                    page?.results?.rows?.length && page.results.rows.map(elem => (
                      <ListElem
                        key={elem.id}
                        text={elem.id}
                        value={elem.value}
                      />
                    ))
                  }
                </React.Fragment>
              ))
            }
            <button
              disabled={!canFetchMore || isFetchingMore}
              onClick={() => fetchMore()}
              ref={loadMoreButtonRef}
              style={{ visibility: !data ? 'hidden' : undefined }}
            >
              More
            </button>
          </div>
        </div>
        <div>
          {isFetching && !isFetchingMore ? 'Background Updating...' : null}
        </div>
      </Container>
    </>
  )
}

export default function App () {
  return (
    <IntlProvider defaultLocale="it" locale="it" messages={messages}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <MainList/>
        <ReactQueryDevtools/>
      </ReactQueryCacheProvider>
    </IntlProvider>
  )
}
