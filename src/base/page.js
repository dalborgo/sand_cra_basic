import React from 'react'
import Page from 'src/components/Page'
import { Box, makeStyles } from '@material-ui/core'
import Header from './Header'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto',
  },
  innerFirst: {
    display: 'flex',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
}))

const ClosingDay = () => {
  const classes = useStyles()
  const intl = useIntl()
  return (
    <Page
      className={classes.root}
      title={intl.formatMessage(messages['menu_closing_day'])}
    >
      <Box p={3} pb={2}>
        <Header/>
      </Box>
      <div className={classes.content}>
        <div className={classes.innerFirst}>
          Prova
        </div>
      </div>
    </Page>
  )
}

export default ClosingDay
