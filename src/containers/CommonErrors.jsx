import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { setPageTitle } from '../actions/header'
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import TablePagination from 'react-md/lib/DataTables/TablePagination'

import { oipaApiUrl } from '../config.js'

import { errorTypeMapping, elementMapping } from '../mappings'


const progressId = 'contentLoadingProgress';


class CommonErrors extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
      page: 1,
      pageSize: 400,
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
    }, 1400);
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
      pageSize: 400,
      ordering: 'display_name'
    })
  }

  loadData(state){

    const query = `datasets/aggregations/?format=json&group_by=message&aggregations=note_count&order_by=-note_count`
    
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
    this.props.setPageTitle(`Common errors`)
    this.loadData(this.state)
  }

  componentWillUpdate(nextProps, nextState){
    if (nextState.fetching === true && this.state.fetching === false){
      this.loadData(nextState)
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
          count,
          ordering
    } = this.state

    
    const paginationMeta = {
      rows: count,
      rowsPerPage: pageSize,
      page: page,
      defaultPage: 1,
      defaultRowsPerPage: 400,
      onPagination: this._handlePagination
    }


    const rows = data.map((row, i) => {
      const model = elementMapping[row.model] ? elementMapping[row.model] : row.model
      return (
        <TableRow key={i}>
          <TableColumn key='exception_type'>
            {errorTypeMapping[row.exception_type]}
          </TableColumn>
          <TableColumn key='model'>
            {model}
          </TableColumn>
          <TableColumn key='field'>
            {row.field}
          </TableColumn>
          <TableColumn key='note_count'>
            {row.note_count}
          </TableColumn>
          <TableColumn key='message'>
            {row.message}
          </TableColumn>
        </TableRow>
      )
    })



    return (
        <div>
            <div id="floating-linear-progress">
              {fetching && <LinearProgress key="progress" id={progressId} />}
              
            </div>
            <div className="md-grid">
                <div className="md-cell md-cell--12">

                  <Card id="common-errors-list-table" tableCard>
                    
                    <div className="md-grid">
                      <div className="md-cell md-cell--8">
                        <h2>Commonly made validation errors</h2>
                      </div>
                    </div>
                  

                    <DataTable baseId="common-errors-table" plain>

                      <Header sortValue={ordering} sort={this.sort}></Header>
                      
                      <TableBody>
                        {rows}
                      </TableBody>
                      <TablePagination {...paginationMeta} />
                    </DataTable>



                  </Card>
                </div>
            </div>
        </div>
    )
  }
}


CommonErrors.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}


/* Header.jsx */

const Header = ({ sortValue, sort }) => (
  <TableHeader>
    <TableRow>
      <TableColumn className='common-errors-col-1' tooltipLabel="">
        Bug type
      </TableColumn>
      <TableColumn className='common-errors-col-2' tooltipLabel=""> 
        Element
      </TableColumn>
      <TableColumn className='common-errors-col-3' tooltipLabel="">
        Attribute
      </TableColumn>
      <TableColumn className='common-errors-col-4' tooltipLabel="">
        occurences of the error
      </TableColumn>
      <TableColumn className='common-errors-col-5' tooltipLabel="">
        Bug message
      </TableColumn>

    </TableRow>
  </TableHeader>
);

Header.propTypes = {
  sort: PropTypes.func.isRequired,
  titleSorted: PropTypes.bool,
  yearSorted: PropTypes.bool,
};



export default connect(null, {
  setPageTitle,
})(CommonErrors)