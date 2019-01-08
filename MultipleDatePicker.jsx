function WeekdayClick({ onClick, props, weekday, className, localeUtils, locale }) {
	const longName = localeUtils.formatWeekdayLong(weekday, locale);
	const shortName = localeUtils.formatWeekdayShort(weekday, locale);
	const weekdays = getWeekDays(props.currentMonth, weekday)
	const { toggleDates, missingDates, presentDates } = getToggleDates(props.dates, weekdays, props)
	return (
	  <div onClick={e => onClick(weekday)} 
		   tabIndex={0} 
		   className={className} 
		   title={longName}>
		{shortName}<br/>
		<input type="checkbox" disabled={toggleDates.length == 0} checked={presentDates.length > 0} />
	  </div>
	);
}

function mkWeeknumberClick(props) {
	return function(weekNumber, week, month) {
		const { toggleDates, missingDates, presentDates } = getToggleDates(props.dates, week, props)
		return <div>
			<input type="checkbox" disabled={toggleDates.length == 0} checked={presentDates.length > 0} />
		</div>
	}
}

function isDateInArray(dates, dateToFind) {
	return dates.some(date => DayPicker.DateUtils.isSameDay(date, dateToFind))
}

function getToggleDates(dates, inputDates, props) {
	const range = {
		from: props.minDate,
		to: props.maxDate
	}
	const toggleDates = inputDates.filter(inputDate =>
		DayPicker.DateUtils.isDayInRange(inputDate, range)
	)

	// valid dates only? - min, max date and any other restrictions
	const missingDates = toggleDates.filter(toggleDate =>
		!isDateInArray(dates, toggleDate)
	)
	const presentDates = toggleDates.filter(toggleDate =>
		isDateInArray(dates, toggleDate)
	)
	const removedDates = dates.filter(date =>
		!isDateInArray(toggleDates, date) 
	)
	
	return { toggleDates, missingDates, presentDates, removedDates }
}

