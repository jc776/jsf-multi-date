function WeekdayClick({ onClick, weekday, className, localeUtils, locale }) {
	const longName = localeUtils.formatWeekdayLong(weekday, locale);
	const shortName = localeUtils.formatWeekdayShort(weekday, locale);
	return (
	  <div onClick={e => onClick(weekday)} 
		   tabIndex={0} 
		   className={className} 
		   title={longName}>
		{shortName}
	  </div>
	);
}

function toggleDays(dates, inputDates, props) {
	const range = {
		from: props.minDate,
		to: props.maxDate
	}
	const toggleDates = inputDates.filter(inputDate =>
		DayPicker.DateUtils.isDayInRange(inputDate, range)
	)

	// valid dates only, too - min, max date and any other restrictions
	const missingDates = toggleDates.filter(toggleDate =>
		!dates.some(date => DayPicker.DateUtils.isSameDay(date, toggleDate))
	)
	console.log(missingDates)
	if(missingDates.length == 0) {
		return dates.filter(date => !toggleDates.some(
			toggleDate => DayPicker.DateUtils.isSameDay(date, toggleDate)
		))
	} else {
		return [...missingDates, ...dates]
	}
}

function getDaysOfMonth(dayInMonth) {
	const month = dayInMonth.getMonth()
	var date = new Date(dayInMonth.getFullYear(), month, 1);
	var days = [];
	while (date.getMonth() === month) {
	   days.push(new Date(date));
	   date.setDate(date.getDate() + 1);
	}
	return days;
}

class MultiDate extends React.Component {
	constructor(props) {
		super(props);
		this.handleDayClick = this.handleDayClick.bind(this)
		this.handleRowClick = this.handleRowClick.bind(this)
		this.handleColumnClick = this.handleColumnClick.bind(this)
		this.handleMonthChange = this.handleMonthChange.bind(this)
		// state here vs state in PrimeFaces?
		this.state = {
			currentMonth: new Date()
		}
	}

	handleMonthChange(date) {
		this.setState({
			currentMonth: date,
		})
	}

	handleDayClick(day, { disabled, selected }) {
		const selectedDays = this.props.dates;
		if(disabled) {
			return;
		}
		if (selected) {
		  const selectedIndex = selectedDays.findIndex(selectedDay =>
			DayPicker.DateUtils.isSameDay(selectedDay, day)
		  );
		  selectedDays.splice(selectedIndex, 1);
		} else {
		  selectedDays.push(day);
		}
		this.props.onChange(selectedDays)
	  }

	handleRowClick(week, days) {
		const selectedDays = this.props.dates;
		console.log("row!", week, days)
		this.props.onChange(toggleDays(selectedDays, days, this.props))
	}

	handleColumnClick(weekday) {
		const { currentMonth } = this.state
		const selectedDays = this.props.dates;
		console.log("column!", currentMonth, weekday)
		const days = getDaysOfMonth(currentMonth).filter(day => 
			day.getDay() == weekday
		)
		this.props.onChange(toggleDays(selectedDays, days, this.props))
	}

	render() {
		const selectedDays = this.props.dates;
		const weekdayElement = <WeekdayClick onClick={this.handleColumnClick} />
		const disabledDays = (!this.props.debug && {
			before: this.props.minDate,
			after: this.props.maxDate
		})
		return <DayPicker 
				selectedDays={selectedDays}
				onDayClick={this.handleDayClick}
				onWeekClick={this.handleRowClick}
				onMonthChange={this.handleMonthChange}
				weekdayElement={weekdayElement}
				fromMonth={this.props.minDate}
				toMonth={this.props.maxDate}
				showWeekNumbers
				showOutsideDays
				disabledDays={disabledDays}
			/>
			
	}
}

class MultiDateJSF extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this)
		const dates = this.props.cfg.value.map(epoch => new Date(epoch))
		this.state = {
			dates
		}
	}
	
	view() {
		const {dates} = this.state;
		const jsonDates = JSON.stringify(
			dates.map(day => day.getTime())
		)
		return (<div>
			<MultiDate 
				dates={dates} 
				onChange={this.handleChange}
				minDate={new Date(this.props.cfg.minDate)} 
				maxDate={new Date(this.props.cfg.maxDate)}
				debug={this.props.cfg.debug} 
			/>
			<input type="hidden" name={this.props.cfg.id} value={jsonDates}/>
		</div>)
	}
	
	handleChange(dates) {
		if(this.props.cfg.behaviors && this.props.cfg.behaviors.change) {
            this.props.cfg.behaviors.change.call(this.input);
        }
		this.setState({
			dates
		})
	}
}


PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function(cfg) {
		this._super(cfg)
		this.render()
	},
	
	render: function() {
		console.log("HELLO")
		console.log(this.cfg)
		ReactDOM.render(<MultiDateJSF cfg={this.cfg}/>, this.jq[0])
	},

	destroy: function() {
		console.log("MultiDate - UNMOUNT")
	},

	update: function() {
		console.log("MultiDate - UPDATE")
	}
})