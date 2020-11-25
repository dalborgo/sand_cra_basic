import React from 'react'
import TextField from '@material-ui/core/TextField'
import { Slide } from '@material-ui/core'
import { DateRangeDelimiter, DateRangePicker } from '@material-ui/pickers'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

const DatePickerField = ({
  form,
  open,
  setOpen,
  setDateRange,
  field: { value, name },
  ...other
}) => {
  // eslint-disable-next-line no-unused-vars
  const [start, end] = value
  const disabledEnd = !end && !open
  return (
    <DateRangePicker
      disableAutoMonthSwitching
      disableFuture
      endText="Fine"
      onAccept={
        date => {
          setDateRange(date)
        }
      }
      onChange={
        date => {
          const [first, second] = date
          const isSameDate = moment(first).isSame(second)
          if (isSameDate) {
            setOpen(false)
            setDateRange(date)
          }
          form.setFieldValue(name, date, false)
        }
      }
      onClose={
        () => {
          setOpen(false)
        }
      }
      open={open}
      reduceAnimations
      renderInput={
        (startProps, endProps) => (
          <React.Fragment>
            <TextField
              {...startProps}
              error={false}
              helperText={null}
              InputLabelProps={
                {
                  shrink: true,
                }
              }
              onFocus={
                event => {
                  if (!open) {
                    setOpen(true)
                    event.target.select()
                  }
                }
              }
              size="small"
            />
            <DateRangeDelimiter><FormattedMessage defaultMessage="a" id="to"/></DateRangeDelimiter>
            <TextField
              {...endProps}
              disabled={disabledEnd}
              error={false}
              helperText={null}
              InputLabelProps={
                {
                  shrink: true,
                }
              }
              inputProps={
                {
                  ...endProps.inputProps,
                  disabled: disabledEnd,
                }
              }
              onFocus={
                event => {
                  if (end && !open) {
                    setOpen(true)
                    event.target.select()
                  }
                }
              }
              size="small"
            />
          </React.Fragment>
        )
      }
      startText="Inizio"
      TransitionComponent={Slide}
      value={value}
      {...other}
    />
  )
}

export default DatePickerField