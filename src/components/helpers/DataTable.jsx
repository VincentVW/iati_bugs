import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader'
import TablePagination from 'react-md/lib/DataTables/TablePagination'


class DataTableContainer extends Component {
  render(){
    return (

      <Card id={this.props.cardId} tableCard>

        {this.props.pagination &&
          <TablePagination onPagination={this.props.handlePagination} {...this.props.paginationMeta} />
        }
        {this.props.title && 
          <TableCardHeader
            title={this.props.title}
            visible={false}>
          </TableCardHeader>
        }
        {this.props.children}

        <DataTableContent headers={this.props.headers} rows={this.props.rows} />
        {this.props.pagination &&
          <TablePagination onPagination={this.props.handlePagination} {...this.props.paginationMeta} />
        }
      </Card>
    )
  }
}

DataTableContainer.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired
}


class DataTableContent extends Component {
  
  render(){

    const rows = this.props.rows.map((row, i) => {

      const columns = this.props.headers.map((header) => {
        return <TableColumn key={header.ref}>{row[header.ref]}</TableColumn>
      })

      return (
        <TableRow key={i}>
          {columns}
        </TableRow>
      )
    })

    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            {this.props.headers.map((header) => {
              return <TableColumn key={header.ref}>{header.name}</TableColumn>
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows}
        </TableBody>
      </DataTable>
    )
  }
}

DataTableContent.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}

export default DataTableContainer
