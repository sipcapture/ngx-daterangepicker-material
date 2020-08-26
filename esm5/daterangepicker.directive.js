import { __assign, __decorate } from "tslib";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, Input, KeyValueDiffers, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleService } from './locale.service';
var moment = _moment;
var DaterangepickerDirective = /** @class */ (function () {
    function DaterangepickerDirective(_changeDetectorRef, differs, _localeService, elementRef, overlay) {
        this._changeDetectorRef = _changeDetectorRef;
        this.differs = differs;
        this._localeService = _localeService;
        this.elementRef = elementRef;
        this.overlay = overlay;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.dateLimit = null;
        this.ranges = {};
        this.opens = 'center';
        this.drops = 'down';
        this.showCancel = false;
        this.lockStartDate = false;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.timeInput = false;
        this.timeZone = false;
        this.closeOnAutoApply = true;
        this._locale = {};
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.notForChangesProperty = ['locale', 'endKey', 'startKey'];
        this.change = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.destroy$ = new Subject();
        this.isInvalidDate = function (date) { return false; };
        this.isCustomDate = function (date) { return false; };
        this.isTooltipDate = function (date) { return null; };
    }
    DaterangepickerDirective_1 = DaterangepickerDirective;
    Object.defineProperty(DaterangepickerDirective.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            this._locale = __assign(__assign({}, this._localeService.config), value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DaterangepickerDirective.prototype, "startKey", {
        set: function (value) {
            if (value !== null) {
                this._startKey = value;
            }
            else {
                this._startKey = 'startDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DaterangepickerDirective.prototype, "endKey", {
        set: function (value) {
            if (value !== null) {
                this._endKey = value;
            }
            else {
                this._endKey = 'endDate';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DaterangepickerDirective.prototype, "value", {
        get: function () {
            return this._value || null;
        },
        set: function (val) {
            this._value = val;
            this._onChange(val);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    DaterangepickerDirective.prototype.ngOnInit = function () {
        this._buildLocale();
    };
    DaterangepickerDirective.prototype.ngOnChanges = function (changes) {
        for (var change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.componentRef && this.notForChangesProperty.indexOf(change) === -1) {
                    this.componentRef[change] = changes[change].currentValue;
                }
            }
        }
    };
    DaterangepickerDirective.prototype.ngOnDestroy = function () {
        this.destroy$.next();
    };
    DaterangepickerDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    DaterangepickerDirective.prototype.open = function () {
        var _this = this;
        if (this.overlayRef) {
            this.hide();
        }
        var originX, overlayX;
        switch (this.opens) {
            case 'left':
                originX = 'end';
                overlayX = 'end';
                break;
            case 'center':
                originX = 'center';
                overlayX = 'center';
                break;
            case 'right':
                originX = 'start';
                overlayX = 'start';
                break;
        }
        this.overlayRef = this.overlay.create({
            backdropClass: 'cdk-overlay-transparent-backdrop',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.elementRef.nativeElement)
                .withPositions([
                {
                    offsetY: this.drops === 'up' ? 0 : 13,
                    originX: originX,
                    originY: this.drops === 'up' ? 'top' : 'bottom',
                    overlayX: overlayX,
                    overlayY: this.drops === 'up' ? 'bottom' : 'top',
                },
            ]),
        });
        var dateRangePickerPortal = new ComponentPortal(DaterangepickerComponent);
        this.componentRef = this.overlayRef.attach(dateRangePickerPortal);
        // Assign all inputs
        this.componentRef.instance.minDate = this.minDate;
        this.componentRef.instance.maxDate = this.maxDate;
        this.componentRef.instance.autoApply = this.autoApply;
        this.componentRef.instance.alwaysShowCalendars = this.alwaysShowCalendars;
        this.componentRef.instance.showCustomRangeLabel = this.showCustomRangeLabel;
        this.componentRef.instance.linkedCalendars = this.linkedCalendars;
        this.componentRef.instance.dateLimit = this.dateLimit;
        this.componentRef.instance.singleDatePicker = this.singleDatePicker;
        this.componentRef.instance.showWeekNumbers = this.showWeekNumbers;
        this.componentRef.instance.showISOWeekNumbers = this.showISOWeekNumbers;
        this.componentRef.instance.showDropdowns = this.showDropdowns;
        this.componentRef.instance.showClearButton = this.showClearButton;
        this.componentRef.instance.customRangeDirection = this.customRangeDirection;
        this.componentRef.instance.ranges = this.ranges;
        this.componentRef.instance.firstMonthDayClass = this.firstMonthDayClass;
        this.componentRef.instance.lastMonthDayClass = this.lastMonthDayClass;
        this.componentRef.instance.emptyWeekRowClass = this.emptyWeekRowClass;
        this.componentRef.instance.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.componentRef.instance.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.componentRef.instance.keepCalendarOpeningWithRange = this.keepCalendarOpeningWithRange;
        this.componentRef.instance.showRangeLabelOnInput = this.showRangeLabelOnInput;
        this.componentRef.instance.showCancel = this.showCancel;
        this.componentRef.instance.lockStartDate = this.lockStartDate;
        this.componentRef.instance.timePicker = this.timePicker;
        this.componentRef.instance.timePicker24Hour = this.timePicker24Hour;
        this.componentRef.instance.timePickerIncrement = this.timePickerIncrement;
        this.componentRef.instance.timeZone = this.timeZone;
        this.componentRef.instance.timePickerSeconds = this.timePickerSeconds;
        this.componentRef.instance.closeOnAutoApply = this.closeOnAutoApply;
        this.componentRef.instance.locale = this.locale;
        this.componentRef.instance.isInvalidDate = this.isInvalidDate;
        this.componentRef.instance.isCustomDate = this.isCustomDate;
        this.componentRef.instance.isTooltipDate = this.isTooltipDate;
        // Set the value
        this.setValue(this.value);
        var localeDiffer = this.differs.find(this.locale).create();
        if (localeDiffer) {
            var changes = localeDiffer.diff(this.locale);
            if (changes) {
                this.componentRef.instance.updateLocale(this.locale);
            }
        }
        // Subscribe to all outputs
        this.componentRef.instance.startDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (itemChanged) {
            _this.startDateChanged.emit(itemChanged);
        });
        this.componentRef.instance.endDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (itemChanged) {
            _this.endDateChanged.emit(itemChanged);
        });
        this.componentRef.instance.rangeClicked
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (range) {
            _this.rangeClicked.emit(range);
        });
        this.componentRef.instance.datesUpdated
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (range) {
            _this.datesUpdated.emit(range);
        });
        this.componentRef.instance.chosenDate
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (chosenDate) {
            var _a;
            if (chosenDate) {
                var endDate = chosenDate.endDate, startDate = chosenDate.startDate;
                _this.value = (_a = {}, _a[_this._startKey] = startDate, _a[_this._endKey] = endDate, _a);
                _this.change.emit(_this.value);
                if (typeof chosenDate.chosenLabel === 'string') {
                    _this.elementRef.nativeElement.value = chosenDate.chosenLabel;
                }
                _this.hide();
            }
        });
        this.componentRef.instance.closeDateRangePicker
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function () {
            _this.hide();
        });
        // Close the DateRangePicker when the backdrop is clicked
        this.overlayRef
            .backdropClick()
            .pipe(takeUntil(this.destroy$))
            .subscribe(function () {
            _this.hide();
        });
    };
    DaterangepickerDirective.prototype.hide = function () {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            this.componentRef = null;
        }
    };
    DaterangepickerDirective.prototype.toggle = function () {
        if (this.overlayRef) {
            this.hide();
        }
        else {
            this.open();
        }
    };
    DaterangepickerDirective.prototype.clear = function () {
        if (this.componentRef) {
            this.componentRef.instance.clear();
        }
    };
    DaterangepickerDirective.prototype.writeValue = function (value) {
        var _a, _b;
        if (_moment.isMoment(value)) {
            this.value = (_a = {}, _a[this._startKey] = value, _a);
        }
        else if (value) {
            this.value = (_b = {}, _b[this._startKey] = moment(value[this._startKey]), _b[this._endKey] = moment(value[this._endKey]), _b);
        }
        else {
            this.value = null;
        }
        this.setValue(this.value);
    };
    DaterangepickerDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    DaterangepickerDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    DaterangepickerDirective.prototype.setValue = function (value) {
        if (this.componentRef) {
            if (value) {
                if (value[this._startKey]) {
                    this.componentRef.instance.setStartDate(value[this._startKey]);
                }
                if (value[this._endKey]) {
                    this.componentRef.instance.setEndDate(value[this._endKey]);
                }
                this.componentRef.instance.calculateChosenLabel();
                if (this.componentRef.instance.chosenLabel) {
                    this.elementRef.nativeElement.value = this.componentRef.instance.chosenLabel;
                }
            }
            else {
                this.componentRef.instance.clear();
            }
        }
        this.elementRef.nativeElement.value = value ? this.calculateChosenLabel(value[this._startKey], value[this._endKey]) : null;
    };
    DaterangepickerDirective.prototype.inputChanged = function (e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        if (this.componentRef) {
            var dateString = e.target.value.split(this.componentRef.instance.locale.separator);
            var start = null, end = null;
            if (dateString.length === 2) {
                start = moment(dateString[0], this.componentRef.instance.locale.format);
                end = moment(dateString[1], this.componentRef.instance.locale.format);
            }
            if (this.singleDatePicker || start === null || end === null) {
                start = moment(e.target.value, this.componentRef.instance.locale.format);
                end = start;
            }
            if (!start.isValid() || !end.isValid()) {
                return;
            }
            this.componentRef.instance.setStartDate(start);
            this.componentRef.instance.setEndDate(end);
            this.componentRef.instance.updateView();
        }
    };
    DaterangepickerDirective.prototype.calculateChosenLabel = function (startDate, endDate) {
        var format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (this.singleDatePicker) {
            return startDate.format(format);
        }
        if (startDate && endDate) {
            return startDate.format(format) + this.locale.separator + endDate.format(format);
        }
        return null;
    };
    /**
     *  build the locale config
     */
    DaterangepickerDirective.prototype._buildLocale = function () {
        this.locale = __assign(__assign({}, this._localeService.config), this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = _moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = _moment.localeData().longDateFormat('L');
            }
        }
    };
    var DaterangepickerDirective_1;
    DaterangepickerDirective.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: KeyValueDiffers },
        { type: LocaleService },
        { type: ElementRef },
        { type: Overlay }
    ]; };
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "minDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "maxDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "autoApply", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "alwaysShowCalendars", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showCustomRangeLabel", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "linkedCalendars", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "dateLimit", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "singleDatePicker", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showWeekNumbers", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showISOWeekNumbers", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showDropdowns", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showClearButton", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "customRangeDirection", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "ranges", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "opens", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "drops", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "lastMonthDayClass", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "emptyWeekRowClass", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "firstDayOfNextMonthClass", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "lastDayOfPreviousMonthClass", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "keepCalendarOpeningWithRange", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showRangeLabelOnInput", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "showCancel", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "lockStartDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timePicker", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timePicker24Hour", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timePickerIncrement", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timePickerSeconds", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timeInput", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "timeZone", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "closeOnAutoApply", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "locale", null);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "_endKey", void 0);
    __decorate([
        Output()
    ], DaterangepickerDirective.prototype, "change", void 0);
    __decorate([
        Output()
    ], DaterangepickerDirective.prototype, "rangeClicked", void 0);
    __decorate([
        Output()
    ], DaterangepickerDirective.prototype, "datesUpdated", void 0);
    __decorate([
        Output()
    ], DaterangepickerDirective.prototype, "startDateChanged", void 0);
    __decorate([
        Output()
    ], DaterangepickerDirective.prototype, "endDateChanged", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "isInvalidDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "isCustomDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "isTooltipDate", void 0);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "startKey", null);
    __decorate([
        Input()
    ], DaterangepickerDirective.prototype, "endKey", null);
    DaterangepickerDirective = DaterangepickerDirective_1 = __decorate([
        Directive({
            selector: 'input[ngxDaterangepickerMd]',
            host: {
                '(keyup.esc)': 'hide()',
                '(blur)': 'onBlur()',
                '(click)': 'open()',
                '(keyup)': 'inputChanged($event)',
                autocomplete: 'off',
            },
            providers: [
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return DaterangepickerDirective_1; }),
                    multi: true,
                },
            ],
        })
    ], DaterangepickerDirective);
    return DaterangepickerDirective;
}());
export { DaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQzNELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQ0gsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsU0FBUyxFQUNULE1BQU0sRUFDTixNQUFNLEVBQ04sYUFBYSxHQUNoQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEtBQUssT0FBTyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBR3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUVqRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFtQnZCO0lBMEhJLGtDQUNXLGtCQUFxQyxFQUNwQyxPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQixFQUN0QixPQUFnQjtRQUpqQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGVBQVUsR0FBVixVQUFVLENBQVk7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Q25GO1FBQVQsTUFBTSxFQUFFO29FQUFnRjtJQU16RjtRQURDLEtBQUssRUFBRTttRUFDdUM7SUFFL0M7UUFEQyxLQUFLLEVBQUU7a0VBQ3NDO0lBRTlDO1FBREMsS0FBSyxFQUFFO21FQUNzQztJQUNyQztRQUFSLEtBQUssRUFBRTs0REFNUDtJQUNRO1FBQVIsS0FBSyxFQUFFOzBEQU1QO0lBL0dRLHdCQUF3QjtRQWpCcEMsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLDZCQUE2QjtZQUN2QyxJQUFJLEVBQUU7Z0JBQ0YsYUFBYSxFQUFFLFFBQVE7Z0JBQ3ZCLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsWUFBWSxFQUFFLEtBQUs7YUFDdEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQXdCLEVBQXhCLENBQXdCLENBQUM7b0JBQ3ZELEtBQUssRUFBRSxJQUFJO2lCQUNkO2FBQ0o7U0FDSixDQUFDO09BQ1csd0JBQXdCLENBb2FwQztJQUFELCtCQUFDO0NBQUEsQUFwYUQsSUFvYUM7U0FwYVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcclxuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XHJcbmltcG9ydCB7XHJcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgIENvbXBvbmVudFJlZixcclxuICAgIERpcmVjdGl2ZSxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBFdmVudEVtaXR0ZXIsXHJcbiAgICBmb3J3YXJkUmVmLFxyXG4gICAgSW5wdXQsXHJcbiAgICBLZXlWYWx1ZURpZmZlcnMsXHJcbiAgICBPbkNoYW5nZXMsXHJcbiAgICBPbkRlc3Ryb3ksXHJcbiAgICBPbkluaXQsXHJcbiAgICBPdXRwdXQsXHJcbiAgICBTaW1wbGVDaGFuZ2VzLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcclxuXHJcbmltcG9ydCB7IExvY2FsZUNvbmZpZyB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XHJcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAgIHNlbGVjdG9yOiAnaW5wdXRbbmd4RGF0ZXJhbmdlcGlja2VyTWRdJyxcclxuICAgIGhvc3Q6IHtcclxuICAgICAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcclxuICAgICAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcclxuICAgICAgICAnKGNsaWNrKSc6ICdvcGVuKCknLFxyXG4gICAgICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJyxcclxuICAgICAgICBhdXRvY29tcGxldGU6ICdvZmYnLFxyXG4gICAgfSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSksXHJcbiAgICAgICAgICAgIG11bHRpOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcbiAgICBwcml2YXRlIF9vbkNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuICAgIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuICAgIHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuICAgIHByaXZhdGUgX3ZhbHVlOiBhbnk7XHJcbiAgICBwcml2YXRlIG92ZXJsYXlSZWY6IE92ZXJsYXlSZWY7XHJcbiAgICBwcml2YXRlIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPERhdGVyYW5nZXBpY2tlckNvbXBvbmVudD47XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xyXG4gICAgQElucHV0KClcclxuICAgIG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xyXG4gICAgQElucHV0KClcclxuICAgIGF1dG9BcHBseTogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIGxpbmtlZENhbGVuZGFyczogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dEcm9wZG93bnM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHJhbmdlcyA9IHt9O1xyXG4gICAgQElucHV0KClcclxuICAgIG9wZW5zOiAnbGVmdCcgfCAnY2VudGVyJyB8ICdyaWdodCcgPSAnY2VudGVyJztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBkcm9wczogJ3VwJyB8ICdkb3duJyA9ICdkb3duJztcclxuICAgIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xyXG4gICAgQElucHV0KClcclxuICAgIGxhc3RNb250aERheUNsYXNzOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93Q2FuY2VsID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbG9ja1N0YXJ0RGF0ZSA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVQaWNrZXIgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VyMjRIb3VyID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgdGltZVBpY2tlckluY3JlbWVudCA9IDE7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgdGltZVBpY2tlclNlY29uZHMgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lSW5wdXQgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lWm9uZSA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XHJcbiAgICBfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcclxuICAgIEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xyXG5cclxuICAgIH1cclxuICAgIGdldCBsb2NhbGUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG4gICAgfVxyXG4gICAgQElucHV0KClcclxuICAgIHByaXZhdGUgX2VuZEtleSA9ICdlbmREYXRlJztcclxuICAgIHByaXZhdGUgX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XHJcbiAgICBub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbJ2xvY2FsZScsICdlbmRLZXknLCAnc3RhcnRLZXknXTtcclxuXHJcbiAgICBAT3V0cHV0KCkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8eyBzdGFydERhdGU6IF9tb21lbnQuTW9tZW50OyBlbmREYXRlOiBfbW9tZW50Lk1vbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjx7IGxhYmVsOiBzdHJpbmc7IGRhdGVzOiBbX21vbWVudC5Nb21lbnQsIF9tb21lbnQuTW9tZW50XSB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjx7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQ7IGVuZERhdGU6IF9tb21lbnQuTW9tZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjx7IGVuZERhdGU6IF9tb21lbnQuTW9tZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAgIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcclxuXHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGlzSW52YWxpZERhdGUgPSAoZGF0ZTogX21vbWVudC5Nb21lbnQpID0+IGZhbHNlXHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNDdXN0b21EYXRlID0gKGRhdGU6IF9tb21lbnQuTW9tZW50KSA9PiBmYWxzZVxyXG4gICAgQElucHV0KClcclxuICAgIGlzVG9vbHRpcERhdGUgPSAoZGF0ZTogX21vbWVudC5Nb21lbnQpID0+IG51bGxcclxuICAgIEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgQElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcclxuICAgIH1cclxuICAgIHNldCB2YWx1ZSh2YWwpIHtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcclxuICAgICAgICB0aGlzLl9vbkNoYW5nZSh2YWwpO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxyXG4gICAgICAgIHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXHJcbiAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgIHByaXZhdGUgb3ZlcmxheTogT3ZlcmxheVxyXG4gICAgKSB7fVxyXG5cclxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2J1aWxkTG9jYWxlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoY2hhbmdlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50UmVmICYmIHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkJsdXIoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3BlbigpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vdmVybGF5UmVmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG9yaWdpblgsIG92ZXJsYXlYO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5vcGVucykge1xyXG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcclxuICAgICAgICAgICAgICAgIG9yaWdpblggPSAnZW5kJztcclxuICAgICAgICAgICAgICAgIG92ZXJsYXlYID0gJ2VuZCc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2VudGVyJzpcclxuICAgICAgICAgICAgICAgIG9yaWdpblggPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIG92ZXJsYXlYID0gJ2NlbnRlcic7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxyXG4gICAgICAgICAgICAgICAgb3JpZ2luWCA9ICdzdGFydCc7XHJcbiAgICAgICAgICAgICAgICBvdmVybGF5WCA9ICdzdGFydCc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMub3ZlcmxheVJlZiA9IHRoaXMub3ZlcmxheS5jcmVhdGUoe1xyXG4gICAgICAgICAgICBiYWNrZHJvcENsYXNzOiAnY2RrLW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxyXG4gICAgICAgICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IHRoaXMub3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKSxcclxuICAgICAgICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5vdmVybGF5XHJcbiAgICAgICAgICAgICAgICAucG9zaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAud2l0aFBvc2l0aW9ucyhbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRZOiB0aGlzLmRyb3BzID09PSAndXAnID8gMCA6IDEzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5YLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5ZOiB0aGlzLmRyb3BzID09PSAndXAnID8gJ3RvcCcgOiAnYm90dG9tJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJsYXlZOiB0aGlzLmRyb3BzID09PSAndXAnID8gJ2JvdHRvbScgOiAndG9wJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZGF0ZVJhbmdlUGlja2VyUG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbChEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gdGhpcy5vdmVybGF5UmVmLmF0dGFjaChkYXRlUmFuZ2VQaWNrZXJQb3J0YWwpO1xyXG5cclxuICAgICAgICAvLyBBc3NpZ24gYWxsIGlucHV0c1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLm1pbkRhdGUgPSB0aGlzLm1pbkRhdGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5hdXRvQXBwbHkgPSB0aGlzLmF1dG9BcHBseTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5hbHdheXNTaG93Q2FsZW5kYXJzID0gdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dDdXN0b21SYW5nZUxhYmVsID0gdGhpcy5zaG93Q3VzdG9tUmFuZ2VMYWJlbDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5saW5rZWRDYWxlbmRhcnMgPSB0aGlzLmxpbmtlZENhbGVuZGFycztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5kYXRlTGltaXQgPSB0aGlzLmRhdGVMaW1pdDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zaW5nbGVEYXRlUGlja2VyID0gdGhpcy5zaW5nbGVEYXRlUGlja2VyO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dXZWVrTnVtYmVycyA9IHRoaXMuc2hvd1dlZWtOdW1iZXJzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dJU09XZWVrTnVtYmVycyA9IHRoaXMuc2hvd0lTT1dlZWtOdW1iZXJzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dEcm9wZG93bnMgPSB0aGlzLnNob3dEcm9wZG93bnM7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2hvd0NsZWFyQnV0dG9uID0gdGhpcy5zaG93Q2xlYXJCdXR0b247XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPSB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnJhbmdlcyA9IHRoaXMucmFuZ2VzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxhc3RNb250aERheUNsYXNzID0gdGhpcy5sYXN0TW9udGhEYXlDbGFzcztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzID0gdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSA9IHRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgPSB0aGlzLnNob3dSYW5nZUxhYmVsT25JbnB1dDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zaG93Q2FuY2VsID0gdGhpcy5zaG93Q2FuY2VsO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxvY2tTdGFydERhdGUgPSB0aGlzLmxvY2tTdGFydERhdGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudGltZVBpY2tlciA9IHRoaXMudGltZVBpY2tlcjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS50aW1lUGlja2VyMjRIb3VyID0gdGhpcy50aW1lUGlja2VyMjRIb3VyO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnRpbWVQaWNrZXJJbmNyZW1lbnQgPSB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudGltZVpvbmUgPSB0aGlzLnRpbWVab25lO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnRpbWVQaWNrZXJTZWNvbmRzID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxvY2FsZSA9IHRoaXMubG9jYWxlO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5pc0ludmFsaWREYXRlID0gdGhpcy5pc0ludmFsaWREYXRlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmlzQ3VzdG9tRGF0ZSA9IHRoaXMuaXNDdXN0b21EYXRlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmlzVG9vbHRpcERhdGUgPSB0aGlzLmlzVG9vbHRpcERhdGU7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgdmFsdWVcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUpO1xyXG5cclxuICAgICAgICBjb25zdCBsb2NhbGVEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmxvY2FsZSkuY3JlYXRlKCk7XHJcbiAgICAgICAgaWYgKGxvY2FsZURpZmZlcikge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VzID0gbG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xyXG4gICAgICAgICAgICBpZiAoY2hhbmdlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudXBkYXRlTG9jYWxlKHRoaXMubG9jYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3Vic2NyaWJlIHRvIGFsbCBvdXRwdXRzXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc3RhcnREYXRlQ2hhbmdlZFxyXG4gICAgICAgICAgICAuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogeyBzdGFydERhdGU6IF9tb21lbnQuTW9tZW50IH0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmVuZERhdGVDaGFuZ2VkXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UucmFuZ2VDbGlja2VkXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHJhbmdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmRhdGVzVXBkYXRlZFxyXG4gICAgICAgICAgICAuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKChyYW5nZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdChyYW5nZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jaG9zZW5EYXRlXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGNob3NlbkRhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjaG9zZW5EYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBlbmREYXRlLCBzdGFydERhdGUgfSA9IGNob3NlbkRhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHtbdGhpcy5fc3RhcnRLZXldOiBzdGFydERhdGUsIFt0aGlzLl9lbmRLZXldOiBlbmREYXRlfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2hvc2VuRGF0ZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaG9zZW5EYXRlLmNob3NlbkxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jbG9zZURhdGVSYW5nZVBpY2tlclxyXG4gICAgICAgICAgICAuYXNPYnNlcnZhYmxlKClcclxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQ2xvc2UgdGhlIERhdGVSYW5nZVBpY2tlciB3aGVuIHRoZSBiYWNrZHJvcCBpcyBjbGlja2VkXHJcbiAgICAgICAgdGhpcy5vdmVybGF5UmVmXHJcbiAgICAgICAgICAgIC5iYWNrZHJvcENsaWNrKClcclxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm92ZXJsYXlSZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5UmVmLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5vdmVybGF5UmVmID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheVJlZikge1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChfbW9tZW50LmlzTW9tZW50KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0geyBbdGhpcy5fc3RhcnRLZXldOiB2YWx1ZSB9O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHsgW3RoaXMuX3N0YXJ0S2V5XTogbW9tZW50KHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSksIFt0aGlzLl9lbmRLZXldOiBtb21lbnQodmFsdWVbdGhpcy5fZW5kS2V5XSkgfTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVt0aGlzLl9zdGFydEtleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zZXRTdGFydERhdGUodmFsdWVbdGhpcy5fc3RhcnRLZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVt0aGlzLl9lbmRLZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2V0RW5kRGF0ZSh2YWx1ZVt0aGlzLl9lbmRLZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY2hvc2VuTGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNob3NlbkxhYmVsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZSA/IHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwodmFsdWVbdGhpcy5fc3RhcnRLZXldLCB2YWx1ZVt0aGlzLl9lbmRLZXldKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXRDaGFuZ2VkKGUpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gZS50YXJnZXQudmFsdWUuc3BsaXQodGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9jYWxlLnNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgIGxldCBzdGFydCA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlbmQgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KGRhdGVTdHJpbmdbMF0sIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgICAgICAgICAgZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxvY2FsZS5mb3JtYXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IG1vbWVudChlLnRhcmdldC52YWx1ZSwgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNldFN0YXJ0RGF0ZShzdGFydCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNldEVuZERhdGUoZW5kKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudXBkYXRlVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVDaG9zZW5MYWJlbChzdGFydERhdGU6IF9tb21lbnQuTW9tZW50LCBlbmREYXRlOiBfbW9tZW50Lk1vbWVudCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy5sb2NhbGUuZGlzcGxheUZvcm1hdCA/IHRoaXMubG9jYWxlLmRpc3BsYXlGb3JtYXQgOiB0aGlzLmxvY2FsZS5mb3JtYXQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdGFydERhdGUgJiYgZW5kRGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpICsgdGhpcy5sb2NhbGUuc2VwYXJhdG9yICsgZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogIGJ1aWxkIHRoZSBsb2NhbGUgY29uZmlnXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xyXG4gICAgICAgIHRoaXMubG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udGhpcy5sb2NhbGUgfTtcclxuICAgICAgICBpZiAoIXRoaXMubG9jYWxlLmZvcm1hdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5mb3JtYXQgPSBfbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnbGxsJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5mb3JtYXQgPSBfbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnTCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==