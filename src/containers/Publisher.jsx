/** @flow */
import React, { Component } from 'react'
import PropTypes from 'prop-types'


import { connect } from 'react-redux'
import PublisherCommonErrors from '../components/publisher/PublisherCommonErrors'

import { setPageTitle } from '../actions/header'

import { oipaApiUrl } from '../config.js'
import DatasetList from '../components/datasets/DatasetList'

import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'


class Publisher extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
        publisher: {
            id: this.context.router.route.match.params.publisherId,
            name: 'Loading'
        },
        fetching: true
    }
  }

  componentDidMount() {
    this.props.setPageTitle(`${this.state.publisher.name}`)
    this.getPublisher(this.state)
  }

  getPublisher(state){

    const query = `publishers/${state.publisher.id}/?format=json`
    
    fetch(oipaApiUrl + query)
      .then((response) => {
        return response.json()
      })
      .then((json) => {

        this.props.setPageTitle(`${json.display_name}`)

        this.setState({
            publisher: json, 
            fetching: false
        })
      }
    )
  }

  render () {

    const {
      publisher
    } = this.state

    const rows = [
        {name: 'Organisation identifier', value: publisher.publisher_iati_id},
        {name: 'Name on registry', value: publisher.display_name},
        {name: 'ID on registry', value: (`${publisher.iati_id} (${publisher.name})`)},
        {name: 'Amount of IATI activities', value: publisher.activity_count},
        {name: 'Amount of validation errors', value: publisher.note_count},
        {name: 'This publisher on the registry', value: <a href={`https://iatiregistry.org/publisher/${publisher.name}`} target="_blank" rel="noopener noreferrer">Open in new window</a>},
    ].map((o) => {
        return (
            <TableRow key={o.name}>
              <TableColumn key='name'>
                {o.name}
              </TableColumn>
              <TableColumn key='value'>
                {o.value}
              </TableColumn>
            </TableRow>
        )
    })

    return (
      <div>

        <div className="md-grid">
            <div className="md-cell md-cell--6">

                <Card id="dataset-info-table" tableCard style={{minHeight: '33.4rem'}}>
                
                  <div className="md-grid">
                    <div className="md-cell md-cell--12">
                      <h2>About this publisher</h2>
                    </div>
                  </div>  

                  <DataTable plain>

                    <TableHeader>
                      <TableRow>
                        <TableColumn>
                          Name
                        </TableColumn>
                        <TableColumn>
                          Value
                        </TableColumn>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {rows}
                    </TableBody>
                  </DataTable>

                </Card>
            </div>
            <div className="md-cell md-cell--6">
                <PublisherCommonErrors publisher={publisher.id} />
            </div>
        </div>

        <div className="md-grid">
            <div className="md-cell md-cell--12 md-cell--12-desktop">
                <DatasetList publisher={publisher.id} />
            </div>
        </div>

      </div>
    )
  }
}

Publisher.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}

Publisher.propTypes = {
  // publisherLoading: PropTypes.bool.isRequired,
  // publisher: PropTypes.instanceOf(immutable.Map).isRequired,
  // publisherDatasets: PropTypes.instanceOf(immutable.List).isRequired,
  // meta: PropTypes.instanceOf(immutable.Map).isRequired,
  // loading: PropTypes.bool.isRequired
}


export default connect(null, {
  setPageTitle,
})(Publisher)
