"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function WeekdayClick(_ref) {
	var _onClick = _ref.onClick,
	    weekday = _ref.weekday,
	    className = _ref.className,
	    localeUtils = _ref.localeUtils,
	    locale = _ref.locale;

	var longName = localeUtils.formatWeekdayLong(weekday, locale);
	var shortName = localeUtils.formatWeekdayShort(weekday, locale);
	return React.createElement(
		"div",
		{ onClick: function onClick(e) {
				return _onClick(weekday);
			},
			tabIndex: 0,
			className: className,
			title: longName },
		shortName
	);
}

function toggleDays(dates, inputDates, props) {
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
	console.log(missingDates);
	if (missingDates.length == 0) {
		console.log("deselect all the toggle dates");
		return dates.filter(function (date) {
			return !toggleDates.some(function (toggleDate) {
				return DayPicker.DateUtils.isSameDay(date, toggleDate);
			});
		});
	} else {
		console.log("select the new toggle dates");
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

var MultiDate = function (_React$Component) {
	_inherits(MultiDate, _React$Component);

	function MultiDate(props) {
		_classCallCheck(this, MultiDate);

		var _this = _possibleConstructorReturn(this, (MultiDate.__proto__ || Object.getPrototypeOf(MultiDate)).call(this, props));

		_this.handleDayClick = _this.handleDayClick.bind(_this);
		_this.handleRowClick = _this.handleRowClick.bind(_this);
		_this.handleColumnClick = _this.handleColumnClick.bind(_this);
		_this.handleMonthChange = _this.handleMonthChange.bind(_this);
		// state here vs state in PrimeFaces?
		_this.state = {
			selectedDays: _this.props.dates,
			currentMonth: new Date()
		};
		return _this;
	}

	_createClass(MultiDate, [{
		key: "handleMonthChange",
		value: function handleMonthChange(date) {
			var selectedDays = this.state.selectedDays;

			this.setState({
				currentMonth: date,
				selectedDays: selectedDays
			});
		}
	}, {
		key: "handleDayClick",
		value: function handleDayClick(day, _ref2) {
			var disabled = _ref2.disabled,
			    selected = _ref2.selected;
			var _state = this.state,
			    currentMonth = _state.currentMonth,
			    selectedDays = _state.selectedDays;

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
			this.setState({
				currentMonth: currentMonth,
				selectedDays: selectedDays
			});
		}
	}, {
		key: "handleRowClick",
		value: function handleRowClick(week, days) {
			var _state2 = this.state,
			    currentMonth = _state2.currentMonth,
			    selectedDays = _state2.selectedDays;

			console.log("row!", week, days);
			this.setState({
				currentMonth: currentMonth,
				selectedDays: toggleDays(selectedDays, days, this.props)
			});
		}
	}, {
		key: "handleColumnClick",
		value: function handleColumnClick(weekday) {
			var _state3 = this.state,
			    currentMonth = _state3.currentMonth,
			    selectedDays = _state3.selectedDays;

			console.log("column!", currentMonth, weekday);
			var days = getDaysOfMonth(currentMonth).filter(function (day) {
				return day.getDay() == weekday;
			});
			this.setState({
				currentMonth: currentMonth,
				selectedDays: toggleDays(selectedDays, days, this.props)
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _state4 = this.state,
			    currentMonth = _state4.currentMonth,
			    selectedDays = _state4.selectedDays;

			var weekdayElement = React.createElement(WeekdayClick, { onClick: this.handleColumnClick });
			var jsonDays = JSON.stringify(selectedDays.map(function (day) {
				return day.getTime();
			}));
			var disabledDays = !this.props.debug && {
				before: this.props.minDate,
				after: this.props.maxDate
			};
			return React.createElement(
				"div",
				null,
				React.createElement(DayPicker, {
					selectedDays: selectedDays,
					onDayClick: this.handleDayClick,
					onWeekClick: this.handleRowClick,
					onMonthChange: this.handleMonthChange,
					weekdayElement: weekdayElement,
					fromMonth: this.props.minDate,
					toMonth: this.props.maxDate,
					showWeekNumbers: true,
					showOutsideDays: true,
					disabledDays: disabledDays
				}),
				React.createElement("input", { type: "hidden", name: this.props.jsfId, value: jsonDays })
			);
		}
	}]);

	return MultiDate;
}(React.Component);

PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function init(cfg) {
		this._super(cfg);
		this.render();
	},

	view: function view() {
		var dates = this.cfg.value.map(function (epoch) {
			return new Date(epoch);
		});
		return React.createElement(MultiDate, {
			dates: dates,
			minDate: new Date(this.cfg.minDate),
			maxDate: new Date(this.cfg.maxDate),
			debug: false,
			jsfId: this.cfg.id
		});
	},

	render: function render() {
		ReactDOM.render(this.view(), this.jq[0]);
	},

	destroy: function destroy() {
		console.log("UNMOUNT");
	},

	update: function update() {
		console.log("UPDATE");
	}

});
