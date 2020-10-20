import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl'
import messages from './translations/en-US.json'
import { useInfiniteQuery } from 'react-query'
import axios from 'axios'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import { ReactQueryDevtools } from 'react-query-devtools'

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

const fetchFunc = async (key, cursor = 0) => {
  console.log('cursor:', cursor)
  const { data } = await axios.get('http://localhost:7000/api/info/browser', {
    params: {
      limit: 20,
      skip: cursor,
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
  const { data, status, fetchMore } = useInfiniteQuery(['docs'], fetchFunc, {
    refetchOnWindowFocus: false,
    retry: false,
    getFetchMore: (lastGroup, allGroups) => {
      console.log('lastGroup:', lastGroup)
      console.log('allGroups:', allGroups)
      return 20
    },
  })
  console.log('status:', status)
  console.log('data:', data)
  return (
    <>
      <CssBaseline/>
      <div>{status}</div>
      <Container maxWidth="lg">
        <div>
          <List component="nav" dense>
            {/* {
              (data?.results && data?.results?.length) &&
              data.results.map()
            }*/}
            {
              (data) &&
              data.map((group, i) => (
                <React.Fragment key={i}>
                  {
                    (group?.results && group?.results?.length) && group.results.map(elem => <ListElem key={elem.id}
                                                                                                      text={elem.id}/>)
                  }
                </React.Fragment>
              ))
              
            }
            <ListElem/>
          </List>
          <button
            onClick={() => fetchMore()}
          >
            More
          </button>
        </div>
      </Container>
    </>
  )
}

export default function App () {
  return (
    <IntlProvider defaultLocale="it" locale="it" messages={messages}>
      <MainList/>
      <ReactQueryDevtools/>
    </IntlProvider>
  )
}
