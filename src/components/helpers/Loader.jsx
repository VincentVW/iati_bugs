import React, { Component} from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'


class Loader extends Component {

    render() {

        if (!this.props.loading){
            return (<div></div>)
        }

        let classes = cn({small: (this.props.inline === true)}, 'spinner')

        return (
            <div className={classes}>
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
        )
    }
}

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
}

export default Loader