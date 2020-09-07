var DaterangepickerComponent_1;
import { __decorate } from "tslib";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocaleService } from './locale.service';
const moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
let DaterangepickerComponent = DaterangepickerComponent_1 = class DaterangepickerComponent {
    constructor(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.tooltiptext = []; // for storing tooltiptext
        this.timepickerVariables = { left: {}, right: {} };
        this.timepickerTimezone = moment.tz.guess(true);
        this.timepickerListZones = moment.tz.names();
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.fromMonthControl = new FormControl();
        this.fromYearControl = new FormControl();
        this.toMonthControl = new FormControl();
        this.toYearControl = new FormControl();
        this.applyBtn = { disabled: false };
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
        this.nowHoveredDate = null;
        this.pickingDate = false;
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = { month: null };
        this.rightCalendar = { month: null };
        this.showCalInRanges = false;
        this.closeOnAutoApply = true;
        this.chosenDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.closeDateRangePicker = new EventEmitter();
        this.destroy$ = new Subject();
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set ranges(value) {
        this._ranges = value;
        this.renderRanges();
    }
    get ranges() {
        return this._ranges;
    }
    isInvalidDate(date) {
        return false;
    }
    isCustomDate(date) {
        return false;
    }
    isTooltipDate(date) {
        return null;
    }
    ngOnInit() {
        /* changed moment to new timezone */
        moment.tz.setDefault(this.timepickerTimezone);
        this.groupTimeZones();
        this.fromMonthControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((month) => {
            this.monthChanged(month, SideEnum.left);
        });
        this.fromYearControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((year) => {
            this.yearChanged(year, SideEnum.left);
        });
        this.toMonthControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((month) => {
            this.monthChanged(month, SideEnum.right);
        });
        this.toYearControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((year) => {
            this.yearChanged(year, SideEnum.right);
        });
        this._buildLocale();
        const daysOfWeek = [...this.locale.daysOfWeek];
        this.locale.firstDay = this.locale.firstDay % 7;
        if (this.locale.firstDay !== 0) {
            let iterator = this.locale.firstDay;
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
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    renderRanges() {
        this.rangesArray = [];
        let start, end;
        if (typeof this.ranges === 'object') {
            for (const range in this.ranges) {
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
                    let maxDate = this.maxDate;
                    if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                        maxDate = start.clone().add(this.maxSpan);
                    }
                    if (maxDate && end.isAfter(maxDate)) {
                        end = maxDate.clone();
                    }
                    // If the end of the range is before the minimum or the start of the range is
                    // after the maximum, don't display this range option at all.
                    if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
                        (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                        continue;
                    }
                    // Support unicode chars in the range names.
                    const elem = document.createElement('textarea');
                    elem.innerHTML = range;
                    const rangeHtml = elem.value;
                    this.ranges[rangeHtml] = [start, end];
                }
            }
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    this.rangesArray.push(range);
                }
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
        }
    }
    groupTimeZones() {
        const timeZoneCopy = JSON.parse(JSON.stringify(this.timepickerListZones));
        const listTimeZones = {
            Africa: [],
            Australia: [],
            Europe: [],
            America: [],
            Pacific: [],
            ETC: []
        };
        timeZoneCopy.forEach(timeZone => {
            const parsedTimeZoneRegion = timeZone.substr(0, timeZone.indexOf('/'));
            if (Object.keys(listTimeZones).some(region => region === parsedTimeZoneRegion)) {
                listTimeZones[parsedTimeZoneRegion].push(timeZone);
            }
            else {
                listTimeZones['ETC'].push(timeZone);
            }
        });
        this.parsedTimeZones = listTimeZones;
    }
    setToNow(time) {
        if (time === 'start') {
            this.timepickerVariables.left.selectedHour = this.timePicker24Hour ? moment().format('h') : moment().format('H');
            this.timepickerVariables.left.selectedMinute = moment().format('m');
            this.timepickerVariables.left.selectedSecond = moment().format('s');
            this.setStartDate(this._getDateWithTime(moment(), this.sideEnum.left));
        }
        else if (time === 'end') {
            this.timepickerVariables.left.selectedHour = this.timePicker24Hour ? moment().format('h') : moment().format('H');
            this.timepickerVariables.left.selectedMinute = moment().format('m');
            this.timepickerVariables.left.selectedSecond = moment().format('s');
            this.setEndDate(this._getDateWithTime(moment(), this.sideEnum.left));
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }
    renderTimePicker(side) {
        let selected, minDate;
        const maxDate = this.maxDate;
        if (side === SideEnum.left) {
            (selected = this.startDate.clone()), (minDate = this.minDate);
        }
        else if (side === SideEnum.right && this.endDate) {
            (selected = this.endDate.clone()), (minDate = this.startDate);
        }
        else if (side === SideEnum.right && !this.endDate) {
            // don't have an end date, use the start date then put the selected time for the right side as the time
            selected = this._getDateWithTime(this.startDate, SideEnum.right);
            if (selected.isBefore(this.startDate)) {
                selected = this.startDate.clone(); // set it back to the start date the time was backwards
            }
            minDate = this.startDate;
        }
        const start = this.timePicker24Hour ? '0' : '1';
        const end = this.timePicker24Hour ? '23' : '12';
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0,
        };
        this.timepickerVariables[side].selectedHour = selected.hour();
        this.timepickerVariables[side].selectedMinute = selected.minute();
        this.timepickerVariables[side].selectedSecond = selected.second();
        // generate AM/PM
        if (!this.timePicker24Hour) {
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
    }
    renderCalendar(side) {
        const mainCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay).subtract(1, 'month').month();
        const lastYear = moment(firstDay).subtract(1, 'month').year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        const calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.minDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) &&
                side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) &&
                side === 'right') {
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
        const minDate = side === 'left' ? this.minDate : this.startDate;
        let maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month,
            year,
            hour,
            minute,
            second,
            daysInMonth,
            firstDay,
            lastDay,
            lastMonth,
            lastYear,
            daysInLastMonth,
            dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate,
            maxDate,
            calendar,
        };
        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const realCurrentYear = moment().year();
            const maxYear = (maxDate && maxDate.year()) || realCurrentYear + 5;
            const minYear = (minDate && minDate.year()) || realCurrentYear - 50;
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (let y = minYear; y <= maxYear; y++) {
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
                yearArrays: years,
            };
            if (side === SideEnum.left) {
                this.fromMonthControl.setValue(currentMonth, { emitEvent: false });
                this.fromYearControl.setValue(currentYear, { emitEvent: false });
            }
            else if (side === SideEnum.right) {
                this.toMonthControl.setValue(currentMonth, { emitEvent: false });
                this.toYearControl.setValue(currentYear, { emitEvent: false });
            }
        }
        this._buildCells(calendar, side);
    }
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.pickingDate = true;
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.pickingDate = true;
            this.startDate = this.startDate.startOf('day');
        }
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
    }
    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.pickingDate = false;
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.pickingDate = false;
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
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
    }
    updateView() {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }
    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker &&
                this.leftCalendar.month &&
                this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate &&
                        this.rightCalendar &&
                        this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) &&
                (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                    this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars &&
                    (this.endDate.month() !== this.startDate.month() || this.endDate.year() !== this.startDate.year())) {
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
    }
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }
    updateElement() {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.rangesArray.length &&
                    this.showRangeLabelOnInput === true &&
                    this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel = this.startDate.format(format) + this.locale.separator + this.endDate.format(format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(format);
        }
    }
    /**
     * this should calculate the label
     */
    calculateChosenLabel() {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        let customRange = true;
        let i = 0;
        if (this.rangesArray.length > 0) {
            for (const range in this.ranges) {
                if (this.ranges[range]) {
                    if (this.timePicker) {
                        const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                        // ignore times when comparing dates if time picker seconds is not enabled
                        if (this.startDate.format(format) === this.ranges[range][0].format(format) &&
                            this.endDate.format(format) === this.ranges[range][1].format(format)) {
                            customRange = false;
                            this.chosenRange = this.rangesArray[i];
                            break;
                        }
                    }
                    else {
                        // ignore times when comparing dates if time picker is not enabled
                        if (this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD') &&
                            this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')) {
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
    }
    clickApply(e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this._getDateWithTime(this.startDate, SideEnum.right);
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            const d = this.startDate.clone();
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
            this.chosenDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        if (e || (this.closeOnAutoApply && !e)) {
            this.hide();
        }
    }
    clickCancel() {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    }
    /**
     * called when month is changed
     * @param month month represented by a number (0 through 11)
     * @param side left or right
     */
    monthChanged(month, side) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param year year represented by a number
     * @param side left or right
     */
    yearChanged(year, side) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when time is changed
     * @param side left or right
     */
    timeChanged(side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        console.log(minute);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            const start = this.startDate.clone();
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
            else if (!this.endDate && this.timePicker) {
                const startClone = this._getDateWithTime(start, SideEnum.right);
                if (startClone.isBefore(start)) {
                    this.timepickerVariables[SideEnum.right].selectedHour = hour;
                    this.timepickerVariables[SideEnum.right].selectedMinute = minute;
                    this.timepickerVariables[SideEnum.right].selectedSecond = second;
                }
            }
        }
        else if (this.endDate) {
            const end = this.endDate.clone();
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
    }
    /**
     * called when timeZone is changed
     * @param timeEvent  an event
     */
    timeZoneChanged(timeEvent) {
        /* changed moment to new timezone */
        moment.tz.setDefault(this.timepickerTimezone);
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
    }
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month, year, side) {
        const isLeft = side === SideEnum.left;
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
    }
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side) {
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
    }
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side) {
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
    }
    /**
     * When hovering a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    hoverDate(e, side, row, col) {
        const leftCalDate = this.calendarVariables.left.calendar[row][col];
        const rightCalDate = this.calendarVariables.right.calendar[row][col];
        if (this.pickingDate) {
            const hoverDate = side === SideEnum.left ? leftCalDate : rightCalDate;
            this.nowHoveredDate = this._isDateRangeInvalid(hoverDate) ? null : hoverDate;
            this.renderCalendar(SideEnum.left);
            this.renderCalendar(SideEnum.right);
        }
        const tooltip = side === SideEnum.left ? this.tooltiptext[leftCalDate] : this.tooltiptext[rightCalDate];
        if (tooltip.length > 0) {
            e.target.setAttribute('title', tooltip);
        }
    }
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side, row, col) {
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
        let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if ((this.endDate || (date.isBefore(this.startDate, 'day') && this.customRangeDirection === false)) &&
            this.lockStartDate === false) {
            // picking start
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
        else {
            // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
                this.setEndDate(this.startDate);
                this.setStartDate(date.clone());
            }
            else if (this._isDateRangeInvalid(date)) {
                this.setStartDate(date.clone());
            }
            else {
                this.setEndDate(date.clone());
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
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
    }
    /**
     *  Click on the custom range
     * @param label
     */
    clickRange(label) {
        this.chosenRange = label;
        if (label === this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            const dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = !this.rangesArray.length || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange || this.autoApply) {
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
                    if (this.linkedCalendars || dates[0].month() === dates[1].month()) {
                        const nextMonth = dates[0].clone().add(1, 'month');
                        this.rightCalendar.month.month(nextMonth.month());
                        this.rightCalendar.month.year(nextMonth.year());
                    }
                    else {
                        this.rightCalendar.month.month(dates[1].month());
                        this.rightCalendar.month.year(dates[1].year());
                    }
                }
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    }
    show(e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    }
    hide() {
        this.closeDateRangePicker.emit();
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
        this.closeDateRangePicker.emit();
    }
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e) {
        e.stopPropagation();
    }
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale) {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    }
    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.chosenDate.emit({ chosenLabel: '', startDate: null, endDate: null });
        this.datesUpdated.emit({ startDate: null, endDate: null });
        this.hide();
    }
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range) {
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        const rangeMarkers = this.ranges[range];
        const areBothBefore = rangeMarkers.every((date) => {
            if (!this.minDate) {
                return false;
            }
            return date.isBefore(this.minDate);
        });
        const areBothAfter = rangeMarkers.every((date) => {
            if (!this.maxDate) {
                return false;
            }
            return date.isAfter(this.maxDate);
        });
        return areBothBefore || areBothAfter;
    }
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    _getDateWithTime(date, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    }
    /**
     *  build the locale config
     */
    _buildLocale() {
        this.locale = Object.assign(Object.assign({}, this._localeService.config), this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    }
    _buildCells(calendar, side) {
        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            const rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];
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
                    if (this.lastDayOfPreviousMonthClass &&
                        (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) &&
                        calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass &&
                        (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) &&
                        calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
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
                if (((this.nowHoveredDate != null && this.pickingDate) || this.endDate != null) &&
                    calendar[row][col] > this.startDate &&
                    (calendar[row][col] < this.endDate || (calendar[row][col] < this.nowHoveredDate && this.pickingDate)) &&
                    !classes.find((el) => el === 'off')) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // apply custom tooltip for this date
                const isTooltip = this.isTooltipDate(calendar[row][col]);
                if (isTooltip) {
                    if (typeof isTooltip === 'string') {
                        this.tooltiptext[calendar[row][col]] = isTooltip; // setting tooltiptext for custom date
                    }
                    else {
                        this.tooltiptext[calendar[row][col]] = 'Put the tooltip as the returned value of isTooltipDate';
                    }
                }
                else {
                    this.tooltiptext[calendar[row][col]] = '';
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes.length; i++) {
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
    }
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }
    checkTime(event, value) {
        const charCode = (event.which) ? event.which : event.keyCode;
        /* if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46 ) {
            return false;
        } */
        const target = event.srcElement || event.target;
        const maxLength = parseInt(target.attributes['maxLength'].value, 10);
        const myLength = target.value.length;
        /* if (target.value > 60){
          console.log('test')
          target.value = 0;
        } */
        console.log(target.value);
        if (myLength === maxLength) {
            target.value = target.value.slice(1);
        }
        if (myLength > maxLength) {
            return false;
        }
        return true;
    }
    /**
     * Returns true when a date within the range of dates is invalid
     */
    _isDateRangeInvalid(endDate) {
        const days = [];
        let day = this.startDate;
        while (day <= endDate) {
            days.push(day);
            day = day.clone().add(1, 'd');
        }
        return days.some((d) => this.isInvalidDate(d));
    }
};
DaterangepickerComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: LocaleService }
];
__decorate([
    Input()
], DaterangepickerComponent.prototype, "locale", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "ranges", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "startDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "endDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "dateLimit", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "minDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "maxDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "autoApply", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "singleDatePicker", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showDropdowns", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showISOWeekNumbers", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "linkedCalendars", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "autoUpdateInput", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "alwaysShowCalendars", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "maxSpan", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lockStartDate", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePicker", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePicker24Hour", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePickerIncrement", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timePickerSeconds", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timeInput", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "timeZone", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showClearButton", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "firstMonthDayClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lastMonthDayClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "emptyWeekRowClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showCustomRangeLabel", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showCancel", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "showRangeLabelOnInput", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "customRangeDirection", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "closeOnAutoApply", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "chosenDate", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "rangeClicked", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "datesUpdated", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "startDateChanged", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "endDateChanged", void 0);
__decorate([
    Output()
], DaterangepickerComponent.prototype, "closeDateRangePicker", void 0);
__decorate([
    ViewChild('pickerContainer', { static: true })
], DaterangepickerComponent.prototype, "pickerContainer", void 0);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isInvalidDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isCustomDate", null);
__decorate([
    Input()
], DaterangepickerComponent.prototype, "isTooltipDate", null);
DaterangepickerComponent = DaterangepickerComponent_1 = __decorate([
    Component({
        selector: 'ngx-daterangepicker-material',
        template: "<div\r\n    class=\"md-drppicker\"\r\n    #pickerContainer\r\n    [ngClass]=\"{\r\n        ltr: locale.direction === 'ltr',\r\n        rtl: this.locale.direction === 'rtl',\r\n        shown: isShown || inline,\r\n        hidden: !isShown && !inline,\r\n        inline: inline,\r\n        double: !singleDatePicker && showCalInRanges,\r\n        'show-ranges': rangesArray.length\r\n    }\"\r\n>\r\n  <mat-tab-group dynamicHeight>\r\n    <mat-tab class=\"tab\" label=\"Relative\" *ngIf='ranges !== undefined'>\r\n      <div *ngIf=\"rangesArray.length > 0\" class=\"ranges\">\r\n          <ul>\r\n              <li *ngFor=\"let range of rangesArray\">\r\n                  <button\r\n                      type=\"button\"\r\n                      [disabled]=\"disableRange(range)\"\r\n                      [ngClass]=\"{ active: range === chosenRange }\"\r\n                      (click)=\"clickRange(range)\"\r\n                  >\r\n                      {{ range }}\r\n                  </button>\r\n              </li>\r\n          </ul>\r\n      </div>\r\n    </mat-tab>\r\n    <mat-tab class=\"tab\" label=\"Absolute\">\r\n      <div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\r\n          <div class=\"calendar-table\">\r\n              <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n                  <thead>\r\n                      <tr>\r\n                          <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n                          <ng-container\r\n                              *ngIf=\"\r\n                                  !calendarVariables.left.minDate ||\r\n                                  (calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) &&\r\n                                      (!this.linkedCalendars || true))\r\n                              \"\r\n                          >\r\n                              <th>\r\n                                  <button class=\"navigation-button\" mat-icon-button (click)=\"clickPrev(sideEnum.left)\">\r\n                                      <span class=\"calendar-icon calendar-icon--left\"></span>\r\n                                  </button>\r\n                              </th>\r\n                          </ng-container>\r\n                          <ng-container\r\n                              *ngIf=\"\r\n                                  !(\r\n                                      !calendarVariables.left.minDate ||\r\n                                      (calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) &&\r\n                                          (!this.linkedCalendars || true))\r\n                                  )\r\n                              \"\r\n                          >\r\n                              <th></th>\r\n                          </ng-container>\r\n                          <th colspan=\"5\" class=\"month drp-animate\">\r\n                              <ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\r\n                                  <div class=\"dropdowns\">\r\n                                      <mat-select [formControl]=\"fromMonthControl\">\r\n                                          <mat-option\r\n                                              *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\r\n                                              [value]=\"m\"\r\n                                              [disabled]=\"\r\n                                                  (calendarVariables.left.dropdowns.inMinYear &&\r\n                                                      m < calendarVariables.left.minDate.month()) ||\r\n                                                  (calendarVariables.left.dropdowns.inMaxYear && m > calendarVariables.left.maxDate.month())\r\n                                              \"\r\n                                          >\r\n                                              {{ locale.monthNames[m] }}\r\n                                          </mat-option>\r\n                                      </mat-select>\r\n                                  </div>\r\n                                  <div class=\"dropdowns\">\r\n                                      <mat-select [formControl]=\"fromYearControl\">\r\n                                          <mat-option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [value]=\"y\">\r\n                                              {{ y }}\r\n                                          </mat-option>\r\n                                      </mat-select>\r\n                                  </div>\r\n                              </ng-container>\r\n                              <ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\r\n                                  {{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\r\n                                  {{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\r\n                              </ng-container>\r\n                          </th>\r\n                          <ng-container\r\n                              *ngIf=\"\r\n                                  (!calendarVariables.left.maxDate ||\r\n                                      calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) &&\r\n                                  (!linkedCalendars || !singleDatePicker)\r\n                              \"\r\n                          >\r\n                              <th>\r\n                                  <button class=\"navigation-button\" mat-icon-button (click)=\"clickNext(sideEnum.left)\">\r\n                                      <span class=\"calendar-icon calendar-icon--right\"></span>\r\n                                  </button>\r\n                              </th>\r\n                          </ng-container>\r\n                          <ng-container\r\n                              *ngIf=\"\r\n                                  !(\r\n                                      (!calendarVariables.left.maxDate ||\r\n                                          calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) &&\r\n                                      (!linkedCalendars || singleDatePicker)\r\n                                  )\r\n                              \"\r\n                          >\r\n                              <th></th>\r\n                          </ng-container>\r\n                      </tr>\r\n                      <tr class=\"week-days\">\r\n                          <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\r\n                              <span>{{ this.locale.weekLabel }}</span>\r\n                          </th>\r\n                          <th *ngFor=\"let dayofweek of locale.daysOfWeek\">\r\n                              <span>{{ dayofweek }}</span>\r\n                          </th>\r\n                      </tr>\r\n                  </thead>\r\n                  <tbody class=\"drp-animate\">\r\n                      <tr *ngFor=\"let row of calendarVariables.left.calRows\" [class]=\"calendarVariables.left.classes[row].classList\">\r\n                          <!-- add week number -->\r\n                          <td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n                              <span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\r\n                          </td>\r\n                          <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n                              <span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\r\n                          </td>\r\n                          <!-- cal -->\r\n                          <td\r\n                              *ngFor=\"let col of calendarVariables.left.calCols\"\r\n                              [class]=\"calendarVariables.left.classes[row][col]\"\r\n                              (click)=\"clickDate($event, sideEnum.left, row, col)\"\r\n                              (mouseenter)=\"hoverDate($event, sideEnum.left, row, col)\"\r\n                          >\r\n                              <span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\r\n                          </td>\r\n                      </tr>\r\n                  </tbody>\r\n              </table>\r\n          </div>\r\n        <div class=\"calendar-time\" *ngIf=\"timePicker\"> <!-- start-time with input -->\r\n          <span class='time-label'>From:</span>\r\n            <div class=\"input\">\r\n                <input (keypress)=\"checkTime($event, timepickerVariables.left.selectedHour)\" type=\"number\" maxLength=\"2\" class=\"input-item hourselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.left.selectedHour | time\" (ngModelChange)=\"timepickerVariables.left.selectedHour = $event; timeChanged(sideEnum.left)\">\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"input\">\r\n                <input (keypress)=\"checkTime($event, timepickerVariables.left.selectedMinute)\" type=\"number\" maxLength=\"2\" class=\"input-item minuteselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.left.selectedMinute | time\" (ngModelChange)=\"timepickerVariables.left.selectedMinute = $event;timeChanged(sideEnum.left)\">\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <div class=\"input\">\r\n                <input (keypress)=\"checkTime($event, timepickerVariables.left.selectedSecond)\" type=\"number\"  maxLength=\"2\" *ngIf=\"timePickerSeconds\" class=\"input-item secondselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.left.selectedSecond | time\" (ngModelChange)=\"timepickerVariables.left.selectedSecond = $event;timeChanged(sideEnum.left)\">\r\n\r\n                <span class=\"select-highlight\"></span>\r\n                <span class=\"select-bar\"></span>\r\n            </div>\r\n            <button mat-button (click)='setToNow(\"start\")'>\r\n              @Now\r\n            </button>\r\n        </div>\r\n\r\n        <div class=\"calendar-time\" *ngIf=\"timePicker\"> <!-- end-time with input -->\r\n          <span class='time-label'>To:</span>\r\n          <div class=\"input\">\r\n              <input (keypress)=\"checkTime($event, timepickerVariables.right.selectedHour)\" type=\"number\"  maxLength=\"2\" class=\"input-item hourselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.right.selectedHour | time\" (ngModelChange)=\"timepickerVariables.right.selectedHour = $event;timeChanged(sideEnum.right)\">\r\n              <span class=\"select-highlight\"></span>\r\n              <span class=\"select-bar\"></span>\r\n          </div>\r\n          <div class=\"input\">\r\n              <input (keypress)=\"checkTime($event, timepickerVariables.right.selectedMinute)\" type=\"number\" max='59'  maxLength=\"2\" class=\"input-item minuteselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.right.selectedMinute | time\" (ngModelChange)=\"timepickerVariables.right.selectedMinute = $event;timeChanged(sideEnum.right)\">\r\n              <span class=\"select-highlight\"></span>\r\n              <span class=\"select-bar\"></span>\r\n          </div>\r\n          <div class=\"input\">\r\n              <input (keypress)=\"checkTime($event, timepickerVariables.right.selectedSecond)\" type=\"number\" max='59'  maxLength=\"2\" *ngIf=\"timePickerSeconds\" class=\"input-item secondselect\" [disabled]=\"!endDate\" [ngModel]=\"timepickerVariables.right.selectedSecond | time\" (ngModelChange)=\"timepickerVariables.right.selectedSecond = $event;timeChanged(sideEnum.right)\">\r\n              <span class=\"select-highlight\"></span>\r\n              <span class=\"select-bar\"></span>\r\n          </div>\r\n          <button mat-button (click)='setToNow(\"end\")'>\r\n            @Now\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </mat-tab>\r\n  </mat-tab-group>\r\n    <div class=\"calendar-table\" *ngIf=\"timeZone\">\r\n      <mat-form-field appearance=\"fill\" style=\"display:block;width:100%;\">\r\n          <mat-label>Displayed timezone select</mat-label>\r\n          <mat-select class=\"select-item\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerTimezone\" (ngModelChange)=\"timeZoneChanged($event)\">\r\n              <mat-optgroup *ngFor='let region of parsedTimeZones | keyvalue' [label]='region.key'>\r\n              <mat-option *ngFor='let timeZone of region.value' [value]=\"timeZone\">\r\n                  {{timeZone | timeZone:'location'}} {{timeZone | timeZone:'offset'}}\r\n              </mat-option>\r\n              </mat-optgroup>\r\n          </mat-select>\r\n          <span class=\"select-highlight\"></span>\r\n          <span class=\"select-bar\"></span>\r\n        </mat-form-field>\r\n\r\n\r\n    </div>\r\n    <div class=\"buttons\" *ngIf=\"!autoApply && (!rangesArray.length || (showCalInRanges && !singleDatePicker))\">\r\n        <div class=\"buttons_input\">\r\n            <button *ngIf=\"showClearButton\" mat-raised-button type=\"button\" [title]=\"locale.clearLabel\" (click)=\"clear()\">\r\n                <span class=\"clear-button\">\r\n                    {{ locale.clearLabel }}\r\n                    <span class=\"clear-icon\">\r\n                        <svg viewBox=\"0 0 24 24\">\r\n                            <path fill=\"currentColor\" d=\"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z\" />\r\n                        </svg>\r\n                    </span>\r\n                </span>\r\n            </button>\r\n            <button *ngIf=\"showCancel\" mat-raised-button (click)=\"clickCancel()\">{{ locale.cancelLabel }}</button>\r\n            <button [disabled]=\"applyBtn.disabled\" mat-raised-button color=\"primary\" (click)=\"clickApply($event)\">\r\n                {{ locale.applyLabel }}\r\n            </button>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
        host: {
            '(click)': 'handleInternalClick($event)',
        },
        encapsulation: ViewEncapsulation.None,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DaterangepickerComponent_1),
                multi: true,
            },
        ],
        styles: [".md-drppicker{border-radius:4px;width:340px;padding:4px;margin-top:-10px;overflow:hidden;font-size:14px;box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12);background-color:#fff}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative;display:inline-block}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker .calendar{width:100%;margin:0 auto}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:1px;white-space:nowrap;text-align:center;min-width:32px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid transparent;padding:4px}.md-drppicker .calendar-table table{border-spacing:2px;border-collapse:separate}.md-drppicker .ranges{width:100%;float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%;display:-ms-grid;display:grid;-ms-grid-columns:1fr 1fr;grid-template-columns:1fr 1fr}.md-drppicker .ranges ul li{font-size:12px}.md-drppicker .ranges ul li button{padding:.2rem .7rem;width:100%;background:0 0;border:none;text-align:left;cursor:pointer;outline:0;line-height:32px}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{border-radius:3px;background:0 0}.md-drppicker table{width:100%;margin:0}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:4px;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.week,.md-drppicker th.week{font-size:80%}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.in-range{border-radius:0;background-color:#dde2e4}.md-drppicker td.in-range:hover{border-radius:0}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:4px}.md-drppicker td{margin:.25em 0;transition:450ms cubic-bezier(.23,1,.32,1);border-radius:2em;transform:scale(1)}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .navigation-button{width:32px!important;height:32px!important;line-height:32px!important}.md-drppicker .navigation-button .calendar-icon{transform:rotate(180deg)}.md-drppicker .navigation-button .calendar-icon::after{display:block;content:'';height:6px;width:6px;border-width:0 0 2px 2px;border-style:solid;position:absolute;left:50%;top:50%}.md-drppicker .navigation-button .calendar-icon.calendar-icon--left::after{margin-left:1px;transform:translate(-50%,-50%) rotate(45deg)}.md-drppicker .navigation-button .calendar-icon.calendar-icon--right::after{margin-left:-1px;transform:translate(-50%,-50%) rotate(225deg)}.md-drppicker .dropdowns{width:60px}.md-drppicker .dropdowns+.dropdowns{margin-left:4px}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select mat-select{width:46px}.md-drppicker .calendar-time .time-label{display:inline-block;text-align:right;width:40px}.md-drppicker .input{display:inline}.md-drppicker .input .input-item{display:inline-block;width:44px;position:relative;font-family:inherit;background-color:transparent;text-align:center;padding:5px 5px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .input .input-item:focus{outline:0}.md-drppicker .input .input-item .input-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker button+button{margin-left:8px}.md-drppicker .clear-button{display:flex;align-items:center;justify-content:center}.md-drppicker .clear-button .clear-icon{font-size:20px!important}.md-drppicker .clear-button .clear-icon svg{width:1em;height:1em;fill:currentColor;pointer-events:none;top:.125em;position:relative}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;padding-right:12px}.md-drppicker.ltr .calendar.left .calendar-table mat-select{width:100%}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{transform:translate(0);transition:transform .2s,opacity .2s}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{transform:translateX(-10%);opacity:0}}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}@media (min-width:730px){.md-drppicker .ranges{width:100%}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}.tab{margin:0 auto}"]
    })
], DaterangepickerComponent);
export { DaterangepickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNILGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsR0FDcEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sS0FBSyxPQUFPLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUV2QixNQUFNLENBQU4sSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2hCLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ25CLENBQUMsRUFIVyxRQUFRLEtBQVIsUUFBUSxRQUduQjtBQWtCRCxJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBd0I7SUFnQmpDLFlBQW9CLEVBQWMsRUFBVSxJQUF1QixFQUFVLGNBQTZCO1FBQXRGLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQ2xHLFNBQUksR0FBNkIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztR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QURDLEtBQUssRUFBRTs0REFHUDtBQUVEO0lBREMsS0FBSyxFQUFFOzZEQUdQO0FBakpRLHdCQUF3QjtJQWhCcEMsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLDhCQUE4QjtRQUV4Qyw2K2JBQStDO1FBQy9DLElBQUksRUFBRTtZQUNGLFNBQVMsRUFBRSw2QkFBNkI7U0FDM0M7UUFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtRQUNyQyxTQUFTLEVBQUU7WUFDUDtnQkFDSSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUF3QixDQUFDO2dCQUN2RCxLQUFLLEVBQUUsSUFBSTthQUNkO1NBQ0o7O0tBQ0osQ0FBQztHQUNXLHdCQUF3QixDQWkyQ3BDO1NBajJDWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBDb21wb25lbnQsXHJcbiAgICBFbGVtZW50UmVmLFxyXG4gICAgRXZlbnRFbWl0dGVyLFxyXG4gICAgZm9yd2FyZFJlZixcclxuICAgIElucHV0LFxyXG4gICAgT25EZXN0cm95LFxyXG4gICAgT25Jbml0LFxyXG4gICAgT3V0cHV0LFxyXG4gICAgVmlld0NoaWxkLFxyXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEZvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4vbG9jYWxlLnNlcnZpY2UnO1xyXG5cclxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcclxuXHJcbmV4cG9ydCBlbnVtIFNpZGVFbnVtIHtcclxuICAgIGxlZnQgPSAnbGVmdCcsXHJcbiAgICByaWdodCA9ICdyaWdodCcsXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyxcclxuICAgIHN0eWxlVXJsczogWycuL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQuc2NzcyddLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcuL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgJyhjbGljayknOiAnaGFuZGxlSW50ZXJuYWxDbGljaygkZXZlbnQpJyxcclxuICAgIH0sXHJcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50KSxcclxuICAgICAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAgICBASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcclxuICAgIH1cclxuICAgIGdldCBsb2NhbGUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgpIHNldCByYW5nZXModmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZXMgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlbmRlclJhbmdlcygpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHJhbmdlcygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYW5nZXM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSkge31cclxuICAgIHByaXZhdGUgX29sZDogeyBzdGFydDogYW55OyBlbmQ6IGFueSB9ID0geyBzdGFydDogbnVsbCwgZW5kOiBudWxsIH07XHJcbiAgICBjaG9zZW5MYWJlbDogc3RyaW5nO1xyXG5cclxuICAgIGNhbGVuZGFyVmFyaWFibGVzOiB7IGxlZnQ6IGFueTsgcmlnaHQ6IGFueSB9ID0geyBsZWZ0OiB7fSwgcmlnaHQ6IHt9IH07XHJcbiAgICB0b29sdGlwdGV4dCA9IFtdOyAvLyBmb3Igc3RvcmluZyB0b29sdGlwdGV4dFxyXG4gICAgdGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnk7IHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xyXG4gICAgdGltZXBpY2tlclRpbWV6b25lID0gbW9tZW50LnR6Lmd1ZXNzKHRydWUpO1xyXG4gICAgdGltZXBpY2tlckxpc3Rab25lcyA9IG1vbWVudC50ei5uYW1lcygpO1xyXG4gICAgZGF0ZXJhbmdlcGlja2VyOiB7IHN0YXJ0OiBGb3JtQ29udHJvbDsgZW5kOiBGb3JtQ29udHJvbCB9ID0geyBzdGFydDogbmV3IEZvcm1Db250cm9sKCksIGVuZDogbmV3IEZvcm1Db250cm9sKCkgfTtcclxuICAgIGZyb21Nb250aENvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICAgIGZyb21ZZWFyQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xyXG4gICAgdG9Nb250aENvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICAgIHRvWWVhckNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcclxuICAgIHBhcnNlZFRpbWVab25lczogYW55O1xyXG4gICAgYXBwbHlCdG46IHsgZGlzYWJsZWQ6IGJvb2xlYW4gfSA9IHsgZGlzYWJsZWQ6IGZhbHNlIH07XHJcbiAgICBzb3J0VmFsdWU6IHN0cmluZztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBlbmREYXRlID0gbW9tZW50KCkuZW5kT2YoJ2RheScpO1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XHJcbiAgICAvLyB1c2VkIGluIHRlbXBsYXRlIGZvciBjb21waWxlIHRpbWUgc3VwcG9ydCBvZiBlbnVtIHZhbHVlcy5cclxuICAgIHNpZGVFbnVtID0gU2lkZUVudW07XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50ID0gbnVsbDtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBtYXhEYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgYXV0b0FwcGx5ID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2luZ2xlRGF0ZVBpY2tlciA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dEcm9wZG93bnMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93V2Vla051bWJlcnMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93SVNPV2Vla051bWJlcnMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBsaW5rZWRDYWxlbmRhcnMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBhdXRvVXBkYXRlSW5wdXQgPSB0cnVlO1xyXG4gICAgQElucHV0KClcclxuICAgIGFsd2F5c1Nob3dDYWxlbmRhcnMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBtYXhTcGFuID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbG9ja1N0YXJ0RGF0ZSA9IGZhbHNlO1xyXG4gICAgLy8gdGltZXBpY2tlciB2YXJpYWJsZXNcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VyID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgdGltZVBpY2tlcjI0SG91ciA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVQaWNrZXJJbmNyZW1lbnQgPSAxO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVQaWNrZXJTZWNvbmRzID0gZmFsc2U7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVJbnB1dCA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVab25lID0gZmFsc2U7XHJcbiAgICAvLyBlbmQgb2YgdGltZXBpY2tlciB2YXJpYWJsZXNcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93Q2xlYXJCdXR0b24gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZyA9IG51bGw7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgZmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgQElucHV0KClcclxuICAgIGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICBfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcclxuICAgIC8vIGN1c3RvbSByYW5nZXNcclxuICAgIF9yYW5nZXM6IGFueSA9IHt9O1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93Q2FuY2VsID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAga2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dSYW5nZUxhYmVsT25JbnB1dCA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIGN1c3RvbVJhbmdlRGlyZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgY2hvc2VuUmFuZ2U6IHN0cmluZztcclxuICAgIHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBub3dIb3ZlcmVkRGF0ZSA9IG51bGw7XHJcbiAgICBwaWNraW5nRGF0ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIHNvbWUgc3RhdGUgaW5mb3JtYXRpb25cclxuICAgIGlzU2hvd246IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGlubGluZSA9IHRydWU7XHJcbiAgICBsZWZ0Q2FsZW5kYXI6IHsgbW9udGg6IF9tb21lbnQuTW9tZW50OyBjYWxlbmRhcj86IF9tb21lbnQuTW9tZW50W11bXSB9ID0geyBtb250aDogbnVsbCB9O1xyXG4gICAgcmlnaHRDYWxlbmRhcjogeyBtb250aDogX21vbWVudC5Nb21lbnQ7IGNhbGVuZGFyPzogX21vbWVudC5Nb21lbnRbXVtdIH0gPSB7IG1vbnRoOiBudWxsIH07XHJcbiAgICBzaG93Q2FsSW5SYW5nZXM6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xyXG5cclxuICAgIEBPdXRwdXQoKSBjaG9zZW5EYXRlOiBFdmVudEVtaXR0ZXI8eyBjaG9zZW5MYWJlbDogc3RyaW5nOyBzdGFydERhdGU6IF9tb21lbnQuTW9tZW50OyBlbmREYXRlOiBfbW9tZW50Lk1vbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IGxhYmVsOiBzdHJpbmc7IGRhdGVzOiBbX21vbWVudC5Nb21lbnQsIF9tb21lbnQuTW9tZW50XSB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjx7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQ7IGVuZERhdGU6IF9tb21lbnQuTW9tZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx7IGVuZERhdGU6IF9tb21lbnQuTW9tZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIGNsb3NlRGF0ZVJhbmdlUGlja2VyOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgQFZpZXdDaGlsZCgncGlja2VyQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgcGlja2VyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xyXG5cclxuICAgIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNJbnZhbGlkRGF0ZShkYXRlOiBfbW9tZW50Lk1vbWVudCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIEBJbnB1dCgpXHJcbiAgICBpc0N1c3RvbURhdGUoZGF0ZTogX21vbWVudC5Nb21lbnQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNUb29sdGlwRGF0ZShkYXRlOiBfbW9tZW50Lk1vbWVudCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgLyogY2hhbmdlZCBtb21lbnQgdG8gbmV3IHRpbWV6b25lICovXHJcbiAgICAgICAgbW9tZW50LnR6LnNldERlZmF1bHQodGhpcy50aW1lcGlja2VyVGltZXpvbmUpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBUaW1lWm9uZXMoKTtcclxuICAgICAgICB0aGlzLmZyb21Nb250aENvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKG1vbnRoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubW9udGhDaGFuZ2VkKG1vbnRoLCBTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5mcm9tWWVhckNvbnRyb2wudmFsdWVDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKHllYXIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy55ZWFyQ2hhbmdlZCh5ZWFyLCBTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50b01vbnRoQ29udHJvbC52YWx1ZUNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgobW9udGgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5tb250aENoYW5nZWQobW9udGgsIFNpZGVFbnVtLnJpZ2h0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50b1llYXJDb250cm9sLnZhbHVlQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCh5ZWFyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMueWVhckNoYW5nZWQoeWVhciwgU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9idWlsZExvY2FsZSgpO1xyXG4gICAgICAgIGNvbnN0IGRheXNPZldlZWsgPSBbLi4udGhpcy5sb2NhbGUuZGF5c09mV2Vla107XHJcbiAgICAgICAgdGhpcy5sb2NhbGUuZmlyc3REYXkgPSB0aGlzLmxvY2FsZS5maXJzdERheSAlIDc7XHJcbiAgICAgICAgaWYgKHRoaXMubG9jYWxlLmZpcnN0RGF5ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xyXG5cclxuICAgICAgICAgICAgd2hpbGUgKGl0ZXJhdG9yID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZGF5c09mV2Vlay5wdXNoKGRheXNPZldlZWsuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVyYXRvci0tO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9jYWxlLmRheXNPZldlZWsgPSBkYXlzT2ZXZWVrO1xyXG4gICAgICAgIGlmICh0aGlzLmlubGluZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vbGQuc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuZW5kRGF0ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJSYW5nZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJSYW5nZXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5yYW5nZXNBcnJheSA9IFtdO1xyXG4gICAgICAgIGxldCBzdGFydCwgZW5kO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJhbmdlc1tyYW5nZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucmFuZ2VzW3JhbmdlXVswXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzBdLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXNbcmFuZ2VdWzFdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzFdLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgc3RhcnQgb3IgZW5kIGRhdGUgZXhjZWVkIHRob3NlIGFsbG93ZWQgYnkgdGhlIG1pbkRhdGUgb3IgbWF4U3BhblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMsIHNob3J0ZW4gdGhlIHJhbmdlIHRvIHRoZSBhbGxvd2FibGUgcGVyaW9kLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgc3RhcnQuaXNCZWZvcmUodGhpcy5taW5EYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXhTcGFuICYmIG1heERhdGUgJiYgc3RhcnQuY2xvbmUoKS5hZGQodGhpcy5tYXhTcGFuKS5pc0FmdGVyKG1heERhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heERhdGUgPSBzdGFydC5jbG9uZSgpLmFkZCh0aGlzLm1heFNwYW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF4RGF0ZSAmJiBlbmQuaXNBZnRlcihtYXhEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBtYXhEYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbmQgb2YgdGhlIHJhbmdlIGlzIGJlZm9yZSB0aGUgbWluaW11bSBvciB0aGUgc3RhcnQgb2YgdGhlIHJhbmdlIGlzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1heGltdW0sIGRvbid0IGRpc3BsYXkgdGhpcyByYW5nZSBvcHRpb24gYXQgYWxsLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMubWluRGF0ZSAmJiBlbmQuaXNCZWZvcmUodGhpcy5taW5EYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKG1heERhdGUgJiYgc3RhcnQuaXNBZnRlcihtYXhEYXRlLCB0aGlzLnRpbWVQaWNrZXIgPyAnbWludXRlJyA6ICdkYXknKSlcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByYW5nZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZUh0bWwgPSBlbGVtLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzW3JhbmdlSHRtbF0gPSBbc3RhcnQsIGVuZF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VzW3JhbmdlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaChyYW5nZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaCh0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICF0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCB8fCB0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnM7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdyb3VwVGltZVpvbmVzKCkge1xyXG4gICAgICAgIGNvbnN0IHRpbWVab25lQ29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy50aW1lcGlja2VyTGlzdFpvbmVzKSk7XHJcbiAgICAgICAgY29uc3QgbGlzdFRpbWVab25lcyA9IHtcclxuICAgICAgICAgIEFmcmljYTogW10sXHJcbiAgICAgICAgICBBdXN0cmFsaWE6IFtdLFxyXG4gICAgICAgICAgRXVyb3BlOiBbXSxcclxuICAgICAgICAgIEFtZXJpY2E6IFtdLFxyXG4gICAgICAgICAgUGFjaWZpYzogW10sXHJcbiAgICAgICAgICBFVEM6IFtdXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aW1lWm9uZUNvcHkuZm9yRWFjaCh0aW1lWm9uZSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJzZWRUaW1lWm9uZVJlZ2lvbiAgPSB0aW1lWm9uZS5zdWJzdHIoMCwgdGltZVpvbmUuaW5kZXhPZignLycpKTtcclxuXHJcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlzdFRpbWVab25lcykuc29tZShyZWdpb24gPT4gcmVnaW9uID09PSBwYXJzZWRUaW1lWm9uZVJlZ2lvbikpIHtcclxuICAgICAgICAgICAgbGlzdFRpbWVab25lc1twYXJzZWRUaW1lWm9uZVJlZ2lvbl0ucHVzaCh0aW1lWm9uZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0VGltZVpvbmVzWydFVEMnXS5wdXNoKHRpbWVab25lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBhcnNlZFRpbWVab25lcyA9IGxpc3RUaW1lWm9uZXM7XHJcbiAgICB9XHJcbiAgICBzZXRUb05vdyh0aW1lKSB7XHJcbiAgICAgICAgaWYgKHRpbWUgPT09ICdzdGFydCcpIHtcclxuICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXMubGVmdC5zZWxlY3RlZEhvdXIgPSB0aGlzLnRpbWVQaWNrZXIyNEhvdXIgPyBtb21lbnQoKS5mb3JtYXQoJ2gnKSA6IG1vbWVudCgpLmZvcm1hdCgnSCcpO1xyXG4gICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlcy5sZWZ0LnNlbGVjdGVkTWludXRlID0gbW9tZW50KCkuZm9ybWF0KCdtJyk7XHJcbiAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzLmxlZnQuc2VsZWN0ZWRTZWNvbmQgPSBtb21lbnQoKS5mb3JtYXQoJ3MnKTtcclxuICAgICAgICAgICB0aGlzLnNldFN0YXJ0RGF0ZSh0aGlzLl9nZXREYXRlV2l0aFRpbWUobW9tZW50KCksIHRoaXMuc2lkZUVudW0ubGVmdCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGltZSA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzLmxlZnQuc2VsZWN0ZWRIb3VyID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gbW9tZW50KCkuZm9ybWF0KCdoJykgOiBtb21lbnQoKS5mb3JtYXQoJ0gnKTtcclxuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzLmxlZnQuc2VsZWN0ZWRNaW51dGUgPSBtb21lbnQoKS5mb3JtYXQoJ20nKTtcclxuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzLmxlZnQuc2VsZWN0ZWRTZWNvbmQgPSBtb21lbnQoKS5mb3JtYXQoJ3MnKTtcclxuICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKG1vbWVudCgpLCB0aGlzLnNpZGVFbnVtLmxlZnQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyVGltZVBpY2tlcihzaWRlOiBTaWRlRW51bSkge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZCwgbWluRGF0ZTtcclxuICAgICAgICBjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xyXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XHJcbiAgICAgICAgICAgIChzZWxlY3RlZCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkpLCAobWluRGF0ZSA9IHRoaXMubWluRGF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzaWRlID09PSBTaWRlRW51bS5yaWdodCAmJiB0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgKHNlbGVjdGVkID0gdGhpcy5lbmREYXRlLmNsb25lKCkpLCAobWluRGF0ZSA9IHRoaXMuc3RhcnREYXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHNpZGUgPT09IFNpZGVFbnVtLnJpZ2h0ICYmICF0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgLy8gZG9uJ3QgaGF2ZSBhbiBlbmQgZGF0ZSwgdXNlIHRoZSBzdGFydCBkYXRlIHRoZW4gcHV0IHRoZSBzZWxlY3RlZCB0aW1lIGZvciB0aGUgcmlnaHQgc2lkZSBhcyB0aGUgdGltZVxyXG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuX2dldERhdGVXaXRoVGltZSh0aGlzLnN0YXJ0RGF0ZSwgU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7IC8vIHNldCBpdCBiYWNrIHRvIHRoZSBzdGFydCBkYXRlIHRoZSB0aW1lIHdhcyBiYWNrd2FyZHNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtaW5EYXRlID0gdGhpcy5zdGFydERhdGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gJzAnIDogJzEnO1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/ICcyMycgOiAnMTInO1xyXG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXSA9IHtcclxuICAgICAgICAgICAgaG91cnM6IFtdLFxyXG4gICAgICAgICAgICBtaW51dGVzOiBbXSxcclxuICAgICAgICAgICAgbWludXRlc0xhYmVsOiBbXSxcclxuICAgICAgICAgICAgc2Vjb25kczogW10sXHJcbiAgICAgICAgICAgIHNlY29uZHNMYWJlbDogW10sXHJcbiAgICAgICAgICAgIGRpc2FibGVkSG91cnM6IFtdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZE1pbnV0ZXM6IFtdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZFNlY29uZHM6IFtdLFxyXG4gICAgICAgICAgICBzZWxlY3RlZEhvdXI6IDAsXHJcbiAgICAgICAgICAgIHNlbGVjdGVkTWludXRlOiAwLFxyXG4gICAgICAgICAgICBzZWxlY3RlZFNlY29uZDogMCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIgICA9IHNlbGVjdGVkLmhvdXIoKTtcclxuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSBzZWxlY3RlZC5taW51dGUoKTtcclxuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBzZWxlY3RlZC5zZWNvbmQoKTtcclxuXHJcbiAgICAgICAgLy8gZ2VuZXJhdGUgQU0vUE1cclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xyXG4gICAgICAgICAgICBpZiAobWluRGF0ZSAmJiBzZWxlY3RlZC5jbG9uZSgpLmhvdXIoMTIpLm1pbnV0ZSgwKS5zZWNvbmQoMCkuaXNCZWZvcmUobWluRGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbURpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgc2VsZWN0ZWQuY2xvbmUoKS5ob3VyKDApLm1pbnV0ZSgwKS5zZWNvbmQoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnBtRGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZC5ob3VyKCkgPj0gMTIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnUE0nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdBTSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkID0gc2VsZWN0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQ2FsZW5kYXIoc2lkZTogU2lkZUVudW0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBtYWluQ2FsZW5kYXIgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIgOiB0aGlzLnJpZ2h0Q2FsZW5kYXI7XHJcbiAgICAgICAgY29uc3QgbW9udGggPSBtYWluQ2FsZW5kYXIubW9udGgubW9udGgoKTtcclxuICAgICAgICBjb25zdCB5ZWFyID0gbWFpbkNhbGVuZGFyLm1vbnRoLnllYXIoKTtcclxuICAgICAgICBjb25zdCBob3VyID0gbWFpbkNhbGVuZGFyLm1vbnRoLmhvdXIoKTtcclxuICAgICAgICBjb25zdCBtaW51dGUgPSBtYWluQ2FsZW5kYXIubW9udGgubWludXRlKCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kID0gbWFpbkNhbGVuZGFyLm1vbnRoLnNlY29uZCgpO1xyXG4gICAgICAgIGNvbnN0IGRheXNJbk1vbnRoID0gbW9tZW50KFt5ZWFyLCBtb250aF0pLmRheXNJbk1vbnRoKCk7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCAxXSk7XHJcbiAgICAgICAgY29uc3QgbGFzdERheSA9IG1vbWVudChbeWVhciwgbW9udGgsIGRheXNJbk1vbnRoXSk7XHJcbiAgICAgICAgY29uc3QgbGFzdE1vbnRoID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpO1xyXG4gICAgICAgIGNvbnN0IGxhc3RZZWFyID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCk7XHJcbiAgICAgICAgY29uc3QgZGF5c0luTGFzdE1vbnRoID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoXSkuZGF5c0luTW9udGgoKTtcclxuICAgICAgICBjb25zdCBkYXlPZldlZWsgPSBmaXJzdERheS5kYXkoKTtcclxuICAgICAgICAvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcclxuICAgICAgICBjb25zdCBjYWxlbmRhcjogYW55ID0gW107XHJcbiAgICAgICAgY2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcclxuICAgICAgICBjYWxlbmRhci5sYXN0RGF5ID0gbGFzdERheTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgICAgY2FsZW5kYXJbaV0gPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGRhdGUgb2JqZWN0c1xyXG4gICAgICAgIGxldCBzdGFydERheSA9IGRheXNJbkxhc3RNb250aCAtIGRheU9mV2VlayArIHRoaXMubG9jYWxlLmZpcnN0RGF5ICsgMTtcclxuICAgICAgICBpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcclxuICAgICAgICAgICAgc3RhcnREYXkgLT0gNztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlPZldlZWsgPT09IHRoaXMubG9jYWxlLmZpcnN0RGF5KSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gNjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjdXJEYXRlID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoLCBzdGFydERheSwgMTIsIG1pbnV0ZSwgc2Vjb25kXSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBjb2wgPSAwLCByb3cgPSAwOyBpIDwgNDI7IGkrKywgY29sKyssIGN1ckRhdGUgPSBtb21lbnQoY3VyRGF0ZSkuYWRkKDI0LCAnaG91cicpKSB7XHJcbiAgICAgICAgICAgIGlmIChpID4gMCAmJiBjb2wgJSA3ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb2wgPSAwO1xyXG4gICAgICAgICAgICAgICAgcm93Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gY3VyRGF0ZS5jbG9uZSgpLmhvdXIoaG91cikubWludXRlKG1pbnV0ZSkuc2Vjb25kKHNlY29uZCk7XHJcbiAgICAgICAgICAgIGN1ckRhdGUuaG91cigxMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1pbkRhdGUgJiZcclxuICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5taW5EYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXHJcbiAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5taW5EYXRlKSAmJlxyXG4gICAgICAgICAgICAgICAgc2lkZSA9PT0gJ2xlZnQnXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMubWF4RGF0ZSAmJlxyXG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1heERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcclxuICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiZcclxuICAgICAgICAgICAgICAgIHNpZGUgPT09ICdyaWdodCdcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWFrZSB0aGUgY2FsZW5kYXIgb2JqZWN0IGF2YWlsYWJsZSB0byBob3ZlckRhdGUvY2xpY2tEYXRlXHJcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBEaXNwbGF5IHRoZSBjYWxlbmRhclxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgY29uc3QgbWluRGF0ZSA9IHNpZGUgPT09ICdsZWZ0JyA/IHRoaXMubWluRGF0ZSA6IHRoaXMuc3RhcnREYXRlO1xyXG4gICAgICAgIGxldCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xyXG4gICAgICAgIC8vIGFkanVzdCBtYXhEYXRlIHRvIHJlZmxlY3QgdGhlIGRhdGVMaW1pdCBzZXR0aW5nIGluIG9yZGVyIHRvXHJcbiAgICAgICAgLy8gZ3JleSBvdXQgZW5kIGRhdGVzIGJleW9uZCB0aGUgZGF0ZUxpbWl0XHJcbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSA9PT0gbnVsbCAmJiB0aGlzLmRhdGVMaW1pdCkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXhMaW1pdCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5JykuZW5kT2YoJ2RheScpO1xyXG4gICAgICAgICAgICBpZiAoIW1heERhdGUgfHwgbWF4TGltaXQuaXNCZWZvcmUobWF4RGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIG1heERhdGUgPSBtYXhMaW1pdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXSA9IHtcclxuICAgICAgICAgICAgbW9udGgsXHJcbiAgICAgICAgICAgIHllYXIsXHJcbiAgICAgICAgICAgIGhvdXIsXHJcbiAgICAgICAgICAgIG1pbnV0ZSxcclxuICAgICAgICAgICAgc2Vjb25kLFxyXG4gICAgICAgICAgICBkYXlzSW5Nb250aCxcclxuICAgICAgICAgICAgZmlyc3REYXksXHJcbiAgICAgICAgICAgIGxhc3REYXksXHJcbiAgICAgICAgICAgIGxhc3RNb250aCxcclxuICAgICAgICAgICAgbGFzdFllYXIsXHJcbiAgICAgICAgICAgIGRheXNJbkxhc3RNb250aCxcclxuICAgICAgICAgICAgZGF5T2ZXZWVrLFxyXG4gICAgICAgICAgICAvLyBvdGhlciB2YXJzXHJcbiAgICAgICAgICAgIGNhbFJvd3M6IEFycmF5LmZyb20oQXJyYXkoNikua2V5cygpKSxcclxuICAgICAgICAgICAgY2FsQ29sczogQXJyYXkuZnJvbShBcnJheSg3KS5rZXlzKCkpLFxyXG4gICAgICAgICAgICBjbGFzc2VzOiB7fSxcclxuICAgICAgICAgICAgbWluRGF0ZSxcclxuICAgICAgICAgICAgbWF4RGF0ZSxcclxuICAgICAgICAgICAgY2FsZW5kYXIsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAodGhpcy5zaG93RHJvcGRvd25zKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY2FsZW5kYXJbMV1bMV0ueWVhcigpO1xyXG4gICAgICAgICAgICBjb25zdCByZWFsQ3VycmVudFllYXIgPSBtb21lbnQoKS55ZWFyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1heFllYXIgPSAobWF4RGF0ZSAmJiBtYXhEYXRlLnllYXIoKSkgfHwgcmVhbEN1cnJlbnRZZWFyICsgNTtcclxuICAgICAgICAgICAgY29uc3QgbWluWWVhciA9IChtaW5EYXRlICYmIG1pbkRhdGUueWVhcigpKSB8fCByZWFsQ3VycmVudFllYXIgLSA1MDtcclxuICAgICAgICAgICAgY29uc3QgaW5NaW5ZZWFyID0gY3VycmVudFllYXIgPT09IG1pblllYXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGluTWF4WWVhciA9IGN1cnJlbnRZZWFyID09PSBtYXhZZWFyO1xyXG4gICAgICAgICAgICBjb25zdCB5ZWFycyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gbWluWWVhcjsgeSA8PSBtYXhZZWFyOyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHllYXJzLnB1c2goeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TW9udGg6IGN1cnJlbnRNb250aCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRZZWFyOiBjdXJyZW50WWVhcixcclxuICAgICAgICAgICAgICAgIG1heFllYXI6IG1heFllYXIsXHJcbiAgICAgICAgICAgICAgICBtaW5ZZWFyOiBtaW5ZZWFyLFxyXG4gICAgICAgICAgICAgICAgaW5NaW5ZZWFyOiBpbk1pblllYXIsXHJcbiAgICAgICAgICAgICAgICBpbk1heFllYXI6IGluTWF4WWVhcixcclxuICAgICAgICAgICAgICAgIG1vbnRoQXJyYXlzOiBBcnJheS5mcm9tKEFycmF5KDEyKS5rZXlzKCkpLFxyXG4gICAgICAgICAgICAgICAgeWVhckFycmF5czogeWVhcnMsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mcm9tTW9udGhDb250cm9sLnNldFZhbHVlKGN1cnJlbnRNb250aCwgeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mcm9tWWVhckNvbnRyb2wuc2V0VmFsdWUoY3VycmVudFllYXIsIHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaWRlID09PSBTaWRlRW51bS5yaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b01vbnRoQ29udHJvbC5zZXRWYWx1ZShjdXJyZW50TW9udGgsIHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9ZZWFyQ29udHJvbC5zZXRWYWx1ZShjdXJyZW50WWVhciwgeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlKTtcclxuICAgIH1cclxuICAgIHNldFN0YXJ0RGF0ZShzdGFydERhdGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdGFydERhdGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2luZ0RhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudChzdGFydERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tpbmdEYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5taW5EYXRlICYmIHRoaXMuc3RhcnREYXRlLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLm1pbkRhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5zdGFydERhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5mbG9vcih0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNTaG93bikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoeyBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RW5kRGF0ZShlbmREYXRlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGVuZERhdGUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2luZ0RhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tpbmdEYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZS5hZGQoMSwgJ2QnKS5zdGFydE9mKCdkYXknKS5zdWJ0cmFjdCgxLCAnc2Vjb25kJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUubWludXRlKE1hdGgucm91bmQodGhpcy5lbmREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbmREYXRlLmlzQmVmb3JlKHRoaXMuc3RhcnREYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLmVuZERhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZGF0ZUxpbWl0ICYmIHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0LCAnZGF5JykuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcclxuICAgICAgICAgICAgLy8gdGhpcy51cGRhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdCh7IGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVNb250aHNJblZpZXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICAvLyBpZiBib3RoIGRhdGVzIGFyZSB2aXNpYmxlIGFscmVhZHksIGRvIG5vdGhpbmdcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggJiZcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCAmJlxyXG4gICAgICAgICAgICAgICAgKCh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmxlZnRDYWxlbmRhciAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuc3RhcnREYXRlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhciAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSkgJiZcclxuICAgICAgICAgICAgICAgICh0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMubGlua2VkQ2FsZW5kYXJzICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuZW5kRGF0ZS5tb250aCgpICE9PSB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpIHx8IHRoaXMuZW5kRGF0ZS55ZWFyKCkgIT09IHRoaXMuc3RhcnREYXRlLnllYXIoKSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpLmRhdGUoMik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJylcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLmxpbmtlZENhbGVuZGFycyAmJiAhdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA+IHRoaXMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGUuY2xvbmUoKS5kYXRlKDIpO1xyXG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpLmRhdGUoMikuc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIFRoaXMgaXMgcmVzcG9uc2libGUgZm9yIHVwZGF0aW5nIHRoZSBjYWxlbmRhcnNcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQ2FsZW5kYXJzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlRWxlbWVudCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBmb3JtYXQgPSB0aGlzLmxvY2FsZS5kaXNwbGF5Rm9ybWF0ID8gdGhpcy5sb2NhbGUuZGlzcGxheUZvcm1hdCA6IHRoaXMubG9jYWxlLmZvcm1hdDtcclxuICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLmF1dG9VcGRhdGVJbnB1dCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB3ZSB1c2UgcmFuZ2VzIGFuZCBzaG91bGQgc2hvdyByYW5nZSBsYWJlbCBvbiBpbnB1dFxyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgPT09IHRydWUgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCAhPT0gdGhpcy5jaG9zZW5SYW5nZVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuY2hvc2VuUmFuZ2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KSArIHRoaXMubG9jYWxlLnNlcGFyYXRvciArIHRoaXMuZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvVXBkYXRlSW5wdXQpIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHRoaXMgc2hvdWxkIGNhbGN1bGF0ZSB0aGUgbGFiZWxcclxuICAgICAqL1xyXG4gICAgY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmxvY2FsZSB8fCAhdGhpcy5sb2NhbGUuc2VwYXJhdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkTG9jYWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjdXN0b21SYW5nZSA9IHRydWU7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VzW3JhbmdlXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/ICdZWVlZLU1NLUREIEhIOm1tOnNzJyA6ICdZWVlZLU1NLUREIEhIOm1tJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIHNlY29uZHMgaXMgbm90IGVuYWJsZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHRoaXMucmFuZ2VzW3JhbmdlXVswXS5mb3JtYXQoZm9ybWF0KSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KGZvcm1hdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21SYW5nZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMucmFuZ2VzQXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSB0aW1lcyB3aGVuIGNvbXBhcmluZyBkYXRlcyBpZiB0aW1lIHBpY2tlciBpcyBub3QgZW5hYmxlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzBdLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMucmFuZ2VzW3JhbmdlXVsxXS5mb3JtYXQoJ1lZWVktTU0tREQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY3VzdG9tUmFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNob3dDdXN0b21SYW5nZUxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaWYgY3VzdG9tIGxhYmVsOiBzaG93IGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsaWNrQXBwbHkoZT8pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiAhdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZSh0aGlzLnN0YXJ0RGF0ZSwgU2lkZUVudW0ucmlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgLy8gZ2V0IGlmIHRoZXJlIGFyZSBpbnZhbGlkIGRhdGUgYmV0d2VlbiByYW5nZVxyXG4gICAgICAgICAgICBjb25zdCBkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgd2hpbGUgKGQuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZShkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IGQuc3VidHJhY3QoMSwgJ2RheXMnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkLmFkZCgxLCAnZGF5cycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5jaG9zZW5MYWJlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob3NlbkRhdGUuZW1pdCh7IGNob3NlbkxhYmVsOiB0aGlzLmNob3NlbkxhYmVsLCBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLCBlbmREYXRlOiB0aGlzLmVuZERhdGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlIH0pO1xyXG4gICAgICAgIGlmIChlIHx8ICh0aGlzLmNsb3NlT25BdXRvQXBwbHkgJiYgIWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGlja0NhbmNlbCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydDtcclxuICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kO1xyXG4gICAgICAgIGlmICh0aGlzLmlubGluZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjYWxsZWQgd2hlbiBtb250aCBpcyBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0gbW9udGggbW9udGggcmVwcmVzZW50ZWQgYnkgYSBudW1iZXIgKDAgdGhyb3VnaCAxMSlcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgbW9udGhDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHNpZGU6IFNpZGVFbnVtKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeWVhciA9IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRZZWFyO1xyXG4gICAgICAgIHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGxlZCB3aGVuIHllYXIgaXMgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIHllYXIgeWVhciByZXByZXNlbnRlZCBieSBhIG51bWJlclxyXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG4gICAgICovXHJcbiAgICB5ZWFyQ2hhbmdlZCh5ZWFyOiBudW1iZXIsIHNpZGU6IFNpZGVFbnVtKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgbW9udGggPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGg7XHJcbiAgICAgICAgdGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIHdoZW4gdGltZSBpcyBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgKi9cclxuICAgIHRpbWVDaGFuZ2VkKHNpZGU6IFNpZGVFbnVtKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XHJcbiAgICAgICAgY29uc3Qgc2Vjb25kID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCwgMTApIDogMDtcclxuICAgICAgICBjb25zb2xlLmxvZyhtaW51dGUpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xyXG4gICAgICAgICAgICBjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcclxuICAgICAgICAgICAgaWYgKGFtcG0gPT09ICdQTScgJiYgaG91ciA8IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBzdGFydC5ob3VyKGhvdXIpO1xyXG4gICAgICAgICAgICBzdGFydC5taW51dGUobWludXRlKTtcclxuICAgICAgICAgICAgc3RhcnQuc2Vjb25kKHNlY29uZCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKHN0YXJ0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSBzdGFydC5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJiB0aGlzLmVuZERhdGUuaXNCZWZvcmUoc3RhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVuZERhdGUoc3RhcnQuY2xvbmUoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZW5kRGF0ZSAmJiB0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q2xvbmUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoc3RhcnQsIFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRDbG9uZS5pc0JlZm9yZShzdGFydCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbU2lkZUVudW0ucmlnaHRdLnNlbGVjdGVkSG91ciA9IGhvdXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW1NpZGVFbnVtLnJpZ2h0XS5zZWxlY3RlZE1pbnV0ZSA9IG1pbnV0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbU2lkZUVudW0ucmlnaHRdLnNlbGVjdGVkU2Vjb25kID0gc2Vjb25kO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgICAgIGVuZC5ob3VyKGhvdXIpO1xyXG4gICAgICAgICAgICBlbmQubWludXRlKG1pbnV0ZSk7XHJcbiAgICAgICAgICAgIGVuZC5zZWNvbmQoc2Vjb25kKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKGVuZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblxyXG4gICAgICAgIC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcclxuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIHdoZW4gdGltZVpvbmUgaXMgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIHRpbWVFdmVudCAgYW4gZXZlbnRcclxuICAgICAqL1xyXG4gICAgdGltZVpvbmVDaGFuZ2VkKHRpbWVFdmVudDogYW55KSB7XHJcbiAgICAgICAgLyogY2hhbmdlZCBtb21lbnQgdG8gbmV3IHRpbWV6b25lICovXHJcbiAgICAgICAgbW9tZW50LnR6LnNldERlZmF1bHQodGhpcy50aW1lcGlja2VyVGltZXpvbmUpO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxyXG4gICAgICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgYWxsIGVtZW1uZXRzXHJcbiAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIC8vIHJlLXJlbmRlciB0aGUgdGltZSBwaWNrZXJzIGJlY2F1c2UgY2hhbmdpbmcgb25lIHNlbGVjdGlvbiBjYW4gYWZmZWN0IHdoYXQncyBlbmFibGVkIGluIGFub3RoZXJcclxuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogIGNhbGwgd2hlbiBtb250aCBvciB5ZWFyIGNoYW5nZWRcclxuICAgICAqIEBwYXJhbSBtb250aCBtb250aCBudW1iZXIgMCAtMTFcclxuICAgICAqIEBwYXJhbSB5ZWFyIHllYXIgZWc6IDE5OTVcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqL1xyXG4gICAgbW9udGhPclllYXJDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlciwgc2lkZTogU2lkZUVudW0pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpc0xlZnQgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0O1xyXG5cclxuICAgICAgICBpZiAoIWlzTGVmdCkge1xyXG4gICAgICAgICAgICBpZiAoeWVhciA8IHRoaXMuc3RhcnREYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5zdGFydERhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5zdGFydERhdGUubW9udGgoKSkpIHtcclxuICAgICAgICAgICAgICAgIG1vbnRoID0gdGhpcy5zdGFydERhdGUubW9udGgoKTtcclxuICAgICAgICAgICAgICAgIHllYXIgPSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1pbkRhdGUpIHtcclxuICAgICAgICAgICAgaWYgKHllYXIgPCB0aGlzLm1pbkRhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLm1pbkRhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5taW5EYXRlLm1vbnRoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMubWluRGF0ZS5tb250aCgpO1xyXG4gICAgICAgICAgICAgICAgeWVhciA9IHRoaXMubWluRGF0ZS55ZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1heERhdGUpIHtcclxuICAgICAgICAgICAgaWYgKHllYXIgPiB0aGlzLm1heERhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLm1heERhdGUueWVhcigpICYmIG1vbnRoID4gdGhpcy5tYXhEYXRlLm1vbnRoKCkpKSB7XHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMubWF4RGF0ZS5tb250aCgpO1xyXG4gICAgICAgICAgICAgICAgeWVhciA9IHRoaXMubWF4RGF0ZS55ZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXIgPSB5ZWFyO1xyXG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aCA9IG1vbnRoO1xyXG4gICAgICAgIGlmIChpc0xlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgubW9udGgobW9udGgpLnllYXIoeWVhcik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgobW9udGgpLnllYXIoeWVhcik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xpY2sgb24gcHJldmlvdXMgbW9udGhcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHQgY2FsZW5kYXJcclxuICAgICAqL1xyXG4gICAgY2xpY2tQcmV2KHNpZGU6IFNpZGVFbnVtKSB7XHJcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xpY2sgb24gbmV4dCBtb250aFxyXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxyXG4gICAgICovXHJcbiAgICBjbGlja05leHQoc2lkZTogU2lkZUVudW0pOiB2b2lkIHtcclxuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xyXG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gaG92ZXJpbmcgYSBkYXRlXHJcbiAgICAgKiBAcGFyYW0gZSBldmVudDogZ2V0IHZhbHVlIGJ5IGUudGFyZ2V0LnZhbHVlXHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgKiBAcGFyYW0gcm93IHJvdyBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcclxuICAgICAqIEBwYXJhbSBjb2wgY29sIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxyXG4gICAgICovXHJcbiAgICBob3ZlckRhdGUoZSwgc2lkZTogU2lkZUVudW0sIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGxlZnRDYWxEYXRlID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlcy5sZWZ0LmNhbGVuZGFyW3Jvd11bY29sXTtcclxuICAgICAgICBjb25zdCByaWdodENhbERhdGUgPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzLnJpZ2h0LmNhbGVuZGFyW3Jvd11bY29sXTtcclxuICAgICAgICBpZiAodGhpcy5waWNraW5nRGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBob3ZlckRhdGUgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gbGVmdENhbERhdGUgOiByaWdodENhbERhdGU7XHJcbiAgICAgICAgICAgIHRoaXMubm93SG92ZXJlZERhdGUgPSB0aGlzLl9pc0RhdGVSYW5nZUludmFsaWQoaG92ZXJEYXRlKSA/IG51bGwgOiBob3ZlckRhdGU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcCA9IHNpZGUgPT09IFNpZGVFbnVtLmxlZnQgPyB0aGlzLnRvb2x0aXB0ZXh0W2xlZnRDYWxEYXRlXSA6IHRoaXMudG9vbHRpcHRleHRbcmlnaHRDYWxEYXRlXTtcclxuICAgICAgICBpZiAodG9vbHRpcC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0b29sdGlwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIHNlbGVjdGluZyBhIGRhdGVcclxuICAgICAqIEBwYXJhbSBlIGV2ZW50OiBnZXQgdmFsdWUgYnkgZS50YXJnZXQudmFsdWVcclxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcclxuICAgICAqIEBwYXJhbSByb3cgcm93IHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxyXG4gICAgICogQHBhcmFtIGNvbCBjb2wgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgZGF0ZSBjbGlja2VkXHJcbiAgICAgKi9cclxuICAgIGNsaWNrRGF0ZShlLCBzaWRlOiBTaWRlRW51bSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdURCcpIHtcclxuICAgICAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdTUEFOJykge1xyXG4gICAgICAgICAgICBpZiAoIWUudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhdmFpbGFibGUnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBkYXRlID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXSA6IHRoaXMucmlnaHRDYWxlbmRhci5jYWxlbmRhcltyb3ddW2NvbF07XHJcblxyXG4gICAgICAgIGlmIChcclxuICAgICAgICAgICAgKHRoaXMuZW5kRGF0ZSB8fCAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IGZhbHNlKSkgJiZcclxuICAgICAgICAgICAgdGhpcy5sb2NrU3RhcnREYXRlID09PSBmYWxzZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICAvLyBwaWNraW5nIHN0YXJ0XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ubGVmdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmVuZERhdGUgJiYgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlOiBjbGlja2luZyB0aGUgc2FtZSBkYXRlIGZvciBzdGFydC9lbmQsXHJcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgdGltZSBvZiB0aGUgZW5kIGRhdGUgaXMgYmVmb3JlIHRoZSBzdGFydCBkYXRlXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBwaWNraW5nIGVuZFxyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLnJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpID09PSB0cnVlICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXJ0RGF0ZShkYXRlLmNsb25lKCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzRGF0ZVJhbmdlSW52YWxpZChkYXRlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5hdXRvQXBwbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVWaWV3KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmF1dG9BcHBseSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGlzIGlzIHRvIGNhbmNlbCB0aGUgYmx1ciBldmVudCBoYW5kbGVyIGlmIHRoZSBtb3VzZSB3YXMgaW4gb25lIG9mIHRoZSBpbnB1dHNcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIENsaWNrIG9uIHRoZSBjdXN0b20gcmFuZ2VcclxuICAgICAqIEBwYXJhbSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBjbGlja1JhbmdlKGxhYmVsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gbGFiZWw7XHJcbiAgICAgICAgaWYgKGxhYmVsID09PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93biA9IHRydWU7IC8vIHNob3cgY2FsZW5kYXJzXHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlcyA9IHRoaXMucmFuZ2VzW2xhYmVsXTtcclxuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBkYXRlc1swXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgJiYgbGFiZWwgIT09IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSBsYWJlbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICF0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCB8fCB0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnM7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7IC8vIGhpZGUgY2FsZW5kYXJzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yYW5nZUNsaWNrZWQuZW1pdCh7IGxhYmVsOiBsYWJlbCwgZGF0ZXM6IGRhdGVzIH0pO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSB8fCB0aGlzLmF1dG9BcHBseSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNsaWNrQXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5tYXhEYXRlLmlzU2FtZShkYXRlc1swXSwgJ21vbnRoJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgoZGF0ZXNbMF0ubW9udGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMF0ueWVhcigpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1swXS5tb250aCgpIC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGgueWVhcihkYXRlc1sxXS55ZWFyKCkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1swXS5tb250aCgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKGRhdGVzWzBdLnllYXIoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzIHx8IGRhdGVzWzBdLm1vbnRoKCkgPT09IGRhdGVzWzFdLm1vbnRoKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dE1vbnRoID0gZGF0ZXNbMF0uY2xvbmUoKS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChuZXh0TW9udGgubW9udGgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC55ZWFyKG5leHRNb250aC55ZWFyKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1sxXS5tb250aCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMV0ueWVhcigpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coZT8pIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Nob3duKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fb2xkLnN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuICAgICAgICB0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcbiAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xvc2VEYXRlUmFuZ2VQaWNrZXIuZW1pdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNTaG93bikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGluY29tcGxldGUgZGF0ZSBzZWxlY3Rpb24sIHJldmVydCB0byBsYXN0IHZhbHVlc1xyXG4gICAgICAgIGlmICghdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vbGQuc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5fb2xkLnN0YXJ0LmNsb25lKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX29sZC5lbmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuX29sZC5lbmQuY2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgYSBuZXcgZGF0ZSByYW5nZSB3YXMgc2VsZWN0ZWQsIGludm9rZSB0aGUgdXNlciBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgIGlmICghdGhpcy5zdGFydERhdGUuaXNTYW1lKHRoaXMuX29sZC5zdGFydCkgfHwgIXRoaXMuZW5kRGF0ZS5pc1NhbWUodGhpcy5fb2xkLmVuZCkpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy5jYWxsYmFjayh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlLCB0aGlzLmNob3NlbkxhYmVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIHBpY2tlciBpcyBhdHRhY2hlZCB0byBhIHRleHQgaW5wdXQsIHVwZGF0ZSBpdFxyXG4gICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VEYXRlUmFuZ2VQaWNrZXIuZW1pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGxlIGNsaWNrIG9uIGFsbCBlbGVtZW50IGluIHRoZSBjb21wb25lbnQsIHVzZWZ1bCBmb3Igb3V0c2lkZSBvZiBjbGlja1xyXG4gICAgICogQHBhcmFtIGUgZXZlbnRcclxuICAgICAqL1xyXG4gICAgaGFuZGxlSW50ZXJuYWxDbGljayhlKTogdm9pZCB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSB0aGUgbG9jYWxlIG9wdGlvbnNcclxuICAgICAqIEBwYXJhbSBsb2NhbGVcclxuICAgICAqL1xyXG4gICAgdXBkYXRlTG9jYWxlKGxvY2FsZSkge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGxvY2FsZSkge1xyXG4gICAgICAgICAgICBpZiAobG9jYWxlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlW2tleV0gPSBsb2NhbGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjdXN0b21SYW5nZUxhYmVsJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyUmFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxyXG4gICAgICovXHJcbiAgICBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgICAgIHRoaXMuZW5kRGF0ZSA9IG1vbWVudCgpLmVuZE9mKCdkYXknKTtcclxuICAgICAgICB0aGlzLmNob3NlbkRhdGUuZW1pdCh7IGNob3NlbkxhYmVsOiAnJywgc3RhcnREYXRlOiBudWxsLCBlbmREYXRlOiBudWxsIH0pO1xyXG4gICAgICAgIHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQoeyBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGwgfSk7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIG91dCBpZiB0aGUgc2VsZWN0ZWQgcmFuZ2Ugc2hvdWxkIGJlIGRpc2FibGVkIGlmIGl0IGRvZXNuJ3RcclxuICAgICAqIGZpdCBpbnRvIG1pbkRhdGUgYW5kIG1heERhdGUgbGltaXRhdGlvbnMuXHJcbiAgICAgKi9cclxuICAgIGRpc2FibGVSYW5nZShyYW5nZSkge1xyXG4gICAgICAgIGlmIChyYW5nZSA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJhbmdlTWFya2VycyA9IHRoaXMucmFuZ2VzW3JhbmdlXTtcclxuICAgICAgICBjb25zdCBhcmVCb3RoQmVmb3JlID0gcmFuZ2VNYXJrZXJzLmV2ZXJ5KChkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5taW5EYXRlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGUuaXNCZWZvcmUodGhpcy5taW5EYXRlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJlQm90aEFmdGVyID0gcmFuZ2VNYXJrZXJzLmV2ZXJ5KChkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBhcmVCb3RoQmVmb3JlIHx8IGFyZUJvdGhBZnRlcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGFkZCB0aW1lXHJcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2dldERhdGVXaXRoVGltZShkYXRlLCBzaWRlOiBTaWRlRW51bSk6IF9tb21lbnQuTW9tZW50IHtcclxuICAgICAgICBsZXQgaG91ciA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIsIDEwKTtcclxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xyXG4gICAgICAgICAgICBjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcclxuICAgICAgICAgICAgaWYgKGFtcG0gPT09ICdQTScgJiYgaG91ciA8IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBob3VyICs9IDEyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtaW51dGUgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUsIDEwKTtcclxuICAgICAgICBjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xyXG4gICAgICAgIHJldHVybiBkYXRlLmNsb25lKCkuaG91cihob3VyKS5taW51dGUobWludXRlKS5zZWNvbmQoc2Vjb25kKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogIGJ1aWxkIHRoZSBsb2NhbGUgY29uZmlnXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xyXG4gICAgICAgIHRoaXMubG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udGhpcy5sb2NhbGUgfTtcclxuICAgICAgICBpZiAoIXRoaXMubG9jYWxlLmZvcm1hdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5mb3JtYXQgPSBtb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdsbGwnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ0wnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlOiBTaWRlRW51bSkge1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd0NsYXNzZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MgJiYgIXRoaXMuaGFzQ3VycmVudE1vbnRoRGF5cyh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1vbnRoLCBjYWxlbmRhcltyb3ddKSkge1xyXG4gICAgICAgICAgICAgICAgcm93Q2xhc3Nlcy5wdXNoKHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDc7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgdG9kYXkncyBkYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzU2FtZShuZXcgRGF0ZSgpLCAnZGF5JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ3RvZGF5Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgd2Vla2VuZHNcclxuICAgICAgICAgICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNvV2Vla2RheSgpID4gNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnd2Vla2VuZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZ3JleSBvdXQgdGhlIGRhdGVzIGluIG90aGVyIG1vbnRocyBkaXNwbGF5ZWQgYXQgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhpcyBjYWxlbmRhclxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpICE9PSBjYWxlbmRhclsxXVsxXS5tb250aCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgbGFzdCBkYXkgb2YgdGhlIHByZXZpb3VzIG1vbnRoIGluIHRoaXMgY2FsZW5kYXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSA9PT0gMCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kYXlzSW5MYXN0TW9udGhcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgbmV4dCBtb250aCBpbiB0aGlzIGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPiBjYWxlbmRhclsxXVsxXS5tb250aCgpIHx8IGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSAwKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSAxXHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgZmlyc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3NcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpcnN0TW9udGhEYXlDbGFzcyAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gY2FsZW5kYXIuZmlyc3REYXkuZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gbWFyayB0aGUgbGFzdCBkYXkgb2YgdGhlIGN1cnJlbnQgbW9udGggd2l0aCBhIGN1c3RvbSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiZcclxuICAgICAgICAgICAgICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmxhc3REYXkuZGF0ZSgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5sYXN0TW9udGhEYXlDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYmVmb3JlIHRoZSBtaW5pbXVtIGRhdGVcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlcyBhZnRlciB0aGUgbWF4aW11bSBkYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubWF4RGF0ZSwgJ2RheScpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlIGlmIGEgY3VzdG9tIGZ1bmN0aW9uIGRlY2lkZXMgaXQncyBpbnZhbGlkXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGNhbGVuZGFyW3Jvd11bY29sXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcsICdpbnZhbGlkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBoaWdobGlnaHQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBzdGFydCBkYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ3N0YXJ0LWRhdGUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVuZCBkYXRlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmREYXRlICE9IG51bGwgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2FjdGl2ZScsICdlbmQtZGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLm5vd0hvdmVyZWREYXRlICE9IG51bGwgJiYgdGhpcy5waWNraW5nRGF0ZSkgfHwgdGhpcy5lbmREYXRlICE9IG51bGwpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID4gdGhpcy5zdGFydERhdGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAoY2FsZW5kYXJbcm93XVtjb2xdIDwgdGhpcy5lbmREYXRlIHx8IChjYWxlbmRhcltyb3ddW2NvbF0gPCB0aGlzLm5vd0hvdmVyZWREYXRlICYmIHRoaXMucGlja2luZ0RhdGUpKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICFjbGFzc2VzLmZpbmQoKGVsKSA9PiBlbCA9PT0gJ29mZicpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhcHBseSBjdXN0b20gY2xhc3NlcyBmb3IgdGhpcyBkYXRlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDdXN0b20gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpc0N1c3RvbSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShjbGFzc2VzLCBpc0N1c3RvbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gYXBwbHkgY3VzdG9tIHRvb2x0aXAgZm9yIHRoaXMgZGF0ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNUb29sdGlwID0gdGhpcy5pc1Rvb2x0aXBEYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUb29sdGlwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpc1Rvb2x0aXAgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHRpcHRleHRbY2FsZW5kYXJbcm93XVtjb2xdXSA9IGlzVG9vbHRpcDsgLy8gc2V0dGluZyB0b29sdGlwdGV4dCBmb3IgY3VzdG9tIGRhdGVcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvb2x0aXB0ZXh0W2NhbGVuZGFyW3Jvd11bY29sXV0gPSAnUHV0IHRoZSB0b29sdGlwIGFzIHRoZSByZXR1cm5lZCB2YWx1ZSBvZiBpc1Rvb2x0aXBEYXRlJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbHRpcHRleHRbY2FsZW5kYXJbcm93XVtjb2xdXSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gc3RvcmUgY2xhc3NlcyB2YXJcclxuICAgICAgICAgICAgICAgIGxldCBjbmFtZSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc2VzW2ldID09PSAnZGlzYWJsZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY25hbWUgKz0gJ2F2YWlsYWJsZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XVtjb2xdID0gY25hbWUucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddLmNsYXNzTGlzdCA9IHJvd0NsYXNzZXMuam9pbignICcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmQgb3V0IGlmIHRoZSBjdXJyZW50IGNhbGVuZGFyIHJvdyBoYXMgY3VycmVudCBtb250aCBkYXlzXHJcbiAgICAgKiAoYXMgb3Bwb3NlZCB0byBjb25zaXN0aW5nIG9mIG9ubHkgcHJldmlvdXMvbmV4dCBtb250aCBkYXlzKVxyXG4gICAgICovXHJcbiAgICBoYXNDdXJyZW50TW9udGhEYXlzKGN1cnJlbnRNb250aCwgcm93KTogYm9vbGVhbiB7XHJcbiAgICAgICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHtcclxuICAgICAgICAgICAgaWYgKHJvd1tkYXldLm1vbnRoKCkgPT09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrVGltZShldmVudDogYW55LCB2YWx1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGNoYXJDb2RlID0gKGV2ZW50LndoaWNoKSA/IGV2ZW50LndoaWNoIDogZXZlbnQua2V5Q29kZTtcclxuICAgICAgICAvKiBpZiAoY2hhckNvZGUgPiAzMSAmJiAoY2hhckNvZGUgPCA0OCB8fCBjaGFyQ29kZSA+IDU3KSAmJiBjaGFyQ29kZSAhPT0gNDYgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9ICovXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQuc3JjRWxlbWVudCB8fCBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoID0gcGFyc2VJbnQodGFyZ2V0LmF0dHJpYnV0ZXNbJ21heExlbmd0aCddLnZhbHVlLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbXlMZW5ndGggPSB0YXJnZXQudmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIC8qIGlmICh0YXJnZXQudmFsdWUgPiA2MCl7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygndGVzdCcpXHJcbiAgICAgICAgICB0YXJnZXQudmFsdWUgPSAwO1xyXG4gICAgICAgIH0gKi9cclxuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXQudmFsdWUpXHJcbiAgICAgICAgaWYgKG15TGVuZ3RoID09PSBtYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LnZhbHVlID0gdGFyZ2V0LnZhbHVlLnNsaWNlKDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobXlMZW5ndGggPiBtYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgd2hlbiBhIGRhdGUgd2l0aGluIHRoZSByYW5nZSBvZiBkYXRlcyBpcyBpbnZhbGlkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2lzRGF0ZVJhbmdlSW52YWxpZChlbmREYXRlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IFtdO1xyXG4gICAgICAgIGxldCBkYXkgPSB0aGlzLnN0YXJ0RGF0ZTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8PSBlbmREYXRlKSB7XHJcbiAgICAgICAgICAgIGRheXMucHVzaChkYXkpO1xyXG4gICAgICAgICAgICBkYXkgPSBkYXkuY2xvbmUoKS5hZGQoMSwgJ2QnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXlzLnNvbWUoKGQpID0+IHRoaXMuaXNJbnZhbGlkRGF0ZShkKSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==