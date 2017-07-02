import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatasetList from '../components/datasets/DatasetList'
import { connect } from 'react-redux'
import { setPageTitle } from '../actions/header'


class DatasetsPage extends Component {

  componentDidMount() {
    this.props.setPageTitle(`Find your dataset`)
  }

  render () {


    return (
        <div className="md-grid">
            <div className="md-cell md-cell--12">
              <DatasetList />
            </div>
        </div>
    )
  }
}


DatasetsPage.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}




export default connect(null, {
  setPageTitle,
})(DatasetsPage)