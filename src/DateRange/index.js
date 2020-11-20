import React from 'react'
import TextField from '@material-ui/core/TextField'
import { DateRangeDelimiter, DateRangePicker } from '@material-ui/pickers'
import { FormattedMessage } from 'react-intl'

export default function BasicDateRangePicker () {
  const [value, setValue] = React.useState([null, null])
  
  return (
    <DateRangePicker
      endText="Check-out"
      onChange={(newValue) => setValue(newValue)}
      renderInput={
        (startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <DateRangeDelimiter><FormattedMessage defaultMessage="a" id="to"/></DateRangeDelimiter>
            <TextField {...endProps} />
          </React.Fragment>
        )
      }
      startText="Check-in"
      value={value}
    />
  )
}