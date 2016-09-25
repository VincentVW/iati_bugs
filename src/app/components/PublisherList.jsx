import React, { Component, PropTypes } from 'react'
import { VirtualScroll, Grid } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import { Link } from 'react-router'


class PublisherList extends Component {

  constructor (props, context) {
    super(props, context)

    let state = {
      loading: false,
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
      columnCount: 8,
      height: 600,
      overscanColumnCount: 15,
      rowHeight: 40,
      totalCount: 1,
      order: '-note_count',
      orderAsc: true,
      filters: immutable.Map({'filterChangeTime': Date.now()}),
      filterChangeTime: 0,
      publisherSearchInput: '',
      publisherNameSearchInput: '',
      fixedHeader: ''
    }

    if(props.meta.get('filters') !== undefined && props.meta.get('filters').get('publisher') !== undefined){
      state.publisherSearchInput = props.meta.get('filters').get('publisher')
    }

    if(props.meta.get('filters') !== undefined && props.meta.get('filters').get('publisherName') !== undefined){
      state.publisherNameSearchInput = props.meta.get('filters').get('publisherName')
    }

    if(props.meta.get('filters') !== undefined){
      state.filters = props.meta.get('filters')
    }


    this.state = state

    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)

    this.onPublisherSearch = this.onPublisherSearch.bind(this)
    this.onPublisherNameSearch = this.onPublisherNameSearch.bind(this)
    this.changeOrder = this.changeOrder.bind(this)

    this.inputSearch = this.inputSearch.bind(this)
  }

  componentDidMount(){
    this.props.fetchPublishers(this.state.order, this.state.filters)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillReceiveProps(nextProps) {

    let height = 600;
    if(nextProps.publishers.size < 16){
      height = nextProps.publishers.size * this.state.rowHeight
    }
    let stateChanges = {
      height: height,
      loading: nextProps.loading,
      totalCount: nextProps.meta.get('count'),
      order: nextProps.meta.get('order'),
      filters: nextProps.meta.get('filters'),
      filterChangeTime:  nextProps.meta.get('filterChangeTime'),
    }

    this.setState(stateChanges);
  }

  inputSearch(event, changedHeader, stateHeaderName){
    const searchValue = event.target.value
    let stateChanges = {}
    stateChanges[stateHeaderName] = searchValue
    this.setState(stateChanges)
    const { order, filters } = this.state
    this.props.fetchPublishers(order, filters.set('filterChangeTime', Date.now()).set(changedHeader, searchValue))
  }

  onPublisherSearch(event){
    this.inputSearch(event, 'publisher', 'publisherSearchInput')
  }

  onPublisherNameSearch(event){
    this.inputSearch(event, 'publisherName', 'publisherNameSearchInput')
  }

  changeOrder(nextOrder, defaultOrder){
    
    const { orderAsc, order, filters } = this.state
    let asc = orderAsc;

    if (order.indexOf(nextOrder) > -1){
      asc = !asc;
    } else {
      asc = defaultOrder;
    }

    if(!asc){
      nextOrder = '-' + nextOrder;
    }

    this.setState({orderAsc: asc})
    this.props.fetchPublishers(nextOrder, filters)
  }

  render () {
    const {
      columnCount,
      height,
      overscanColumnCount,
      rowHeight,
      totalCount,
      order,
      filterChangeTime,
      publisherSearchInput,
      publisherNameSearchInput,
      fixedHeader,
      loading
    } = this.state

    const headerClasses = cn(fixedHeader, 'colHeader')
    const loaderClasses = cn({loading: loading}, 'loader')

    return (
      <div className="ListWrapper2">
        <div id="publisherList">
          <div 
          className={headerClasses}>
            <Grid
              className="HeaderGrid"
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={46}
              overscanColumnCount={overscanColumnCount}
              cellRenderer={this._renderHeaderCell}
              rowHeight={46}
              rowCount={1}
              width={2000}
              publisherSearchInput={publisherSearchInput}
              publisherNameSearchInput={publisherNameSearchInput}
              filterChangeTime={filterChangeTime}
            />
          </div>
          <div className={loaderClasses}></div>
            <VirtualScroll
              width={2000}
              height={height}
              rowCount={totalCount}
              rowHeight={rowHeight}
              rowRenderer={this._rowRenderer}
              order={order}
              filterChangeTime={filterChangeTime}
            />
        </div>
      </div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 340
      case 1:
        return 550
      case 2:
        return 1110
      case 3:
        return 100
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {

    let content
    const {publisherSearchInput, publisherNameSearchInput } = this.state

    switch (columnIndex) {

      case 0:
        content = <input
            type="text"
            onChange={this.onPublisherSearch}
            value={publisherSearchInput}
            placeholder="Publisher ref"
          />
        break
      case 1:
        content = <input
            type="text"
            onChange={this.onPublisherNameSearch}
            value={publisherNameSearchInput}
            placeholder="Publisher name"
          />
        break
      case 2:
        content = <div className="inputHeaderCell">
          Bug count
          <span className="sort-by" onClick={this.changeOrder.bind(null, 'note_count', false)}><img alt="Sort by bug count" src="/images/sort-alphabetical.svg" /></span>
          </div>
        break
      case 3:
        content = 'Activity count'
        break
      default:
        content = (
          <div>
          empty
          </div>
        )
        break
    }

    return (
      <div className="headerCell">
        {content}
      </div>
    )
  }

  _rowRenderer ({ index, isScrolling }) {
    const {publishers} = this.props 
    const row = publishers.get(index)
    const even = (index % 2 === 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'datasets', even)

    if (row === undefined) {
      return (
        <div className={rowCn}>
          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            loading...
          </div>
        </div>
      )
    } else {
      let url = 'publishers/' + row._publisher.id
      let publisherName = row._publisher.org_name
      if(publisherName.length > 90){
        publisherName = publisherName.substr(0,87) + '...'
      }
      return (
        <div className={rowCn}>

          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            {row._publisher.org_id}
          </div>
          
          <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={row._publisher.org_name}>
            <Link to={url}>{publisherName}</Link>
          </div>

          <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
            {row.note_count}
          </div>
        </div>
      )
    }
  }
}

PublisherList.propTypes = {
  loading: PropTypes.bool.isRequired,
  publishers: PropTypes.instanceOf(immutable.List).isRequired,
  meta: PropTypes.instanceOf(immutable.Map).isRequired,
}

function mapStateToProps(state, props) {
    const { publishers } = state
    return {
        loading: publishers.get('loading'),
        publishers: publishers.get('results'),
        meta: publishers.get('meta')
    }
}

import { fetchPublishers } from '../actions/publishers'
export default connect(mapStateToProps, {
    fetchPublishers,
})(PublisherList)