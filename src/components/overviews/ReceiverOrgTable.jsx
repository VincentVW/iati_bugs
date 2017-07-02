import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DataTableContainer from '../helpers/DataTable'


class ReceiverOrgTable extends Component {

  render () {
    const { results } = this.props

    const rows = results.map((r, i) => {
      return {
        receiver_org: r.receiver_org,
        disbursement: `${r.disbursement.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (GBP)`,
        expenditure: `${r.expenditure.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (GBP)`
      }
    })

    return (
      <DataTableContainer 
        cardId='top-suppliers'
        title="All direct suppliers" 
        rows={rows} 
        headers={[
          {ref: 'receiver_org', name: 'Supplier name'},
          {ref: 'disbursement', name: 'Disbursement'},
          {ref: 'expenditure', name: 'Expenditure'}
        ]} 
      />
    )
  }
}

ReceiverOrgTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired
}

export default ReceiverOrgTable