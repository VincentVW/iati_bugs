/** @flow */
import React, { Component, PropTypes } from 'react'
import { InfiniteLoader, AutoSizer, Grid, ScrollSync } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'
import styles from '../css/tablestyle.css'
import scrollbarSize from 'dom-helpers/util/scrollbarSize'
import { connect } from 'react-redux'
import {List} from 'immutable'
import moment from 'moment'
import { Link } from 'react-router'

const LEFT_COLOR_FROM = hexToRgb('#4ABA79')
const LEFT_COLOR_TO = hexToRgb('#BC3959')

// const LEFT_COLOR_FROM = hexToRgb('#55b4eb')
// const LEFT_COLOR_TO = hexToRgb('#9aced9')

const TOP_COLOR_FROM = hexToRgb('#000000')
const TOP_COLOR_TO = hexToRgb('#000000')


class PublisherList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      columnWidth: 300,
      columnCount: 3,
      height: 1000,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 36,
      rowCount: 0,
      totalCount: 4000
    }

    this._renderBodyCell = this._renderBodyCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this.props.fetchPublishers()
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.rowCount != nextProps.publishers.size){
      this.setState({
        rowCount: nextProps.publishers.size
      });
    }
  }

  render () {

    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
      totalCount
    } = this.state

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <h2>bugs by publisher</h2>
          <p>
            The below list shows all detected bugs by IATI Publisher.
          </p>
          <p>
            To search datasets by the publisher, please use the search on the <Link to="/datasets">datasets</Link> page for now.
          </p>
        </div>
        <div className="ListWrapper">
          <ScrollSync>
            {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => {
              const x = scrollLeft / (scrollWidth - clientWidth)
              const y = scrollTop / (scrollHeight - clientHeight)

              const leftBackgroundColor = mixColors(LEFT_COLOR_FROM, LEFT_COLOR_TO, y)
              const leftColor = '#ffffff'
              const topBackgroundColor = mixColors(TOP_COLOR_FROM, TOP_COLOR_TO, x)
              const topColor = '#ffffff'
              const middleBackgroundColor = mixColors(leftBackgroundColor, topBackgroundColor, 0.8)
              const middleColor = '#ffffff'

              return (
                <div 
                  className="GridRow"
                  style={{
                    width: '100%',
                  }}>
                  
                  <div className="GridColumn">
                    <AutoSizer disableHeight>
                      {({ width }) => (
                        <div>
                          <div style={{
                            backgroundColor: `rgb(58, 58, 58)`,
                            color: topColor,
                            height: rowHeight,
                            width: width - scrollbarSize()
                          }}>
                            <Grid
                              className="HeaderGrid"
                              columnWidth={this._getColumnWidth}
                              columnCount={columnCount}
                              height={rowHeight}
                              overscanColumnCount={overscanColumnCount}
                              cellRenderer={this._renderLeftHeaderCell}
                              rowHeight={rowHeight}
                              rowCount={1}
                              scrollLeft={scrollLeft}
                              width={width - scrollbarSize()}
                            />
                          </div>
                          <div
                            style={{
                              backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                              color: middleColor,
                              height,
                              width
                            }}
                          >

                            <Grid
                              className="BodyGrid"
                              columnWidth={this._getColumnWidth}
                              columnCount={columnCount}
                              height={height}
                              onScroll={onScroll}
                              overscanColumnCount={overscanColumnCount}
                              overscanRowCount={overscanRowCount}
                              cellRenderer={this._renderBodyCell}
                              rowHeight={rowHeight}
                              rowCount={rowCount}
                              width={width}
                            />
                          </div>
                        </div>
                      )}
                    </AutoSizer>
                  </div>
                </div>
              )
            }}
          </ScrollSync>
        </div>
      </div>
    )
  }


  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 240
      case 1:
        return 650
      case 2:
        return 180
      case 3:
        return 180
      case 4:
        return 600
      case 5:
        return 800
      default:
        return 100
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _renderBodyCell ({ columnIndex, rowIndex }) {

    const {publishers} = this.props
    let content
    switch (columnIndex) {
      case 0:
        content = publishers.get(rowIndex)._publisher.org_id
        break
      case 1:
        content = publishers.get(rowIndex)._publisher.org_name
        break
      case 2:
        content = publishers.get(rowIndex).note_count
        break
      case 3:
        //content = publishers.get(rowIndex).activity_count
        content = 'to do'
        break
      default:
        content = (
          <div>
          
          </div>
        )
        break
    }

    return (
      <div className="cell">
        {content}
      </div>
    )
  }

  _renderLeftHeaderCell ({ columnIndex, rowIndex }) {
    let content

    switch (columnIndex) {
      case 0:
        content = 'Ref'
        break
      case 1:
        content = 'Name'
        break
      case 2:
        content = 'Error count'
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

PublisherList.propTypes = {
  publishers: PropTypes.instanceOf(List).isRequired
} 

function mapStateToProps(state, props) {
    const { publishers } = state

    return {
        publishers: publishers,
    }
}

import { fetchPublishers } from '../actions/publishers'
export default connect(mapStateToProps, {
    fetchPublishers,
})(PublisherList)