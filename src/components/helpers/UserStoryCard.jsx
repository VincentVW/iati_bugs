import React, { Component } from 'react'

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Media, { MediaOverlay } from 'react-md/lib/Media';


class UserStoryCard extends Component {

  render () {
    return (
      <div className="md-cell md-cell--6">
        <Card className="md-block-centered">
          
          <Media>
            <img alt="card" src={this.props.imgSrc} />
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
