/** @flow */
import React, { Component, PropTypes } from 'react'
import * as immutable from 'immutable'
import moment from 'moment'


class DatasetInfoList extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {dataset} = this.props

    if (dataset.size == 0){
      return (<div></div>)
    }
    return (
      <div className="col">
        <h2>Dataset meta</h2>

        <div className="datasetInfo">

          <div className="rv-row even">
            <div className="rv-col col-1 colHeader">&nbsp;</div><div className="rv-col col-2 colHeader">&nbsp;</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1">Reference</div><div className="rv-col col-2">{dataset.get('ref')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">Title</div><div className="rv-col col-2">{dataset.get('title')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1">Publisher</div><div className="rv-col col-2">{dataset.get('publisher').org_name}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">Standard type</div><div className="rv-col col-2">{dataset.get('type')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1">Last updated</div><div className="rv-col col-2">{moment(dataset.get('date_updated')).format('YYYY-MM-DD HH:mm')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1"># Activities</div><div className="rv-col col-2">{dataset.get('activity_count')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1"># Bugs</div><div className="rv-col col-2">{dataset.get('note_count')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">Source URL </div><div className="rv-col col-2"><a href={dataset.get('source_url')} target="_blank">link</a></div>
          </div>

        </div>
      </div>
    )
  }
}

DatasetInfoList.propTypes = {
  dataset: PropTypes.instanceOf(immutable.Map).isRequired,
}

export default DatasetInfoList