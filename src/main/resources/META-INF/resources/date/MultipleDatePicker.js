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
		return dates.filter(function (date) {
			return !toggleDates.some(function (toggleDate) {
				return DayPicker.DateUtils.isSameDay(date, toggleDate);
			});
		});
	} else {
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
			currentMonth: new Date()
		};
		return _this;
	}

	_createClass(MultiDate, [{
		key: "handleMonthChange",
		value: function handleMonthChange(date) {
			this.setState({
				currentMonth: date
			});
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
			this.props.onChange(selectedDays);
		}
	}, {
		key: "handleRowClick",
		value: function handleRowClick(week, days) {
			var selectedDays = this.props.dates;
			console.log("row!", week, days);
			this.props.onChange(toggleDays(selectedDays, days, this.props));
		}
	}, {
		key: "handleColumnClick",
		value: function handleColumnClick(weekday) {
			var currentMonth = this.state.currentMonth;

			var selectedDays = this.props.dates;
			console.log("column!", currentMonth, weekday);
			var days = getDaysOfMonth(currentMonth).filter(function (day) {
				return day.getDay() == weekday;
			});
			this.props.onChange(toggleDays(selectedDays, days, this.props));
		}
	}, {
		key: "render",
		value: function render() {
			var selectedDays = this.props.dates;
			var weekdayElement = React.createElement(WeekdayClick, { onClick: this.handleColumnClick });
			var disabledDays = !this.props.debug && {
				before: this.props.minDate,
				after: this.props.maxDate
			};
			return React.createElement(DayPicker, {
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
			});
		}
	}]);

	return MultiDate;
}(React.Component);

var MultiDateJSF = function (_React$Component2) {
	_inherits(MultiDateJSF, _React$Component2);

	function MultiDateJSF(props) {
		_classCallCheck(this, MultiDateJSF);

		var _this2 = _possibleConstructorReturn(this, (MultiDateJSF.__proto__ || Object.getPrototypeOf(MultiDateJSF)).call(this, props));

		_this2.handleChange = _this2.handleChange.bind(_this2);
		var dates = _this2.props.cfg.value.map(function (epoch) {
			return new Date(epoch);
		});
		_this2.state = {
			dates: dates
		};
		return _this2;
	}

	_createClass(MultiDateJSF, [{
		key: "view",
		value: function view() {
			var dates = this.state.dates;

			var jsonDates = JSON.stringify(dates.map(function (day) {
				return day.getTime();
			}));
			return React.createElement(
				"div",
				null,
				React.createElement(MultiDate, {
					dates: dates,
					onChange: this.handleChange,
					minDate: new Date(this.props.cfg.minDate),
					maxDate: new Date(this.props.cfg.maxDate),
					debug: this.props.cfg.debug
				}),
				React.createElement("input", { type: "hidden", name: this.props.cfg.id, value: jsonDates })
			);
		}
	}, {
		key: "handleChange",
		value: function handleChange(dates) {
			if (this.props.cfg.behaviors && this.props.cfg.behaviors.change) {
				this.props.cfg.behaviors.change.call(this.input);
			}
			this.setState({
				dates: dates
			});
		}
	}]);

	return MultiDateJSF;
}(React.Component);

PrimeFaces.widget.MultiDatePicker = PrimeFaces.widget.BaseWidget.extend({
	init: function init(cfg) {
		this._super(cfg);
		this.render();
	},

	render: function render() {
		console.log("HELLO");
		console.log(this.cfg);
		ReactDOM.render(React.createElement(MultiDateJSF, { cfg: this.cfg }), this.jq[0]);
	},

	destroy: function destroy() {
		console.log("MultiDate - UNMOUNT");
	},

	update: function update() {
		console.log("MultiDate - UPDATE");
	}
});
