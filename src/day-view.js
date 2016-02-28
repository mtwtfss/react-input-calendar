import React from 'react'
import cs from 'classnames'
import moment from 'moment'
import 'moment-range'

import Cell from './cell'
import ViewHeader from './view-header'

class DayView extends React.Component {
    constructor() {
      super()
      this.cellClick = this.cellClick.bind(this)
      this.next = this.next.bind(this)
      this.prev = this.prev.bind(this)
    }

    static propTypes = {
        date: React.PropTypes.object.isRequired,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        setDate: React.PropTypes.func,
        nextView: React.PropTypes.func,
        weekdays: React.PropTypes.arrayOf(React.PropTypes.string),
        weekStartsOn: React.PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6])
    }

    getDaysTitles() {
        if (this.props.weekdays) {
          return this.props.weekdays.map(item => ({ val: item, label: item }))
        } else if (moment.locale() === 'de') {
          return 'Mo_Di_Mi_Do_Fr_Sa_So'.split('_').map(item => ({ val: item, label: item }))
        }
        return moment.weekdaysMin().map(item => ({ val: item, label: item }))
    }

    next() {
        let nextDate = this.props.date.clone().add(1, 'months')
        if (this.props.maxDate && nextDate.isAfter(this.props.maxDate, 'day')) {
          nextDate = this.props.maxDate
        }
        this.props.setDate(nextDate)
    }

    prev() {
        let prevDate = this.props.date.clone().subtract(1, 'months')
        if (this.props.minDate && prevDate.isBefore(this.props.minDate, 'day')) {
          prevDate = this.props.minDate
        }
        this.props.setDate(prevDate)
    }

    cellClick(e) {
        let cell = e.target,
          date = parseInt(cell.innerHTML, 10),
          newDate = this.props.date ? this.props.date.clone() : moment()

        if (isNaN(date)) return

        if (cell.className.indexOf('prev') > -1 ) {
            newDate.subtract(1, 'months')
        } else if (cell.className.indexOf('next') > -1) {
            newDate.add(1, 'months')
        }

        newDate.date(date)
        this.props.setDate(newDate, true)
    }

    getDays() {
        let now = this.props.date ? this.props.date : moment(),
          start = now.clone().startOf('month').weekday(0),
          end = now.clone().endOf('month').weekday(6),
          minDate = this.props.minDate,
          maxDate = this.props.maxDate,
          month = now.month(),
          today = moment(),
          currDay = now.date(),
          year = now.year(),
          days = []

        moment()
          .range(start, end)
          .by('days', day => {
            days.push({
              label: day.format('D'),
              prev: (day.month() < month && !(day.year() > year)) || day.year() < year ,
              next: day.month() > month || day.year() > year,
              disabled: day.isBefore(minDate, 'day') || day.isAfter(maxDate, 'day'),
              curr: day.date() === currDay && day.month() === month,
              today: day.date() === today.date() && day.month() === today.month() && day.year() === today.year()
            })
          })
        return days
    }

    render() {
        if (this.props.weekStartsOn) {
          moment.locale(moment.locale(), {
            week: { dow: this.props.weekStartsOn }
          });
        }

        let titles = this.getDaysTitles().map((item, i) => {
            return <Cell classes="day title" key={i} value={item.label} />
        }), _class

        let days = this.getDays().map((item, i) => {
            _class = cs({
                'day': true,
                'next': item.next,
                'prev': item.prev,
                'disabled': item.disabled,
                'current': item.curr,
                'today': item.today
            })
            return <Cell classes={_class} key={i} value={item.label} />
        })

        let currentDate = this.props.date ? this.props.date.format('MMMM') : moment().format('MMMM')

        return (
            <div className="view days-view" onKeyDown={this.keyDown}>
                <ViewHeader
                  data={currentDate}
                  next={this.next}
                  prev={this.prev}
                  titleAction={this.props.nextView} />
                <div className="days-title">{titles}</div>
                <div className="days" onClick={this.cellClick}>{days}</div>
            </div>
        )
    }
}

export default DayView
