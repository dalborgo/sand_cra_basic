import React, { memo } from 'react'
import { LocalizationProvider } from '@material-ui/pickers'
import Container from '@material-ui/core/Container'
import BasicDateRangePicker from './DateRange'
import messages from './translations/it-IT.json'
import { IntlProvider } from 'react-intl'
import MomentAdapter from '@material-ui/pickers/adapter/moment'
require('moment/locale/it')
require('moment/locale/de')

const App7 = memo(function App7 () {
  return (
    <IntlProvider defaultLocale="it" locale="it" messages={messages}>
      <LocalizationProvider dateAdapter={MomentAdapter} locale="it">
        <Container maxWidth="sm">
          <BasicDateRangePicker/>
        </Container>
      </LocalizationProvider>
    </IntlProvider>
  )
})

export default App7