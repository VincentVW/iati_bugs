/** @flow */
import React, { Component, PropTypes } from 'react'
import { VirtualScroll, Grid } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'
import PublisherCommonErrors from './PublisherCommonErrorList'
import PublisherInfoList from './PublisherInfoList'


class Publisher extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: false,
      publisherLoading: false,
      columnCount: 6,
      height: 400,
      overscanColumnCount: 0,
      rowHeight: 36,
      totalCount: 1,
      order: 'line_number',
      orderAsc: true,
      page: 1,
      next: null,
      previous: null,
      filterChangeCounter: 0,
      fixedHeader: ''
    }

    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)

    this.changeOrder = this.changeOrder.bind(this)
  }

  componentDidMount() {
    this.props.fetchPublisher(this.props.params.publisherId)
    this.props.fetchPublisherDatasets(this.props.params.publisherId, this.state.page, this.state.order)
  }

  componentWillUnmount() {

  }

  componentWillReceiveProps(nextProps) {

    let height = 400;
    if(nextProps.publisherDatasets.size < 11){
      height = nextProps.publisherDatasets.size * this.state.rowHeight
    }

    this.setState({
      height: height,
      loading: nextProps.loading,
      publisherLoading: nextProps.publisherLoading,
      totalCount: nextProps.meta.get('count'),
      order: nextProps.meta.get('order'),
      page: nextProps.meta.get('page'),
      filters: nextProps.meta.get('filters'),
      previous: nextProps.meta.get('previous'),
      next: nextProps.meta.get('next'),
      filterChangeCounter:  nextProps.meta.get('filterChangeCounter'),
    });
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

    this.props.fetchPublisherDatasets(this.props.params.publisherId, '1', order)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {

    const {
      columnCount,
      height,
      overscanColumnCount,
      rowHeight,
      totalCount,
      order,
      filterChangeCounter,
      fixedHeader,
      loading,
      publisherLoading
    } = this.state
    const {params, publisher} = this.props
    const headerClasses = cn(fixedHeader, 'colHeader')
    const loaderClasses = cn({loading: loading}, 'loader')
    return (
      <div>
        <div className="ListInfo">
          <PublisherInfoList publisherLoading={publisherLoading} publisher={publisher}></PublisherInfoList>
          <PublisherCommonErrors publisherId={params.publisherId}></PublisherCommonErrors>
        </div>

        <div className="publisherDatasetsHeader">
          <h2>Datasets</h2>
        </div>
        
        <div className="ListWrapper">
          <div id="publisherDatasets">
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
                width={1920}
              />
            </div>
            <div className={loaderClasses}></div>
            <VirtualScroll
              width={1920}
              height={height}
              rowCount={totalCount}
              rowHeight={rowHeight}
              rowRenderer={this._rowRenderer}
              order={order}
              filterChangeCounter={filterChangeCounter}
            />
          </div>
        </div>
      </div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 250
      case 1:
        return 450
      case 2:
        return 200
      case 3:
        return 200
      case 4:
        return 200
      case 5:
        return 620
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {

    let content

    switch (columnIndex) {
      case 0:
        content = 'Ref'
        break
      case 1:
        content = 'Title'
        break
      case 2:
        content = 'Bug count'
        break
      case 3:
        content = 'Standard type'
        break
      case 4:
        content = 'XML file'
        break
      case 5:
      	content = 'Last checked'
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
    const {publisherDatasets} = this.props 
    const row = publisherDatasets.get(index)
    const even = (index % 2 === 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'publishers', even)
    
    if (row === undefined) {
      return (
        <div className={rowCn}>
          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            loading...
          </div>

          <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}}>
            loading...
          </div>

          <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
            loading..
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

    let ref = row.ref
	if (ref.length > 32){ ref = ref.substr(0,32) + '...'; }
	let url = '/datasets/' + row.id
	let title = row.title
	if(title.length > 45){
		title = title.substr(0,42) + '...'
	}

    return (
      <div className={rowCn}>
        
        <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}} title={row.ref}>
        	<Link to={url}>{ref}</Link>
        </div>

        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={row.title}>
          {title}
        </div>

        <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}} title={row.title}>
          <Link to={url}>{row.note_count}</Link>
        </div>

        <div className="rv-col column-4" style={{width: this._getColumnWidth({index: 3})}}>
          {row.type}
        </div>

        <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 4})}}>
          	<a target="_blank" href={row.source_url}>
				source link
			</a>
        </div>

        <div className="rv-col column-6" style={{width: this._getColumnWidth({index: 5})}}>
          {moment(row.date_updated).format('YYYY-MM-DD HH:mm')}
        </div>
      </div>
    )
  }
}

Publisher.propTypes = {
  publisherLoading: PropTypes.bool.isRequired,
  publisher: PropTypes.instanceOf(immutable.Map).isRequired,
  publisherDatasets: PropTypes.instanceOf(immutable.List).isRequired,
  meta: PropTypes.instanceOf(immutable.Map).isRequired,
  loading: PropTypes.bool.isRequired
}

function mapStateToProps(state, props) {
    const { publisher, publisherDatasets } = state
    return {
        publisherLoading: publisher.get('loading'),
        publisher: publisher.get('meta'),
        publisherDatasets: publisherDatasets.get('results'),
        meta: publisherDatasets.get('meta'),
        loading: publisherDatasets.get('loading'),
    }
}

import { fetchPublisher, fetchPublisherDatasets } from '../actions/publisher'
export default connect(mapStateToProps, {
    fetchPublisher,
    fetchPublisherDatasets
})(Publisher)