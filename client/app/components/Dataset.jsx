/** @flow */
import React, { Component, PropTypes } from 'react'
import { WindowScroller, VirtualScroll, InfiniteLoader, AutoSizer, Grid, ScrollSync } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from '../css/tablestyle.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'
import { errorTypeMapping, elementMapping } from '../mappings'
import DatasetCommonErrors from './DatasetCommonErrorList'
import DatasetInfoList from './DatasetInfoList'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

class Dataset extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
      columnCount: 5,
      height: 1000,
      overscanColumnCount: 0,
      overscanRowCount: 0,
      rowHeight: 36,
      rowCount: 1,
      totalCount: 1,
      order: 'line_number',
      orderAsc: true,
      page: 1,
      next: null,
      previous: null,
      filterChangeCounter: 0,
      fixedHeader: ''
    }

    // this._renderBodyCell = this._renderBodyCell.bind(this)
    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)

    this.changeOrder = this.changeOrder.bind(this)

    this._timeoutIdMap = {}
    this._isRowLoaded = this._isRowLoaded.bind(this)
    this._loadMoreRows = this._loadMoreRows.bind(this)
    this._clearData = this._clearData.bind(this)

    this.handleScroll = this.handleScroll.bind(this)

    this.props.fetchDataset(this.props.params.datasetId)
    this.props.fetchDatasetNotes(this.props.params.datasetId, this.state.page, this.state.order)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    Object.keys(this._timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId)
    })
  }

  handleScroll(event) {
    let scrollTop = event.srcElement.body.scrollTop;
    let fixedHeader = ''
    
    if(scrollTop > 480){
      fixedHeader = 'fixed'
    }
    
    if(this.state.fixedHeader != fixedHeader){

      this.setState({
        fixedHeader: fixedHeader
      });
    }
  }

  componentWillReceiveProps(nextProps) {

    // check if order or filters changed, then, clear loaded indexes
    if (this.state.filterChangeCounter != nextProps.meta.get('filterChangeCounter') || this.state.order != nextProps.meta.get('order')){
      this._clearData();
    }

    this.setState({
      rowCount: nextProps.datasetNotes.size,
      totalCount: nextProps.meta.get('count'),
      order: nextProps.meta.get('order'),
      page: nextProps.meta.get('page'),
      filters: nextProps.meta.get('filters'),
      previous: nextProps.meta.get('previous'),
      next: nextProps.meta.get('next'),
      filterChangeCounter:  nextProps.meta.get('filterChangeCounter'),
    });
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
      this.props.fetchDatasetNotes(this.props.params.datasetId, page, this.state.order)
    }

    const { loadedRowsMap, loadingRowCount } = this.state
    const increment = stopIndex - startIndex + 1

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment
    })

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
    }, 500 + Math.round(Math.random() * 1000))

    this._timeoutIdMap[timeoutId] = true

    let promiseResolver

    return new Promise(resolve => {
      promiseResolver = resolve
    })
  }

  changeOrder(order, defaultOrder){
    let asc = this.state.orderAsc;

    if (this.state.order.indexOf(order) > -1){
      asc = !asc;
    } else {
      asc = defaultOrder;
    }

    if(!asc){
      order = '-' + order;
    }

    this.setState({
      orderAsc: asc
    })

    this.props.fetchDatasetNotes(this.props.params.datasetId, '1', order)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {

    const {
      columnCount,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
      totalCount,
      order,
      filters,
      filterChangeCounter,
      fixedHeader
    } = this.state

    const {params, dataset, loading} = this.props

    const headerClasses = cn(fixedHeader, 'colHeader')

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <h1>{dataset.get('title')}</h1>
          <DatasetInfoList dataset={dataset}></DatasetInfoList>
          <DatasetCommonErrors datasetId={params.datasetId}></DatasetCommonErrors>
        </div>
        <div className="datasetNotesHeader">
          <h2>Bugs</h2>
        </div>
        <div className="ListWrapper">
          <InfiniteLoader
            isRowLoaded={this._isRowLoaded}
            loadMoreRows={this._loadMoreRows}
            minimumBatchSize={100}
            rowCount={totalCount}
          >
            {({ onRowsRendered, registerChild }) => (

                  <div id="datasetNotes">
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
                        width={2140}
                      />
                    </div>

                    <VirtualScroll
                      ref={registerChild}
                      width={2140}
                      height={height}
                      onRowsRendered={onRowsRendered}
                      rowCount={totalCount}
                      rowHeight={rowHeight}
                      rowRenderer={this._rowRenderer}
                      order={order}
                      filterChangeCounter={filterChangeCounter}
                    />
                  </div>
                 
              )}
          </InfiniteLoader>
        </div>
      </div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 100
      case 1:
        return 450
      case 2:
        return 370
      case 3:
        return 220
      case 4:
        return 1000
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {

    let content

    switch (columnIndex) {
      case 0:
        content = 'XML line'
        break
      case 1:
        content = 'IATI Identifier'
        break
      case 2:
        content = 'Element'
        break
      case 3:
        content = 'Attribute'
        break
      case 4:
        content = 'Bug message'
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
    const {datasetNotes} = this.props 
    const row = datasetNotes.get(index)
    const even = (index % 2 == 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'datasets', even)
    
    if (loadedRowsMap[index] !== STATUS_LOADED || row == undefined) {
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
        </div>
      )
    }

    let model = row.model
    if (elementMapping[model] != undefined){
      model = elementMapping[model]
    }
    const fullModel = model
    if(model.length > 44){
      model = model.substring(0,42) + '...'
    }
    let iati_identifier = row.iati_identifier
    if(iati_identifier.length > 45){
      iati_identifier = iati_identifier.substring(0,45) + '...'
    }

    return (
      <div className={rowCn}>
        
        <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
          {row.line_number}
        </div>

        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={row.iati_identifier}>
          {iati_identifier}
        </div>

        <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}} title={fullModel}>
          {model}
        </div>

        <div className="rv-col column-4" style={{width: this._getColumnWidth({index: 3})}}>
          {row.field}
        </div>

        <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 4})}}>
          {row.message}
        </div>
      </div>
    )
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

/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors (color1, color2, amount) {
  const weight1 = amount
  const weight2 = 1 - amount

  const r = Math.round(weight1 * color1.r + weight2 * color2.r)
  const g = Math.round(weight1 * color1.g + weight2 * color2.g)
  const b = Math.round(weight1 * color1.b + weight2 * color2.b)

  return { r, g, b }
}

Dataset.propTypes = {
  dataset: PropTypes.instanceOf(immutable.Map).isRequired,
  datasetNotes: PropTypes.instanceOf(immutable.List).isRequired,
  meta: PropTypes.instanceOf(immutable.Map).isRequired,
  loading: PropTypes.bool.isRequired
}

function mapStateToProps(state, props) {
    const { dataset, datasetNotes } = state
    return {
        dataset: dataset,
        datasetNotes: datasetNotes.get('results'),
        meta: datasetNotes.get('meta'),
        loading: datasetNotes.get('loading'),
    }
}

import { fetchDataset, fetchDatasetNotes } from '../actions/dataset'
export default connect(mapStateToProps, {
    fetchDataset,
    fetchDatasetNotes
})(Dataset)