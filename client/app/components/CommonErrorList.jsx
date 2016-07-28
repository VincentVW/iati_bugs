/** @flow */
import React, { Component, PropTypes } from 'react'
import { WindowScroller, AutoSizer, Grid, VirtualScroll, ScrollSync } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from '../css/tablestyle.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import { connect } from 'react-redux'
import {List} from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'
import { errorTypeMapping, elementMapping } from '../mappings'

// element -> reason -> note
const reasonMapping = {
  'policy-marker': { 
    'not found on the accompanying code list': '300k bugs by UN DEVCO due to prepending a zero to policy-marker codes',
    'significance is required when using OECD DAC CRS vocabulary': '208k bugs by JICA due to missing significance, ',  
  },
  'participating-org/narrative': {
    'must specify xml:lang on iati-activity or xml:lang on the element itself': 'Many reporters not applying the rule to set lang or default lang',
  },
  'location/location-id': {
    'not found on the accompanying code list': '115k bugs by Aiddata / WB due to non-existing vocabulary "GEO"'
  },
  'transaction/sector': {
    'required attribute missing': '108k bugs by UNICEF due to empty code'
  },

}

class CommonErrorList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      columnWidth: 300,
      columnCount: 6,
      height: 600,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 1,
      fixedHeader: ''
    }
    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)

    // this.handleScroll = this.handleScroll.bind(this)

    
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.rowCount != nextProps.modelAggregation.size){
      this.setState({
        rowCount: nextProps.modelAggregation.size
      });
    }
  }

  componentDidMount() {
    this.props.fetchModelAggregation()
    // window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.handleScroll);
  }

  // handleScroll(event) {
  //   let scrollTop = event.srcElement.body.scrollTop;
  //   let fixedHeader = ''
    
  //   if(scrollTop > 255){
  //     fixedHeader = 'fixed'
  //   }
    
  //   if(this.state.fixedHeader != fixedHeader){
  //     this.setState({
  //       fixedHeader: fixedHeader
  //     });
  //   }
  // }

  componentWillReceiveProps(nextProps) {

    let stateChanges = {
      rowCount: nextProps.modelAggregation.size,
    }

    this.setState(stateChanges);
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
      rowCount,
      fixedHeader
    } = this.state

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <h2>Common bugs</h2>
          <p>
            The below list shows all detected bugs by IATI element/attribute and type of bug.
            <br />&nbsp;<br />
            Where known, its also shown why this field is often filled in incorrectly.
          </p>
        </div>

        <div id="commonErrorList">
          <div 
          className={fixedHeader}
          style={{
            backgroundColor: `rgb(58, 58, 58)`,
            color: `rgb(255, 255, 255)`,
            height: rowHeight,
            minWidth: 2350,
            width: `100%`
          }}>
            <Grid
              className="HeaderGrid"
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={rowHeight}
              overscanColumnCount={overscanColumnCount}
              cellRenderer={this._renderHeaderCell}
              rowHeight={rowHeight}
              rowCount={1}
              width={2350}
            />
          </div>

            <AutoSizer disableHeight>
              {({ width }) => (
                
                <VirtualScroll
                  width={2350}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  rowRenderer={this._rowRenderer}
                />

              )}
            </AutoSizer>
        </div>
      </div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 200
      case 1:
        return 450
      case 2:
        return 250
      case 3:
        return 150
      case 4:
        return 600
      case 5:
        return 800
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {
    let content

    switch (columnIndex) {
      case 0:
        content = 'Bug type'
        break
      case 1:
        content = 'Element'
        break
      case 2:
        content = 'Attribute'
        break
      case 3:
        content = 'Bug count'
        break
      case 4:
        content = 'Bug message'
        break
      case 5:
        content = 'Main reason'
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
    const {modelAggregation} = this.props 
    const row = modelAggregation.get(index)
    const even = (index % 2 == 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', 'commonErrors', even)

    if (row == undefined) {
      return (
        <div className={rowCn}>
          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            loading...
          </div>
        </div>
      )
    } else {
      
      let model = row.model
      if(elementMapping[model] != undefined){
        model = elementMapping[model]
      }

      let notes = '-';
      if(reasonMapping[model] != undefined && reasonMapping[model][row.message] != undefined){
        notes = reasonMapping[model][row.message]
      }

      let message = row.message
      const fullMessage = message
      if(message.length > 75){
        message = message.substring(0,75) + '...';
      }
      return (
        <div className={rowCn}>

          <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
            {errorTypeMapping[row.exception_type]}
          </div>
          
          <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}}>
            {model}
          </div>

          <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
            {row.field}
          </div>

          <div className="rv-col column-4" style={{width: this._getColumnWidth({index: 3})}}>
            {row.note_count}
          </div>

          <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 4})}} title={fullMessage}>
            {message}
          </div>

          <div className="rv-col column-6" style={{width: this._getColumnWidth({index: 5})}}>
            {notes}
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

CommonErrorList.propTypes = {
  modelAggregation: PropTypes.instanceOf(List).isRequired
} 

function mapStateToProps(state, props) {
    const { modelAggregation } = state

    return {
        modelAggregation: modelAggregation,
    }
}

import { fetchModelAggregation } from '../actions/modelAggregation'
export default connect(mapStateToProps, {
    fetchModelAggregation,
})(CommonErrorList)