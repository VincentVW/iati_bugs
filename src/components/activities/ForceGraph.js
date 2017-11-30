import React, { Component} from 'react'
import PropTypes from 'prop-types'
import * as d3 from "d3"
import _ from "lodash"
import {event as currentEvent} from 'd3'

import Loader from '../helpers/MoLoader'


import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import Slider from 'react-md/lib/Sliders';
import cn from 'classnames'

import { scaleOrdinal } from "d3-scale"
import { forceSimulation, forceLink, forceManyBody, forceCenter } from "d3-force"

var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 3000,
            height = 3000,
            nodeWidth = 16,
            nodeHeight = 16;



// function viewport() {
//   var e = window,
//       a = 'inner';
//   if (!('innerWidth' in window)) {
//     a = 'client';
//     e = document.documentElement || document.body;
//   }
//   return {
//     width: e[a + 'Width'],
//     height: Math.max(900, e[a + 'Height'] - 450)
//   }
// }



// var width = viewport().width - margin.right - margin.left,
//     height = viewport().height - margin.top - margin.bottom;


// console.log(width)
// console.log(height)





var svg

function redraw() {
  svg.attr("transform", `translate(${currentEvent.translate}) scale(${currentEvent.scale})`);
}

// var zoom = d3.behavior.zoom()
//           .on("zoom", redraw);


const colors = [
  d3.rgb(0,130,112),
  d3.rgb(58,186,168),
  d3.rgb(233,186,130),
  d3.rgb(59,101,126),
  d3.rgb(177,68,76),
  d3.rgb(0,94,165),
  d3.rgb(48,48,48),
  d3.rgb(48,48,48),
  d3.rgb(48,48,48),
  d3.rgb(48,48,48),
  d3.rgb(48,48,48),
  d3.rgb(48,48,48),
]

var first = 1;
  
var y = scaleOrdinal()
  .domain(d3.range(5))
  .range([0, 100]);
  

class ForceGraph extends Component {

    constructor (props, context) {
      super(props, context)
      this.state = {
          loaded: false,
          loader: false,
          loadingText: 'Fetching data',
          nodeLocked: false,
          linkLocked: false,
          node: {errors: [], activity: props.activity },
          link: {
            start_node: { activity_iati_id: "-" },
            end_node: { activity_iati_id: "GB-1-201492-101" },
            relations: []
          },
          fullScreen: false,
          outflowToggle: false,
          inflowToggle: false
      }

      this.createTree = this.createTree.bind(this)
      this.fullscreenToggle = this.fullscreenToggle.bind(this)

      this.outflowToggle = this.outflowToggle.bind(this)
      this.inflowToggle = this.inflowToggle.bind(this)

    }

    componentDidMount(){
      const text = 'Implementing the hierarchy'

      if(this.props.links.length > 0){
        this.setState({loader: true, loadingText: text}) 
      } else {
        var that = this
        setTimeout(function(){ 
          that.setState({loader: true, loadingText: text}) 
        }, 1000);
      }
    }

    componentDidUpdate(prevProps, prevState){

      if(this.props.links.length > 0 && this.props.loading === false && this.state.loaded === false){
        this.setState({
            loaded: true,
            loadingText: 'Visualizing the chain'
        })
        this.createTree()
      }
    }

