import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from 'react-md/lib/TextFields'

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import TablePagination from 'react-md/lib/DataTables/TablePagination'
import Button from 'react-md/lib/Buttons/Button';

import { oipaApiUrl } from '../../config.js'


const progressId = 'contentLoadingProgress';


class NotesList extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
      page: 1,
      pageSize: 10,
      query: '',
      queryText: '',
      count: 0,
      fetching: true,
      data: [],
      ordering: 'display_name'
    }

    this.changeQuery = this.changeQuery.bind(this)
    this.keyDownQuery = this.keyDownQuery.bind(this)

    this.setQuery = this.setQuery.bind(this)

    this._handlePagination = this._handlePagination.bind(this)
    this.timeout = null
    this.removeQuery = this.removeQuery.bind(this)
  }

  setQuery(q){
    if (q === this.state.query){ return } 
    
    this.setState({
      query: q,
      fetching: true,
      page: 1
    })
  }

  changeQuery (value){
    this.setState({queryText: value})
    
    clearTimeout(this.timeout)

    const setQuery = this.setQuery

    this.timeout = setTimeout(function () {
      setQuery(value)
    }, 1200);
  }

  keyDownQuery (e){
    if(e.key === 'Enter'){
      this.setState({
        fetching: true
      })
    }
  }

  removeQuery(){
    this.setState({
      query: '',
      queryText: '',
      fetching: true,
      page: 1,
      pageSize: 10,
      ordering: 'display_name'
    })
  }

  loadData(state, props){
    const query = `datasets/${props.dataset.id}/notes/?format=json&page=${state.page}&page_size=${state.pageSize}&q=${state.query}&ordering=${state.ordering}`
    
    fetch(oipaApiUrl + query)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState({
            count: json.count,
            data: json.results,
            fetching: false
        })
      }
    )
  }

  componentDidMount() {
    this.loadData(this.state, this.props)
  }

  componentWillUpdate(nextProps, nextState){
    if ((nextState.fetching === true && this.state.fetching === false) || nextProps.publisher !== this.props.publisher){
      this.loadData(nextState, nextProps)
    }
  }

  _handlePagination(start, pageSize) {

    this.setState({
      page: (1 + (start / pageSize)),
      pageSize: pageSize,
      fetching: true,
    })
  }

  sort = (order) => {
    const reverse = this.state.ordering.includes(order)
    const ordering = reverse ? this.state.ordering.charAt(0) === '-' ? order : `-${order}` : order
    this.setState({
      ordering: ordering,
      fetching: true
    })
  }


  render () {

    const {
          data,
          page,
          pageSize,
          fetching,
          queryText,
          count,
          ordering
    } = this.state

    
    const paginationMeta = {
      rows: count,
      rowsPerPage: pageSize,
      page: page,
      defaultPage: 1,
      defaultRowsPerPage: 10,
    }

    const rows = data.map((row, i) => {
      return (
        <TableRow key={i}>
          <TableColumn key='line_number'>{row.line_number}</TableColumn>
          <TableColumn key='iati_identifier'>{row.iati_identifier}</TableColumn>
          <TableColumn key='model'>{row.model}</TableColumn>
          <TableColumn key='field'>{row.field}</TableColumn>
          <TableColumn key='message'>{row.message}</TableColumn>
          <TableColumn key='variable'>{row.variable}</TableColumn>
          <TableColumn key='exception_type'>{row.exception_type}</TableColumn>
        </TableRow>
      )
    })

    return (
      <Card id="notes-list-table" tableCard>
            
        <div id="floating-linear-progress">
          {fetching && <LinearProgress key="progress" id={progressId} />}
        </div>

          <div className="md-grid">
            <div className="md-cell md-cell--4">

              <h2>Validation errors</h2>
              <TextField
                id="search-input"
                onKeyDown={this.keyDownQuery}
                onChange={this.changeQuery}
                value={queryText}
                label="Search..."
                lineDirection="center"
                placeholder=""
                customSize="search"
                className="md-cell md-cell--12 md-cell--bottom"
              >
              </TextField>
            </div>
            <div className="md-cell md-cell--8 align-right">

              <Button
                flat={true}
                label='Reset'
                primary
                tooltipLabel='Reset'
                onClick={this.removeQuery}
              >
                refresh
              </Button>
            </div>
          </div>  

        <DataTable plain className='notes-table'>

          <Header sortValue={ordering} sort={this.sort}></Header>
          
          <TableBody>
            {rows}
          </TableBody>
          <TablePagination onPagination={this._handlePagination} {...paginationMeta} />
        </DataTable>
        </Card>
    )
  }
}


NotesList.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}


/* Header.jsx */

const Header = ({ sortValue, sort }) => (
  <TableHeader>
    <TableRow>
      <TableColumn
        sorted={sortValue.includes('line_number') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('line_number')}
        tooltipLabel="The line number on which this validation error occurs"
        className='notes-col-1'
      >
        Line
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('iati_identifier') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('iati_identifier')}
        tooltipLabel="The IATI identifier of the activity where this error occurs"
        className='notes-col-2'
      >
        identifier
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('model') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('model')}
        tooltipLabel="The IATI element on which this error occurs"
        className='notes-col-3'
      >
        Element
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('field') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('field')}
        tooltipLabel="The IATI attribute on which this error occurs"
        className='notes-col-4'
      >
        Attribute
      </TableColumn>

      <TableColumn
        sorted={sortValue.includes('message') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('message')}
        tooltipLabel="A message that describes the error"
        className='notes-col-5'
      >
        Message
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('variable') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('variable')}
        tooltipLabel="A message that describes the error"
        className='notes-col-6'
      >
        Variable
      </TableColumn>

      <TableColumn
        sorted={sortValue.includes('exception_type') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('exception_type')}
        tooltipLabel=""
        className='notes-col-7'
      >
        Exception type
      </TableColumn>
      
    </TableRow>
  </TableHeader>
);

Header.propTypes = {
  sort: PropTypes.func.isRequired,
  titleSorted: PropTypes.bool,
  yearSorted: PropTypes.bool,
};



export default NotesList