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


class PublisherCommonErrors extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: false,
      columnCount: 3,
      height: 310,
      rowHeight: 36,
      rowCount: 1,
      filterChangeCounter: 0
    }

    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
    
  }
  componentDidMount(){
    this.props.fetchPublisherCommonErrors(this.props.publisherId)
  }
  
  componentWillReceiveProps(nextProps) {

    let height = 310;
    if(nextProps.publisherCommonErrors.size < 9){
      height = nextProps.publisherCommonErrors.size * this.state.rowHeight
    }

    this.setState({
      loading: nextProps.loading,
      height: height,
      rowCount: nextProps.publisherCommonErrors.size,
      filterChangeCounter: this.state.filterChangeCounter + 1
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {

    const {
      columnCount,
      height,
      rowHeight,
      rowCount,
      filterChangeCounter,
      loading
    } = this.state

    const {publisher} = this.props

    const headerClasses = cn('colHeader')
    const loaderClasses = cn({loading: loading}, 'loader')

    return (
    	<div className="col publisherCommonErrorsWrapper">
        <h2>Bug count per element</h2>
  			<div className="ListWrapper publisherCommonErrors">
  				<div style={{
  					overflowX: `scroll`,
  					width: `100%`,
            maxWidth: `820px`
  				}}>
  					<div className={headerClasses}>
  						<Grid
  							className="HeaderGrid"
  							columnWidth={this._getColumnWidth}
  							columnCount={columnCount}
  							height={46}
  							cellRenderer={this._renderHeaderCell}
  							rowHeight={46}
  							rowCount={1}
  							width={820}
  						/>
  					</div>
            <div className={loaderClasses}></div>
  					<AutoSizer disableHeight>
  					    {({ width }) => (
  					      <VirtualScroll
  					        height={height}
  					        rowRenderer={this._rowRenderer}
  					        rowHeight={rowHeight}
  					        rowCount={rowCount}
  					        width={820}
                    filterChangeCounter={filterChangeCounter}
  					      />
  					  	)}
  					</AutoSizer>
  				</div> 
  		</div>
		</div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 120
      case 1:
        return 400
      case 2:
        return 300
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {

    let content

    switch (columnIndex) {
      case 0:
        content = 'Bug count'
        break
      case 1:
        content = 'Element'
        break
      case 2:
        content = 'Field'
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
    const {publisherCommonErrors} = this.props 
    const row = publisherCommonErrors.get(index)
    const even = (index % 2 == 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', even)

    if (row == undefined){
    	return (<div className={rowCn}></div>)
    }

    let model = row.model
    if (elementMapping[model] != undefined){
      model = elementMapping[model]
    }
    const fullModel = model
    if(model.length > 44){
      model = model.substring(0,42) + '...'
    }

    return (
      <div className={rowCn}>
        <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
          {row.note_count}
        </div>
        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={fullModel}>
          {model}
        </div>
        <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
          {row.field}
        </div>
      </div>
    )
  }
}

PublisherCommonErrors.propTypes = {
  loading: PropTypes.bool.isRequired,
  publisherCommonErrors: PropTypes.instanceOf(immutable.List).isRequired,
}

function mapStateToProps(state, props) {
    const { publisherCommonErrors } = state
    return {
        loading: publisherCommonErrors.get('loading'),
        publisherCommonErrors: publisherCommonErrors.get('results'),
    }
}

import { fetchPublisherCommonErrors } from '../actions/publisher'
export default connect(mapStateToProps, {
    fetchPublisherCommonErrors
})(PublisherCommonErrors)