import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewChild, EventEmitter, Output, Input, forwardRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { LocaleService } from './locale.service';
var moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
var DaterangepickerComponent = /** @class */ (function () {
    function DaterangepickerComponent(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.timepickerListZones = moment.tz.names();
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.timepickerTimezone = moment.tz.guess(true);
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.dateLimit = null;
        // used in template for compile time support of enum values.
        this.sideEnum = SideEnum;
        this.minDate = null;
        this.maxDate = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = false;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.maxSpan = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.timeInput = false;
        this.timeZone = false;
        // end of timepicker variables
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this._locale = {};
        // custom ranges
        this._ranges = {};
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.customRangeDirection = false;
        this.rangesArray = [];
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = {};
        this.rightCalendar = {};
        this.showCalInRanges = false;
        this.options = {}; // should get some opt from user
        this.closeOnAutoApply = true;
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
    }
    DaterangepickerComponent_1 = DaterangepickerComponent;
    Object.defineProperty(DaterangepickerComponent.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            this._locale = tslib_1.__assign({}, this._localeService.config, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DaterangepickerComponent.prototype, "ranges", {
        get: function () {
            return this._ranges;
        },
        set: function (value) {
            this._ranges = value;
            this.renderRanges();
        },
        enumerable: true,
        configurable: true
    });
    DaterangepickerComponent.prototype.ngOnInit = function () {
        /* changed moment to new timezone */
        moment.tz.setDefault(this.timepickerTimezone);
        this._buildLocale();
        var daysOfWeek = tslib_1.__spread(this.locale.daysOfWeek);
        if (this.locale.firstDay !== 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                daysOfWeek.push(daysOfWeek.shift());
                iterator--;
            }
        }
        this.locale.daysOfWeek = daysOfWeek;
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (this.startDate && this.timePicker) {
            this.setStartDate(this.startDate);
            this.renderTimePicker(SideEnum.left);
        }
        if (this.endDate && this.timePicker) {
            this.setEndDate(this.endDate);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    };
    DaterangepickerComponent.prototype.renderRanges = function () {
        this.rangesArray = [];
        var start, end;
        if (typeof this.ranges === 'object') {
            for (var range in this.ranges) {
                if (this.ranges[range]) {
                    if (typeof this.ranges[range][0] === 'string') {
                        start = moment(this.ranges[range][0], this.locale.format);
                    }
                    else {
                        start = moment(this.ranges[range][0]);
                    }
                    if (typeof this.ranges[range][1] === 'string') {
                        end = moment(this.ranges[range][1], this.locale.format);
                    }
                    else {
                        end = moment(this.ranges[range][1]);
                    }
                    // If the start or end date exceed those allowed by the minDate or maxSpan
                    // options, shorten the range to the allowable period.
                    if (this.minDate && start.isBefore(this.minDate)) {
                        start = this.minDate.clone();
                    }
                    var maxDate = this.maxDate;
                    if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                        maxDate = start.clone().add(this.maxSpan);
                    }
                    if (maxDate && end.isAfter(maxDate)) {
                        end = maxDate.clone();
                    }
                    // If the end of the range is before the minimum or the start of the range is
                    // after the maximum, don't display this range option at all.
                    if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                        || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                        continue;
                    }
                    // Support unicode chars in the range names.
                    var elem = document.createElement('textarea');
                    elem.innerHTML = range;
                    var rangeHtml = elem.value;
                    this.ranges[rangeHtml] = [start, end];
                }
            }
            for (var range in this.ranges) {
                if (this.ranges[range]) {
                    this.rangesArray.push(range);
                }
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
        }
    };
    DaterangepickerComponent.prototype.renderTimePicker = function (side) {
        if (side === SideEnum.right && !this.endDate) {
            return;
        }
        var selected, minDate;
        var maxDate = this.maxDate;
        if (side === SideEnum.left) {
            selected = this.startDate.clone(),
                minDate = this.minDate;
        }
        else if (side === SideEnum.right) {
            selected = this.endDate.clone(),
                minDate = this.startDate;
        }
        if (this.timeInput === true) {
            var start = this.timePicker24Hour ? "00" : "01";
            var end = this.timePicker24Hour ? "23" : "12";
            this.timepickerVariables[side] = {
                hours: [],
                minutes: [],
                minutesLabel: [],
                seconds: [],
                secondsLabel: [],
                disabledHours: [],
                disabledMinutes: [],
                disabledSeconds: [],
                selectedHour: "00",
                selectedMinute: "00",
                selectedSecond: "00",
            };
            this.timepickerVariables[side].selectedHour = selected.hour() < 10 ? '0' + selected.hour() : selected.hour();
            this.timepickerVariables[side].selectedMinute = selected.minute() < 10 ? '0' + selected.minute() : selected.minute();
            this.timepickerVariables[side].selectedSecond = selected.second() < 10 ? '0' + selected.second() : selected.second();
        }
        else {
            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;
            this.timepickerVariables[side] = {
                hours: [],
                minutes: [],
                minutesLabel: [],
                seconds: [],
                secondsLabel: [],
                disabledHours: [],
                disabledMinutes: [],
                disabledSeconds: [],
                selectedHour: "00",
                selectedMinute: "00",
                selectedSecond: "00",
            };
            // generate hours
            for (var i = start; i <= end; i++) {
                var i_in_24 = i;
                if (!this.timePicker24Hour) {
                    i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : (i === 12 ? 0 : i);
                }
                var time = selected.clone().hour(i_in_24);
                var disabled = false;
                if (minDate && time.minute(59).isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.minute(0).isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].hours.push(i);
                if (i_in_24 === selected.hour() && !disabled) {
                    this.timepickerVariables[side].selectedHour = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledHours.push(i);
                }
            }
            // generate minutes
            for (var i = 0; i < 60; i += this.timePickerIncrement) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().minute(i);
                var disabled = false;
                if (minDate && time.second(59).isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.second(0).isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].minutes.push(i);
                this.timepickerVariables[side].minutesLabel.push(padded);
                if (selected.minute() === i && !disabled) {
                    this.timepickerVariables[side].selectedMinute = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledMinutes.push(i);
                }
            }
            // generate seconds
            if (this.timePickerSeconds) {
                for (var i = 0; i < 60; i++) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.clone().second(i);
                    var disabled = false;
                    if (minDate && time.isBefore(minDate)) {
                        disabled = true;
                    }
                    if (maxDate && time.isAfter(maxDate)) {
                        disabled = true;
                    }
                    this.timepickerVariables[side].seconds.push(i);
                    this.timepickerVariables[side].secondsLabel.push(padded);
                    if (selected.second() === i && !disabled) {
                        this.timepickerVariables[side].selectedSecond = i;
                    }
                    else if (disabled) {
                        this.timepickerVariables[side].disabledSeconds.push(i);
                    }
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            var am_html = '';
            var pm_html = '';
            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    };
    DaterangepickerComponent.prototype.renderCalendar = function (side) {
        var mainCalendar = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
        var month = mainCalendar.month.month();
        var year = mainCalendar.month.year();
        var hour = mainCalendar.month.hour();
        var minute = mainCalendar.month.minute();
        var second = mainCalendar.month.second();
        var daysInMonth = moment([year, month]).daysInMonth();
        var firstDay = moment([year, month, 1]);
        var lastDay = moment([year, month, daysInMonth]);
        var lastMonth = moment(firstDay).subtract(1, 'month').month();
        var lastYear = moment(firstDay).subtract(1, 'month').year();
        var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        var dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        var calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (var i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        var minDate = side === 'left' ? this.minDate : this.startDate;
        var maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            var maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            var currentMonth = calendar[1][1].month();
            var currentYear = calendar[1][1].year();
            var realCurrentYear = moment().year();
            var maxYear = (maxDate && maxDate.year()) || (realCurrentYear + 5);
            var minYear = (minDate && minDate.year()) || (realCurrentYear - 50);
            var inMinYear = currentYear === minYear;
            var inMaxYear = currentYear === maxYear;
            var years = [];
            for (var y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    };
    DaterangepickerComponent.prototype.setStartDate = function (startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }
        this.startDate.tz(this.timepickerTimezone);
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.startDateChanged.emit({ startDate: this.startDate });
        this.updateMonthsInView();
    };
    DaterangepickerComponent.prototype.setEndDate = function (endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        this.endDate.tz(this.timepickerTimezone);
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit && this.startDate.clone().add(this.dateLimit, 'day').isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.endDateChanged.emit({ endDate: this.endDate });
        this.updateMonthsInView();
    };
    DaterangepickerComponent.prototype.isInvalidDate = function (date) {
        return false;
    };
    DaterangepickerComponent.prototype.isCustomDate = function (date) {
        return false;
    };
    DaterangepickerComponent.prototype.updateView = function () {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    };
    DaterangepickerComponent.prototype.updateMonthsInView = function () {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                    (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                        this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    };
    /**
     *  This is responsible for updating the calendars
     */
    DaterangepickerComponent.prototype.updateCalendars = function () {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    };
    DaterangepickerComponent.prototype.updateElement = function () {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.rangesArray.length && this.showRangeLabelOnInput === true && this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel = this.startDate.format(this.locale.format) +
                        this.locale.separator + this.endDate.format(this.locale.format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    };
    DaterangepickerComponent.prototype.remove = function () {
        this.isShown = false;
    };
    /**
     * this should calculate the label
     */
    DaterangepickerComponent.prototype.calculateChosenLabel = function () {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        var customRange = true;
        var i = 0;
        if (this.rangesArray.length > 0) {
            for (var range in this.ranges) {
                if (this.ranges[range]) {
                    if (this.timePicker) {
                        var format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === this.ranges[range][0].format(format)
                            && this.endDate.format(format) === this.ranges[range][1].format(format)) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    else {
                        // ignore times when comparing dates if time picker is not enabled
                        if (this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD')
                            && this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    i++;
                }
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                // if custom label: show calendar
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    };
    DaterangepickerComponent.prototype.clickApply = function (e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            var d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate, timezone: this.timepickerTimezone });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate, timezone: this.timepickerTimezone });
        if (e || (this.closeOnAutoApply && !e)) {
            this.hide();
        }
    };
    DaterangepickerComponent.prototype.clickCancel = function (e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    };
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    DaterangepickerComponent.prototype.monthChanged = function (monthEvent, side) {
        var year = this.calendarVariables[side].dropdowns.currentYear;
        var month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    DaterangepickerComponent.prototype.yearChanged = function (yearEvent, side) {
        var month = this.calendarVariables[side].dropdowns.currentMonth;
        var year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    DaterangepickerComponent.prototype.timeChanged = function (timeEvent, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        //let hour = this.timepickerVariables[side].selectedHour;
        //const minute = this.timepickerVariables[side].selectedMinute;
        //const second = this.timePickerSeconds ? this.timepickerVariables[side].selectedSecond : 0;
        if (hour < 10)
            this.timepickerVariables[side].selectedHour = '0' + this.timepickerVariables[side].selectedHour;
        else
            this.timepickerVariables[side].selectedHour = '0';
        if (minute < 10)
            this.timepickerVariables[side].selectedMinute = '0' + this.timepickerVariables[side].selectedMinute;
        else
            this.timepickerVariables[side].selectedMinute = minute;
        if (second < 10)
            this.timepickerVariables[side].selectedSecond = '0' + this.timepickerVariables[side].selectedSecond;
        else
            this.timepickerVariables[side].selectedSecond = second;
        /*
        console.log("side1", side);
        console.log("event1", timeEvent);
        console.log("hour", hour);
        console.log("minute", minute);
        console.log("1this.timepickerVariables[side].selectedHour", this.timepickerVariables[side].selectedHour);
        console.log("1this.timepickerVariables[side].selectedMinute", this.timepickerVariables[side].selectedMinute);
        console.log("2this.timepickerVariables[side].selectedSecond", this.timepickerVariables[side].selectedSecond);
        */
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            var start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        }
        else if (this.endDate) {
            var end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
        if (this.autoApply) {
            this.clickApply();
        }
    };
    /**
     * called when timeZone is changed
     * @param timeEvent  an event
     */
    DaterangepickerComponent.prototype.timeZoneChanged = function (timeEvent) {
        /* changed moment to new timezone */
        moment.tz.setDefault(this.timepickerTimezone);
        this.startDate.tz(this.timepickerTimezone);
        this.endDate.tz(this.timepickerTimezone);
        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        // update the all ememnets
        this.updateElement();
        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
        if (this.autoApply) {
            this.clickApply();
        }
    };
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    DaterangepickerComponent.prototype.monthOrYearChanged = function (month, year, side) {
        var isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    };
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    DaterangepickerComponent.prototype.clickPrev = function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    };
    /**
     * Click on next month
     * @param side left or right calendar
     */
    DaterangepickerComponent.prototype.clickNext = function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    };
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    DaterangepickerComponent.prototype.clickDate = function (e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        var date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if ((this.endDate || (date.isBefore(this.startDate, 'day')
            && this.customRangeDirection === false)) && this.lockStartDate === false) { // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else { // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
                this.setEndDate(this.startDate);
                this.setStartDate(date.clone());
            }
            else {
                this.setEndDate(date.clone());
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        if (this.autoApply && this.startDate && this.endDate) {
            this.clickApply();
        }
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    };
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    DaterangepickerComponent.prototype.clickRange = function (e, label) {
        this.chosenRange = label;
        if (label === this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            var dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange) {
                this.clickApply();
            }
            else {
                if (!this.alwaysShowCalendars) {
                    return this.clickApply();
                }
                if (this.maxDate && this.maxDate.isSame(dates[0], 'month')) {
                    this.rightCalendar.month.month(dates[0].month());
                    this.rightCalendar.month.year(dates[0].year());
                    this.leftCalendar.month.month(dates[0].month() - 1);
                    this.leftCalendar.month.year(dates[1].year());
                }
                else {
                    this.leftCalendar.month.month(dates[0].month());
                    this.leftCalendar.month.year(dates[0].year());
                    // get the next year
                    var nextMonth = dates[0].clone().add(1, 'month');
                    this.rightCalendar.month.month(nextMonth.month());
                    this.rightCalendar.month.year(nextMonth.year());
                }
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    };
    DaterangepickerComponent.prototype.show = function (e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    };
    DaterangepickerComponent.prototype.hide = function (e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    };
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    DaterangepickerComponent.prototype.handleInternalClick = function (e) {
        e.stopPropagation();
    };
    /**
     * update the locale options
     * @param locale
     */
    DaterangepickerComponent.prototype.updateLocale = function (locale) {
        for (var key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    };
    /**
     *  clear the daterange picker
     */
    DaterangepickerComponent.prototype.clear = function () {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null, timezone: '' });
        this.datesUpdated.emit({ startDate: null, endDate: null, timezone: '' });
        this.hide();
    };
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    DaterangepickerComponent.prototype.disableRange = function (range) {
        var _this = this;
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        var rangeMarkers = this.ranges[range];
        var areBothBefore = rangeMarkers.every(function (date) {
            if (!_this.minDate) {
                return false;
            }
            return date.isBefore(_this.minDate);
        });
        var areBothAfter = rangeMarkers.every(function (date) {
            if (!_this.maxDate) {
                return false;
            }
            return date.isAfter(_this.maxDate);
        });
        return (areBothBefore || areBothAfter);
    };
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    DaterangepickerComponent.prototype._getDateWithTime = function (date, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    };
    /**
     *  build the locale config
     */
    DaterangepickerComponent.prototype._buildLocale = function () {
        this.locale = tslib_1.__assign({}, this._localeService.config, this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    };
    DaterangepickerComponent.prototype._buildCells = function (calendar, side) {
        for (var row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            var rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (var col = 0; col < 7; col++) {
                var classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() ||
                        calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() ||
                        calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled', 'invalid');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                var isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                var cname = '', disabled = false;
                for (var i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    };
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    DaterangepickerComponent.prototype.hasCurrentMonthDays = function (currentMonth, row) {
        for (var day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    };
    DaterangepickerComponent.prototype.checkTime = function (event, side) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
            return false;
        }
        var target = event.srcElement || event.target;
        var maxLength = parseInt(target.attributes["maxLength"].value, 10);
        var myLength = target.value.length;
        if (myLength == maxLength) {
            target.value = target.value.slice(1);
        }
        if (myLength > maxLength)
            return false;
        return true;
    };
    var DaterangepickerComponent_1;
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "timepickerTimezone", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "startDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "endDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], DaterangepickerComponent.prototype, "dateLimit", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "minDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "maxDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "autoApply", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "singleDatePicker", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showDropdowns", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showWeekNumbers", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showISOWeekNumbers", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "linkedCalendars", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "autoUpdateInput", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "alwaysShowCalendars", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "maxSpan", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "lockStartDate", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "timePicker", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "timePicker24Hour", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "timePickerIncrement", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "timePickerSeconds", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "timeInput", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "timeZone", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showClearButton", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "firstMonthDayClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "lastMonthDayClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "emptyWeekRowClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], DaterangepickerComponent.prototype, "locale", null);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], DaterangepickerComponent.prototype, "ranges", null);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showCustomRangeLabel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "showCancel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "showRangeLabelOnInput", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "customRangeDirection", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "drops", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DaterangepickerComponent.prototype, "opens", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DaterangepickerComponent.prototype, "closeOnAutoApply", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DaterangepickerComponent.prototype, "choosedDate", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DaterangepickerComponent.prototype, "rangeClicked", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DaterangepickerComponent.prototype, "datesUpdated", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DaterangepickerComponent.prototype, "startDateChanged", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DaterangepickerComponent.prototype, "endDateChanged", void 0);
    tslib_1.__decorate([
        ViewChild('pickerContainer'),
        tslib_1.__metadata("design:type", ElementRef)
    ], DaterangepickerComponent.prototype, "pickerContainer", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], DaterangepickerComponent.prototype, "isInvalidDate", null);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], DaterangepickerComponent.prototype, "isCustomDate", null);
    DaterangepickerComponent = DaterangepickerComponent_1 = tslib_1.__decorate([
        Component({
            selector: 'ngx-daterangepicker-material',
            template: "<div class=\"md-drppicker\" #pickerContainer\n[ngClass]=\"{\n    ltr: locale.direction === 'ltr',\n    rtl: this.locale.direction === 'rtl',\n    'shown': isShown || inline,\n    'hidden': !isShown && !inline,\n    'inline': inline,\n    'double': !singleDatePicker && showCalInRanges,\n    'show-ranges': rangesArray.length\n}\" [class]=\"'drops-' + drops + '-' + opens\">\n    <div class=\"ranges\">\n        <ul>\n          <li *ngFor=\"let range of rangesArray\">\n            <button type=\"button\"\n                    (click)=\"clickRange($event, range)\"\n                    [disabled]=\"disableRange(range)\"\n                    [ngClass]=\"{'active': range === chosenRange}\">{{range}}</button>\n          </li>\n        </ul>\n    </div>\n    <div class=\"calendar\" [ngClass]=\"{right: singleDatePicker, left: !singleDatePicker}\"\n        *ngIf=\"showCalInRanges\">\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true)\">\n                            <th (click)=\"clickPrev(sideEnum.left)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!(!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month drp-animate\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n                                <div class=\"dropdowns\">\n                                        {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}\n                                        <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.left)\">\n                                                <option\n                                                [disabled]=\"(calendarVariables.left.dropdowns.inMinYear && m < calendarVariables.left.minDate.month()) || (calendarVariables.left.dropdowns.inMaxYear && m > calendarVariables.left.maxDate.month())\"\n                                                *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.left.dropdowns.currentMonth == m\">\n                                                    {{locale.monthNames[m]}}\n                                                </option>\n                                        </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                    {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                                    <select class=\"yearselect\"  (change)=\"yearChanged($event, sideEnum.left)\">\n                                        <option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.left.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}  {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                        <ng-container *ngIf=\"(!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker )\">\n                            <th class=\"next available\" (click)=\"clickNext(sideEnum.left)\">\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker ))\">\n                            <th></th>\n                        </ng-container>\n                    </tr>\n                    <tr class='week-days'>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody class=\"drp-animate\">\n                    <tr *ngFor=\"let row of calendarVariables.left.calRows\" [class]=\"calendarVariables.left.classes[row].classList\">\n                        <!-- add week number -->\n                        <td  class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <!-- cal -->\n                        <td *ngFor=\"let col of calendarVariables.left.calCols\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\">\n                            <span>{{calendarVariables.left.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker && timeInput\">\n            <div class=\"input\">\n                <input (keypress)=\"checkTime($event, sideEnum.left)\" type=\"number\" maxLength=\"2\" class=\"input-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"input\">\n                <input (keypress)=\"checkTime($event, sideEnum.left)\" type=\"number\" maxLength=\"2\" class=\"input-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"input\">                            \n                <input (keypress)=\"checkTime($event, sideEnum.left)\" type=\"number\" maxLength=\"2\" *ngIf=\"timePickerSeconds\" class=\"input-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker && !timeInput\">\n            <div class=\"select\">\n                <select class=\"select-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.left.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select *ngIf=\"timePickerSeconds\" class=\"select-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.left.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select *ngIf=\"!timePicker24Hour\" class=\"select-item ampmselect\" [(ngModel)]=\"timepickerVariables.left.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"calendar right\"\n        *ngIf=\"showCalInRanges && !singleDatePicker\"\n        >\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"(!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars)\">\n                            <th (click)=\"clickPrev(sideEnum.right)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n                                <div class=\"dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}\n                                    <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.right)\">\n                                            <option\n                                            [disabled]=\"(calendarVariables.right.dropdowns.inMinYear && m < calendarVariables.right.minDate.month()) || (calendarVariables.right.dropdowns.inMaxYear && m > calendarVariables.right.maxDate.month())\"\n                                            *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.right.dropdowns.currentMonth == m\">\n                                                {{locale.monthNames[m]}}\n                                            </option>\n                                    </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                        {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                                        <select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.right)\">\n                                        <option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.right.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}  {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                            <ng-container *ngIf=\"!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true)\">\n                                <th class=\"next available\" (click)=\"clickNext(sideEnum.right)\">\n                                </th>\n                            </ng-container>\n                            <ng-container *ngIf=\"!(!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true))\">\n                                <th></th>\n                            </ng-container>\n                    </tr>\n\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"let row of calendarVariables.right.calRows\" [class]=\"calendarVariables.right.classes[row].classList\">\n                        <td class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <td *ngFor=\"let col of calendarVariables.right.calCols\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\">\n                            <span>{{calendarVariables.right.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker && timeInput\">\n            <div class=\"input\">\n                <input (keypress)=\"checkTime($event, sideEnum.right)\" type=\"number\" maxLength=\"2\" class=\"input-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"input\">\n                <input (keypress)=\"checkTime($event, sideEnum.right)\" type=\"number\" maxLength=\"2\" class=\"input-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"input\">\n                <input (keypress)=\"checkTime($event, sideEnum.right)\" type=\"number\" maxLength=\"2\" *ngIf=\"timePickerSeconds\" class=\"input-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker && !timeInput\">\n            <div class=\"select\">\n                <select class=\"select-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.right.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select *ngIf=\"timePickerSeconds\" class=\"select-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.right.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div> \n            <div class=\"select\">\n                <select *ngIf=\"!timePicker24Hour\" class=\"select-item ampmselect\" [(ngModel)]=\"timepickerVariables.right.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>     \n        <div class=\"calendar-table\" *ngIf=\"timeZone\">\n            <div class=\"select\">\n                <select class=\"select-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerTimezone\" (ngModelChange)=\"timeZoneChanged($event)\">\n                    <option *ngFor=\"let i of timepickerListZones\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>            \n        </div>  \n    </div>\n    <div class=\"buttons\" *ngIf=\"!autoApply && ( !rangesArray.length || (showCalInRanges && !singleDatePicker))\">\n        <div class=\"buttons_input\">\n            <button  *ngIf=\"showClearButton\" class=\"btn btn-default clear\" type=\"button\" (click)=\"clear()\" [title]=\"locale.clearLabel\">\n                {{locale.clearLabel}}\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 -5 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/></svg>\n            </button>\n            <button class=\"btn btn-default\" *ngIf=\"showCancel\" type=\"button\" (click)=\"clickCancel($event)\">{{locale.cancelLabel}}</button>\n            <button class=\"btn\"  [disabled]=\"applyBtn.disabled\" type=\"button\" (click)=\"clickApply($event)\">{{locale.applyLabel}}</button>\n        </div>\n    </div>\n</div>\n",
            host: {
                '(click)': 'handleInternalClick($event)',
            },
            encapsulation: ViewEncapsulation.None,
            providers: [{
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DaterangepickerComponent_1; }),
                    multi: true
                }],
            styles: [".md-drppicker{position:absolute;font-family:Roboto,sans-serif;color:inherit;border-radius:4px;width:278px;padding:4px;margin-top:-10px;overflow:hidden;z-index:1000;font-size:14px;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12)}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative;display:inline-block}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:270px;margin:4px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:32px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:4px;border-radius:4px;background-color:#fff}.md-drppicker table{width:100%;margin:0}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:4px;border:1px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.available.prev,.md-drppicker th.available.prev{display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.prev:hover,.md-drppicker th.available.prev:hover{margin:0}.md-drppicker td.available.next,.md-drppicker th.available.next{transform:rotate(180deg);display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.next:hover,.md-drppicker th.available.next:hover{margin:0;transform:rotate(180deg)}.md-drppicker td.available:hover,.md-drppicker th.available:hover{background-color:#eee;border-color:transparent;color:inherit;background-repeat:no-repeat;background-size:.5em;background-position:center;margin:.25em 0;opacity:.8;border-radius:2em;transform:scale(1);transition:450ms cubic-bezier(.23,1,.32,1)}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:450ms cubic-bezier(.23,1,.32,1);border-radius:2em;transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#dde2e4;border-color:transparent;color:#000;border-radius:0}.md-drppicker td.in-range:hover{border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:4px}.md-drppicker td.active{transition:background .3s ease-out;background:rgba(0,0,0,.1)}.md-drppicker td.active,.md-drppicker td.active:hover{background-color:#3f51b5;border-color:transparent;color:#fff}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:50px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:'';border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time .input{display:inline}.md-drppicker .calendar-time .input .input-item{display:inline-block;width:44px;position:relative;font-family:inherit;background-color:transparent;text-align:center;padding:5px 5px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .input .input-item:focus{outline:0}.md-drppicker .calendar-time .input .input-item .input-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:4px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #08c;border-radius:4px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button.active{background-color:#3f51b5;color:#fff}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{background:0 0}.md-drppicker .ranges ul li:hover{background-color:#eee}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:\"\";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;padding-right:12px}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{transform:translate(0);transition:transform .2s,opacity .2s}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{transform:translateX(-10%);opacity:0}}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}"]
        }),
        tslib_1.__metadata("design:paramtypes", [ElementRef,
            ChangeDetectorRef,
            LocaleService])
    ], DaterangepickerComponent);
    return DaterangepickerComponent;
}());
export { DaterangepickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUFVLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUMxSCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzdDLE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFFdkIsTUFBTSxDQUFOLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQix5QkFBYSxDQUFBO0lBQ2IsMkJBQWUsQ0FBQTtBQUNuQixDQUFDLEVBSFcsUUFBUSxLQUFSLFFBQVEsUUFHbkI7QUFnQkQ7SUF3SEksa0NBQ1ksRUFBYyxFQUNkLElBQXVCLEVBQ3ZCLGNBQTZCO1FBRjdCLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUN2QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQTFIakMsU0FBSSxHQUE2QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBRXBFLHNCQUFpQixHQUE4QixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBQ3ZFLHdCQUFtQixHQUE4QixFQUFFLElBQUksRUFBRSxF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QXZ4Q1ksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgSW5wdXQsIGZvcndhcmRSZWYsIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZiwgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcsIExPQ0FMRV9DT05GSUcgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb25maWcnO1xuXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGUuc2VydmljZSc7XG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xuXG5leHBvcnQgZW51bSBTaWRlRW51bSB7XG4gICAgbGVmdCA9ICdsZWZ0JyxcbiAgICByaWdodCA9ICdyaWdodCdcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyxcbiAgICBzdHlsZVVybHM6IFsnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBob3N0OiB7XG4gICAgICAgICcoY2xpY2spJzogJ2hhbmRsZUludGVybmFsQ2xpY2soJGV2ZW50KScsXG4gICAgfSxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCksXG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgfV1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9vbGQ6IHsgc3RhcnQ6IGFueSwgZW5kOiBhbnkgfSA9IHsgc3RhcnQ6IG51bGwsIGVuZDogbnVsbCB9O1xuICAgIGNob3NlbkxhYmVsOiBzdHJpbmc7XG4gICAgY2FsZW5kYXJWYXJpYWJsZXM6IHsgbGVmdDogYW55LCByaWdodDogYW55IH0gPSB7IGxlZnQ6IHt9LCByaWdodDoge30gfTtcbiAgICB0aW1lcGlja2VyVmFyaWFibGVzOiB7IGxlZnQ6IGFueSwgcmlnaHQ6IGFueSB9ID0geyBsZWZ0OiB7fSwgcmlnaHQ6IHt9IH07XG4gICAgdGltZXBpY2tlckxpc3Rab25lcyA9IG1vbWVudC50ei5uYW1lcygpO1xuICAgIGRhdGVyYW5nZXBpY2tlcjogeyBzdGFydDogRm9ybUNvbnRyb2wsIGVuZDogRm9ybUNvbnRyb2wgfSA9IHsgc3RhcnQ6IG5ldyBGb3JtQ29udHJvbCgpLCBlbmQ6IG5ldyBGb3JtQ29udHJvbCgpIH07XG4gICAgYXBwbHlCdG46IHsgZGlzYWJsZWQ6IGJvb2xlYW4gfSA9IHsgZGlzYWJsZWQ6IGZhbHNlIH07XG5cbiAgICBASW5wdXQoKVxuICAgIHRpbWVwaWNrZXJUaW1lem9uZSA9IG1vbWVudC50ei5ndWVzcyh0cnVlKTtcbiAgICBASW5wdXQoKVxuICAgIHN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuICAgIEBJbnB1dCgpXG4gICAgZW5kRGF0ZSA9IG1vbWVudCgpLmVuZE9mKCdkYXknKTtcblxuICAgIEBJbnB1dCgpXG4gICAgZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuICAgIC8vIHVzZWQgaW4gdGVtcGxhdGUgZm9yIGNvbXBpbGUgdGltZSBzdXBwb3J0IG9mIGVudW0gdmFsdWVzLlxuICAgIHNpZGVFbnVtID0gU2lkZUVudW07XG5cbiAgICBASW5wdXQoKVxuICAgIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50ID0gbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIG1heERhdGU6IF9tb21lbnQuTW9tZW50ID0gbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGF1dG9BcHBseTogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgc2luZ2xlRGF0ZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgc2hvd0Ryb3Bkb3duczogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgc2hvd1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBzaG93SVNPV2Vla051bWJlcnM6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIGxpbmtlZENhbGVuZGFyczogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgYXV0b1VwZGF0ZUlucHV0OiBCb29sZWFuID0gdHJ1ZTtcbiAgICBASW5wdXQoKVxuICAgIGFsd2F5c1Nob3dDYWxlbmRhcnM6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIG1heFNwYW46IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIGxvY2tTdGFydERhdGU6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuICAgIEBJbnB1dCgpXG4gICAgdGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgdGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgdGltZVBpY2tlckluY3JlbWVudCA9IDE7XG4gICAgQElucHV0KClcbiAgICB0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgdGltZUlucHV0ID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICB0aW1lWm9uZSA9IGZhbHNlO1xuICAgIC8vIGVuZCBvZiB0aW1lcGlja2VyIHZhcmlhYmxlc1xuICAgIEBJbnB1dCgpXG4gICAgc2hvd0NsZWFyQnV0dG9uOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XG4gICAgQElucHV0KClcbiAgICBsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgZmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgbGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuICAgIEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcbiAgICB9XG4gICAgZ2V0IGxvY2FsZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgIH1cbiAgICAvLyBjdXN0b20gcmFuZ2VzXG4gICAgX3JhbmdlczogYW55ID0ge307XG5cbiAgICBASW5wdXQoKSBzZXQgcmFuZ2VzKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3JhbmdlcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLnJlbmRlclJhbmdlcygpO1xuICAgIH1cbiAgICBnZXQgcmFuZ2VzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yYW5nZXM7XG4gICAgfVxuXG4gICAgQElucHV0KClcbiAgICBzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcbiAgICBASW5wdXQoKVxuICAgIHNob3dDYW5jZWwgPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIHNob3dSYW5nZUxhYmVsT25JbnB1dCA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPSBmYWxzZTtcbiAgICBjaG9zZW5SYW5nZTogc3RyaW5nO1xuICAgIHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XG5cbiAgICAvLyBzb21lIHN0YXRlIGluZm9ybWF0aW9uXG4gICAgaXNTaG93bjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIGlubGluZSA9IHRydWU7XG4gICAgbGVmdENhbGVuZGFyOiBhbnkgPSB7fTtcbiAgICByaWdodENhbGVuZGFyOiBhbnkgPSB7fTtcbiAgICBzaG93Q2FsSW5SYW5nZXM6IEJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG9wdGlvbnM6IGFueSA9IHt9OyAvLyBzaG91bGQgZ2V0IHNvbWUgb3B0IGZyb20gdXNlclxuICAgIEBJbnB1dCgpIGRyb3BzOiBzdHJpbmc7XG4gICAgQElucHV0KCkgb3BlbnM6IHN0cmluZztcbiAgICBASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcbiAgICBAT3V0cHV0KCkgY2hvb3NlZERhdGU6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuICAgIEBPdXRwdXQoKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuICAgIEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuICAgIEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcbiAgICBAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuICAgIEBWaWV3Q2hpbGQoJ3BpY2tlckNvbnRhaW5lcicpIHBpY2tlckNvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMucmFuZ2VDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmRhdGVzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmVuZERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuXG4gICAgICAgIC8qIGNoYW5nZWQgbW9tZW50IHRvIG5ldyB0aW1lem9uZSAqL1xuICAgICAgICBtb21lbnQudHouc2V0RGVmYXVsdCh0aGlzLnRpbWVwaWNrZXJUaW1lem9uZSk7XG5cbiAgICAgICAgdGhpcy5fYnVpbGRMb2NhbGUoKTtcbiAgICAgICAgY29uc3QgZGF5c09mV2VlayA9IFsuLi50aGlzLmxvY2FsZS5kYXlzT2ZXZWVrXTtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxlLmZpcnN0RGF5ICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLmxvY2FsZS5maXJzdERheTtcblxuICAgICAgICAgICAgd2hpbGUgKGl0ZXJhdG9yID4gMCkge1xuICAgICAgICAgICAgICAgIGRheXNPZldlZWsucHVzaChkYXlzT2ZXZWVrLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2NhbGUuZGF5c09mV2VlayA9IGRheXNPZldlZWs7XG4gICAgICAgIGlmICh0aGlzLmlubGluZSkge1xuICAgICAgICAgICAgdGhpcy5fb2xkLnN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMuX29sZC5lbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5lbmREYXRlKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJSYW5nZXMoKTtcblxuICAgIH1cbiAgICByZW5kZXJSYW5nZXMoKSB7XG4gICAgICAgIHRoaXMucmFuZ2VzQXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IHN0YXJ0LCBlbmQ7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhbmdlIGluIHRoaXMucmFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VzW3JhbmdlXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucmFuZ2VzW3JhbmdlXVswXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVswXSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJhbmdlc1tyYW5nZV1bMV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzFdLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVsxXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN0YXJ0IG9yIGVuZCBkYXRlIGV4Y2VlZCB0aG9zZSBhbGxvd2VkIGJ5IHRoZSBtaW5EYXRlIG9yIG1heFNwYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9ucywgc2hvcnRlbiB0aGUgcmFuZ2UgdG8gdGhlIGFsbG93YWJsZSBwZXJpb2QuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgc3RhcnQuaXNCZWZvcmUodGhpcy5taW5EYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0aGlzLm1pbkRhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4U3BhbiAmJiBtYXhEYXRlICYmIHN0YXJ0LmNsb25lKCkuYWRkKHRoaXMubWF4U3BhbikuaXNBZnRlcihtYXhEYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4RGF0ZSA9IHN0YXJ0LmNsb25lKCkuYWRkKHRoaXMubWF4U3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9IG1heERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZW5kIG9mIHRoZSByYW5nZSBpcyBiZWZvcmUgdGhlIG1pbmltdW0gb3IgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZSBpc1xuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciB0aGUgbWF4aW11bSwgZG9uJ3QgZGlzcGxheSB0aGlzIHJhbmdlIG9wdGlvbiBhdCBhbGwuXG4gICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy5taW5EYXRlICYmIGVuZC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUsIHRoaXMudGltZVBpY2tlciA/ICdtaW51dGUnIDogJ2RheScpKVxuICAgICAgICAgICAgICAgICAgICAgICAgfHwgKG1heERhdGUgJiYgc3RhcnQuaXNBZnRlcihtYXhEYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHJhbmdlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZUh0bWwgPSBlbGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJhbmdlc1tyYW5nZUh0bWxdID0gW3N0YXJ0LCBlbmRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZXNbcmFuZ2VdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaChyYW5nZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlc0FycmF5LnB1c2godGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICghdGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcbiAgICAgICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmVuZGVyVGltZVBpY2tlcihzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQgJiYgIXRoaXMuZW5kRGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZWxlY3RlZCwgbWluRGF0ZTtcbiAgICAgICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICBtaW5EYXRlID0gdGhpcy5taW5EYXRlO1xuICAgICAgICB9IGVsc2UgaWYgKHNpZGUgPT09IFNpZGVFbnVtLnJpZ2h0KSB7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpLFxuICAgICAgICAgICAgICAgIG1pbkRhdGUgPSB0aGlzLnN0YXJ0RGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50aW1lSW5wdXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gXCIwMFwiIDogXCIwMVwiO1xuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gXCIyM1wiIDogXCIxMlwiO1xuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xuICAgICAgICAgICAgICAgIGhvdXJzOiBbXSxcbiAgICAgICAgICAgICAgICBtaW51dGVzOiBbXSxcbiAgICAgICAgICAgICAgICBtaW51dGVzTGFiZWw6IFtdLFxuICAgICAgICAgICAgICAgIHNlY29uZHM6IFtdLFxuICAgICAgICAgICAgICAgIHNlY29uZHNMYWJlbDogW10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRIb3VyczogW10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRNaW51dGVzOiBbXSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZFNlY29uZHM6IFtdLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSG91cjogXCIwMFwiLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkTWludXRlOiBcIjAwXCIsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTZWNvbmQ6IFwiMDBcIixcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIgPSBzZWxlY3RlZC5ob3VyKCkgPCAxMCA/ICcwJyArIHNlbGVjdGVkLmhvdXIoKSA6IHNlbGVjdGVkLmhvdXIoKTtcbiAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSA9IHNlbGVjdGVkLm1pbnV0ZSgpIDwgMTAgPyAnMCcgKyBzZWxlY3RlZC5taW51dGUoKSA6IHNlbGVjdGVkLm1pbnV0ZSgpO1xuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kID0gc2VsZWN0ZWQuc2Vjb25kKCkgPCAxMCA/ICcwJyArIHNlbGVjdGVkLnNlY29uZCgpIDogc2VsZWN0ZWQuc2Vjb25kKCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMCA6IDE7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnRpbWVQaWNrZXIyNEhvdXIgPyAyMyA6IDEyO1xuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xuICAgICAgICAgICAgICAgIGhvdXJzOiBbXSxcbiAgICAgICAgICAgICAgICBtaW51dGVzOiBbXSxcbiAgICAgICAgICAgICAgICBtaW51dGVzTGFiZWw6IFtdLFxuICAgICAgICAgICAgICAgIHNlY29uZHM6IFtdLFxuICAgICAgICAgICAgICAgIHNlY29uZHNMYWJlbDogW10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRIb3VyczogW10sXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRNaW51dGVzOiBbXSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZFNlY29uZHM6IFtdLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSG91cjogXCIwMFwiLFxuICAgICAgICAgICAgICAgIHNlbGVjdGVkTWludXRlOiBcIjAwXCIsXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRTZWNvbmQ6IFwiMDBcIixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBob3Vyc1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaV9pbl8yNCA9IGk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaV9pbl8yNCA9IHNlbGVjdGVkLmhvdXIoKSA+PSAxMiA/IChpID09PSAxMiA/IDEyIDogaSArIDEyKSA6IChpID09PSAxMiA/IDAgOiBpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0aW1lID0gc2VsZWN0ZWQuY2xvbmUoKS5ob3VyKGlfaW5fMjQpO1xuICAgICAgICAgICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUubWludXRlKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUubWludXRlKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5ob3Vycy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIGlmIChpX2luXzI0ID09PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIgPSBpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkSG91cnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBtaW51dGVzXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpICs9IHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBzZWxlY3RlZC5jbG9uZSgpLm1pbnV0ZShpKTtcblxuICAgICAgICAgICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUuc2Vjb25kKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ubWludXRlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzTGFiZWwucHVzaChwYWRkZWQpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZC5taW51dGUoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlID0gaTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZE1pbnV0ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSBzZWNvbmRzXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyU2Vjb25kcykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWRkZWQgPSBpIDwgMTAgPyAnMCcgKyBpIDogaTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuc2Vjb25kKGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWluRGF0ZSAmJiB0aW1lLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgdGltZS5pc0FmdGVyKG1heERhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2Vjb25kcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2Vjb25kc0xhYmVsLnB1c2gocGFkZGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkLnNlY29uZCgpID09PSBpICYmICFkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kID0gaTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkU2Vjb25kcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGdlbmVyYXRlIEFNL1BNXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFtX2h0bWwgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHBtX2h0bWwgPSAnJztcblxuICAgICAgICAgICAgaWYgKG1pbkRhdGUgJiYgc2VsZWN0ZWQuY2xvbmUoKS5ob3VyKDEyKS5taW51dGUoMCkuc2Vjb25kKDApLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWF4RGF0ZSAmJiBzZWxlY3RlZC5jbG9uZSgpLmhvdXIoMCkubWludXRlKDApLnNlY29uZCgwKS5pc0FmdGVyKG1heERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnBtRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkLmhvdXIoKSA+PSAxMikge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnUE0nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ0FNJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICB9XG4gICAgcmVuZGVyQ2FsZW5kYXIoc2lkZTogU2lkZUVudW0pIHsgLy8gc2lkZSBlbnVtXG4gICAgICAgIGNvbnN0IG1haW5DYWxlbmRhcjogYW55ID0gKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpID8gdGhpcy5sZWZ0Q2FsZW5kYXIgOiB0aGlzLnJpZ2h0Q2FsZW5kYXI7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1vbnRoKCk7XG4gICAgICAgIGNvbnN0IHllYXIgPSBtYWluQ2FsZW5kYXIubW9udGgueWVhcigpO1xuICAgICAgICBjb25zdCBob3VyID0gbWFpbkNhbGVuZGFyLm1vbnRoLmhvdXIoKTtcbiAgICAgICAgY29uc3QgbWludXRlID0gbWFpbkNhbGVuZGFyLm1vbnRoLm1pbnV0ZSgpO1xuICAgICAgICBjb25zdCBzZWNvbmQgPSBtYWluQ2FsZW5kYXIubW9udGguc2Vjb25kKCk7XG4gICAgICAgIGNvbnN0IGRheXNJbk1vbnRoID0gbW9tZW50KFt5ZWFyLCBtb250aF0pLmRheXNJbk1vbnRoKCk7XG4gICAgICAgIGNvbnN0IGZpcnN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgMV0pO1xuICAgICAgICBjb25zdCBsYXN0RGF5ID0gbW9tZW50KFt5ZWFyLCBtb250aCwgZGF5c0luTW9udGhdKTtcbiAgICAgICAgY29uc3QgbGFzdE1vbnRoID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpO1xuICAgICAgICBjb25zdCBsYXN0WWVhciA9IG1vbWVudChmaXJzdERheSkuc3VidHJhY3QoMSwgJ21vbnRoJykueWVhcigpO1xuICAgICAgICBjb25zdCBkYXlzSW5MYXN0TW9udGggPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGhdKS5kYXlzSW5Nb250aCgpO1xuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBmaXJzdERheS5kYXkoKTtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBhIDYgcm93cyB4IDcgY29sdW1ucyBhcnJheSBmb3IgdGhlIGNhbGVuZGFyXG4gICAgICAgIGNvbnN0IGNhbGVuZGFyOiBhbnkgPSBbXTtcbiAgICAgICAgY2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcbiAgICAgICAgY2FsZW5kYXIubGFzdERheSA9IGxhc3REYXk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIGNhbGVuZGFyW2ldID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBkYXRlIG9iamVjdHNcbiAgICAgICAgbGV0IHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gZGF5T2ZXZWVrICsgdGhpcy5sb2NhbGUuZmlyc3REYXkgKyAxO1xuICAgICAgICBpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcbiAgICAgICAgICAgIHN0YXJ0RGF5IC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5T2ZXZWVrID09PSB0aGlzLmxvY2FsZS5maXJzdERheSkge1xuICAgICAgICAgICAgc3RhcnREYXkgPSBkYXlzSW5MYXN0TW9udGggLSA2O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1ckRhdGUgPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGgsIHN0YXJ0RGF5LCAxMiwgbWludXRlLCBzZWNvbmRdKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgY29sID0gMCwgcm93ID0gMDsgaSA8IDQyOyBpKyssIGNvbCsrLCBjdXJEYXRlID0gbW9tZW50KGN1ckRhdGUpLmFkZCgyNCwgJ2hvdXInKSkge1xuICAgICAgICAgICAgaWYgKGkgPiAwICYmIGNvbCAlIDcgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb2wgPSAwO1xuICAgICAgICAgICAgICAgIHJvdysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gY3VyRGF0ZS5jbG9uZSgpLmhvdXIoaG91cikubWludXRlKG1pbnV0ZSkuc2Vjb25kKHNlY29uZCk7XG4gICAgICAgICAgICBjdXJEYXRlLmhvdXIoMTIpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5taW5EYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5taW5EYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiYgc2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1heERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcbiAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLm1heERhdGUpICYmIHNpZGUgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2UgdGhlIGNhbGVuZGFyIG9iamVjdCBhdmFpbGFibGUgdG8gaG92ZXJEYXRlL2NsaWNrRGF0ZVxuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5jYWxlbmRhciA9IGNhbGVuZGFyO1xuICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vIERpc3BsYXkgdGhlIGNhbGVuZGFyXG4gICAgICAgIC8vXG4gICAgICAgIGNvbnN0IG1pbkRhdGUgPSBzaWRlID09PSAnbGVmdCcgPyB0aGlzLm1pbkRhdGUgOiB0aGlzLnN0YXJ0RGF0ZTtcbiAgICAgICAgbGV0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XG4gICAgICAgIC8vIGFkanVzdCBtYXhEYXRlIHRvIHJlZmxlY3QgdGhlIGRhdGVMaW1pdCBzZXR0aW5nIGluIG9yZGVyIHRvXG4gICAgICAgIC8vIGdyZXkgb3V0IGVuZCBkYXRlcyBiZXlvbmQgdGhlIGRhdGVMaW1pdFxuICAgICAgICBpZiAodGhpcy5lbmREYXRlID09PSBudWxsICYmIHRoaXMuZGF0ZUxpbWl0KSB7XG4gICAgICAgICAgICBjb25zdCBtYXhMaW1pdCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5JykuZW5kT2YoJ2RheScpO1xuICAgICAgICAgICAgaWYgKCFtYXhEYXRlIHx8IG1heExpbWl0LmlzQmVmb3JlKG1heERhdGUpKSB7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZSA9IG1heExpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0gPSB7XG4gICAgICAgICAgICBtb250aDogbW9udGgsXG4gICAgICAgICAgICB5ZWFyOiB5ZWFyLFxuICAgICAgICAgICAgaG91cjogaG91cixcbiAgICAgICAgICAgIG1pbnV0ZTogbWludXRlLFxuICAgICAgICAgICAgc2Vjb25kOiBzZWNvbmQsXG4gICAgICAgICAgICBkYXlzSW5Nb250aDogZGF5c0luTW9udGgsXG4gICAgICAgICAgICBmaXJzdERheTogZmlyc3REYXksXG4gICAgICAgICAgICBsYXN0RGF5OiBsYXN0RGF5LFxuICAgICAgICAgICAgbGFzdE1vbnRoOiBsYXN0TW9udGgsXG4gICAgICAgICAgICBsYXN0WWVhcjogbGFzdFllYXIsXG4gICAgICAgICAgICBkYXlzSW5MYXN0TW9udGg6IGRheXNJbkxhc3RNb250aCxcbiAgICAgICAgICAgIGRheU9mV2VlazogZGF5T2ZXZWVrLFxuICAgICAgICAgICAgLy8gb3RoZXIgdmFyc1xuICAgICAgICAgICAgY2FsUm93czogQXJyYXkuZnJvbShBcnJheSg2KS5rZXlzKCkpLFxuICAgICAgICAgICAgY2FsQ29sczogQXJyYXkuZnJvbShBcnJheSg3KS5rZXlzKCkpLFxuICAgICAgICAgICAgY2xhc3Nlczoge30sXG4gICAgICAgICAgICBtaW5EYXRlOiBtaW5EYXRlLFxuICAgICAgICAgICAgbWF4RGF0ZTogbWF4RGF0ZSxcbiAgICAgICAgICAgIGNhbGVuZGFyOiBjYWxlbmRhclxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5zaG93RHJvcGRvd25zKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50TW9udGggPSBjYWxlbmRhclsxXVsxXS5tb250aCgpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBjYWxlbmRhclsxXVsxXS55ZWFyKCk7XG4gICAgICAgICAgICBjb25zdCByZWFsQ3VycmVudFllYXIgPSBtb21lbnQoKS55ZWFyKCk7XG4gICAgICAgICAgICBjb25zdCBtYXhZZWFyID0gKG1heERhdGUgJiYgbWF4RGF0ZS55ZWFyKCkpIHx8IChyZWFsQ3VycmVudFllYXIgKyA1KTtcbiAgICAgICAgICAgIGNvbnN0IG1pblllYXIgPSAobWluRGF0ZSAmJiBtaW5EYXRlLnllYXIoKSkgfHwgKHJlYWxDdXJyZW50WWVhciAtIDUwKTtcbiAgICAgICAgICAgIGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xuICAgICAgICAgICAgY29uc3QgaW5NYXhZZWFyID0gY3VycmVudFllYXIgPT09IG1heFllYXI7XG4gICAgICAgICAgICBjb25zdCB5ZWFycyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XG4gICAgICAgICAgICAgICAgeWVhcnMucHVzaCh5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zID0ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRNb250aDogY3VycmVudE1vbnRoLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRZZWFyOiBjdXJyZW50WWVhcixcbiAgICAgICAgICAgICAgICBtYXhZZWFyOiBtYXhZZWFyLFxuICAgICAgICAgICAgICAgIG1pblllYXI6IG1pblllYXIsXG4gICAgICAgICAgICAgICAgaW5NaW5ZZWFyOiBpbk1pblllYXIsXG4gICAgICAgICAgICAgICAgaW5NYXhZZWFyOiBpbk1heFllYXIsXG4gICAgICAgICAgICAgICAgbW9udGhBcnJheXM6IEFycmF5LmZyb20oQXJyYXkoMTIpLmtleXMoKSksXG4gICAgICAgICAgICAgICAgeWVhckFycmF5czogeWVhcnNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlKTtcbiAgICB9XG4gICAgc2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnREYXRlLnR6KHRoaXMudGltZXBpY2tlclRpbWV6b25lKTtcblxuICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUubWludXRlKE1hdGgucm91bmQodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHRoaXMubWluRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMuc3RhcnREYXRlLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUubWludXRlKE1hdGguZmxvb3IodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdCh7IHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XG4gICAgfVxuXG4gICAgc2V0RW5kRGF0ZShlbmREYXRlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IG1vbWVudChlbmREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbmREYXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLmVuZERhdGUuYWRkKDEsICdkJykuc3RhcnRPZignZGF5Jykuc3VidHJhY3QoMSwgJ3NlY29uZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW5kRGF0ZS50eih0aGlzLnRpbWVwaWNrZXJUaW1lem9uZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMuZW5kRGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0ZUxpbWl0ICYmIHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5JykuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgICAgICAgIC8vIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdCh7IGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICB9XG4gICAgQElucHV0KClcbiAgICBpc0ludmFsaWREYXRlKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBASW5wdXQoKVxuICAgIGlzQ3VzdG9tRGF0ZShkYXRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB1cGRhdGVWaWV3KCkge1xuICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG4gICAgfVxuXG4gICAgdXBkYXRlTW9udGhzSW5WaWV3KCkge1xuICAgICAgICBpZiAodGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICAvLyBpZiBib3RoIGRhdGVzIGFyZSB2aXNpYmxlIGFscmVhZHksIGRvIG5vdGhpbmdcbiAgICAgICAgICAgIGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoICYmIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCAmJlxuICAgICAgICAgICAgICAgICgodGhpcy5zdGFydERhdGUgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIgJiYgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5yaWdodENhbGVuZGFyICYmIHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpKVxuICAgICAgICAgICAgICAgICYmXG4gICAgICAgICAgICAgICAgKHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGlua2VkQ2FsZW5kYXJzICYmICh0aGlzLmVuZERhdGUubW9udGgoKSAhPT0gdGhpcy5zdGFydERhdGUubW9udGgoKSB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUueWVhcigpICE9PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpLmRhdGUoMik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMubGlua2VkQ2FsZW5kYXJzICYmICF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID4gdGhpcy5tYXhEYXRlKSB7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGUuY2xvbmUoKS5kYXRlKDIpLnN1YnRyYWN0KDEsICdtb250aCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBUaGlzIGlzIHJlc3BvbnNpYmxlIGZvciB1cGRhdGluZyB0aGUgY2FsZW5kYXJzXG4gICAgICovXG4gICAgdXBkYXRlQ2FsZW5kYXJzKCkge1xuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcblxuICAgICAgICBpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgfVxuICAgIHVwZGF0ZUVsZW1lbnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgd2UgdXNlIHJhbmdlcyBhbmQgc2hvdWxkIHNob3cgcmFuZ2UgbGFiZWwgb24gaW5wdXRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZXNBcnJheS5sZW5ndGggJiYgdGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgPT09IHRydWUgJiYgdGhpcy5jaG9zZW5SYW5nZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsICE9PSB0aGlzLmNob3NlblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLmNob3NlblJhbmdlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KSArXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5zZXBhcmF0b3IgKyB0aGlzLmVuZERhdGUuZm9ybWF0KHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB0aGlzIHNob3VsZCBjYWxjdWxhdGUgdGhlIGxhYmVsXG4gICAgICovXG4gICAgY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5sb2NhbGUgfHwgIXRoaXMubG9jYWxlLnNlcGFyYXRvcikge1xuICAgICAgICAgICAgdGhpcy5fYnVpbGRMb2NhbGUoKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3VzdG9tUmFuZ2UgPSB0cnVlO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZXNbcmFuZ2VdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyAnWVlZWS1NTS1ERCBISDptbTpzcycgOiAnWVlZWS1NTS1ERCBISDptbSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgc2Vjb25kcyBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMF0uZm9ybWF0KGZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHRoaXMucmFuZ2VzW3JhbmdlXVsxXS5mb3JtYXQoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMucmFuZ2VzQXJyYXlbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgaXMgbm90IGVuYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzBdLmZvcm1hdCgnWVlZWS1NTS1ERCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLnJhbmdlc0FycmF5W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3VzdG9tUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG93Q3VzdG9tUmFuZ2VMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgY3VzdG9tIGxhYmVsOiBzaG93IGNhbGVuZGFyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgY2xpY2tBcHBseShlPykge1xuICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiAhdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzSW52YWxpZERhdGUgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICAvLyBnZXQgaWYgdGhlcmUgYXJlIGludmFsaWQgZGF0ZSBiZXR3ZWVuIHJhbmdlXG4gICAgICAgICAgICBjb25zdCBkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIHdoaWxlIChkLmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IGQuc3VidHJhY3QoMSwgJ2RheXMnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZC5hZGQoMSwgJ2RheXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaG9zZW5MYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHsgY2hvc2VuTGFiZWw6IHRoaXMuY2hvc2VuTGFiZWwsIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSwgdGltZXpvbmU6IHRoaXMudGltZXBpY2tlclRpbWV6b25lIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7IHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSwgdGltZXpvbmU6IHRoaXMudGltZXBpY2tlclRpbWV6b25lIH0pO1xuICAgICAgICBpZiAoZSB8fCAodGhpcy5jbG9zZU9uQXV0b0FwcGx5ICYmICFlKSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGlja0NhbmNlbChlKSB7XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5fb2xkLnN0YXJ0O1xuICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kO1xuICAgICAgICBpZiAodGhpcy5pbmxpbmUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiBtb250aCBpcyBjaGFuZ2VkXG4gICAgICogQHBhcmFtIG1vbnRoRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICAgKi9cbiAgICBtb250aENoYW5nZWQobW9udGhFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBjb25zdCB5ZWFyID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXI7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQobW9udGhFdmVudC50YXJnZXQudmFsdWUsIDEwKTtcbiAgICAgICAgdGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiB5ZWFyIGlzIGNoYW5nZWRcbiAgICAgKiBAcGFyYW0geWVhckV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG4gICAgICovXG4gICAgeWVhckNoYW5nZWQoeWVhckV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudE1vbnRoO1xuICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQoeWVhckV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuICAgICAgICB0aGlzLm1vbnRoT3JZZWFyQ2hhbmdlZChtb250aCwgeWVhciwgc2lkZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNhbGxlZCB3aGVuIHRpbWUgaXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgICAqL1xuICAgIHRpbWVDaGFuZ2VkKHRpbWVFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuXG4gICAgICAgIGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuICAgICAgICBsZXQgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XG4gICAgICAgIGxldCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuXG4gICAgICAgIC8vbGV0IGhvdXIgPSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyO1xuICAgICAgICAvL2NvbnN0IG1pbnV0ZSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZTtcbiAgICAgICAgLy9jb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kIDogMDtcbiAgICAgICAgaWYgKGhvdXIgPCAxMCkgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9ICcwJyArIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXI7XG4gICAgICAgIGVsc2UgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9ICcwJztcbiAgICAgICAgaWYgKG1pbnV0ZSA8IDEwKSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSAnMCcgKyB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGU7XG4gICAgICAgIGVsc2UgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlID0gbWludXRlO1xuICAgICAgICBpZiAoc2Vjb25kIDwgMTApIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCA9ICcwJyArIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZDtcbiAgICAgICAgZWxzZSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBzZWNvbmQ7XG5cbiAgICAgICAgLypcbiAgICAgICAgY29uc29sZS5sb2coXCJzaWRlMVwiLCBzaWRlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJldmVudDFcIiwgdGltZUV2ZW50KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJob3VyXCIsIGhvdXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIm1pbnV0ZVwiLCBtaW51dGUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIjF0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyXCIsIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIjF0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGVcIiwgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCIydGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kXCIsIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCk7ICAgICAgIFxuICAgICAgICAqL1xuXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG4gICAgICAgICAgICBjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIHN0YXJ0LmhvdXIoaG91cik7XG4gICAgICAgICAgICBzdGFydC5taW51dGUobWludXRlKTtcbiAgICAgICAgICAgIHN0YXJ0LnNlY29uZChzZWNvbmQpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUoc3RhcnQpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmIHRoaXMuZW5kRGF0ZS5pc0JlZm9yZShzdGFydCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVuZERhdGUoc3RhcnQuY2xvbmUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcbiAgICAgICAgICAgIGVuZC5ob3VyKGhvdXIpO1xuICAgICAgICAgICAgZW5kLm1pbnV0ZShtaW51dGUpO1xuICAgICAgICAgICAgZW5kLnNlY29uZChzZWNvbmQpO1xuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKGVuZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXG4gICAgICAgIC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9BcHBseSkge1xuICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogY2FsbGVkIHdoZW4gdGltZVpvbmUgaXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XG4gICAgICovXG4gICAgdGltZVpvbmVDaGFuZ2VkKHRpbWVFdmVudDogYW55KSB7XG5cbiAgICAgICAgLyogY2hhbmdlZCBtb21lbnQgdG8gbmV3IHRpbWV6b25lICovXG4gICAgICAgIG1vbWVudC50ei5zZXREZWZhdWx0KHRoaXMudGltZXBpY2tlclRpbWV6b25lKTtcblxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZS50eih0aGlzLnRpbWVwaWNrZXJUaW1lem9uZSk7XG4gICAgICAgIHRoaXMuZW5kRGF0ZS50eih0aGlzLnRpbWVwaWNrZXJUaW1lem9uZSk7XG5cblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgYWxsIGVtZW1uZXRzXG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuXG4gICAgICAgIC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9BcHBseSkge1xuICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogIGNhbGwgd2hlbiBtb250aCBvciB5ZWFyIGNoYW5nZWRcbiAgICAgKiBAcGFyYW0gbW9udGggbW9udGggbnVtYmVyIDAgLTExXG4gICAgICogQHBhcmFtIHllYXIgeWVhciBlZzogMTk5NVxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICAgKi9cbiAgICBtb250aE9yWWVhckNoYW5nZWQobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyLCBzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBjb25zdCBpc0xlZnQgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0O1xuXG4gICAgICAgIGlmICghaXNMZWZ0KSB7XG4gICAgICAgICAgICBpZiAoeWVhciA8IHRoaXMuc3RhcnREYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5zdGFydERhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5zdGFydERhdGUubW9udGgoKSkpIHtcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMuc3RhcnREYXRlLm1vbnRoKCk7XG4gICAgICAgICAgICAgICAgeWVhciA9IHRoaXMuc3RhcnREYXRlLnllYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1pbkRhdGUpIHtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgdGhpcy5taW5EYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5taW5EYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMubWluRGF0ZS5tb250aCgpKSkge1xuICAgICAgICAgICAgICAgIG1vbnRoID0gdGhpcy5taW5EYXRlLm1vbnRoKCk7XG4gICAgICAgICAgICAgICAgeWVhciA9IHRoaXMubWluRGF0ZS55ZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhEYXRlKSB7XG4gICAgICAgICAgICBpZiAoeWVhciA+IHRoaXMubWF4RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMubWF4RGF0ZS55ZWFyKCkgJiYgbW9udGggPiB0aGlzLm1heERhdGUubW9udGgoKSkpIHtcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMubWF4RGF0ZS5tb250aCgpO1xuICAgICAgICAgICAgICAgIHllYXIgPSB0aGlzLm1heERhdGUueWVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRZZWFyID0geWVhcjtcbiAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudE1vbnRoID0gbW9udGg7XG4gICAgICAgIGlmIChpc0xlZnQpIHtcbiAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgobW9udGgpLnllYXIoeWVhcik7XG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5jbG9uZSgpLnN1YnRyYWN0KDEsICdtb250aCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xpY2sgb24gcHJldmlvdXMgbW9udGhcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0IGNhbGVuZGFyXG4gICAgICovXG4gICAgY2xpY2tQcmV2KHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDbGljayBvbiBuZXh0IG1vbnRoXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxuICAgICAqL1xuICAgIGNsaWNrTmV4dChzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuICAgICAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXaGVuIHNlbGVjdGluZyBhIGRhdGVcbiAgICAgKiBAcGFyYW0gZSBldmVudDogZ2V0IHZhbHVlIGJ5IGUudGFyZ2V0LnZhbHVlXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgICAqIEBwYXJhbSByb3cgcm93IHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxuICAgICAqIEBwYXJhbSBjb2wgY29sIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxuICAgICAqL1xuICAgIGNsaWNrRGF0ZShlLCBzaWRlOiBTaWRlRW51bSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnVEQnKSB7XG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1NQQU4nKSB7XG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhdmFpbGFibGUnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGUgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXJbcm93XVtjb2xdIDogdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXTtcblxuICAgICAgICBpZiAoKHRoaXMuZW5kRGF0ZSB8fCAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpXG4gICAgICAgICAgICAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSBmYWxzZSkpICYmIHRoaXMubG9ja1N0YXJ0RGF0ZSA9PT0gZmFsc2UpIHsgLy8gcGlja2luZyBzdGFydFxuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgICAgICAgIGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ubGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5lbmREYXRlICYmIGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGNsaWNraW5nIHRoZSBzYW1lIGRhdGUgZm9yIHN0YXJ0L2VuZCxcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgdGltZSBvZiB0aGUgZW5kIGRhdGUgaXMgYmVmb3JlIHRoZSBzdGFydCBkYXRlXG4gICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUuY2xvbmUoKSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBpY2tpbmcgZW5kXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZShkYXRlLCBTaWRlRW51bS5yaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpID09PSB0cnVlICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvQXBwbHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyKSB7XG4gICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvQXBwbHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9BcHBseSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0byBjYW5jZWwgdGhlIGJsdXIgZXZlbnQgaGFuZGxlciBpZiB0aGUgbW91c2Ugd2FzIGluIG9uZSBvZiB0aGUgaW5wdXRzXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogIENsaWNrIG9uIHRoZSBjdXN0b20gcmFuZ2VcbiAgICAgKiBAcGFyYW0gZTogRXZlbnRcbiAgICAgKiBAcGFyYW0gbGFiZWxcbiAgICAgKi9cbiAgICBjbGlja1JhbmdlKGUsIGxhYmVsKSB7XG4gICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSBsYWJlbDtcbiAgICAgICAgaWYgKGxhYmVsID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlOyAvLyBzaG93IGNhbGVuZGFyc1xuICAgICAgICAgICAgdGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGF0ZXMgPSB0aGlzLnJhbmdlc1tsYWJlbF07XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IGRhdGVzWzBdLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ICYmIGxhYmVsICE9PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICghdGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlOyAvLyBoaWRlIGNhbGVuZGFyc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yYW5nZUNsaWNrZWQuZW1pdCh7IGxhYmVsOiBsYWJlbCwgZGF0ZXM6IGRhdGVzIH0pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xpY2tBcHBseSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMubWF4RGF0ZS5pc1NhbWUoZGF0ZXNbMF0sICdtb250aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1swXS5tb250aCgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMF0ueWVhcigpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKGRhdGVzWzFdLnllYXIoKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMF0ueWVhcigpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBuZXh0IHllYXJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoID0gZGF0ZXNbMF0uY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChuZXh0TW9udGgubW9udGgoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKG5leHRNb250aC55ZWFyKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG5cblxuICAgIHNob3coZT8pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTaG93bikgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5fb2xkLnN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgICAgdGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG5cbiAgICBoaWRlKGU/KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW5jb21wbGV0ZSBkYXRlIHNlbGVjdGlvbiwgcmV2ZXJ0IHRvIGxhc3QgdmFsdWVzXG4gICAgICAgIGlmICghdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fb2xkLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQuY2xvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLl9vbGQuZW5kKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZC5jbG9uZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYSBuZXcgZGF0ZSByYW5nZSB3YXMgc2VsZWN0ZWQsIGludm9rZSB0aGUgdXNlciBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgICBpZiAoIXRoaXMuc3RhcnREYXRlLmlzU2FtZSh0aGlzLl9vbGQuc3RhcnQpIHx8ICF0aGlzLmVuZERhdGUuaXNTYW1lKHRoaXMuX29sZC5lbmQpKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmNhbGxiYWNrKHRoaXMuc3RhcnREYXRlLCB0aGlzLmVuZERhdGUsIHRoaXMuY2hvc2VuTGFiZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgcGlja2VyIGlzIGF0dGFjaGVkIHRvIGEgdGV4dCBpbnB1dCwgdXBkYXRlIGl0XG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhhbmRsZSBjbGljayBvbiBhbGwgZWxlbWVudCBpbiB0aGUgY29tcG9uZW50LCB1c2VmdWwgZm9yIG91dHNpZGUgb2YgY2xpY2tcbiAgICAgKiBAcGFyYW0gZSBldmVudFxuICAgICAqL1xuICAgIGhhbmRsZUludGVybmFsQ2xpY2soZSkge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgdGhlIGxvY2FsZSBvcHRpb25zXG4gICAgICogQHBhcmFtIGxvY2FsZVxuICAgICAqL1xuICAgIHVwZGF0ZUxvY2FsZShsb2NhbGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbG9jYWxlKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZVtrZXldID0gbG9jYWxlW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2N1c3RvbVJhbmdlTGFiZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyUmFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG4gICAgICAgIHRoaXMuY2hvb3NlZERhdGUuZW1pdCh7IGNob3NlbkxhYmVsOiAnJywgc3RhcnREYXRlOiBudWxsLCBlbmREYXRlOiBudWxsLCB0aW1lem9uZTogJycgfSk7XG4gICAgICAgIHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQoeyBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGwsIHRpbWV6b25lOiAnJyB9KTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBvdXQgaWYgdGhlIHNlbGVjdGVkIHJhbmdlIHNob3VsZCBiZSBkaXNhYmxlZCBpZiBpdCBkb2Vzbid0XG4gICAgICogZml0IGludG8gbWluRGF0ZSBhbmQgbWF4RGF0ZSBsaW1pdGF0aW9ucy5cbiAgICAgKi9cbiAgICBkaXNhYmxlUmFuZ2UocmFuZ2UpIHtcbiAgICAgICAgaWYgKHJhbmdlID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmFuZ2VNYXJrZXJzID0gdGhpcy5yYW5nZXNbcmFuZ2VdO1xuICAgICAgICBjb25zdCBhcmVCb3RoQmVmb3JlID0gcmFuZ2VNYXJrZXJzLmV2ZXJ5KGRhdGUgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm1pbkRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGF0ZS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhcmVCb3RoQWZ0ZXIgPSByYW5nZU1hcmtlcnMuZXZlcnkoZGF0ZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubWF4RGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRlLmlzQWZ0ZXIodGhpcy5tYXhEYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAoYXJlQm90aEJlZm9yZSB8fCBhcmVCb3RoQWZ0ZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGFkZCB0aW1lXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldERhdGVXaXRoVGltZShkYXRlLCBzaWRlOiBTaWRlRW51bSk6IF9tb21lbnQuTW9tZW50IHtcbiAgICAgICAgbGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG4gICAgICAgICAgICBjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbnV0ZSA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSwgMTApO1xuICAgICAgICBjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuICAgICAgICByZXR1cm4gZGF0ZS5jbG9uZSgpLmhvdXIoaG91cikubWludXRlKG1pbnV0ZSkuc2Vjb25kKHNlY29uZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBidWlsZCB0aGUgbG9jYWxlIGNvbmZpZ1xuICAgICAqL1xuICAgIHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xuICAgICAgICB0aGlzLmxvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnRoaXMubG9jYWxlIH07XG4gICAgICAgIGlmICghdGhpcy5sb2NhbGUuZm9ybWF0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnbGxsJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIF9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA2OyByb3crKykge1xuICAgICAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10gPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHJvd0NsYXNzZXMgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzICYmICF0aGlzLmhhc0N1cnJlbnRNb250aERheXModGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tb250aCwgY2FsZW5kYXJbcm93XSkpIHtcbiAgICAgICAgICAgICAgICByb3dDbGFzc2VzLnB1c2godGhpcy5lbXB0eVdlZWtSb3dDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA3OyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgdG9kYXkncyBkYXRlXG4gICAgICAgICAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5pc1NhbWUobmV3IERhdGUoKSwgJ2RheScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgndG9kYXknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHdlZWtlbmRzXG4gICAgICAgICAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5pc29XZWVrZGF5KCkgPiA1KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnd2Vla2VuZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBncmV5IG91dCB0aGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGRpc3BsYXllZCBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGlzIGNhbGVuZGFyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpICE9PSBjYWxlbmRhclsxXVsxXS5tb250aCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2ZmJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgbGFzdCBkYXkgb2YgdGhlIHByZXZpb3VzIG1vbnRoIGluIHRoaXMgY2FsZW5kYXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgJiYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpIDwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgPT09IDApICYmIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZGF5c0luTGFzdE1vbnRoXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgbmV4dCBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzICYmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA+IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gMCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gMVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgZmlyc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3NcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RNb250aERheUNsYXNzICYmIGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmXG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmZpcnN0RGF5LmRhdGUoKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb250aERheUNsYXNzICYmIGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmXG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmxhc3REYXkuZGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmxhc3RNb250aERheUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGJlZm9yZSB0aGUgbWluaW11bSBkYXRlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWluRGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5taW5EYXRlLCAnZGF5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGFmdGVyIHRoZSBtYXhpbXVtIGRhdGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubWF4RGF0ZSwgJ2RheScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlIGlmIGEgY3VzdG9tIGZ1bmN0aW9uIGRlY2lkZXMgaXQncyBpbnZhbGlkXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZShjYWxlbmRhcltyb3ddW2NvbF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2ludmFsaWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgc3RhcnQgZGF0ZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ3N0YXJ0LWRhdGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZW5kIGRhdGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmREYXRlICE9IG51bGwgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdhY3RpdmUnLCAnZW5kLWRhdGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSAhPSBudWxsICYmIGNhbGVuZGFyW3Jvd11bY29sXSA+IHRoaXMuc3RhcnREYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXSA8IHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGFwcGx5IGN1c3RvbSBjbGFzc2VzIGZvciB0aGlzIGRhdGVcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ3VzdG9tICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlzQ3VzdG9tID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNsYXNzZXMsIGlzQ3VzdG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzdG9yZSBjbGFzc2VzIHZhclxuICAgICAgICAgICAgICAgIGxldCBjbmFtZSA9ICcnLCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3Nlc1tpXSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY25hbWUgKz0gJ2F2YWlsYWJsZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddW2NvbF0gPSBjbmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XS5jbGFzc0xpc3QgPSByb3dDbGFzc2VzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgb3V0IGlmIHRoZSBjdXJyZW50IGNhbGVuZGFyIHJvdyBoYXMgY3VycmVudCBtb250aCBkYXlzXG4gICAgICogKGFzIG9wcG9zZWQgdG8gY29uc2lzdGluZyBvZiBvbmx5IHByZXZpb3VzL25leHQgbW9udGggZGF5cylcbiAgICAgKi9cbiAgICBoYXNDdXJyZW50TW9udGhEYXlzKGN1cnJlbnRNb250aCwgcm93KSB7XG4gICAgICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB7XG4gICAgICAgICAgICBpZiAocm93W2RheV0ubW9udGgoKSA9PT0gY3VycmVudE1vbnRoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNoZWNrVGltZShldmVudDogYW55LCBzaWRlOiBTaWRlRW51bSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBjaGFyQ29kZSA9IChldmVudC53aGljaCkgPyBldmVudC53aGljaCA6IGV2ZW50LmtleUNvZGU7XG4gICAgICAgIGlmIChjaGFyQ29kZSA+IDMxICYmIChjaGFyQ29kZSA8IDQ4IHx8IGNoYXJDb2RlID4gNTcpICYmIGNoYXJDb2RlICE9IDQ2KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnNyY0VsZW1lbnQgfHwgZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgbWF4TGVuZ3RoID0gcGFyc2VJbnQodGFyZ2V0LmF0dHJpYnV0ZXNbXCJtYXhMZW5ndGhcIl0udmFsdWUsIDEwKTtcbiAgICAgICAgdmFyIG15TGVuZ3RoID0gdGFyZ2V0LnZhbHVlLmxlbmd0aDtcblxuICAgICAgICBpZiAobXlMZW5ndGggPT0gbWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICB0YXJnZXQudmFsdWUgPSB0YXJnZXQudmFsdWUuc2xpY2UoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobXlMZW5ndGggPiBtYXhMZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG4iXX0=