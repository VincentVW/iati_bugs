import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from 'react-md/lib/TextFields'

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
import Button from 'react-md/lib/Buttons/Button'

import { oipaApiUrl } from '../config.js'


const progressId = 'contentLoadingProgress';


class PublisherList extends Component {

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

  loadData(state){

    const query = `publishers/?format=json&page=${state.page}&page_size=${state.pageSize}&q=${state.query}&ordering=${state.ordering}&fields=id,iati_id,publisher_iati_id,display_name,note_count&no_datasets=False`
    
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
    this.props.setPageTitle(`Find your organisation`)
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

  rowClick(row){
    this.context.router.history.push(`/publishers/${row.id}`)
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
      onPagination: this._handlePagination
    }


    const rows = data.map((row, i) => {

      return (
        <TableRow key={i} onClick={() => { this.rowClick(row)}}>
          <TableColumn key='publisher_iati_id'>
            {row.publisher_iati_id}
          </TableColumn>
          <TableColumn key='display_name'>
            {row.display_name}
          </TableColumn>
          <TableColumn key='note_count'>{row.note_count}</TableColumn>
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

                  <Card id="publisher-list-table" tableCard>
                    
                    
                          <h2>publishers</h2>
                          
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
                       
                          <Button
                            primary
                            flat
                            label='Reset'
                            onClick={this.removeQuery}
                          >
                            refresh
                          </Button>



                          <DataTable baseId="publisher-table" plain>

                            <Header sortValue={ordering} sort={this.sort}></Header>
                            
                            <TableBody>
                              {rows}
                            </TableBody>
                            <TablePagination {...paginationMeta} />
                          </DataTable>



                    </Card>

                        








                  { /*}


                  <CSSTransitionGroup
                    component="div"
                    className="text-container"
                    transitionName="opacity"
                    transitionEnterTimeout={1500}
                    transitionLeaveTimeout={1500}
                    {...accessibilityProps}
                  >
          
                    </CSSTransitionGroup> */}

                </div>
            </div>

        </div>
    )
  }
}


PublisherList.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}


/* Header.jsx */

const Header = ({ sortValue, sort }) => (
  <TableHeader>
    <TableRow>
      <TableColumn
        sorted={sortValue.includes('publisher_iati_id') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('publisher_iati_id')}
        tooltipLabel="The IATI organisation identifier as reported on the registry"
      >
        Publisher reference
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('display_name') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('display_name')}
        tooltipLabel="The publisher's name as reported on the registry"
      >
        Publisher name
      </TableColumn>
      <TableColumn
        tooltipLabel="The amount of errors found on this publisher"
      >
        Bug count
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
})(PublisherList)