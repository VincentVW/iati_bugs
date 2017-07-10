import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from 'react-md/lib/TextFields'

import LinearProgress from 'react-md/lib/Progress/LinearProgress'
import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import TablePagination from 'react-md/lib/DataTables/TablePagination'
import Button from 'react-md/lib/Buttons/Button'

import { oipaApiUrl } from '../../config.js'
import cn from 'classnames'
import { Link } from 'react-router-dom'


const progressId = 'contentLoadingProgress';


class DatasetList extends Component {

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

    let query = `datasets/?format=json&filetype=1&page=${state.page}&page_size=${state.pageSize}&q=${state.query}&ordering=${state.ordering}&fields=id,name,title,filetype,publisher,source_url,date_updated,note_count`
    
    if(props.publisher){
      query += `&publisher_id=${props.publisher}`
    }
    
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

  // rowClick(row){
  //   console.log('go to', `datasets/${row.id}`)

  //   this.context.router.history.push(`/datasets/${row.id}`)
  // }


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

    const {
      publisher
    } = this.props

    
    const paginationMeta = {
      rows: count,
      rowsPerPage: pageSize,
      page: page,
      defaultPage: 1,
      defaultRowsPerPage: 10,
    }

    const rows = data.map((row, i) => {

      // <TableRow key={i} onClick={() => { this.rowClick(row)}}>
      return (
        <TableRow key={i}>
          <TableColumn key='name'>
            <Link to={`/datasets/${row.id}`}>{row.name}</Link>
          </TableColumn>
          <TableColumn key='title'>
            <Link to={`/datasets/${row.id}`}>{row.title}</Link>
          </TableColumn>
          <TableColumn key='filetype'>
            {row.filetype}
          </TableColumn>
          {!publisher && 
            <TableColumn key='publisher_iati_id'>
              {row.publisher.display_name}
              { // <Link to={`/publishers/${row.publisher.id}`}></Link>
              }
            </TableColumn>
          }
          <TableColumn key='note_count'>
            <Link to={`/datasets/${row.id}`}>{row.note_count}</Link>
          </TableColumn>
        </TableRow>
      )
    })

    return (
      <Card id="dataset-list-table" tableCard>
            
        <div id="floating-linear-progress">
          {fetching && <LinearProgress key="progress" id={progressId} />}
        </div>

         
          <div className="md-grid">
            <div className="md-cell md-cell--4">

              {publisher && this.props.page &&
                <h2>Other datasets by this publisher</h2>
              }
              {publisher && !this.props.page &&
                <h2>Datasets by this publisher</h2>
              }
              
              <TextField
                id="search-input"
                onKeyDown={this.keyDownQuery}
                onChange={this.changeQuery}
                value={queryText}
                label="Search by dataset name or title..."
                lineDirection="center"
                placeholder=""
                customSize="search"
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

        <DataTable plain>

          <Header sortValue={ordering} sort={this.sort} publisher={publisher}></Header>
          
          <TableBody>
            {rows}
          </TableBody>
          <TablePagination onPagination={this._handlePagination} {...paginationMeta} />
        </DataTable>
        </Card>
    )
  }
}


DatasetList.contextTypes = {
  router: PropTypes.shape({
    history:  PropTypes.object.isRequired,
  }),
}


/* Header.jsx */

const Header = ({ sortValue, sort, publisher }) => {


  return (
  <TableHeader>
    <TableRow autoAdjust={false}>
      <TableColumn
        sorted={sortValue.includes('name') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('name')}
        tooltipLabel="The dataset name as reported on the registry"
        className='dataset-col-1 col-orderable'
      >
        Name
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('title') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('title')}
        tooltipLabel="The dataset title as reported on the registry"
        className='dataset-col-2 col-orderable'
      >
        Title
      </TableColumn>
      <TableColumn
        sorted={sortValue.includes('filetype') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('filetype')}
        tooltipLabel="The dataset's IATI type as reported on the registry"
        className='dataset-col-3 col-orderablev'
      >
        Filetype
      </TableColumn>
      {!publisher && 
        <TableColumn
          tooltipLabel="The publisher's name as reported on the registry"
          className='dataset-col-4'
        >
          Publisher
        </TableColumn>
      }
      <TableColumn
        sorted={sortValue.includes('note_count') ? sortValue.charAt(0) === '-' ? true : false : undefined}
        onClick={() => sort('note_count')}
        tooltipLabel="The amount of found validation errors"
        className={cn({'col-orderable': true, 'dataset-col-5': !publisher, 'dataset-col-45': publisher})} 
      >
        # of validation errors
      </TableColumn>
    </TableRow>
  </TableHeader>
)};

Header.propTypes = {
  sort: PropTypes.func.isRequired,
  titleSorted: PropTypes.bool,
  yearSorted: PropTypes.bool,
};



export default DatasetList