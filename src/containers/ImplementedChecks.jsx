import React, { Component } from 'react'
import TextField from 'react-md/lib/TextFields'
import DataTableContainer from '../components/helpers/DataTable'
import { implementedChecks } from '../components/checksList'

import { connect } from 'react-redux'
import { setPageTitle } from '../actions/header'
import Avatar from 'react-md/lib/Avatars';
import Chip from 'react-md/lib/Chips';


class ImplementedChecks extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
          query: '',
          implementedChecks: []
    }

    this.changeQuery = this.changeQuery.bind(this)
    this.setQuery = this.setQuery.bind(this)
    this.timeout = null
  }

  setQuery(q){
    if(q === ''){
      this.setState({
        query: '',
        implementedChecks: implementedChecks
      })
    } else {
      const filteredChecks = implementedChecks.filter((o) => o.element.includes(q) || o.attribute.includes(q) || o.check.includes(q))
      this.setState({
        query: q,
        implementedChecks: filteredChecks
      })
    }
  }

  changeQuery (e){
    const value = e.target.value

    clearTimeout(this.timeout)

    const setQuery = this.setQuery

    const enterPressed = e.key === 'Enter'

    this.timeout = setTimeout(function () {
      setQuery(value)
    }, enterPressed ? 0 : 2000);
  }

  componentDidMount() {
    this.props.setPageTitle(`Implemented checks`)
    this.setState({implementedChecks: implementedChecks})
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.implementedChecks.length !== nextState.implementedChecks.length){
      return true
    }
    return false
  }

  render () {

        const {
              implementedChecks
        } = this.state

        const statusMapping = {
          '-2': <span style={{color: 'red'}}>cant implement</span>,
          '-1': <span style={{color: 'red'}}>unknown</span>,
          '0':  <span style={{color: 'red'}}>X</span>,
          '1': <span style={{color: 'green'}}>✓</span>
        }

        const rows = this.state.implementedChecks.map((row) => {
          // const bugsClasses = cn('rv-col', 'column-4', 'status-'+row.bugs)
          // const bugsText = this.implementedContent(row.bugs)
          return {
                key: `${row.element}-${row.attribute}`,
                standard_type: row.standard,
                version: row.version,
                element: row.element,
                attribute: row.attribute,
                implement: statusMapping[parseInt(row.bugs, 10)],
                validation_checks: row.check
          }
      })

    return (
        <div>
       

            <div className="md-grid">
                <div className="md-cell md-cell--12">

                    <DataTableContainer 
                        cardId='activity-list-tablee'
                        title={''} 
                        rows={rows} 
                        headers={[
                                {ref: 'standard_type',    name: 'Standard type'},
                                {ref: 'version',          name: 'Version'},
                                {ref: 'element',          name: 'Element'},
                                {ref: 'attribute',        name: 'Attribute'},
                                {ref: 'implement',        name: 'Implemented'},
                                {ref: 'validation_checks',name: 'Validation check'},
                        ]}
                        pagination={false}>
                        <div className="align-right">
                          <Chip
                            label={implementedChecks.filter(o => (o.bugs === 1)).length + " Implemented checks"}
                            avatar={<Avatar suffix="light-green">✓</Avatar>}
                          />

                          <Chip
                            label={implementedChecks.filter(o => (o.bugs === 0)).length + " Non-implemented checks"}
                            avatar={<Avatar suffix="red">X</Avatar>}
                          />

                          <Chip
                            label={implementedChecks.filter(o => (o.bugs === -2)).length + " Non-implementable checks"}
                            avatar={<Avatar suffix="yellow">:|</Avatar>}
                          />

                        </div>

                        <TextField
                          id="search-input"
                          onKeyDown={this.changeQuery}
                          label="Search by iati element/attribute/error msg..."
                          lineDirection="center"
                          placeholder=""
                          customSize="title"
                          className="md-cell md-cell--bottom"
                        />

                    </DataTableContainer>
                </div>
            </div>
        </div>
    )
  }
}


export default connect(null, {
  setPageTitle,
})(ImplementedChecks)