import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DataTableContainer from './DataTable'

import _ from 'lodash'


class ErrorList extends Component {

  shouldComponentUpdate(nextProps, nextState){
    return nextProps.errors.length !== this.props.errors.length && nextProps.chainNodes.length > 0
  }

  groupedRows(errorRows){

    const errorRowsGrouped = _.chain(errorRows)
          .sort((o) => (o.iatiIdentifier))
          .groupBy((line) => {
            return line.iatiIdentifier + line.errorMessage
          })
          .toArray()
          .map((o) => {
            return {
              ...o[0],
              occurences: o.length
            }
          })
          .value()


    return errorRowsGrouped
  }

  render(){

    const { errors, chainNodes } = this.props

    if(errors.length === 0 || chainNodes.length === 0){
      return (
        <span>There are no problems found within this chain.</span>
      )
    }

    const errorTypes = {
      '1': 'provider-org not set on incoming fund',
      '2': 'provider-activity-id not set on incoming fund',
      '3': 'given provider-activity-id set on incoming fund does not exist',
      '4': 'receiver-org not set on disbursement',
      '5': 'receiver-activity-id not set on disbursement',
      '6': 'given receiver-activity-id set on disbursement does not exist',
      '7': 'given related-activity with type parent does not exist',
      '8': 'given related-activity with type child does not exist',
      '9': 'participating-org is given as funder but there are no incoming funds from this organisation ref',
      '10': 'participating-org is given as implementer but there are no disbursements nor expenditures to this organisation ref',
    }
    
    const rows = errors.map((o, index) => {

      return {
        iatiIdentifier: chainNodes[o.chain_node][0].activity_iati_id,
        errorMessage:errorTypes[o.error_type],
        mentionedActivityOrOrg: o.mentioned_activity_or_org,
        level: o.warning_level
      }
    })

    const errorList = rows.filter((o) => (o.level === 'error' ))
    const warningList = rows.filter((o) => (o.level === 'warning' ))
    const infoList = rows.filter((o) => (o.level === 'info' ))

    const errorRows = this.groupedRows(errorList)
    const warningRows = this.groupedRows(warningList)
    const infoRows = this.groupedRows(infoList)


    return (
      <div>

        <DataTableContainer 
          cardId='error-table'
          title={`${errorList.length} errors`} 
          rows={errorRows} 
          headers={[
            {ref: 'level', name: 'Level'},
            {ref: 'iatiIdentifier',  name: 'Activity Id'},
            {ref: 'errorMessage',  name: 'Value'},
            {ref: 'occurences',  name: 'Occurences'},
          ]} 
        />

        <br/>

        <DataTableContainer 
          cardId='warning-table'
          title={`${warningList.length} warnings`} 
          rows={warningRows} 
          headers={[
            {ref: 'level', name: 'Level'},
            {ref: 'iatiIdentifier',  name: 'Activity Id'},
            {ref: 'errorMessage',  name: 'Value'},
            {ref: 'occurences',  name: 'Occurences'},
          ]} 
        />

        <br/>

        <DataTableContainer 
          cardId='info-table'
          title={`${infoList.length} warnings`} 
          rows={infoRows} 
          headers={[
            {ref: 'level', name: 'Level'},
            {ref: 'iatiIdentifier',  name: 'Activity Id'},
            {ref: 'errorMessage',  name: 'Value'},
            {ref: 'occurences',  name: 'Occurences'},
          ]} 
        />
      </div>
    )
  }
}

ErrorList.propTypes = {
  errors: PropTypes.array.isRequired
}

export default ErrorList