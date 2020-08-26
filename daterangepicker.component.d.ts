import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
export declare enum SideEnum {
    left = "left",
    right = "right"
}
export declare class DaterangepickerComponent implements OnInit, OnDestroy {
    private el;
    private _ref;
    private _localeService;
    set locale(value: any);
    get locale(): any;
    set ranges(value: any);
    get ranges(): any;
    constructor(el: ElementRef, _ref: ChangeDetectorRef, _localeService: LocaleService);
    private _old;
    chosenLabel: string;
    calendarVariables: {
        left: any;
        right: any;
    };
    tooltiptext: any[];
    timepickerVariables: {
        left: any;
        right: any;
    };
    timepickerTimezone: string;
    timepickerListZones: string[];
    daterangepicker: {
        start: FormControl;
        end: FormControl;
    };
    fromMonthControl: FormControl;
    fromYearControl: FormControl;
    toMonthControl: FormControl;
    toYearControl: FormControl;
    applyBtn: {
        disabled: boolean;
    };
    startDate: _moment.Moment;
    endDate: _moment.Moment;
    dateLimit: number;
    sideEnum: typeof SideEnum;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    autoApply: boolean;
    singleDatePicker: boolean;
    showDropdowns: boolean;
    showWeekNumbers: boolean;
    showISOWeekNumbers: boolean;
    linkedCalendars: boolean;
    autoUpdateInput: boolean;
    alwaysShowCalendars: boolean;
    maxSpan: boolean;
    lockStartDate: boolean;
    timePicker: boolean;
    timePicker24Hour: boolean;
    timePickerIncrement: number;
    timePickerSeconds: boolean;
    timeInput: boolean;
    timeZone: boolean;
    showClearButton: boolean;
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    _locale: LocaleConfig;
    _ranges: any;
    showCustomRangeLabel: boolean;
    showCancel: boolean;
    keepCalendarOpeningWithRange: boolean;
    showRangeLabelOnInput: boolean;
    customRangeDirection: boolean;
    chosenRange: string;
    rangesArray: Array<any>;
    nowHoveredDate: any;
    pickingDate: boolean;
    isShown: Boolean;
    inline: boolean;
    leftCalendar: {
        month: _moment.Moment;
        calendar?: _moment.Moment[][];
    };
    rightCalendar: {
        month: _moment.Moment;
        calendar?: _moment.Moment[][];
    };
    showCalInRanges: Boolean;
    closeOnAutoApply: boolean;
    chosenDate: EventEmitter<{
        chosenLabel: string;
        startDate: _moment.Moment;
        endDate: _moment.Moment;
    }>;
    rangeClicked: EventEmitter<{
        label: string;
        dates: [_moment.Moment, _moment.Moment];
    }>;
    datesUpdated: EventEmitter<{
        startDate: _moment.Moment;
        endDate: _moment.Moment;
    }>;
    startDateChanged: EventEmitter<{
        startDate: _moment.Moment;
    }>;
    endDateChanged: EventEmitter<{
        endDate: _moment.Moment;
    }>;
    closeDateRangePicker: EventEmitter<void>;
    pickerContainer: ElementRef;
    destroy$: Subject<unknown>;
    isInvalidDate(date: _moment.Moment): boolean;
    isCustomDate(date: _moment.Moment): boolean;
    isTooltipDate(date: _moment.Moment): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    renderRanges(): void;
    renderTimePicker(side: SideEnum): void;
    renderCalendar(side: SideEnum): void;
    setStartDate(startDate: any): void;
    setEndDate(endDate: any): void;
    updateView(): void;
    updateMonthsInView(): void;
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars(): void;
    updateElement(): void;
    /**
     * this should calculate the label
     */
    calculateChosenLabel(): void;
    clickApply(e?: any): void;
    clickCancel(): void;
    /**
     * called when month is changed
     * @param month month represented by a number (0 through 11)
     * @param side left or right
     */
    monthChanged(month: number, side: SideEnum): void;
    /**
     * called when year is changed
     * @param year year represented by a number
     * @param side left or right
     */
    yearChanged(year: number, side: SideEnum): void;
    /**
     * called when time is changed
     * @param side left or right
     */
    timeChanged(side: SideEnum): void;
    /**
     * called when timeZone is changed
     * @param timeEvent  an event
     */
    timeZoneChanged(timeEvent: any): void;
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month: number, year: number, side: SideEnum): void;
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side: SideEnum): void;
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side: SideEnum): void;
    /**
     * When hovering a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    hoverDate(e: any, side: SideEnum, row: number, col: number): void;
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e: any, side: SideEnum, row: number, col: number): void;
    /**
     *  Click on the custom range
     * @param label
     */
    clickRange(label: string): void;
    show(e?: any): void;
    hide(): void;
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e: any): void;
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale: any): void;
    /**
     *  clear the daterange picker
     */
    clear(): void;
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(range: any): any;
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    private _getDateWithTime;
    /**
     *  build the locale config
     */
    private _buildLocale;
    private _buildCells;
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth: any, row: any): boolean;
    checkTime(event: any, value: any): boolean;
    /**
     * Returns true when a date within the range of dates is invalid
     */
    private _isDateRangeInvalid;
}
