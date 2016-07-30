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


class ImplementedErrorList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      columnWidth: 300,
      columnCount: 7,
      height: 600,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 0,
      fixedHeader: ''
    }
    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)

    this.state.implementedChecks = [
      {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'last-updated-datetime', check: 'last-updated-time is less than previously existing activity', bugs: 1, dashboard: 0, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'last-updated-datetime', check: 'last-updated-time is not present, but is present on previously existing activity', bugs: 1, dashboard: 0, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'xml:lang', check: 'must be on codelist', bugs: 1, dashboard: 1, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'default-currency', check: 'must be on codelist', bugs: 1, dashboard: 1, validator: 0},
      {standard: 'activity', version: '2.02', element: 'iati-activity', attribute:'humanitarian', check: 'must be of type xsd:boolean', bugs: 1, dashboard: 0, validator: 1},
      {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'hierarchy', check: 'must be of type xsd:int', bugs: 1, dashboard: 0, validator: 1},
      
      {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: 'must occur', bugs: 1, dashboard: 0, validator: 1},
      {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: ' must be prefixed with either the current org ref for the reporting org or a previous identifier reported in other-identifier, and suffixed with the organisation’s own activity identifier.', bugs: 0, dashboard: 0, validator: 0},

      {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'ref', check: 'must be of type xsd:int', bugs: 1, dashboard: 1, validator: 1},
      {standard: 'activity', version: '2.01+', element: 'reporting-org', attribute:'ref', check: 'must be in format {RegistrationAgency}-{RegistrationNumber}', bugs: 0, dashboard: 0, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'type', check: 'must be on codelist', bugs: 1, dashboard: 1, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'secondary-publisher', check: 'must be of type xsd:boolean', bugs: 1, dashboard: 0, validator: -1},
      {standard: 'activity', version: '1.0x', element: 'reporting-org', attribute:'xml:lang', check: 'must be on codelist', bugs: 1, dashboard: 1, validator: -1},
      
      {standard: 'activity', version: '2.01+', element: 'title', attribute:'-', check: 'should occur once and only once', bugs: -1, dashboard: -1, validator: 1},
      {standard: 'activity', version: '2.01+', element: 'title', attribute:'xml:lang', check: 'should occur once and only once', bugs: -1, dashboard: -1, validator: 1},

      {standard: 'activity', version: '2.01+', element: 'title/narrative', attribute:'xml:lang', check: 'should occur once and only once', bugs: -1, dashboard: -1, validator: 1},
      


      {standard: 'activity', version: '1.01+', element: 'sector', attribute:'code', check: 'required', bugs: 1, dashboard: -1, validator: 1},
      {standard: 'activity', version: '1.01+', element: 'sector', attribute:'code', check: 'must be on codelist', bugs: 1, dashboard: 1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'sector', attribute:'vocabulary', check: 'must be on codelist', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'sector', attribute:'percentage', check: 'Percentages for all reported sectors must add up to 100%', bugs: -1, dashboard: -1, validator: -1},

      {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'code', check: 'required', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'code', check: 'must be on codelist', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'percentage', check: 'should be of type xsd:decimal, between 0 and 100', bugs: 1, dashboard: 1, validator: 1},

      {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'code', check: 'required', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'code', check: 'must be on codelist', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'percentage', check: 'should be of type xsd:decimal, between 0 and 100', bugs: 1, dashboard: 1, validator: 1},

      {standard: 'activity', version: '1.01+', element: 'recipient-country / recipient-region', attribute:'percentage', check: 'Percentages for all reported countries and regions must add up to 100%.', bugs: -1, dashboard: -1, validator: -1},
      {standard: 'activity', version: '1.01+', element: 'transaction/provider-org', attribute:'provider-acivity-id', check: 'Must be an existing IATI activity', bugs: -1, dashboard: -1, validator: -1},

      {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'code', check: 'on codelist (for default vocabulary)', bugs: 1, dashboard: 1, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'code', check: 'on codelist (for non-default vocabulary)', bugs: 0, dashboard: 0, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'vocabulry', check: 'on codelist if reported', bugs: 1, dashboard: 1, validator: 0},
      {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'significance', check: 'given when vocabulary="1" used', bugs: 1, dashboard: 0, validator: 0},

      {standard: 'activity', version: '1.01+', element: 'result/result-indicator/result-indicator-period', attribute:'significance', check: 'given when vocabulary="1" used', bugs: 1, dashboard: 0, validator: 0},


      {standard: '-', element: 'Any more suggestions?', attribute:'Add to the Trello board please!', check: '-', bugs: 0, dashboard: 0, validator: 0},
    ]

    this.state.rowCount = this.state.implementedChecks.length
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.rowCount != nextProps.modelAggregation.size){
      this.setState({
        rowCount: nextProps.modelAggregation.size
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

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

    const headerClasses = cn(fixedHeader, 'colHeader')

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <p style={{fontWeight: 'bold'}}>Note: This list is incomplete and will be updated in the upcoming days.</p>
          <p>
            The below list will show a complete list of all IATI validation checks.

            <br /><br />
            Do you have any additions? Feel free to add them to the <a target="_blank" href="https://trello.com/b/cAa0ryxh/iati-bugs">Trello board</a> or <a target="_blank" href="https://github.com/VincentVW/iati_bugs">the code</a>!
            <br /><br />
            Last updated: 2016-07-28
          </p>
        </div>
        <div id="implementedBugsList">
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
              width={2400}
            />
          </div>

            <AutoSizer disableHeight>
              {({ width }) => (
                
                <VirtualScroll
                  width={2400}
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
        return 150
      case 1:
        return 260
      case 2:
        return 250
      case 3:
        return 150
      case 4:
        return 150
      case 5:
        return 150
      case 6:
        return 1200
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {
    let content

    switch (columnIndex) {
      case 0:
        content = 'Standard type'
        break
      case 1:
        content = 'Element'
        break
      case 2:
        content = 'Attribute'
        break
      case 3:
        content = 'Checked by IATI Bug Tracker'
        break
      case 4:
        content = 'Checked by IATI Dashboard'
        break
      case 5:
        content = 'Checked by IATI Validator 1.0'
        break
      case 6:
        content = 'Validation check'
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

  implementedContent (status){
    switch(status){
      case -1:
        return 'unknown'
      case 0:
        return 'X'
      case 1:
        return '✓'
    }
  }

  _rowRenderer ({ index, isScrolling }) {
    const { implementedChecks } = this.state
    // const {} = this.props 
    const row = implementedChecks[index]
    const even = (index % 2 == 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', even)

    const bugsClasses = cn('rv-col', 'column-4', 'status-'+row.bugs)
    const dashboardClasses = cn('rv-col', 'column-5', 'status-'+row.dashboard)
    const validatorClasses = cn('rv-col', 'column-6', 'status-'+row.validator)
    const bugsText = this.implementedContent(row.bugs)
    const dashboardText = this.implementedContent(row.dashboard)
    const validatorText = this.implementedContent(row.validator)

    let element = row.element
    if(element.length > 36){
      element = element.substr(0,36) + '...';
    }

    return (
      <div className={rowCn}>

        <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
          {row.standard}
        </div>

        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}} title={row.element}>
          {element}
        </div>
        
        <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 2})}}>
          {row.attribute}
        </div>

        <div className={bugsClasses} style={{width: this._getColumnWidth({index: 3})}}>
          {bugsText}
        </div>

        <div className={dashboardClasses} style={{width: this._getColumnWidth({index: 4})}}>
          {dashboardText}
        </div>

        <div className={validatorClasses} style={{width: this._getColumnWidth({index: 5})}}>
          {validatorText}
        </div>

        <div className="rv-col column-7" style={{width: this._getColumnWidth({index: 6})}}>
          {row.check}
        </div>
      </div>
    )
  }
}

export default ImplementedErrorList
