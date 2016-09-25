/** @flow */
import React, { Component, PropTypes } from 'react'
import { VirtualScroll, AutoSizer, Grid } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import { connect } from 'react-redux'
import * as immutable from 'immutable'
import { elementMapping } from '../mappings'


class DatasetCommonErrors extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
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
    this.props.fetchDatasetCommonErrors(this.props.datasetId)
  }
  
  componentWillReceiveProps(nextProps) {
    let height = 310;
    if(nextProps.datasetCommonErrors.size < 9){
      height = nextProps.datasetCommonErrors.size * this.state.rowHeight
    }

    this.setState({
      height: height,
      rowCount: nextProps.datasetCommonErrors.size,
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
      filterChangeCounter
    } = this.state

    const headerClasses = cn('colHeader')

    return (
    	<div className="col datasetCommonErrorsWrapper">
        <h2>Bug count per element</h2>
  			<div className="ListWrapper datasetCommonErrors">
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
  							height={rowHeight}
  							cellRenderer={this._renderHeaderCell}
  							rowHeight={rowHeight}
  							rowCount={1}
  							width={820}
  						/>
  					</div>

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
    const {datasetCommonErrors} = this.props 
    const row = datasetCommonErrors.get(index)
    const even = (index % 2 === 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'datasets', even)

    if (row === undefined){
    	return (<div className={rowCn}></div>)
    }

    let model = row.model
    if (elementMapping[model] !== undefined){
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

DatasetCommonErrors.propTypes = {
  datasetCommonErrors: PropTypes.instanceOf(immutable.List).isRequired,
}

function mapStateToProps(state, props) {
    const { datasetCommonErrors } = state
    return {
        datasetCommonErrors: datasetCommonErrors.get('results'),
    }
}

import { fetchDatasetCommonErrors } from '../actions/dataset'
export default connect(mapStateToProps, {
    fetchDatasetCommonErrors
})(DatasetCommonErrors)