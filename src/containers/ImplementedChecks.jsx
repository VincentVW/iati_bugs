import React, { Component } from 'react'
import TextField from 'react-md/lib/TextFields'
import { allImplementedChecks } from '../components/checksList'

import { connect } from 'react-redux'
import { setPageTitle } from '../actions/header'
import Avatar from 'react-md/lib/Avatars'
import Chip from 'react-md/lib/Chips'

import DataTable from 'react-md/lib/DataTables/DataTable'
import TableHeader from 'react-md/lib/DataTables/TableHeader'
import TableBody from 'react-md/lib/DataTables/TableBody'
import TableRow from 'react-md/lib/DataTables/TableRow'
import TableColumn from 'react-md/lib/DataTables/TableColumn'
import Card from 'react-md/lib/Cards/Card'
import Button from 'react-md/lib/Buttons/Button'
import cn from 'classnames'


class ImplementedChecks extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
          query: '',
          status: -3,
          implementedChecks: []
    }

    this.changeQuery = this.changeQuery.bind(this)
    this.setQuery = this.setQuery.bind(this)
    this.timeout = null


    this.removeQuery = this.removeQuery.bind(this)
    this.filterByStatus = this.filterByStatus.bind(this)
  }

  removeQuery(){
    this.setState({
      query: '',
      status: -3,
      implementedChecks: allImplementedChecks
    })
  }

  setQuery(query){

    const { status } = this.state

    if(query === ''){

      const filteredChecks = allImplementedChecks
        .filter((o) => (o.bugs === status || status === -3))
        
      this.setState({
        query: '',
        implementedChecks: filteredChecks
      })
    } else {
      const filteredChecks = allImplementedChecks
        .filter((o) => (o.bugs === status || status === -3))
        .filter((o) => o.element.includes(query) || o.attribute.includes(query) || o.check.includes(query))

      this.setState({
        query: query,
        implementedChecks: filteredChecks
      })
    }
  }

  filterByStatus(status){
    const { query } = this.state

    if(query === ''){

      const filteredChecks = allImplementedChecks
        .filter((o) => (o.bugs === status || status === -3))
        
      this.setState({
        query: '',
        implementedChecks: filteredChecks,
        status: status
      })
    } else {
      const filteredChecks = allImplementedChecks
        .filter((o) => (o.bugs === status || status === -3))
        .filter((o) => o.element.includes(query) || o.attribute.includes(query) || o.check.includes(query))

      this.setState({
        query: query,
        implementedChecks: filteredChecks,
        status: status
      })
    }
  }

  changeQuery (e){
    const value = e.target.value

    clearTimeout(this.timeout)

    const setQuery = this.setQuery

    const enterPressed = e.key === 'Enter'

    this.timeout = setTimeout(function () {
      setQuery(value)
    }, enterPressed ? 0 : 2000);
  }

  componentDidMount() {
    this.props.setPageTitle(`Implemented checks`)
    this.setState({implementedChecks: allImplementedChecks})
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.implementedChecks.length !== nextState.implementedChecks.length){
      return true
    }
    return false
  }

  render () {

        const {
              implementedChecks,
              status
        } = this.state

        const statusMapping = {
          '-2': <span style={{color: 'red'}}>cant implement</span>,
          '-1': <span style={{color: 'red'}}>unknown</span>,
          '0':  <span style={{color: 'red'}}>X</span>,
          '1': <span style={{color: 'green'}}>✓</span>
        }

        const rows = implementedChecks.map((row, i) => {
          return (
            <TableRow key={`${row.element}-${row.attribute}-${row.check}`}>
              <TableColumn key='standard_type'>
                {row.standard}
              </TableColumn>
              <TableColumn key='version'>
                {row.version}
              </TableColumn>
              <TableColumn key='element'>
                {row.element}
              </TableColumn>
              <TableColumn key='attribute'>
                {row.attribute}
              </TableColumn>
              <TableColumn key='implement'>
                {statusMapping[parseInt(row.bugs, 10)]}
              </TableColumn>
              <TableColumn key='validation_checks'>
                {row.check}
              </TableColumn>
            </TableRow>
          )
        })

      console.log(status)

    return (

      <div className="md-grid">
                <div className="md-cell md-cell--12">

          <Card id="implemented-checks-list-table" tableCard>

            <div className="md-grid">
              <div className="md-cell md-cell--6">

                <TextField
                  id="search-input"
                  onKeyDown={this.changeQuery}
                  label="Search by iati element/attribute/error msg..."
                  lineDirection="center"
                  placeholder=""
                  customSize="search"
                />

              </div>
              <div className="md-cell md-cell--5 align-right">
                <Button
                  flat={true}
                  label='Reset'
                  primary
                  tooltipLabel='Reset'
                  onClick={this.removeQuery}
                >
                  refresh
                </Button>
              </div>
            </div>  

            <div className="md-grid">
              <div className="md-cell md-cell--4">

            

              </div>
              <div className="md-cell md-cell--8 align-right">
                
                <Chip
                  label={allImplementedChecks.filter(o => (o.bugs === 1)).length + " Implemented checks"}
                  avatar={<Avatar suffix="light-green">✓</Avatar>}
                  onClick={this.filterByStatus.bind(this, 1)}
                  className={cn({'selected': status === 1})}

                />

                <Chip
                  label={allImplementedChecks.filter(o => (o.bugs === 0)).length + " Non-implemented checks"}
                  avatar={<Avatar suffix="red">X</Avatar>}
                  onClick={this.filterByStatus.bind(this, 0)}
                  className={cn({'selected': status === 0})}
                />

                <Chip
                  label={allImplementedChecks.filter(o => (o.bugs === -2)).length + " Non-implementable checks"}
                  avatar={<Avatar suffix="yellow">:|</Avatar>}
                  onClick={this.filterByStatus.bind(this, -2)}
                  className={cn({'selected': status === -2})}
                />

              </div>
            </div>

            <DataTable plain>
              <Header></Header>
              <TableBody>
                {rows}
              </TableBody>
            </DataTable>
          </Card>
        </div> 
      </div> 
    )
  }
}



/* Header.jsx */

const Header = () => {

  return (
  <TableHeader>
    <TableRow autoAdjust={false}>
      <TableColumn tooltipLabel="" className='implemented-checks-col-1'>
        Standard type
      </TableColumn>
      <TableColumn tooltipLabel="" className='implemented-checks-col-2'>
        Version
      </TableColumn>
      <TableColumn tooltipLabel="" className='implemented-checks-col-3'>
        Element
      </TableColumn>
      <TableColumn tooltipLabel="" className='implemented-checks-col-4'>
        Attribute
      </TableColumn>
      <TableColumn tooltipLabel="" className='implemented-checks-col-5'>
        Implemented
      </TableColumn>
      <TableColumn tooltipLabel="" className='implemented-checks-col-6'>
        Validation checks
      </TableColumn>
    </TableRow>
  </TableHeader>
)};



export default connect(null, {
  setPageTitle,
})(ImplementedChecks)