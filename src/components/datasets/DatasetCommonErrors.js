import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import TablePagination from 'react-md/lib/DataTables/TablePagination'

import { oipaApiUrl } from '../../config.js'

import { elementMapping } from '../../mappings'



class DatasetCommonErrors extends Component {

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
    })
  }

  loadData(state, props){
    if(!props.dataset){
      return false;
    }

    const query = `datasets/aggregations/?format=json&group_by=model&aggregations=note_count&order_by=-note_count&id=${props.dataset.id}`
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
    if ((nextState.fetching === true && this.state.fetching === false) || nextProps.dataset.id !== this.props.dataset.id){
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

  rowClick(row){
    console.log('go to', `datasets/${row.id}`)
    this.context.router.history.push(`/datasets/${row.id}`)
  }


  render () {

    const {
          data,
          page,
          pageSize,
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

    const start = (page*pageSize - pageSize)
    const rows = data.slice(start, (start+pageSize)).map((row, i) => {

      return (
        <TableRow key={i} onClick={() => { this.rowClick(row)}}>
          <TableColumn key='model'>{elementMapping[row.model] ? elementMapping[row.model] : row.model}</TableColumn>
          <TableColumn key='field'>{row.field}</TableColumn>
          <TableColumn key='note_count'>{row.note_count}</TableColumn>
        </TableRow>
      )
    })

    return (
      <Card id="dataset-common-error-list-table" tableCard>
        
        <div className="md-grid">
          <div className="md-cell md-cell--12">
            <h2>Recurring validation errors</h2>
          </div>
        </div>

        <DataTable plain>
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


DatasetCommonErrors.contextTypes = {
  router:   PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}


/* Header.jsx */

const Header = ({ sortValue, sort }) => (
  <TableHeader>
    <TableRow>
      <TableColumn tooltipLabel="Element">
        Element
      </TableColumn>
      <TableColumn tooltipLabel="Attribute">
        Attribute
      </TableColumn>
      <TableColumn tooltipLabel="The amount of found validation errors">
        Note count
      </TableColumn>
    </TableRow>
  </TableHeader>
);

Header.propTypes = {
  sort: PropTypes.func.isRequired,
  titleSorted: PropTypes.bool,
  yearSorted: PropTypes.bool,
};



export default DatasetCommonErrors