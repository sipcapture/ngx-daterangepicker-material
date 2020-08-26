import { Overlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, ElementRef, EventEmitter, KeyValueDiffers, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as _moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { LocaleConfig } from './daterangepicker.config';
import { LocaleService } from './locale.service';
export declare class DaterangepickerDirective implements OnInit, OnChanges, OnDestroy {
    _changeDetectorRef: ChangeDetectorRef;
    private differs;
    private _localeService;
    private elementRef;
    private overlay;
    private _onChange;
    private _onTouched;
    private _validatorChange;
    private _value;
    private overlayRef;
    private componentRef;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    autoApply: boolean;
    alwaysShowCalendars: boolean;
    showCustomRangeLabel: boolean;
    linkedCalendars: boolean;
    dateLimit: number;
    singleDatePicker: boolean;
    showWeekNumbers: boolean;
    showISOWeekNumbers: boolean;
    showDropdowns: boolean;
    showClearButton: boolean;
    customRangeDirection: boolean;
    ranges: {};
    opens: 'left' | 'center' | 'right';
    drops: 'up' | 'down';
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    keepCalendarOpeningWithRange: boolean;
    showRangeLabelOnInput: boolean;
    showCancel: boolean;
    lockStartDate: boolean;
    timePicker: boolean;
    timePicker24Hour: boolean;
    timePickerIncrement: number;
    timePickerSeconds: boolean;
    timeInput: boolean;
    timeZone: boolean;
    closeOnAutoApply: boolean;
    _locale: LocaleConfig;
    set locale(value: any);
    get locale(): any;
    private _endKey;
    private _startKey;
    notForChangesProperty: Array<string>;
    change: EventEmitter<{
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
    destroy$: Subject<unknown>;
    isInvalidDate: (date: _moment.Moment) => boolean;
    isCustomDate: (date: _moment.Moment) => boolean;
    isTooltipDate: (date: _moment.Moment) => any;
    set startKey(value: any);
    set endKey(value: any);
    get value(): any;
    set value(val: any);
    constructor(_changeDetectorRef: ChangeDetectorRef, differs: KeyValueDiffers, _localeService: LocaleService, elementRef: ElementRef, overlay: Overlay);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    onBlur(): void;
    open(): void;
    hide(): void;
    toggle(): void;
    clear(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    private setValue;
    inputChanged(e: any): void;
    calculateChosenLabel(startDate: _moment.Moment, endDate: _moment.Moment): string;
    /**
     *  build the locale config
     */
    private _buildLocale;
}
