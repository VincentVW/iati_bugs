import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { setPageTitle } from '../actions/header'
import { oipaApiUrl } from '../config.js'
import NotesList from '../components/notes/NotesList'
import DatasetCommonErrors from '../components/datasets/DatasetCommonErrors'

import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import { Link } from 'react-router-dom'


class Dataset extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
        dataset: {
            id: this.context.router.route.match.params.datasetId,
            name: 'Loading'
        },
        fetching: true
    }
  }

  componentDidMount() {
    this.props.setPageTitle(`${this.state.dataset.name}`)
    this.getDataset(this.state)
  }

  getDataset(state){

    const query = `datasets/${state.dataset.id}/?format=json`
    
    fetch(oipaApiUrl + query)
      .then((response) => {
        return response.json()
      })
      .then((json) => {

        this.props.setPageTitle(`${json.title}`)

        this.setState({
            dataset: json, 
            fetching: false
        })
      }
    )
  }

  render () {

    const {
      dataset
    } = this.state

    const rows = [
        {name: 'Name on the registry', value: dataset.title},
        {name: 'Reference on the registry', value: <a href={`https://iatiregistry.org/dataset/${dataset.name}`} target="_blank" rel="noopener noreferrer">{dataset.name}</a>},
        {name: 'Publisher of this dataset', value: dataset.publisher ? (<Link to={`/publishers/${dataset.publisher.id}`}>{dataset.publisher.display_name}</Link>) : '-'},
        {name: 'ID on the registry', value: dataset.iati_id},
        {name: 'Last checked', value: dataset.date_updated},
        {name: 'Amount of IATI activities', value: dataset.activity_count},
        {name: 'Amount of validation errors', value: dataset.note_count},
        {name: 'Dataset URL', value: <a target="_blank" rel="noopener noreferrer" href={dataset.source_url}>go to</a>},
        {name: 'IATI version', value: `${dataset.iati_version} (according to the registry)`},
        {name: 'Filetype', value: dataset.filetype}


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

                <Card id="dataset-info-table" tableCard>
                
                  <div className="md-grid">
                    <div className="md-cell md-cell--12">
                      <h2>About this dataset</h2>
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
                <DatasetCommonErrors dataset={dataset} />
            </div>
        </div>

        <div className="md-grid">
            <div className="md-cell md-cell--12 md-cell--12-desktop">
              <NotesList dataset={dataset} />
            </div>
        </div>

      </div>
    )
  }
}

Dataset.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}

Dataset.propTypes = {
  // publisherLoading: PropTypes.bool.isRequired,
  // publisher: PropTypes.instanceOf(immutable.Map).isRequired,
  // publisherDatasets: PropTypes.instanceOf(immutable.List).isRequired,
  // meta: PropTypes.instanceOf(immutable.Map).isRequired,
  // loading: PropTypes.bool.isRequired
}


export default connect(null, {
  setPageTitle,
})(Dataset)