    createTree(){

      var links = _.cloneDeep(this.props.links)
      var activities = this.props.activities

      const groupedChainErrors = _.chain(this.props.chainErrors)
        .groupBy((error) => {
          return error.chain_node
        })
        .value()

      var nodesObj = {}
      // Compute the distinct nodes from the links.
      links.forEach(function(link) {

        if (!nodesObj[link.start_node.activity_iati_id]){

          nodesObj[link.start_node.activity_iati_id] = {
            _id: link.start_node.activity_iati_id,
            level: link.start_node.tier,
            bol: link.start_node.bol,
            eol: link.start_node.eol,
            activity: activities[link.start_node.activity_oipa_id],
            errors: groupedChainErrors[link.start_node.id] ? groupedChainErrors[link.start_node.id] : []
          }
        }

        if (!nodesObj[link.end_node.activity_iati_id]){
     
          nodesObj[link.end_node.activity_iati_id] = {
            _id: link.end_node.activity_iati_id,
            level: link.end_node.tier,
            bol: link.end_node.bol,
            eol: link.end_node.eol,
            activity: activities[link.end_node.activity_oipa_id],
            errors: groupedChainErrors[link.end_node.id] ? groupedChainErrors[link.end_node.id] : []
          }
        }

      })


      let nodes = _.values(nodesObj)

      // enrich links with indexes of nodes
      links.forEach(function(link) {
        link.id = 'n' + link.id
        link.source = _.findIndex(nodes, function(o) { return o._id === link.start_node.activity_iati_id; });     
        link.target = _.findIndex(nodes, function(o) { return o._id === link.end_node.activity_iati_id; });  
      })

      let graph = {
        nodes: nodes,
        links: links
      }

      this.graph = graph

      const maxLevel = d3.max(nodes, function(d) { return d.level; })

      width = 1000 + (nodes.length * 5)
      height = 300 * maxLevel


      // // ZOOM
      // var zoom = d3.behavior.zoom()
      //   .center([width / 2, height / 2])
      //   .scaleExtent([1, 10])
      //   .on("zoom", zoomed);

      svg = d3.select("#force-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
            // .call(zoom);


      

      // var rect = svg.append("rect")
      //   .attr("width", width)
      //   .attr("height", height)
      //   .style("fill", "white")
      //   .style("pointer-events", "all");

      // var container = svg.append("g");

      // container.append("g")
      //     .attr("class", "axis")
      //   .selectAll("circle")
      //     .data(d3.range(10, width, 10))
      //   .enter().append("circle")
      //     .attr("cx", width / 2)
      //     .attr("cy", height / 2)
      //     .attr("r", function(d) { return d; });

      // var center = svg.append("circle")
      //     .style("fill", "red")
      //     .attr("cx", width / 2)
      //     .attr("cy", height / 2)
      //     .attr("r", 10);

      // function zoomed() {
      //   container.attr("transform", "translate(" + currentEvent.translate + ")scale(" + currentEvent.scale + ")");
      // }
      // // /ZOOM



      this.tooltip = d3.select("#force-graph")
        .append("div")
        .attr("class", "mytooltip")
        .style("opacity", "0")
        .style("display", "none")

      var link = svg.selectAll(".link")
          .data(graph.links)
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", 2 )
          .style("stroke", "#999")
           .on("click", this.clickLink())
           .on("mouseenter", this.mouseOverLink())
           .on("mouseout", this.mouseOutLink);
      

      var legenNode = svg.selectAll(".legend-node")
          .data([...Array(maxLevel+1).keys()])
        .enter()
          .append("g")

        legenNode.append("rect")
            .attr("class", "legend-node")
            .attr("x", 20)
            .attr("y", function(d) { return d * 24 + 20; })
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .style("fill", function(d, i) { return colors[d]; })
            .style("stroke", function(d, i) { return colors[d].darker(2); })

        legenNode.append("text")
            .attr("x", 42)
            .attr("y", function(d) { return (d * 24) + 32; })
            .attr("fill", "black")
            .text(function(d){ return `tier ${d}`})


      var node = svg.selectAll(".node")
          .data(graph.nodes)
        .enter().append("rect")
          .attr("class", "node")
          .attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; })
          .attr("width", nodeWidth)
          .attr("height", nodeHeight)
          .style("fill", function(d, i) { return colors[d.level]; })
          .style("stroke", function(d, i) { return colors[d.level].darker(2); })
          // .call(force.drag)
          // .on("mousedown", function() { currentEvent.stopPropagation(); })
          .on("click", this.clickNode())
          .on("mouseenter", this.mouseOverNode());

      
      
      var simulation = forceSimulation()
       .force('link', forceLink().distance(20))
       .force('charge', forceManyBody(-1000))
       .force("center", forceCenter(100,100))

      // var force = d3.layout.force()
      //   .charge(-1000)
      //   .gravity(0.2)
      //   .linkDistance(20)                
        // .size([width, height])


      simulation
        .nodes(graph.nodes)
        .on("tick", tick);

      simulation
        .force("link")
        .links(graph.links)


        // .on("tick", tick)
        // .start();
      

      // var that = this
      // setTimeout(function() {
      //   first = 0;
      //   // simulation.restart();
      //   that.setState({loader: false}) 

      // }, 5000);

      function tick() {
        
        var k = first ? 1 : 5
     
        graph.nodes.forEach(function(o, i) {
          o.y += (y(o.level) - o.y) * k; 
        });

        node.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

        link.attr("x1", function(d) { return d.source.x + nodeWidth/2; })
            .attr("y1", function(d) { return d.source.y + nodeHeight/2; })
            .attr("x2", function(d) { return d.target.x + nodeWidth/2; })
            .attr("y2", function(d) { return d.target.y + nodeHeight/2; });
      }

      // when loading, show th graph with limited visibility in the background
      // svg.style("opacity", 0.01)
      //   .transition()
      //     .duration(5000)
      //     .style("opacity", 0.02)
      //   .transition()
      //     .duration(3000)
      //     .style("opacity", 1);
      
