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
		console.log("deselect all the toggle dates")
		return dates.filter(date => !toggleDates.some(
			toggleDate => DayPicker.DateUtils.isSameDay(date, toggleDate)
		))
	} else {
		console.log("select the new toggle dates")
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
		this.handleDayClick = this.handleDayClick.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.handleColumnClick = this.handleColumnClick.bind(this);
		this.handleMonthChange = this.handleMonthChange.bind(this)
		// state here vs state in PrimeFaces?
		this.state = {
			selectedDays: this.props.dates,
			currentMonth: new Date()
		}
	}

	handleMonthChange(date) {
		const { selectedDays } = this.state;
		this.setState({
			currentMonth: date,
			selectedDays
		})
	}

	handleDayClick(day, { disabled, selected }) {
		const { currentMonth, selectedDays } = this.state;
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
		this.setState({ 
			currentMonth,
			selectedDays
		});
	  }

	handleRowClick(week, days) {
		const { currentMonth, selectedDays } = this.state;
		console.log("row!", week, days)
		this.setState({ 
			currentMonth,
			selectedDays: toggleDays(selectedDays, days, this.props)
		});
	}

	handleColumnClick(weekday) {
		const { currentMonth, selectedDays } = this.state;
		console.log("column!", currentMonth, weekday)
		const days = getDaysOfMonth(currentMonth).filter(day => 
			day.getDay() == weekday
		)
		this.setState({ 
			currentMonth,
			selectedDays: toggleDays(selectedDays, days, this.props)
		});
	}

	render() {
		const { currentMonth, selectedDays } = this.state;
		const weekdayElement = <WeekdayClick onClick={this.handleColumnClick} />
		const jsonDays = JSON.stringify(
			selectedDays.map(day => day.getTime())
		)
		const disabledDays = (!this.props.debug && {
			before: this.props.minDate,
			after: this.props.maxDate
		})
		return <div>
			<DayPicker 
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
			<input type="hidden" name={this.props.jsfId} value={jsonDays}/>
		</div>
	}
}


PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function(cfg) {
		this._super(cfg)
		this.render()
	},

	view: function() {
		const dates = this.cfg.value.map(epoch => new Date(epoch))
		return <MultiDate 
			dates={dates} 
			minDate={new Date(this.cfg.minDate)} 
			maxDate={new Date(this.cfg.maxDate)}
			debug={false} 
			jsfId={this.cfg.id}
		/>
	},
	
	render: function() {
		ReactDOM.render(this.view(), this.jq[0])
	},

	destroy: function() {
		console.log("UNMOUNT")
	},

	update: function() {
		console.log("UPDATE")
	},


})