function toggleDays(dates, inputDates, props) {
	const { toggleDates, missingDates, removedDates } = getToggleDates(dates, inputDates, props)
	if(missingDates.length == 0) {
		console.log("remove")
		return removedDates
	} else {
		console.log("add")
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

function getWeekDays(dayInMonth, weekday) {
	return getDaysOfMonth(dayInMonth).filter(day => 
		day.getDay() == weekday
	)
}

class MultiDate extends React.PureComponent {
	constructor(props) {
		super(props)
		this.handleDayClick = this.handleDayClick.bind(this)
		this.handleRowClick = this.handleRowClick.bind(this)
		this.handleColumnClick = this.handleColumnClick.bind(this)
		this.handleMonthChange = this.handleMonthChange.bind(this)
	}

	handleMonthChange(nextMonth) {
		this.props.onChange({ currentMonth: nextMonth })
	}

	handleDayClick(day, { disabled, selected }) {
		const selectedDays = this.props.dates
		const newDays = [...selectedDays]
		if(disabled) {
			return;
		}
		if (selected) {
		  const selectedIndex = selectedDays.findIndex(selectedDay =>
			DayPicker.DateUtils.isSameDay(selectedDay, day)
		  );
		  newDays.splice(selectedIndex, 1);
		} else {
		  newDays.push(day);
		}
		this.props.onChange({ dates: newDays })
	  }

	handleRowClick(weekNumber, week) {
		const selectedDays = this.props.dates
		console.log("row!", weekNumber, week)
		this.props.onChange({ dates: toggleDays(selectedDays, week, this.props) })
	}

	handleColumnClick(weekday) {
		const { currentMonth } = this.props
		const selectedDays = this.props.dates
		console.log("column!", currentMonth, weekday)
		const days = getWeekDays(currentMonth, weekday)
		this.props.onChange({ dates: toggleDays(selectedDays, days, this.props) })
	}

	render() {
		const { highlightedDates, currentMonth, minDate, maxDate } = this.props
		const selectedDays = this.props.dates
		console.log("currentMonth: ", currentMonth)
		const weekdayElement = <WeekdayClick props={this.props} onClick={this.handleColumnClick} />
		const weeknumberElement = mkWeeknumberClick(this.props)
		const disabledDays = (!this.props.debug && {
			before: minDate,
			after: maxDate
		})
		const isDateHighlighted = isDateInArray.bind(null, highlightedDates)
		const modifiers = {
			highlighted: isDateHighlighted
		}
		return <DayPicker 
			key="pick"
			selectedDays={selectedDays}
			modifiers={modifiers}
			onDayClick={this.handleDayClick}
			onWeekClick={this.handleRowClick}
			onMonthChange={this.handleMonthChange}
			weekdayElement={weekdayElement}
			renderWeek={weeknumberElement}
			fromMonth={minDate}
			toMonth={maxDate}
			month={currentMonth}
			showWeekNumbers
			showOutsideDays
			fixedWeeks
			disabledDays={disabledDays}
		/>
		//locale="fr"
		//localeUtils={DayPicker.LocaleUtils}
	}
}

class MultiDateReadOnly extends React.PureComponent {
	render() {
		console.log(this.props)
		const { dates, highlightedDates, minDate, maxDate, debug } = this.props
		const disabledDays = (!debug && {
			before: minDate,
			after: maxDate
		})
		const isDateHighlighted = isDateInArray.bind(null, highlightedDates)
		const modifiers = {
			highlighted: isDateHighlighted
		}
		return <DayPicker 
			key="pick"
			selectedDays={dates}
			fromMonth={minDate}
			toMonth={maxDate}
			showOutsideDays
			modifiers={modifiers}
			fixedWeeks
			disabledDays={disabledDays}
		/>
	}
}

class MultiDateJSF extends React.PureComponent {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.sendState = this.sendState.bind(this)
		this.state = {
			currentMonth: new Date(),
			dates: (this.props.cfg.value || []).map(epoch => new Date(epoch))
		}
	}
	
	sendState() {
		if(this.props.cfg.behaviors && this.props.cfg.behaviors.change) {
			this.props.cfg.behaviors.change.call(this);
		}
	}
	
	handleChange(nextState) {
		const cb = nextState.dates && this.sendState
		console.log("update - ", nextState, cb)
		const state = {
			currentMonth: nextState.currentMonth || this.state.currentMonth,
			dates: nextState.dates || this.state.dates
		}
		this.setState(state, cb)
	}
	
	render() {
		const { currentMonth, dates } = this.state 
		const { highlightedDates, minDate, maxDate, id } = this.props.cfg
		const jsonDates = JSON.stringify(
			dates.map(date => date.getTime())
		)
		const highlightedDateValues = (highlightedDates || []).map(epoch => new Date(epoch))
		return <div>
			<MultiDate 
				key="jsfPick"
				onChange={this.handleChange}
				dates={dates}
				currentMonth={currentMonth}
				highlightedDates={highlightedDateValues}
				minDate={new Date(minDate)} 
				maxDate={new Date(maxDate)}
				debug={false} 
			/>
			<input key="jsfInput" type="hidden" name={id} value={jsonDates}/>
		</div>
	}
}


PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function(cfg) {
		this._super(cfg)
		console.log("MultiDate - INIT")
		console.log(this.cfg)
		console.log(this.jq[0])
		this.render()
	},
	
	view: function() {
		if(this.cfg.readOnly) {
			const dates = (this.cfg.value || []).map(epoch => new Date(epoch))
			const highlightedDates = (this.cfg.highlightedDates || []).map(epoch => new Date(epoch))
			return <MultiDateReadOnly 
				dates={dates}
				highlightedDates={highlightedDates}
				minDate={new Date(this.cfg.minDate)} 
				maxDate={new Date(this.cfg.maxDate)}
				debug={false}
			/>
		}
		return <MultiDateJSF cfg={this.cfg}/>
	},
	
	render: function(cb) {
		ReactDOM.render(this.view(), this.jq[0], cb)
	},

	destroy: function() {
		console.log("MultiDate - UNMOUNT")
	},

	update: function() {
		console.log("MultiDate - UPDATE")
	},


})