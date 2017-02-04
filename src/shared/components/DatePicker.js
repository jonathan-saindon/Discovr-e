import React, { Component, PropTypes } from 'react'
import Icon from '../../hackatown/components/Icon'
import moment from 'moment'
import '../styles/molecules/_datepicker.sass'

/* DATE PICKER
 *  This component is to create a list of days for a given month and year to pick a specific date in a form or filter.
 *
 *  Call to component should look something like this:
 *  <DatePicker action="function"/>
 * */
export default class DatePicker extends Component {
  var year, month, day, date

  constructor(props, context) {
    super(props, context)
  }

  const handleSendingDate = (given_day) => {
    this.props.action(given_day)
  }

  render() {
    moment.locale("fr-CA")
    let date = moment()
    let year = date.year()
    let month = date.month() + 1
    let day = date.date() + 1
    return (
      <div className="field date-picker">
        <label className="" for="id-name">Please choose a date:</label>
        <div className="date-picker-element select-input">
          <select style="width:auto">
            {this.getNextYears().map(this.createYearOption)}
          </select>
        </div>
        <div className="date-picker-element">
          <span onclick={this.subtractMonth()}><Icon icon_class={"fa-chevron-circle-left"}/></span>
          <span>{this.getCurrentMonthName()}</span>
          <span onclick={this.addMonth()}><Icon icon_class={"fa-chevron-circle-right"}/></span>
        </div>
        <div className="date-picker-element">
          <div className="date-picker-day-names">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>
          <div className="date-picker-day-list">
            {this.getMonthDays().map(this.createCalendarDay)}
          </div>
        </div>
      </div>
    )
  }

  const getMonthDays = () => {
    let days = []
    let monthDate = moment().year(this.year).month(this.month - 1).date(1)

    if (monthDate.day() == 0) {
      vm.month_days.push({
        empty: true
      })
      vm.month_days.push({
        empty: true
      })
      vm.month_days.push({
        empty: true
      })
      vm.month_days.push({
        empty: true
      })
      vm.month_days.push({
        empty: true
      })
      vm.month_days.push({
        empty: true
      })
    } else {
      for (var i = 1; i < monthDate.day(); i++) {
        vm.month_days.push({
          empty: true
        })
      }
    }

    do {
      vm.month_days.push(moment(monthDate))
      monthDate.add(1, 'days')
    } while (monthDate.month() == (vm.current_month - 1))

    return vm.month_days
  }

  const getNextYears = () => {
    return [year,
      year + 1,
      year + 2,
      year + 3,
      year + 4,
      year + 5,
      year + 6,
      year + 7,
      year + 8,
      year + 9,
      year + 10]
  }

  const getCurrentMonthName = () => {
    return date.format("MMMM")
  }

  const subtractMonth = () => {
    return date.subtract(1, "months")
  }

  const addMonth = () => {
    return date.add(1, "months")
  }

  const createYearOption = (givenYear) => {
    if (givenYear == this.year) {
      return (
        <option value={givenYear} key={givenYear} selected>{givenYear}</option>
      )
    } else {
      return (
        <option value={givenYear} key={givenYear}>{givenYear}</option>
      )
    }
  }

  const createCalendarDay = (givenDay) => {
    if (givenDay.empty) {
      return (
        <div className="date-picker-day empty" key={givenDay} onclick={this.handleSendingDate(monthDay)}>
          <div className="date-number">0</div>
        </div>
      )
    } else if (date.format("YYYY-MM-DD") == givenDay.format("YYYY-MM-DD")) {
      return (
        <div className="date-picker-day" key={givenDay} onclick={this.handleSendingDate(monthDay)}>
          <div className="date-number selected">
            {day.format("D")}
          </div>
        </div>
      )
    } else {
      return (
        <div className="date-picker-day" key={givenDay} onclick={this.handleSendingDate(monthDay)}>
          <div className="date-number">
            {givenDay.format("D")}
          </div>
        </div>
      )
    }
  }
}

DatePicker.propTypes = {
  action: PropTypes.func.isRequired
}