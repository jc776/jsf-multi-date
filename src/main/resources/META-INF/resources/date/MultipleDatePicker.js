"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function WeekdayClick(_ref) {
	var _onClick = _ref.onClick,
	    props = _ref.props,
	    weekday = _ref.weekday,
	    className = _ref.className,
	    localeUtils = _ref.localeUtils,
	    locale = _ref.locale;

	var longName = localeUtils.formatWeekdayLong(weekday, locale);
	var shortName = localeUtils.formatWeekdayShort(weekday, locale);
	var weekdays = getWeekDays(props.currentMonth, weekday);

	var _getToggleDates = getToggleDates(props.dates, weekdays, props),
	    toggleDates = _getToggleDates.toggleDates,
	    missingDates = _getToggleDates.missingDates,
	    presentDates = _getToggleDates.presentDates;

	return React.createElement(
		"div",
		{ onClick: function onClick(e) {
				return _onClick(weekday);
			},
			tabIndex: 0,
			className: className,
			title: longName },
		shortName,
		React.createElement("br", null),
		React.createElement("input", { type: "checkbox", disabled: toggleDates.length == 0, checked: presentDates.length > 0 })
	);
}

function mkWeeknumberClick(props) {
	return function (weekNumber, week, month) {
		var _getToggleDates2 = getToggleDates(props.dates, week, props),
		    toggleDates = _getToggleDates2.toggleDates,
		    missingDates = _getToggleDates2.missingDates,
		    presentDates = _getToggleDates2.presentDates;

		return React.createElement(
			"div",
			null,
			React.createElement("input", { type: "checkbox", disabled: toggleDates.length == 0, checked: presentDates.length > 0 })
		);
	};
}

function getToggleDates(dates, inputDates, props) {
	var range = {
		from: props.minDate,
		to: props.maxDate
	};
	var toggleDates = inputDates.filter(function (inputDate) {
		return DayPicker.DateUtils.isDayInRange(inputDate, range);
	});

	// valid dates only, too - min, max date and any other restrictions
	var missingDates = toggleDates.filter(function (toggleDate) {
		return !dates.some(function (date) {
			return DayPicker.DateUtils.isSameDay(date, toggleDate);
		});
	});
	var presentDates = toggleDates.filter(function (toggleDate) {
		return dates.some(function (date) {
			return DayPicker.DateUtils.isSameDay(date, toggleDate);
		});
	});
	var removedDates = dates.filter(function (date) {
		return !toggleDates.some(function (toggleDate) {
			return DayPicker.DateUtils.isSameDay(date, toggleDate);
		});
	});

	return { toggleDates: toggleDates, missingDates: missingDates, presentDates: presentDates, removedDates: removedDates };
}

function toggleDays(dates, inputDates, props) {
	var _getToggleDates3 = getToggleDates(dates, inputDates, props),
	    toggleDates = _getToggleDates3.toggleDates,
	    missingDates = _getToggleDates3.missingDates,
	    removedDates = _getToggleDates3.removedDates;

	if (missingDates.length == 0) {
		console.log("remove");
		return removedDates;
	} else {
		console.log("add");
		return [].concat(_toConsumableArray(missingDates), _toConsumableArray(dates));
	}
}

function getDaysOfMonth(dayInMonth) {
	var month = dayInMonth.getMonth();
	var date = new Date(dayInMonth.getFullYear(), month, 1);
	var days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
}

function getWeekDays(dayInMonth, weekday) {
	return getDaysOfMonth(dayInMonth).filter(function (day) {
		return day.getDay() == weekday;
	});
}

