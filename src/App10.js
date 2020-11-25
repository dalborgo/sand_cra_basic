import React, { memo, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Field, Form, Formik } from 'formik'
import { FormattedDate, IntlProvider, useIntl } from 'react-intl'
import messages from './translations/it-IT.json'
import moment from 'moment';
import { LocalizationProvider } from '@material-ui/pickers'
import MomentAdapter from '@material-ui/pickers/adapter/moment'
import Container from '@material-ui/core/Container'
import DatePickerField from './DateRangeInt'
import create from 'zustand'
import produce from 'immer'
import Button from '@material-ui/core/Button'
import shallow from 'zustand/shallow'
import { Typography } from '@material-ui/core'

require('moment/locale/it')
require('moment/locale/de')
moment.locale('it') //altrimenti prende il secondo importato
const immer = config => (set, get) => config(fn => set(produce(fn)), get)
const useStore = create(immer(set => ({
  startDate: null,
  endDate: null,
  setDateRange: input => set(state => {
    const [startDate, endDate] = input
    if (startDate && endDate) {
      state.startDate = startDate
      state.endDate = endDate
    }
  }),
})))

const Mio = memo(() => {
  const { startDate, endDate } = useStore(state => ({ startDate: state.startDate, endDate: state.endDate }), shallow)
  const intl = useIntl()
  return (
    <Typography>
      {
        intl.formatDate(startDate, {
          dateStyle: 'medium',
        })
      }{' - '}
      {<FormattedDate dateStyle={'medium'}  value={endDate} />}
    </Typography>
  )
})

export default function App10 () {
  const setDateRange = useStore(state => state.setDateRange)
  const [open, setOpen] = useState(false)
  return (
    <IntlProvider defaultLocale="it" locale="it" messages={messages}>
      <LocalizationProvider dateAdapter={MomentAdapter} locale="it">
        <Container maxWidth="sm">
          <Formik
            initialValues={{ dateRange: [null, null] }}
            onSubmit={
              value => {
                setOpen(false)
                setDateRange(value.dateRange)
              }
            }
          >
            {
              () => (
                <Form>
                  <Grid container>
                    <Grid container item xs={12}>
                      <Field
                        component={DatePickerField}
                        name="dateRange"
                        open={open}
                        setDateRange={setDateRange}
                        setOpen={setOpen}
                      />
                      <Button style={{ display: 'none' }} type="submit"/>
                    </Grid>
                  </Grid>
                </Form>
              )
            }
          </Formik>
          <br/>
          <Mio/>
        </Container>
      </LocalizationProvider>
    </IntlProvider>
  )
}