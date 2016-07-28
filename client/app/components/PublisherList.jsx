import React, { Component, PropTypes } from 'react'
import { WindowScroller, InfiniteLoader, VirtualScroll, AutoSizer, Grid, ScrollSync } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from '../css/tablestyle.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'


class PublisherList extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
      columnCount: 8,
      height: 600,
      overscanColumnCount: 15,
      rowHeight: 40,
      rowCount: 1,
      totalCount: 1,
      order: '-note_count',
      orderAsc: true,
      filters: immutable.Map({'filterChangeTime': Date.now()}),
      filterChangeTime: 0,
      publisherSearchInput: '',
      publisherNameSearchInput: '',
      fixedHeader: ''
    }

    if(props.meta.get('filters') != undefined && props.meta.get('filters').get('publisher') != undefined){
      this.state.publisherSearchInput = props.meta.get('filters').get('publisher')
    }

    if(props.meta.get('filters') != undefined && props.meta.get('filters').get('publisherName') != undefined){
      this.state.publisherNameSearchInput = props.meta.get('filters').get('publisherName')
    }

    if(props.meta.get('filters') != undefined){
      this.state.filters = props.meta.get('filters')
    }

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

    let stateChanges = {
      rowCount: nextProps.publishers.size,
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
      rowCount,
      totalCount,
      order,
      filters,
      filterChangeTime,
      publisherSearchInput,
      publisherNameSearchInput,
      fixedHeader
    } = this.state

    const headerClasses = cn(fixedHeader, 'colHeader')

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <h2>bugs by publisher</h2>
        </div>
        <div id="publisherList">
          <div 
          className={headerClasses}>
            <Grid
              className="HeaderGrid"
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={rowHeight}
              overscanColumnCount={overscanColumnCount}
              cellRenderer={this._renderHeaderCell}
              rowHeight={rowHeight}
              rowCount={1}
              width={1900}
              publisherSearchInput={publisherSearchInput}
              publisherNameSearchInput={publisherNameSearchInput}
              filterChangeTime={filterChangeTime}
            />
          </div>

          <VirtualScroll
            width={1900}
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
        return 720
      case 2:
        return 840
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
          <span className="sort-by" onClick={this.changeOrder.bind(null, 'note_count', false)}><img src="/public/images/sort-alphabetical.svg" /></span>
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
    const { loadedRowsMap } = this.state
    const {publishers} = this.props 
    const row = publishers.get(index)
    const even = (index % 2 == 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'datasets', even)

    if (row == undefined) {
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

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

PublisherList.propTypes = {
  publishers: PropTypes.instanceOf(immutable.List).isRequired,
  meta: PropTypes.instanceOf(immutable.Map).isRequired,
}

function mapStateToProps(state, props) {
    const { publishers } = state
    return {
        publishers: publishers.get('results'),
        meta: publishers.get('meta')
    }
}

import { fetchPublishers } from '../actions/publishers'
export default connect(mapStateToProps, {
    fetchPublishers,
})(PublisherList)