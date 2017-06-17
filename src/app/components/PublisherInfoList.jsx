/** @flow */
import React, { Component, PropTypes } from 'react'
import * as immutable from 'immutable'
import cn from 'classnames'


class PublisherInfoList extends Component {

  render () {
    const {publisher, publisherLoading} = this.props
    const loaderClasses = cn({loading: publisherLoading}, 'loader')

    if (publisher.size === 0){
      return (<div></div>)
    }
    
    return (
      <div className="col">
        <h2>Publisher meta</h2>

        <div className="publisherInfo">

          <div className={loaderClasses}></div>

          <div className="rv-row even">
            <div className="rv-col col-1 colHeader">&nbsp;</div><div className="rv-col col-2 colHeader">&nbsp;</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">Organisation identifier</div><div className="rv-col col-2">{publisher.get('publisher_iati_id')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1">Name on registry</div><div className="rv-col col-2">{publisher.get('display_name')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1">ID on registry</div><div className="rv-col col-2">{publisher.get('iati_id')}</div>
          </div>

          <div className="rv-row even">
            <div className="rv-col col-1"># Activities</div><div className="rv-col col-2">{publisher.get('activity_count')}</div>
          </div>

          <div className="rv-row uneven">
            <div className="rv-col col-1"># Bugs</div><div className="rv-col col-2">{publisher.get('note_count')}</div>
          </div>

        </div>
      </div>
    )
  }
}

PublisherInfoList.propTypes = {
  publisherLoading: PropTypes.bool.isRequired,
  publisher: PropTypes.instanceOf(immutable.Map).isRequired,
}

export default PublisherInfoList
