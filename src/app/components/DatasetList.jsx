import React, { Component, PropTypes } from 'react'
import { InfiniteLoader, VirtualScroll, Grid } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'

const STATUS_LOADING = 1
const STATUS_LOADED = 2


class DatasetList extends Component {

  constructor (props, context) {
    super(props, context)

    const now = Date.now()

    let state = {
      loading: false,
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
      columnCount: 8,
      height: 600,
      overscanColumnCount: 15,
      rowHeight: 40,
      totalCount: 0,
      order: 'ref',
      orderAsc: true,
      page: 1,
      filters: immutable.Map({
        'filterChangeTime': now
      }),
      next: null,
      previous: null,
      filterChangeTime: now,
      stateFilterChangeTime: now,
      refSearchInput: '',
      titleSearchInput: '',
      publisherSearchInput: '',
      publisherNameSearchInput: '',
      fixedHeader: '',
      scrollToIndex: null,
    }

    if(props.meta.get('filters') !== undefined && props.meta.get('filters').get('ref') !== undefined){
      state.refSearchInput = props.meta.get('filters').get('ref')
    }

    if(props.meta.get('filters') !== undefined && props.meta.get('filters').get('title') !== undefined){
      state.titleSearchInput = props.meta.get('filters').get('title')
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

    this.onRefSearch = this.onRefSearch.bind(this)
    this.onTitleSearch = this.onTitleSearch.bind(this)
    this.onPublisherSearch = this.onPublisherSearch.bind(this)
    this.onPublisherNameSearch = this.onPublisherNameSearch.bind(this)
    this.changeOrder = this.changeOrder.bind(this)

    this.inputSearch = this.inputSearch.bind(this)

    this._timeoutIdMap = {}
    this._isRowLoaded = this._isRowLoaded.bind(this)
    this._loadMoreRows = this._loadMoreRows.bind(this)
    this._clearData = this._clearData.bind(this)
  }

  componentDidMount(){
    this.props.fetchDatasets(this.state.page, this.state.order, this.state.filters)
  }

  componentWillUnmount() {
    Object.keys(this._timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  componentWillReceiveProps(nextProps) {

    let height = 600;
    if(nextProps.datasets.size < 16){
      height = nextProps.datasets.size * this.state.rowHeight
    }

    let stateChanges = {
      height: height,
      loading: nextProps.loading,
      totalCount: nextProps.meta.get('count'),
      order: nextProps.meta.get('order'),
      page: nextProps.meta.get('page'),
      filters: nextProps.meta.get('filters'),
      previous: nextProps.meta.get('previous'),
      next: nextProps.meta.get('next'),
      filterChangeTime: nextProps.meta.get('filterChangeTime'),
    }

    this.setState(stateChanges);
  }

  inputSearch(event, changedHeader, stateHeaderName){
    const searchValue = event.target.value
    let stateChanges = {
      stateFilterChangeTime: Date.now(),
    }
    stateChanges[stateHeaderName] = searchValue
    this.setState(stateChanges)
    const { order, filters } = this.state
    this.props.fetchDatasets('1', order, filters.set('filterChangeTime', stateChanges.stateFilterChangeTime).set(changedHeader, searchValue))
  }

  onRefSearch(event){
    this.inputSearch(event, 'ref', 'refSearchInput')
  }

  onTitleSearch(event){
    this.inputSearch(event, 'title', 'titleSearchInput')
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

    // this._clearData();
    // this._loadMoreRows(0,0);

    const now = Date.now()

    this.setState({
      orderAsc: asc,
      stateFilterChangeTime: now, 
      totalCount: 0,
      scrollToIndex: 0,
    })
    this.props.fetchDatasets('1', nextOrder, filters.set('filterChangeTime', now))
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
      stateFilterChangeTime,
      refSearchInput,
      titleSearchInput,
      publisherSearchInput,
      publisherNameSearchInput,
      fixedHeader,
      loading,
      scrollToIndex
    } = this.state

    const headerClasses = cn(fixedHeader, 'colHeader')
    const loaderClasses = cn({loading: loading}, 'loader')

    return (
      <div className="ListWrapper2">
        <div id="datasetList">
          <div className={headerClasses}>
            <Grid
              className="HeaderGrid"
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={46}
              overscanColumnCount={overscanColumnCount}
              cellRenderer={this._renderHeaderCell}
              rowHeight={46}
              rowCount={1}
              width={2350}
              refSearchInput={refSearchInput}
              titleSearchInput={titleSearchInput}
              publisherSearchInput={publisherSearchInput}
              publisherNameSearchInput={publisherNameSearchInput}
              stateFilterChangeTime={stateFilterChangeTime}
            />
          </div>
          <div className={loaderClasses}></div>
          <InfiniteLoader
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this._loadMoreRows}
            minimumBatchSize={100}
            rowCount={totalCount}>
            {({ onRowsRendered, registerChild }) => (
              <VirtualScroll
                ref={registerChild}
                width={2350}
                height={height}
                onRowsRendered={onRowsRendered}
                rowCount={totalCount}
                rowHeight={rowHeight}
                rowRenderer={this._rowRenderer}
                order={order}
                filterChangeTime={filterChangeTime}
                scrollTop={scrollToIndex}
              />
            )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }

  _clearData () {
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0
    })
  }
  
  _isRowLoaded ({ index }) {
    const { loadedRowsMap } = this.state
    return !!loadedRowsMap[index] // STATUS_LOADING or STATUS_LOADED
  }

  _loadMoreRows ({ startIndex, stopIndex }) {

    startIndex = 200 * Math.floor(startIndex / 200);
    stopIndex = startIndex + 200;
    let page = Math.floor(startIndex / 200) + 1;
    if(page > 1){
      this.props.fetchDatasets(page, this.state.order, this.state.filters)
    }

    const { loadedRowsMap, loadingRowCount } = this.state
    const increment = stopIndex - startIndex + 1

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment
    })