var MultiDate = function (_React$PureComponent) {
	_inherits(MultiDate, _React$PureComponent);

	function MultiDate(props) {
		_classCallCheck(this, MultiDate);

		var _this = _possibleConstructorReturn(this, (MultiDate.__proto__ || Object.getPrototypeOf(MultiDate)).call(this, props));

		_this.handleDayClick = _this.handleDayClick.bind(_this);
		_this.handleRowClick = _this.handleRowClick.bind(_this);
		_this.handleColumnClick = _this.handleColumnClick.bind(_this);
		_this.handleMonthChange = _this.handleMonthChange.bind(_this);
		return _this;
	}

	_createClass(MultiDate, [{
		key: "handleMonthChange",
		value: function handleMonthChange(nextMonth) {
			this.props.onChange({ currentMonth: nextMonth });
		}
	}, {
		key: "handleDayClick",
		value: function handleDayClick(day, _ref2) {
			var disabled = _ref2.disabled,
			    selected = _ref2.selected;

			var selectedDays = this.props.dates;
			if (disabled) {
				return;
			}
			if (selected) {
				var selectedIndex = selectedDays.findIndex(function (selectedDay) {
					return DayPicker.DateUtils.isSameDay(selectedDay, day);
				});
				selectedDays.splice(selectedIndex, 1);
			} else {
				selectedDays.push(day);
			}
			this.props.onChange({ dates: selectedDays });
		}
	}, {
		key: "handleRowClick",
		value: function handleRowClick(weekNumber, week) {
			var selectedDays = this.props.dates;
			console.log("row!", weekNumber, week);
			this.props.onChange({ dates: toggleDays(selectedDays, week, this.props) });
		}
	}, {
		key: "handleColumnClick",
		value: function handleColumnClick(weekday) {
			var currentMonth = this.props.currentMonth;

			var selectedDays = this.props.dates;
			console.log("column!", currentMonth, weekday);
			var days = getWeekDays(currentMonth, weekday);
			this.props.onChange({ dates: toggleDays(selectedDays, days, this.props) });
		}
	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    currentMonth = _props.currentMonth,
			    minDate = _props.minDate,
			    maxDate = _props.maxDate;

			var selectedDays = this.props.dates;
			console.log("currentMonth: ", currentMonth);
			var weekdayElement = React.createElement(WeekdayClick, { props: this.props, onClick: this.handleColumnClick });
			var weeknumberElement = mkWeeknumberClick(this.props);
			var disabledDays = !this.props.debug && {
				before: minDate,
				after: maxDate
			};
			return React.createElement(DayPicker, {
				key: "pick",
				selectedDays: selectedDays,
				onDayClick: this.handleDayClick,
				onWeekClick: this.handleRowClick,
				onMonthChange: this.handleMonthChange,
				weekdayElement: weekdayElement,
				renderWeek: weeknumberElement,
				fromMonth: minDate,
				toMonth: maxDate,
				month: currentMonth,
				showWeekNumbers: true,
				showOutsideDays: true,
				fixedWeeks: true,
				disabledDays: disabledDays
			});
		}
	}]);

	return MultiDate;
}(React.PureComponent);

PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function init(cfg) {
		this._super(cfg);
		console.log(this.state);
		this.handleChange = this.handleChange.bind(this);
		this.sendState = this.sendState.bind(this);
		this.state = {
			currentMonth: new Date(),
			dates: this.cfg.value.map(function (epoch) {
				return new Date(epoch);
			})
		};
		this.render();
	},

	view: function view() {
		var _state = this.state,
		    currentMonth = _state.currentMonth,
		    dates = _state.dates;
		var _cfg = this.cfg,
		    minDate = _cfg.minDate,
		    maxDate = _cfg.maxDate,
		    id = _cfg.id;

		var jsonDates = JSON.stringify(dates.map(function (date) {
			return date.getTime();
		}));
		return React.createElement(
			"div",
			null,
			React.createElement(MultiDate, {
				key: "jsfPick",
				onChange: this.handleChange,
				dates: dates,
				currentMonth: currentMonth,
				minDate: new Date(minDate),
				maxDate: new Date(maxDate),
				debug: false
			}),
			React.createElement("input", { key: "jsfInput", type: "hidden", name: id, value: jsonDates })
		);
	},

	sendState: function sendState() {
		if (this.cfg.behaviors && this.cfg.behaviors.change) {
			this.cfg.behaviors.change.call(this);
		}
	},

	handleChange: function handleChange(nextState) {
		var cb = nextState.dates && this.sendState;
		console.log("update - ", nextState, cb);
		this.state = {
			currentMonth: nextState.currentMonth || this.state.currentMonth,
			dates: nextState.dates || this.state.dates
		};
		this.render(cb);
	},


	render: function render(cb) {
		ReactDOM.render(this.view(), this.jq[0], cb);
	},

	destroy: function destroy() {
		console.log("MultiDate - UNMOUNT");
	},

	update: function update() {
		console.log("MultiDate - UPDATE");
	}

});
