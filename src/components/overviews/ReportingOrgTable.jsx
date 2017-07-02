import React, { Component} from 'react'
import PropTypes from 'prop-types'


class ReportingOrgTable extends Component {

  render () {
    const { results } = this.props

    const orderedResults = results.sort(function(a, b){
      if(a.reporting_organisation == null){
        return 1;
      } else if(b.reporting_organisation == null){
        return 0;
      }
      var nameA = a.reporting_organisation.primary_name.toLowerCase(), nameB=b.reporting_organisation.primary_name.toLowerCase()

      if (nameA < nameB) //sort string ascending
        return -1 
      if (nameA > nameB)
        return 1
      return 0 //default return value (no sorting)
    })

    const trs = orderedResults.map((r, i) => {
      if(r.reporting_organisation == null){
        return (<tr key={i}><td colSpan="3"></td></tr>)
      }
      return (
        <tr key={i}>
          <td>{r.reporting_organisation.primary_name}</td>
          <td>{r.reporting_organisation.organisation_identifier}</td>
          <td>{r.count}</td>
        </tr>
      )
    })

    return (
      <table>
        <thead>
          <tr>
            <th width="200">Name</th>            
            <th width="150">Organisation identifier</th>
            <th width="150"># of activities with DFID involvement</th>
          </tr>
        </thead>
        <tbody>
          {trs}
        </tbody>
      </table>
    )
  }
}

ReportingOrgTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired
}

export default ReportingOrgTable