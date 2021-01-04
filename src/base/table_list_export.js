import React, { memo, useCallback, useRef, useState } from 'react'
import {
  ExportPanel,
  Grid,
  SearchPanel,
  Table,
  TableHeaderRow,
  TableRowDetail,
  TableSummaryRow,
  Toolbar,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui'
import { Cell, CellSummary, DetailCell, GridDetailContainerBase, summaryCalculator } from './comps'
import { useGeneralStore } from 'src/zustandStore'
import {
  IntegratedFiltering,
  IntegratedSummary,
  RowDetailState,
  SearchState,
  SummaryState,
} from '@devexpress/dx-react-grid'
import { useIntl } from 'react-intl'
import { messages } from 'src/translations/messages'
import { LoadingComponent } from 'src/components/TableComponents'
import { CellHeader, RootToolbar } from 'src/components/TableComponents/CellBase'
import { SearchInput } from 'src/components/TableComponents/SearchInput'
import { useMoneyFormatter } from 'src/utils/formatters'
import TableDetailToggleCell from './comps/TableDetailToggleCellBase'
import { withWidth } from '@material-ui/core'
import { GridExporter } from '@devexpress/dx-react-grid-export'
import saveAs from 'file-saver'
import moment from 'moment'
import ExcelJS from 'exceljs'

const getRowId = row => row._id
const Root = props => <Grid.Root {...props} style={{ height: '100%' }}/>

const tableColumnExtensions = [
  { columnName: 'covers', align: 'right' },
  { columnName: 'final_price', align: 'right' },
]
const totalSummaryItems = [
  { columnName: 'table_display', type: 'count' },
  { columnName: 'covers', type: 'sum' },
  { columnName: 'final_price', type: 'incomeSum' },
]

const IntegratedFilteringSel = memo(function IntegratedFilteringSel () {
  const filteringColumnExtensions = ['covers', 'date']
    .map(columnName => ({
      columnName,
      predicate: () => false,
    }))
  return (
    <IntegratedFiltering
      columnExtensions={filteringColumnExtensions}
    />
  )
})
const SearchPanelIntl = memo(function SearchPanelIntl () {
  const intl = useIntl()
  return (
    <SearchPanel
      inputComponent={SearchInput}
      messages={
        {
          searchPlaceholder: intl.formatMessage(messages['common_search']),
        }
      }
    />
  )
})
const SelectiveTable = memo(function SelectiveTable ({ isIdle, isFetching, width }) {
  const noDataCellComponent = useCallback(({ colSpan }) =>
    <LoadingComponent colSpan={colSpan} idle={isIdle} isFetching={isFetching}/>, [isFetching, isIdle])
  const [isSmall] = useState(() => ['xs', 'sm'].includes(width)) //lo faccio statico
  if (isSmall) {
    return (
      <Table
        cellComponent={Cell}
        columnExtensions={tableColumnExtensions}
        noDataCellComponent={noDataCellComponent}
      />
    )
  } else {
    return (
      <VirtualTable
        cellComponent={Cell}
        columnExtensions={tableColumnExtensions}
        height="auto"
        noDataCellComponent={noDataCellComponent}
      />
    )
  }
})

const tableSelect = ({ table_display: Td, room_display: Rd, payments }) => {
  const { closed_by: closedBy } = Array.isArray(payments) ? payments[0] : payments
  return `${Td}|${Rd}|${closedBy}`
}
const TableList = ({ rows, isFetching, isIdle, width }) => {
  console.log('%c***EXPENSIVE_RENDER_TABLE', 'color: yellow')
  const moneyFormatter = useMoneyFormatter()
  const intl = useIntl()
  const [exportMessages] = useState(
    {
      showExportMenu: intl.formatMessage(messages['common_exportMenu']),
      exportAll: intl.formatMessage(messages['common_exportTable']),
    }
  )
  const [columns] = useState(() => {
    const companyData = useGeneralStore.getState().companyData
    const companySelect = ({ owner }) => companyData ? companyData?.[owner]?.name : owner
    const typeSelect = ({ payments }) => {
      const text = messages[`mode_${payments.mode}`] ? intl.formatMessage(messages[`mode_${payments.mode}`]) : payments.mode
      return Array.isArray(payments) ? intl.formatMessage(messages['common_separatePayment']) : `${payments?.income}|${text}`
    }
    const finalPriceSelect = ({
      final_price: Fp,
      discount_price: Dp,
    }) => `${moneyFormatter(Fp)}${Dp ? `|-${moneyFormatter(Dp)}` : ''}`
    const columns_ = [
      { name: 'owner', title: intl.formatMessage(messages['common_building']), getCellValue: companySelect },
      { name: 'date', title: intl.formatMessage(messages['common_date']) },
      { name: 'table_display', title: intl.formatMessage(messages['common_table']), getCellValue: tableSelect },
      { name: 'type', title: intl.formatMessage(messages['common_type']), getCellValue: typeSelect },
      { name: 'covers', title: intl.formatMessage(messages['common_covers']) },
      { name: 'final_price', title: intl.formatMessage(messages['common_income']), getCellValue: finalPriceSelect },
    ]
    if (Object.keys(companyData).length < 2) {columns_.shift()}
    return columns_
  })
  const [messagesSummary] = useState(() => ({
    sum: intl.formatMessage(messages['common_total']),
    count: intl.formatMessage(messages['common_total']),
  }))
  const exporterRef = useRef(null)
  const startExport = useCallback(options => {
    exporterRef.current.exportGrid(options)
  }, [exporterRef])
  const onSave = useCallback(() => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Dati')
    const columns_ = []
    for (let column of columns) {
      columns_.push({
        header: column.title,
        key: column.name,
      })
    }
    worksheet.columns = columns_
    const rows_ = []
    for (let row of rows) {
      rows_.push({
        date: moment(row.date, 'YYYYMMDDHHmmssSSS').format('DD/MM/YYYY'),
      })
    }
    worksheet.addRows(rows_);
    workbook.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx')
    })
  }, [columns, rows])
  return (
    <Grid
      columns={columns}
      getRowId={getRowId}
      rootComponent={Root}
      rows={rows}
    >
      <SearchState/>
      <SummaryState
        totalItems={totalSummaryItems}
      />
      <RowDetailState/>
      <IntegratedFilteringSel/>
      <IntegratedSummary calculator={summaryCalculator}/>
      <SelectiveTable
        isFetching={isFetching}
        isIdle={isIdle}
        width={width}
      />
      <TableHeaderRow cellComponent={CellHeader}/>
      <TableSummaryRow messages={messagesSummary} totalCellComponent={CellSummary}/>
      <TableRowDetail
        cellComponent={DetailCell}
        contentComponent={GridDetailContainerBase}
        toggleCellComponent={TableDetailToggleCell}
        toggleColumnWidth={0}
      />
      <Toolbar
        rootComponent={RootToolbar}
      />
      <SearchPanelIntl/>
      <ExportPanel messages={exportMessages} startExport={startExport}/>
      <GridExporter
        columns={columns}
        onSave={onSave}
        ref={exporterRef}
        rows={rows}
        totalSummaryItems={totalSummaryItems}
      />
    </Grid>
  )
}

export default memo(withWidth()(TableList))
