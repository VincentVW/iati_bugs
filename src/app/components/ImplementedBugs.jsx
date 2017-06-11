/** @flow */
import React, { Component } from 'react'
import { AutoSizer, Grid, VirtualScroll } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'


class ImplementedErrorList extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      columnWidth: 300,
      columnCount: 6,
      height: 600,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 40,
      rowCount: 0,
      fixedHeader: '',
      implementedChecks: [
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'last-updated-datetime', check: 'last-updated-time is less than previously existing activity', bugs: 1, dashboard: 0, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'last-updated-datetime', check: 'last-updated-time is not present, but is present on previously existing activity', bugs: 1, dashboard: 0, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'xml:lang', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'default-currency', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '2.02',  element: 'iati-activity', attribute:'humanitarian', check: 'Must be of type xsd:boolean', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'hierarchy', check: 'Must be of type xsd:int', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'iati-activity', attribute:'hierarchy', check: 'If multiple levels are reported then, to avoid double counting, financial transactions should only be reported at the lowest hierarchical level.', bugs: 1, dashboard: 0, validator: 0},
            
            {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: 'Required element', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: 'Must be prefixed with either the current org ref for the reporting org or a previous identifier reported in other-identifier, and suffixed with the organisation’s own activity identifier.', bugs: 1, dashboard: 0, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: 'Should match the regex [^\/\&\|\?]+', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'iati-identifier', attribute:'text', check: 'Should not be repeated in other datasets', bugs: 0, dashboard: 0, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'ref', check: 'Must be of type xsd:int', bugs: 1, dashboard: 1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'reporting-org', attribute:'ref', check: 'Must be in format {RegistrationAgency}-{RegistrationNumber}', bugs: 1, dashboard: 0, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'reporting-org', attribute:'secondary-publisher', check: 'Must be of type xsd:boolean', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.0x',  element: 'reporting-org', attribute:'xml:lang', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '2.01+', element: 'reporting-org/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'reporting-org/narrative', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: 0, validator: 1},

            {standard: 'activity', version: '1.0x',  element: 'title', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'title', attribute:'-', check: 'Should occur once and only once', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'title/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'title/narrative', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: 0, validator: 1},

            {standard: 'activity', version: '1.0x',  element: 'description', attribute:'-', check: 'Should occur at least once', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.0x',  element: 'description', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'description/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'description/narrative', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: 0, validator: 1},

            {standard: 'activity', version: '2.01+', element: 'participating-org', attribute:'ref', check: 'Must be in the format {Registration Agency} - (Registration Number}', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'participating-org', attribute:'ref', check: 'Participating-org/@ref should match the regex [^\/\&\|\?]+', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'participating-org', attribute:'ref', check: 'Either @ref or narrative must be present', bugs: 1, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'participating-org', attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'participating-org', attribute:'role', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'participating-org', attribute:'role', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'participating-org', attribute:'activity-id', check: 'Must be an existing IATI activity', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'participating-org', attribute:'text', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'participating-org/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'participating-org/narrative', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.0x',  element: 'other-identifier', attribute:'owner-ref/owner-name', check: 'Either @owner-ref or @owner-name must be present', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier', attribute:'ref', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier', attribute:'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier', attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier/owner-org', attribute:'ref', check: 'When used MUST contain a valid organisation identifier', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier/owner-org', attribute:'ref', check: 'When used, then either other-identifier/owner-org/@ref or other-identifier/owner-org/narrative/text() MUST be present', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier/owner-org/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'other-identifier/owner-org/narrative', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '2.01+', element: 'activity-status', attribute:'-', check: 'This element should occur once and only once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-status', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-status', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'activity-date', attribute:'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-date', attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-date', attribute:'type', check: 'All instances of the ActivityDateType code 2 & 4 (actual dates) are not expected to be in the future.', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-date', attribute:'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'activity-date', attribute:'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'activity-date', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'activity-date/narratives', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'activity-date/narratives', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'contact-info', attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/organisation', attribute:'-', check: 'Required element', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/organisation', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/organisation', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/organisation', attribute:'-', check: 'Should occur no more than once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/organisation/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/organisation/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '2.01+', element: 'contact-info/department', attribute:'-', check: 'Should occur no more than once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/department/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/department/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.0x',  element: 'contact-info/person-name', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/person-name', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/person-name', attribute:'-', check: 'Should occur no more than once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/person-name/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/person-name/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.0x',  element: 'contact-info/job-title', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/job-title', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/job-title', attribute:'-', check: 'Should occur no more than once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/job-title/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/job-title/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'contact-info/telephone', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'contact-info/email', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'contact-info/website', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.0x',  element: 'contact-info/mailing-address', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'contact-info/mailing-address', attribute:'text', check: 'Should not be empty', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/mailing-address/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'contact-info/mailing-address/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.03+', element: 'activity-scope', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.03+', element: 'activity-scope', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'recipient-country', attribute:'percentage', check: 'Should be of type xsd:decimal, between 0 and 100', bugs: 1, dashboard: 1, validator: 1},


            {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'code', check: 'Must be on codelist (for default vocabulary)', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'code', check: 'Must be on codelist (for non-default vocabulary)', bugs: -2, dashboard: 0, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'percentage', check: 'Should be of type xsd:decimal, between 0 and 100', bugs: 1, dashboard: 1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'recipient-region', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'recipient-country / recipient-region', attribute:'percentage', check: 'Percentages for all reported countries and regions must add up to 100%', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'location', attribute:'ref', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/location-id', attribute:'code', check: 'Must be on codelist (for any vocabulary)', bugs: -2, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/location-id', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.0x',  element: 'location/name', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/name/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/name/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.0x',  element: 'location/description', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/description/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/description/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.0x',  element: 'location/activity-description', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/activity-description/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '2.01+', element: 'location/activity-description/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'location/administrative', attribute:'code', check: 'Must be on codelist (for any vocabulary)', bugs: -2, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/administrative', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/administrative', attribute:'level', check: 'Should be of type xsd:nonNegativeInteger', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'location/point/pos', attribute:'text', check: 'Should be of format "lat lng"', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/point/pos', attribute:'text', check: 'Should be a valid point according to epsg-crs-4326', bugs: 1, dashboard: -1, validator: 1},      

            {standard: 'activity', version: '1.01+', element: 'location/exactness', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/exactness', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'location/location-reach', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/location-reach', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'location/location-class', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/location-class', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},


            {standard: 'activity', version: '1.01+', element: 'location/feature-designation', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'location/feature-designation', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: 1},


            {standard: 'activity', version: '1.01+', element: 'sector', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'sector', attribute:'code', check: 'Must be on codelist (for default vocabulary)', bugs: 1, dashboard: 1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'sector', attribute:'code', check: 'Must be on codelist (for non-default vocabulary)', bugs: -2, dashboard: 1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'sector', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '2.02+', element: 'sector', attribute:'vocabulary-uri', check: 'Should be of type xsd:anyURI', bugs: 1, dashboard: 1, validator: 0},
            {standard: 'activity', version: '1.01+', element: 'sector', attribute:'percentage', check: 'Percentages for all reported sectors must add up to 100%', bugs: 1, dashboard: -1, validator: -1},


            {standard: 'activity', version: '1.01+', element: 'country-budget-items', attribute:'vocabulary', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items', attribute:'-', check: 'Should occur no more than once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item', attribute:'-', check: 'Should occur at least once', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item', attribute:'percentage', check: 'Should be of type xsd:decimal, between 0 and 100', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item', attribute:'percentage', check: 'For each vocabulary used, the percentage values should sum 100%', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item/description', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item/description/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'country-budget-items/budget-item/description/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},

            // need to re-check order for humanitarian scope (xsd sequence)
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope', attribute:'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope', attribute:'vocabulary', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope', attribute:'vocabulary-uri', check: 'Should be of type xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'humanitarian-scope/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.02+', element: 'policy-marker', attribute:'vocabulary-uri', check: 'Should be of type xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'code', check: 'Must be on codelist (for default vocabulary)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'code', check: 'Must be on codelist (for non-default vocabulary)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'policy-marker', attribute:'significance', check: 'This attribute MUST be used for all OECD DAC CRS vocabularies', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.0x',  element: 'policy-marker', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'policy-marker/narrative', attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'policy-marker/narrative', attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'collaboration-type', attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'collaboration-type', attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'default-flow-type',                    attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'default-flow-type',                    attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'default-finance-type',                 attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'default-finance-type',                 attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'default-aid-type',                     attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'default-aid-type',                     attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'default-tied-status',                  attribute:'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'default-tied-status',                  attribute:'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'budget',                               attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget',                               attribute:'status', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/period-start',                  attribute:'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/period-start',                  attribute:'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/period-end',                    attribute:'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/period-end',                    attribute:'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/value',                         attribute:'currency', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/value',                         attribute:'value-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'budget/value',                         attribute:'value-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},

            // To check;

            {standard: 'activity', version: '1.01+', element: 'planned-disbursement',                 attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement',                 attribute:'status', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/period-start',    attribute:'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/period-start',    attribute:'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/period-end',      attribute:'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/period-end',      attribute:'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/value',           attribute:'currency', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/value',           attribute:'value-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'planned-disbursement/value',           attribute:'value-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},

            // TO DO: capital spend checks
            {standard: 'activity', version: '1.01+', element: 'capital-spend',                        attribute:'percentage', check: 'Content must be a positive decimal number between 0 and 100 of type xsd:decimal', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'capital-spend',                        attribute:'percentage', check: 'Must occur no more than once', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction',                          attribute: 'ref', check: 'Must be of type xsd:string', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction',                          attribute: 'humanitarian', check: 'Must be of type xsd:boolean', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction',                          attribute: 'transaction-type', check: 'Must occur once and only once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/transaction-type',         attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/transaction-date',         attribute: 'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/transaction-date',         attribute: 'iso-date', check: 'Must be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/transaction-date',         attribute: 'iso-date', check: 'Must be today, or in the past', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/value',                    attribute: 'currency', check: 'Required unless the iati-activity/@default-currency is present', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/value',                    attribute: 'currency', check: 'Must be on codelist', bugs: 1, dashboard: 1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/value',                    attribute: 'value-date', check: 'Must be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/value',                    attribute: 'text', check: 'Must be of type xsd:decimal', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/description',              attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'transaction/description/narrative',    attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'transaction/description/narrative',    attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'ref', check: 'Must be in the format {Registration Agency} - (Registration Number}', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'ref', check: 'Must be an existing IATI organisation', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'ref', check: 'If this is not present then the narrative MUST contain the name of the organisation.', bugs: -2, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org',             attribute: 'provider-activity-id', check: 'Must be an existing IATI activity', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org/narrative',   attribute: 'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/provider-org/narrative',   attribute: 'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'ref', check: 'Must be in the format {Registration Agency} - (Registration Number}', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'ref', check: 'Must be an existing IATI organisation', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'ref', check: 'If this is not present then the narrative MUST contain the name of the organisation.', bugs: -2, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org',             attribute: 'receiver-activity-id', check: 'Must be an existing IATI activity', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org/narrative',   attribute: 'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/receiver-org/narrative',   attribute: 'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/disbursement-channel',     attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/disbursement-channel',     attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/disbursement-channel',     attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: '-', check: 'If this element is used then ALL transaction elements should contain a transaction/sector element and iati-activity/sector should NOT be used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: '-', check: 'This element can be used multiple times, but only one sector can be reported per vocabulary.', bugs: 0, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: '-', check: 'Either transaction/sector or sector must be present.', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: 'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/sector',                   attribute: 'vocabulary-uri', check: 'Must be of type xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-country',        attribute: '-', check: 'If this element is used then ALL transaction elements should contain a transaction/recipient-country element and iati-activity/recipient-country should NOT be used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-country',        attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-country',        attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: '-', check: 'If this element is used then ALL transaction elements should contain a transaction/recipient-region element and iati-activity/recipient-region should NOT be used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: '-', check: 'This element can be used multiple times, but only one recipient-region can be reported per vocabulary.', bugs: 0, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: 'vocabulary', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-region',         attribute: 'vocabulary-uri', check: 'Must be of type xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-country|recipient-region', attribute: '-', check: 'Either transaction/recipient-region,transaction/recipient-country,   or recipient-region,recipient-country must be present.', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/recipient-country|recipient-region', attribute: '-', check: 'only a recipient-region OR a recipient-country is expected', bugs: 0, dashboard: -1, validator: -1},
           
            {standard: 'activity', version: '1.01+', element: 'transaction/flow-type',                attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/flow-type',                attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/flow-type',                attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/finance-type',             attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/finance-type',             attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/finance-type',             attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/aid-type',                 attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/aid-type',                 attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/aid-type',                 attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'transaction/tied-status',              attribute: '-', check: 'Must occur no more than once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/tied-status',              attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'transaction/tied-status',              attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'document-link',                       attribute:'url', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link',                       attribute:'url', check: 'Should be of type xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'document-link',                       attribute:'format', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link',                       attribute:'format', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'document-link/title',                 attribute: '-', check: 'Must occur occur once and only once (within each parent element)', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'document-link/title/narrative',       attribute:'text', check: 'Should not be empty when used', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '2.01+', element: 'document-link/title/narrative',       attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '2.01+', element: 'document-link/category',              attribute: '-', check: 'This element must occur at least once (within each parent element).', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link/category',              attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link/category',              attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'document-link/language',              attribute: 'code', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link/language',              attribute: 'code', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'document-link/document-date',         attribute: '-', check: 'This element must occur no more than once (within each parent element).', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link/document-date',         attribute: 'iso-date', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'document-link/document-date',         attribute: 'iso-date', check: 'Should be of type xsd:date', bugs: 1, dashboard: -1, validator: -1},

            {standard: 'activity', version: '1.01+', element: 'related-activity',                    attribute:'ref', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'related-activity',                    attribute:'ref', check: 'Must be an existing IATI activity identifier', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'related-activity',                    attribute:'type', check: 'Required attribute', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'related-activity',                    attribute:'type', check: 'Must be on codelist', bugs: 1, dashboard: -1, validator: -1},
            

            // TOMORROW

            {standard: 'activity', version: '1.01+', element: 'conditions',                          attribute:'-', check: 'This element must occur no more than once (within each parent element).', bugs: 0, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'conditions',                          attribute:'attached', check: 'Required attribute', bugs: 0, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'conditions',                          attribute:'attached', check: 'Must be of type xsd:boolean', bugs: 0, dashboard: 0, validator: 1},

            {standard: 'activity', version: '1.01+', element: 'conditions/condition',                attribute:'type', check: 'Required attribute', bugs: 0, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'conditions/condition',                attribute:'type', check: 'Must be on codelist', bugs: 0, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'conditions/condition/narratives',     attribute:'text', check: 'Should not be empty when used', bugs: 0, dashboard: 0, validator: 1},
            {standard: 'activity', version: '1.01+', element: 'conditions/condition/narratives',     attribute:'xml:lang', check: 'xml:lang should be provided on element itself or the iati-activity (as default language)', bugs: 0, dashboard: 0, validator: 1},


            
            {standard: 'activity', version: '1.01+', element: 'result',                               attribute:'type',                   check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result',                               attribute:'aggregation-status',     check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/title',                         attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/title/narrative',               attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/description',                   attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/description/narrative',         attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator',                     attribute:'measure',                check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator',                     attribute:'ascending',              check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/title',               attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/description',         attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/baseline',            attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/period',              attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/period/period-start', attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/period/period-end',   attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/period/target',       attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'result/indicator/period/actual',       attribute: 'todo',                  check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'crs-add',                                    attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/aidtype-flag',                       attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/aidtype-flag/code',                  attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/aidtype-flag/significance',          attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms',                         attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/repayment-type',          attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/repayment-plan',          attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/commitment-date',         attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/repayment-first-date',    attribute: 'todo',         check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/repayment-final-date',    attribute: 'todo',         check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/rate-1',                  attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-terms/rate-2',                  attribute: 'todo',            check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status',                        attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/interest-received',      attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/principal-outstanding',  attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/principal-arrears',      attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/year',                   attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/currency',               attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'crs-add/loan-status/value-date',             attribute: 'todo',      check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            
            {standard: 'activity', version: '1.01+', element: 'fss',                      attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/forecast',             attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/forecast/year',        attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/forecast/currency',    attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/forecast/value-date',  attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/extraction-date',      attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/priority',             attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            {standard: 'activity', version: '1.01+', element: 'fss/phaseout-year',        attribute: 'todo', check: 'todo', bugs: 1, dashboard: -1, validator: -1},
            

            
            {standard: 'activity', version: '1.0x', element: 'activity-website',          attribute:'text', check: 'xsd:anyURI', bugs: 1, dashboard: -1, validator: -1},
            

            // end of to check;

            // https://github.com/pwyf/2017-technical-consultation/issues/26#issuecomment-293638917

            // great addition by Yohanna:
            // An automatic test could be designed to identify at least some of the mistakes, by combining AidType with Implementing Organization Type. 
            // For instance, 
            // AidType A01 and A02 require a Government OrgType. 
            // AidType B02 requires an OrgType Multilateral, 
            // while AidType B03 can only have OrgType Multilateral or INGO 
            // (which are easily confirmed via their Channel Code).


            // need to check additional 2.02 element that are missing in the above, only added humanitarian-scope
            {standard: '-', version: '-', element: 'Any more suggestions?', attribute:'Add to the Trello board please!', check: '-', bugs: 0, dashboard: 0, validator: 0},
          ],
    }


    this._renderHeaderCell = this._renderHeaderCell.bind(this)
    this._getColumnWidth = this._getColumnWidth.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.rowCount !== nextProps.modelAggregation.size){
      this.setState({
        rowCount: nextProps.modelAggregation.size
      });
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {

    const {
      columnCount,
      height,
      overscanColumnCount,
      rowHeight,
      fixedHeader,
      implementedChecks
    } = this.state

    const headerClasses = cn(fixedHeader, 'colHeader')

    return (
      <div className="ListWrapper2">
        <div className="ListInfo">
          <p>
            Do you have any additions? Feel free to add them to the <a target="_blank" href="https://trello.com/b/cAa0ryxh/iati-bugs">Trello board</a> or <a target="_blank" href="https://github.com/VincentVW/iati_bugs">the code</a>!
            <br /><br />
            Last updated: 2017-06-11
            <br /><br />
            Amount of checks: {implementedChecks.length}
           </p>
        </div>
        <div id="implementedBugsList">
          <div 
          className={headerClasses}>
            <Grid
              className="HeaderGrid"
              columnWidth={this._getColumnWidth}
              columnCount={columnCount}
              height={46}
              overscanColumnCount={overscanColumnCount}
              cellRenderer={this._renderHeaderCell}
              rowHeight={46}
              rowCount={1}
              width={2400}
            />
          </div>

            <AutoSizer disableHeight>
              {({ width }) => (
                
                <VirtualScroll
                  width={2400}
                  height={height}
                  rowCount={implementedChecks.length}
                  rowHeight={rowHeight}
                  rowRenderer={this._rowRenderer}
                />

              )}
            </AutoSizer>
        </div>
      </div>
    )
  }

  _getColumnWidth ({ index }) {
    switch (index) {
      case 0:
        return 150
      case 1:
        return 100
      case 2:
        return 260
      case 3:
        return 250
      case 4:
        return 150
      case 5:
        return 1200
      case 6:
        return 150
      case 7:
        return 1200
      default:
        return 100
    }
  }

  _renderHeaderCell ({ columnIndex, rowIndex }) {
    let content

    switch (columnIndex) {
      case 0:
        content = 'Standard type'
        break
      case 1:
        content = 'Version'
        break
      case 2:
        content = 'Element'
        break
      case 3:
        content = 'Attribute'
        break
      case 4:
        content = 'Implemented'
        break
      case 5:
        content = 'Validation check'
        break
      default:
        content = (
          <div>
          	empty
          </div>
        )
        break
    }

    return (
      <div className="headerCell">
        {content}
      </div>
    )
  }

  implementedContent (status){
    switch(status){
      case -1:
        return 'unknown'
      case 0:
        return 'X'
      case 1:
        return '✓'
      default:
        return 'unknown'
    }
  }

  _rowRenderer ({ index, isScrolling }) {
    const { implementedChecks } = this.state
    const row = implementedChecks[index]
    const even = (index % 2 === 1) ? 'uneven': 'even';
    const rowCn = cn('rv-row', 'row', even)

    const bugsClasses = cn('rv-col', 'column-4', 'status-'+row.bugs)
    // const dashboardClasses = cn('rv-col', 'column-5', 'status-'+row.dashboard)
    // const validatorClasses = cn('rv-col', 'column-6', 'status-'+row.validator)
    const bugsText = this.implementedContent(row.bugs)
    // const dashboardText = this.implementedContent(row.dashboard)
    // const validatorText = this.implementedContent(row.validator)

    let element = row.element
    if(element.length > 36){
      element = element.substr(0,36) + '...';
    }

    return (
      <div className={rowCn}>

        <div className="rv-col column-1" style={{width: this._getColumnWidth({index: 0})}}>
          {row.standard}
        </div>

        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 1})}}>
          {row.version}
        </div>

        <div className="rv-col column-2" style={{width: this._getColumnWidth({index: 2})}} title={row.element}>
          {element}
        </div>
        
        <div className="rv-col column-3" style={{width: this._getColumnWidth({index: 3})}}>
          {row.attribute}
        </div>

        <div className={bugsClasses} style={{width: this._getColumnWidth({index: 4})}}>
          {bugsText}
        </div>

        <div className="rv-col column-5" style={{width: this._getColumnWidth({index: 5})}}>
          {row.check}
        </div>
      </div>
    )
  }
}

export default ImplementedErrorList
