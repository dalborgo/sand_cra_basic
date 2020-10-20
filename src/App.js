import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl'
import messages from './translations/en-US.json'
import { QueryCache, ReactQueryCacheProvider, useInfiniteQuery } from 'react-query'
import axios from 'axios'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import { ReactQueryDevtools } from 'react-query-devtools'

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

const LIMIT = null
const fetchFunc = async (key, cursor) => {
  const { data } = await axios.get('http://localhost:7000/api/info/browser', {
    params: {
      limit: LIMIT,
      startkey: cursor,
    },
  })
  return data
}

function ListElem ({ text }) {
  return (
    <ListItem>
      <ListItemText primary={text}/>
    </ListItem>
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
  return (
    <>
      <CssBaseline/>
      <div>{status}</div>
      <Container maxWidth="lg">
        <div>
          <List component="nav" dense>
            {
              (data) &&
              data.map((group, i) => (
                <React.Fragment key={i}>
                  {
                    group?.results?.rows?.length && group.results.rows.map(elem => (
                      <ListElem
                        key={elem.id}
                        text={elem.id}
                      />
                    ))
                  }
                </React.Fragment>
              ))
  
            }
            <ListElem/>
          </List>
          <button disabled={!canFetchMore || isFetchingMore} onClick={() => fetchMore()}>
            More
          </button>
        </div>
        <div>{isFetching && !isFetchingMore ? 'Fetching...' : null}</div>
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
