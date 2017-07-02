import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mojs from 'mo-js'




class MoJsLoader extends Component {
  render() {
    return (<div></div>);
  }
  
  shouldComponentUpdate () {
    this.props.isPlay && this._loader.replay();
    return false;
  }
  
  componentDidMount () {

    const baseCircle = {
        shape:        'circle',
        opacity:      1,
        radius:       10,
        fill:         '#666',
        easing:       'elastic.out',
        repeat:       0,
        scale:        { 0 : 1 },
        duration:     800,
        parent:       '#mo-loader',
        left:         10
    }

    const circle1 = new mojs.Shape({...baseCircle, x: 0,    y: 0,   delay: 0,   duration: 2000})
    const circle2 = new mojs.Shape({...baseCircle, x: 65,   y: 23,  delay: 2800,   duration: 2000})
    const circle3 = new mojs.Shape({...baseCircle, x: 65,   y: -25, delay: 2200,   duration: 2000})
    const circle4 = new mojs.Shape({...baseCircle, x: 131,  y: 39,  delay: 7500,   duration: 2000})

    this.circle1 = circle1;

    var circles = [circle1, circle2, circle3, circle4]

    for(var i = 0; i < 4; i++){
      circles.forEach((circle) => {

        circle.then({opacity: 0.7, duration: 800}).then({opacity: 1, duration: 800})
      })
    }

    const baseLine = {
      shape:    'line',
      stroke:   '#666',
      radius:   25,
      duration: 1500,
      delay:    5000,
      strokeDasharray: '100%',
      parent: '#mo-loader',
      left:     10
    }

    const line1 = new mojs.Shape({...baseLine, x: 32, y: 12,  angle: 20,  delay: 1200, strokeDashoffset: { '300%': '200%' },})
    const line2 = new mojs.Shape({...baseLine, x: 32, y: -12, angle: -20, delay: 2400, strokeDashoffset: { '100%': '200%' },})
    const line3 = new mojs.Shape({...baseLine, x: 101, y: 32, radius: 28, angle: 15,  delay: 5900, strokeDashoffset: { '300%': '200%' },})
    line3.then({x: 97, y: 32, radius: 25})
    
    var lines = [line1, line2, line3]

    this.items = [...circles, ...lines]

    this._loader = new mojs.Timeline()
      .add(this.items)
    
  }

  componentWillUnmount(){

    var removeEl = function removeEl (node) { node.parentNode.removeChild(node); }
    this._loader = null

    this.items.forEach((o) => {
      removeEl(o.el)
    })
    
  }
}


class Loader extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
        isPlay: true
    }

    this._play = this._play.bind(this)
    this._resetPlay = this._resetPlay.bind(this)

  }

  _play() { this.setState({ isPlay: true }); }
  _resetPlay() { this.setState({ isPlay: false }); }
  
  componentDidMount(){
    this.setState({ isPlay: true })
  }

  render() {
    if(!this.props.loading){ return (<div></div>) }
    
    return (
      <div id="mo-loader"> 
        <MoJsLoader loading={this.props.loading} isPlay={this.state.isPlay} onComplete={this._resetPlay}/>
        <span>{this.props.loadingText}...</span>
      </div>
    )
  }
}

Loader.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string.isRequired
};

export default Loader;
