/** @flow */
import React, { Component, PropTypes } from 'react'
import * as immutable from 'immutable'
import moment from 'moment'


class PublisherInfoList extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {publisher} = this.props

    if (publisher.size == 0){
      return (<div></div>)
    }
    return (
      <div className="col">
        <h2>Publisher meta</h2>

        <div className="publisherInfo">

          <div className="rv-row even">
            <div className="rv-col col-1 colHeader">&nbsp;</div><div className="rv-col col-2 colHeader">&nbsp;</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1">Organisation identifier</div><div className="rv-col col-2">{publisher.get('org_id')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">Name on registry</div><div className="rv-col col-2">{publisher.get('org_name')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1"># Activities</div><div className="rv-col col-2">{publisher.get('activity_count')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1"># Bugs</div><div className="rv-col col-2">{publisher.get('note_count')}</div>
          </div>

        </div>
      </div>
    )
  }
}

PublisherInfoList.propTypes = {
  publisher: PropTypes.instanceOf(immutable.Map).isRequired,
}

export default PublisherInfoList