    let promiseResolver

    const timeoutId = setTimeout(() => {
      const { loadedRowCount, loadingRowCount } = this.state

      delete this._timeoutIdMap[timeoutId]

      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED
      }

      this.setState({
        loadingRowCount: loadingRowCount - increment,
        loadedRowCount: loadedRowCount + increment
      })

      promiseResolver()
    }, 750 + Math.round(Math.random() * 100))

    this._timeoutIdMap[timeoutId] = true

    

    return new Promise(resolve => {
      promiseResolver = resolve
    })
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 250
      case 1:
        return 400
      case 2:
        return 300
      case 3:
        return 150
      case 4:
        return 150
      case 5:
        return 150
      case 6:
        return 200
      case 7:
        return 750
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {

    let content
    const { refSearchInput, titleSearchInput, publisherSearchInput, publisherNameSearchInput } = this.state

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
            <input
              type="text"
              onChange={this.onRefSearch}
              value={refSearchInput}
              placeholder="Dataset ref"
            />
            <span className="sort-by" onClick={this.changeOrder.bind(null, 'ref', true)}><img alt="Sort by ref" src="/images/sort-alphabetical.svg" /></span>
          </div>
        break
      case 3:
        content = <div className="bug-count-header">
        Bug count
            <span className="sort-by" onClick={this.changeOrder.bind(null, 'note_count', false)}><img alt="Sort by bug count" src="/images/sort-numeric.svg" /></span></div>
        break
      case 4:
        content = 'XML file'
        break
      case 5:
        content = 'Standard type'
        break
      case 6:
        content = 'Last checked'
        break
      
      case 7:
        content = <input
            type="text"
            onChange={this.onTitleSearch}
            value={titleSearchInput}
            placeholder="Dataset title"
          />
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
    const {datasets} = this.props 
    const row = datasets.get(index)
    const even = (index % 2 === 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'datasets', even)

    if (loadedRowsMap[index] !== STATUS_LOADED || row === undefined) {
      return (
        <div className={rowCn}>
          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            loading...
          </div>

          <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}}>
            loading...
          </div>

          <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
            loading...
          </div>

          <div className="rv-col column-4" style={{width: this._getColumnWidth({index: 3})}}>
            loading...
          </div>

          <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 4})}}>
            loading...
          </div>

          <div className="rv-col column-6" style={{width: this._getColumnWidth({index: 5})}}>
            loading...
          </div>

          <div className="rv-col column-7" style={{width: this._getColumnWidth({index: 6})}}>
            loading...
          </div>
          <div className="rv-col column-8" style={{width: this._getColumnWidth({index: 7})}}>
            loading...
          </div>
        </div>
      )
    } else {
      let ref = row.ref
      if (ref.length > 32){ ref = ref.substr(0,32) + '...'; }
      let url = '/datasets/' + row.id
      let publisherName = row.publisher.org_name
      if(publisherName.length > 45){
        publisherName = publisherName.substr(0,42) + '...'
      }
      return (
        <div className={rowCn}>

          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            {row.publisher.org_id}
          </div>
          
          <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={row.publisher.org_name}>
            {publisherName}
          </div>

          <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
            <Link to={url}>{ref}</Link>
          </div>

          <div className="rv-col column-4" style={{width: this._getColumnWidth({index: 3})}}>
            <Link to={url}>{row.note_count}</Link>
          </div>

          <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 4})}}>
            <a target="_blank" href={row.source_url}>
              source link
            </a>
          </div>

          <div className="rv-col column-6" style={{width: this._getColumnWidth({index: 5})}}>
            {row.type}
          </div>

          <div className="rv-col column-7" style={{width: this._getColumnWidth({index: 6})}}>
            {moment(row.date_updated).format('YYYY-MM-DD HH:mm')}
          </div>

          <div className="rv-col column-8" style={{width: this._getColumnWidth({index: 7})}}>
            {row.title}
          </div>
        </div>
      )
    }
  }
}

DatasetList.propTypes = {
  loading: PropTypes.bool.isRequired,
  datasets: PropTypes.instanceOf(immutable.List).isRequired,
  meta: PropTypes.instanceOf(immutable.Map).isRequired,
}

function mapStateToProps(state, props) {
    const { datasets } = state
    return {
        loading: datasets.get('loading'),
        datasets: datasets.get('results'),
        meta: datasets.get('meta')
    }
}

import { fetchDatasets } from '../actions/datasets'
export default connect(mapStateToProps, {
    fetchDatasets,
})(DatasetList)