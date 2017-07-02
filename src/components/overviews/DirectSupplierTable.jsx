import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import fetch from 'isomorphic-fetch'
import {oipaApiUrl} from '../../config'
import DataTableContainer from '../helpers/DataTable'

class DirectSupplierTable extends Component {

  constructor (props, context) {
    super(props, context)

    this.getLink = this.getLink.bind(this)
  }

  getLink(organisation_identifier){

    fetch(`${oipaApiUrl}publishers/?format=json&org_id=`+organisation_identifier)
        .then((response) => {
        if (response.status >= 400) {
            return false;
        }
        return response.json();
      })
      .then((json) => {
        var url = ''
        if(json.results.length > 0){
          url = "http://iatibugtracker.org/publishers/"+json.results[0].id
        }
        if(url !== ''){
          window.open(url)
        } else{
          alert('Not found (might be a new publisher, not on dev.oipa yet)')
        }
      }
    )
  }

  render () {
    const { results } = this.props

    const rows = results.map((r, i) => {
      return {
        publisher: r.iati_publisher !== '' ? (<Link to={'/supplier/'+r.iati_publisher}>{r.supplier_hq}</Link>) : r.supplier_hq,
        publisherOrgId: r.iati_publisher !== '' ? (<Link to={'/supplier/'+r.iati_publisher}>{r.iati_publisher}</Link>) : '-',
        participatingOrg: r.participatingOrg === 0 ? <span style={{color: '#ED000C'}}>0</span> : r.participatingOrg,
        providerOrg: r.providerOrg === 0 ? <span style={{color: '#ED000C'}}>0</span> : r.providerOrg,
        providerActId: r.providerActId === 0 ? <span style={{color: '#ED000C'}}>0</span> : r.providerActId
      }
    })

    return (
      <DataTableContainer 
        cardId='top-suppliers'
        title="Top suppliers" 
        rows={rows} 
        headers={[
          {ref: 'publisher', name: 'Supplier name'},
          {ref: 'publisherOrgId', name: 'Supplier IATI ref'},
          {ref: 'participatingOrg',  name: 'participating-org match'},
          {ref: 'providerOrg',  name: 'provider-org match'},
          {ref: 'providerActId',  name: 'provider-activity-id match'},
        ]} 
      />
    )
  }
}

DirectSupplierTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  results: PropTypes.array.isRequired
}

export default DirectSupplierTable