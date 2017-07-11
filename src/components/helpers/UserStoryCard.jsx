import React, { Component } from 'react'

import Card from 'react-md/lib/Cards/Card'
import CardTitle from 'react-md/lib/Cards/CardTitle'
import Media, { MediaOverlay } from 'react-md/lib/Media'
import { Link } from 'react-router-dom'


class UserStoryCard extends Component {

  render () {
    return (
      <div className="md-cell md-cell--6-desktop md-cell--12-tablet">
        <Card className="md-block-centered">
          
          <Media>
            <Link to={this.props.imgLink}><img alt="card" src={this.props.imgSrc} /></Link>
            <MediaOverlay>
              <CardTitle title={this.props.title} subtitle={this.props.subtitle ? this.props.subtitle : ''}>
                
              </CardTitle>
            </MediaOverlay>
          </Media>
          {/* this.props.children */}

        </Card>
      </div>
    )
  }
}

export default UserStoryCard