      // this defined the height difference per tier
      // var y = scaleOrdinal()
      //   .domain(d3.range(10))
      //   .range([0, 150 * 10]);
    }

    clickNode(d){
      var self = this;
      return function(d, i) {
        const nodeLocked = self.state.node.index === d.index ? !self.state.nodeLocked : self.state.nodeLocked
        self.setState({
          node: d,
          nodeLocked:nodeLocked
        })
      }
    }

    clickLink(d){
      var self = this;
      return function(d, i) {
        const linkLocked = self.state.link.id === d.id ? !self.state.linkLocked : self.state.linkLocked
        self.setState({
          link: d,
          linkLocked: linkLocked
        })
      }
    }

    mouseOverNode(d) {
      var self = this;
      return function(d, i) {
        if(!self.state.nodeLocked){
          self.setState({node: d})
        }
      }
    }
    
    mouseOverLink(d) {
      var self = this;
      return function(d, i) {
        
        d3.select(this)
          .style("stroke", "#F5352B");

        self.setState({link: d})
      }
    }

    mouseOutLink(d) {
      d3.select(this).style("stroke", "#999");
    }

    inflowToggle(){

      if(!this.state.inflowToggle){

        var nodes = svg.selectAll(".node")

        nodes.transition()
          .duration(750)
          .attr("opacity", function(d) { return d.bol ? 1 : 0.1; })

        var links = svg.selectAll(".link")

        links.transition()
          .duration(750)
          .attr("opacity", function(d){
            return d.start_node.bol ? 1 : 0.1;
          })


      } else {
        this.showAllToggle()
      }

      this.setState({inflowToggle: !this.state.inflowToggle})
    }

    outflowToggle(){


      if(!this.state.outflowToggle){
        var nodes = svg.selectAll(".node")

        nodes.transition()
          .duration(750)
          .attr("opacity", function(d) { return d.eol ? 1 : 0.1; })

        var links = svg.selectAll(".link")

        links.transition()
          .duration(750)
          .attr("opacity", function(d){
            return d.start_node.eol ? 1 : 0.1;
          })

      } else {
        this.showAllToggle()
      }

      this.setState({outflowToggle: !this.state.outflowToggle})
    }

    showAllToggle(){
      var nodes = svg.selectAll(".node")

      nodes.transition()
        .duration(750)
        .attr("opacity", 1)

      var links = svg.selectAll(".link")

      links.transition()
        .duration(750)
        .attr("opacity", 1)
    }

    fullscreenToggle(){
      this.setState({
        fullScreen: !this.state.fullScreen
      })
    }

    render () {

        const { node, link, nodeLocked, linkLocked } = this.state
        const activity = node.activity

        const warnings = node.errors.filter((o) => ['warning', 'info'].includes(o.warning_level))
        const errors = node.errors.filter((o) => o.warning_level === 'error')

        const linkTypes = _.chain(link.relations)
        .groupBy((relation) => {
          return relation.relation
        })
        .value()

        const linkTypeLis = _.map(linkTypes, (o, i) => {
          return (<li key={i}>{o[0].relation}: {o.length} occurences</li>)
        })


        return (
            <div id="force-graph-wrapper" className={cn({fullscreen: this.state.fullScreen})}>
              <Loader loading={this.state.loader} loadingText={this.state.loadingText} />

              <div id="force-graph">


                <div id="force-graph-checkboxes">

                  <Checkbox
                    id="inflowToggle"
                    name="inflowToggle"
                    // defaultChecked
                    onChange={this.inflowToggle}
                    label="Only show inflow"
                  />

                  <Checkbox
                    id="outflowToggle"
                    name="outflowToggle"
                    // defaultChecked
                    onChange={this.outflowToggle}
                    label="Only show outflow"
                  />
                  
                  <Checkbox
                    id="fullscreenToggle"
                    name="fullscreenToggle"
                    // defaultChecked
                    onChange={this.fullscreenToggle}
                    label="Full screen"
                  />

                </div>  
              </div>

            
              <div id="info-bar">
                <h6>Last selected node<i className="material-icons" aria-hidden="true">{nodeLocked ? 'lock' : 'lock_open'}</i></h6>
                <p>
                Title:  {activity.title ? activity.title.narratives[0].text : 'No title'}<br/>
                Reporting org: {activity.reporting_organisation ? activity.reporting_organisation.narratives.length > 0 ? activity.reporting_organisation.narratives[0].text : 'Unnamed reporting-org' : 'Unnamed reporting-org'} <br/>
                IATI id: {activity.iati_identifier} <br/>
                Warnings: {warnings.length}<br/>
                Errors: {errors.length}<br/>

                Left click to keep this activity nodeLocked.
                </p>

                <h6>Last selected line<i className="material-icons" aria-hidden="true">{linkLocked ? 'lock' : 'lock_open'}</i></h6>
                start node: {link.start_node.activity_iati_id} <br/>
                end node: {link.end_node.activity_iati_id} <br/>
                <ul>
                  {linkTypeLis}
                </ul>
                
               
                TODO - provide tools to easier go through the three

                
                <h6>Note </h6>
                You're currently viewing the delivery chain from the perspective of {this.context.router.route.match.params.activityId}. <br/>All the other nodes shown on tier 0 of this visualisation are shown because they give side-funding to this chain, their further delivery chain is not shown.
         

              </div>

            </div>
        )
    }
}


ForceGraph.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
}



ForceGraph.propTypes = {
  links: PropTypes.array.isRequired
}


export default ForceGraph
