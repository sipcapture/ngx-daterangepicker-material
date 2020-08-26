var DaterangepickerDirective_1;
import { __decorate } from "tslib";
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectorRef, ComponentRef, Directive, ElementRef, EventEmitter, forwardRef, Input, KeyValueDiffers, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleService } from './locale.service';
const moment = _moment;
let DaterangepickerDirective = DaterangepickerDirective_1 = class DaterangepickerDirective {
    constructor(_changeDetectorRef, differs, _localeService, elementRef, overlay) {
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
        this.isInvalidDate = (date) => false;
        this.isCustomDate = (date) => false;
        this.isTooltipDate = (date) => null;
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        }
        else {
            this._startKey = 'startDate';
        }
    }
    set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        }
        else {
            this._endKey = 'endDate';
        }
    }
    get value() {
        return this._value || null;
    }
    set value(val) {
        this._value = val;
        this._onChange(val);
        this._changeDetectorRef.markForCheck();
    }
    ngOnInit() {
        this._buildLocale();
    }
    ngOnChanges(changes) {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.componentRef && this.notForChangesProperty.indexOf(change) === -1) {
                    this.componentRef[change] = changes[change].currentValue;
                }
            }
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    onBlur() {
        this._onTouched();
    }
    open() {
        if (this.overlayRef) {
            this.hide();
        }
        let originX, overlayX;
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
                    originX,
                    originY: this.drops === 'up' ? 'top' : 'bottom',
                    overlayX,
                    overlayY: this.drops === 'up' ? 'bottom' : 'top',
                },
            ]),
        });
        const dateRangePickerPortal = new ComponentPortal(DaterangepickerComponent);
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
        const localeDiffer = this.differs.find(this.locale).create();
        if (localeDiffer) {
            const changes = localeDiffer.diff(this.locale);
            if (changes) {
                this.componentRef.instance.updateLocale(this.locale);
            }
        }
        // Subscribe to all outputs
        this.componentRef.instance.startDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged) => {
            this.startDateChanged.emit(itemChanged);
        });
        this.componentRef.instance.endDateChanged
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((itemChanged) => {
            this.endDateChanged.emit(itemChanged);
        });
        this.componentRef.instance.rangeClicked
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.componentRef.instance.datesUpdated
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.componentRef.instance.chosenDate
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe((chosenDate) => {
            if (chosenDate) {
                const { endDate, startDate } = chosenDate;
                this.value = { [this._startKey]: startDate, [this._endKey]: endDate };
                this.change.emit(this.value);
                if (typeof chosenDate.chosenLabel === 'string') {
                    this.elementRef.nativeElement.value = chosenDate.chosenLabel;
                }
                this.hide();
            }
        });
        this.componentRef.instance.closeDateRangePicker
            .asObservable()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.hide();
        });
        // Close the DateRangePicker when the backdrop is clicked
        this.overlayRef
            .backdropClick()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.hide();
        });
    }
    hide() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            this.componentRef = null;
        }
    }
    toggle() {
        if (this.overlayRef) {
            this.hide();
        }
        else {
            this.open();
        }
    }
    clear() {
        if (this.componentRef) {
            this.componentRef.instance.clear();
        }
    }
    writeValue(value) {
        if (_moment.isMoment(value)) {
            this.value = { [this._startKey]: value };
        }
        else if (value) {
            this.value = { [this._startKey]: moment(value[this._startKey]), [this._endKey]: moment(value[this._endKey]) };
        }
        else {
            this.value = null;
        }
        this.setValue(this.value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setValue(value) {
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
    }
    inputChanged(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        if (this.componentRef) {
            const dateString = e.target.value.split(this.componentRef.instance.locale.separator);
            let start = null, end = null;
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
    }
    calculateChosenLabel(startDate, endDate) {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (this.singleDatePicker) {
            return startDate.format(format);
        }
        if (startDate && endDate) {
            return startDate.format(format) + this.locale.separator + endDate.format(format);
        }
        return null;
    }
    /**
     *  build the locale config
     */
    _buildLocale() {
        this.locale = Object.assign(Object.assign({}, this._localeService.config), this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = _moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = _moment.localeData().longDateFormat('L');
            }
        }
    }
};
DaterangepickerDirective.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: KeyValueDiffers },
    { type: LocaleService },
    { type: ElementRef },
    { type: Overlay }
];
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
                useExisting: forwardRef(() => DaterangepickerDirective_1),
                multi: true,
            },
        ],
    })
], DaterangepickerDirective);
export { DaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUNILGlCQUFpQixFQUNqQixZQUFZLEVBQ1osU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFDTCxlQUFlLEVBQ2YsU0FBUyxFQUNULFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLGFBQWEsR0FDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUd2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFakQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBbUJ2QixJQUFhLHdCQUF3QixnQ0FBckMsTUFBYSx3QkFBd0I7SUEwSGpDLFlBQ1csa0JBQXFDLEVBQ3BDLE9BQXdCLEVBQ3hCLGNBQTZCLEVBQzdCLFVBQXNCLEVBQ3RCLE9BQWdCO1FBSmpCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDcEMsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIsbUJBQWMsR0FBZCxjQUFj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TXpGO0lBREMsS0FBSyxFQUFFOytEQUN1QztBQUUvQztJQURDLEtBQUssRUFBRTs4REFDc0M7QUFFOUM7SUFEQyxLQUFLLEVBQUU7K0RBQ3NDO0FBQ3JDO0lBQVIsS0FBSyxFQUFFO3dEQU1QO0FBQ1E7SUFBUixLQUFLLEVBQUU7c0RBTVA7QUEvR1Esd0JBQXdCO0lBakJwQyxTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsNkJBQTZCO1FBQ3ZDLElBQUksRUFBRTtZQUNGLGFBQWEsRUFBRSxRQUFRO1lBQ3ZCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFNBQVMsRUFBRSxzQkFBc0I7WUFDakMsWUFBWSxFQUFFLEtBQUs7U0FDdEI7UUFDRCxTQUFTLEVBQUU7WUFDUDtnQkFDSSxPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUF3QixDQUFDO2dCQUN2RCxLQUFLLEVBQUUsSUFBSTthQUNkO1NBQ0o7S0FDSixDQUFDO0dBQ1csd0JBQXdCLENBb2FwQztTQXBhWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5LCBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xyXG5pbXBvcnQgeyBDb21wb25lbnRQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcclxuaW1wb3J0IHtcclxuICAgIENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgQ29tcG9uZW50UmVmLFxyXG4gICAgRGlyZWN0aXZlLFxyXG4gICAgRWxlbWVudFJlZixcclxuICAgIEV2ZW50RW1pdHRlcixcclxuICAgIGZvcndhcmRSZWYsXHJcbiAgICBJbnB1dCxcclxuICAgIEtleVZhbHVlRGlmZmVycyxcclxuICAgIE9uQ2hhbmdlcyxcclxuICAgIE9uRGVzdHJveSxcclxuICAgIE9uSW5pdCxcclxuICAgIE91dHB1dCxcclxuICAgIFNpbXBsZUNoYW5nZXMsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQnO1xyXG5cclxuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4vbG9jYWxlLnNlcnZpY2UnO1xyXG5cclxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dFtuZ3hEYXRlcmFuZ2VwaWNrZXJNZF0nLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgICcoa2V5dXAuZXNjKSc6ICdoaWRlKCknLFxyXG4gICAgICAgICcoYmx1ciknOiAnb25CbHVyKCknLFxyXG4gICAgICAgICcoY2xpY2spJzogJ29wZW4oKScsXHJcbiAgICAgICAgJyhrZXl1cCknOiAnaW5wdXRDaGFuZ2VkKCRldmVudCknLFxyXG4gICAgICAgIGF1dG9jb21wbGV0ZTogJ29mZicsXHJcbiAgICB9LFxyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAgICAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlKSxcclxuICAgICAgICAgICAgbXVsdGk6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcclxuICAgIHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4gICAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4gICAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcclxuICAgIHByaXZhdGUgb3ZlcmxheVJlZjogT3ZlcmxheVJlZjtcclxuICAgIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PjtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgbWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgYXV0b0FwcGx5OiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgY3VzdG9tUmFuZ2VEaXJlY3Rpb246IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgcmFuZ2VzID0ge307XHJcbiAgICBASW5wdXQoKVxyXG4gICAgb3BlbnM6ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JyA9ICdjZW50ZXInO1xyXG4gICAgQElucHV0KClcclxuICAgIGRyb3BzOiAndXAnIHwgJ2Rvd24nID0gJ2Rvd24nO1xyXG4gICAgZmlyc3RNb250aERheUNsYXNzOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcclxuICAgIEBJbnB1dCgpXHJcbiAgICBlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xyXG4gICAgQElucHV0KClcclxuICAgIGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nO1xyXG4gICAgQElucHV0KClcclxuICAgIGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xyXG4gICAgQElucHV0KClcclxuICAgIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2hvd1JhbmdlTGFiZWxPbklucHV0OiBib29sZWFuO1xyXG4gICAgQElucHV0KClcclxuICAgIHNob3dDYW5jZWwgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICBsb2NrU3RhcnREYXRlID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKVxyXG4gICAgdGltZVBpY2tlciA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVQaWNrZXIyNEhvdXIgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VySW5jcmVtZW50ID0gMTtcclxuICAgIEBJbnB1dCgpXHJcbiAgICB0aW1lUGlja2VyU2Vjb25kcyA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVJbnB1dCA9IGZhbHNlO1xyXG4gICAgQElucHV0KClcclxuICAgIHRpbWVab25lID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcclxuICAgIF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xyXG4gICAgQElucHV0KCkgc2V0IGxvY2FsZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlIH07XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0IGxvY2FsZSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XHJcbiAgICB9XHJcbiAgICBASW5wdXQoKVxyXG4gICAgcHJpdmF0ZSBfZW5kS2V5ID0gJ2VuZERhdGUnO1xyXG4gICAgcHJpdmF0ZSBfc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcclxuICAgIG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFsnbG9jYWxlJywgJ2VuZEtleScsICdzdGFydEtleSddO1xyXG5cclxuICAgIEBPdXRwdXQoKSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjx7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQ7IGVuZERhdGU6IF9tb21lbnQuTW9tZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPHsgbGFiZWw6IHN0cmluZzsgZGF0ZXM6IFtfbW9tZW50Lk1vbWVudCwgX21vbWVudC5Nb21lbnRdIH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPHsgc3RhcnREYXRlOiBfbW9tZW50Lk1vbWVudDsgZW5kRGF0ZTogX21vbWVudC5Nb21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPHsgc3RhcnREYXRlOiBfbW9tZW50Lk1vbWVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPHsgZW5kRGF0ZTogX21vbWVudC5Nb21lbnQgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xyXG5cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNJbnZhbGlkRGF0ZSA9IChkYXRlOiBfbW9tZW50Lk1vbWVudCkgPT4gZmFsc2VcclxuICAgIEBJbnB1dCgpXHJcbiAgICBpc0N1c3RvbURhdGUgPSAoZGF0ZTogX21vbWVudC5Nb21lbnQpID0+IGZhbHNlXHJcbiAgICBASW5wdXQoKVxyXG4gICAgaXNUb29sdGlwRGF0ZSA9IChkYXRlOiBfbW9tZW50Lk1vbWVudCkgPT4gbnVsbFxyXG4gICAgQElucHV0KCkgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBASW5wdXQoKSBzZXQgZW5kS2V5KHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZEtleSA9IHZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZSB8fCBudWxsO1xyXG4gICAgfVxyXG4gICAgc2V0IHZhbHVlKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbCk7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXHJcbiAgICAgICAgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcclxuICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgcHJpdmF0ZSBvdmVybGF5OiBPdmVybGF5XHJcbiAgICApIHt9XHJcblxyXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fYnVpbGRMb2NhbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjaGFuZ2UgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShjaGFuZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYgJiYgdGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQmx1cigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm92ZXJsYXlSZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgb3JpZ2luWCwgb3ZlcmxheVg7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm9wZW5zKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgb3JpZ2luWCA9ICdlbmQnO1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheVggPSAnZW5kJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdjZW50ZXInOlxyXG4gICAgICAgICAgICAgICAgb3JpZ2luWCA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICAgICAgb3ZlcmxheVggPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5YID0gJ3N0YXJ0JztcclxuICAgICAgICAgICAgICAgIG92ZXJsYXlYID0gJ3N0YXJ0JztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5vdmVybGF5UmVmID0gdGhpcy5vdmVybGF5LmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIGJhY2tkcm9wQ2xhc3M6ICdjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXHJcbiAgICAgICAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpLFxyXG4gICAgICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLm92ZXJsYXlcclxuICAgICAgICAgICAgICAgIC5wb3NpdGlvbigpXHJcbiAgICAgICAgICAgICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudClcclxuICAgICAgICAgICAgICAgIC53aXRoUG9zaXRpb25zKFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldFk6IHRoaXMuZHJvcHMgPT09ICd1cCcgPyAwIDogMTMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpblgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpblk6IHRoaXMuZHJvcHMgPT09ICd1cCcgPyAndG9wJyA6ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVybGF5WCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVk6IHRoaXMuZHJvcHMgPT09ICd1cCcgPyAnYm90dG9tJyA6ICd0b3AnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBkYXRlUmFuZ2VQaWNrZXJQb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsKERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYgPSB0aGlzLm92ZXJsYXlSZWYuYXR0YWNoKGRhdGVSYW5nZVBpY2tlclBvcnRhbCk7XHJcblxyXG4gICAgICAgIC8vIEFzc2lnbiBhbGwgaW5wdXRzXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5tYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmF1dG9BcHBseSA9IHRoaXMuYXV0b0FwcGx5O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmFsd2F5c1Nob3dDYWxlbmRhcnMgPSB0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnM7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2hvd0N1c3RvbVJhbmdlTGFiZWwgPSB0aGlzLnNob3dDdXN0b21SYW5nZUxhYmVsO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmxpbmtlZENhbGVuZGFycyA9IHRoaXMubGlua2VkQ2FsZW5kYXJzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmRhdGVMaW1pdCA9IHRoaXMuZGF0ZUxpbWl0O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNpbmdsZURhdGVQaWNrZXIgPSB0aGlzLnNpbmdsZURhdGVQaWNrZXI7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2hvd1dlZWtOdW1iZXJzID0gdGhpcy5zaG93V2Vla051bWJlcnM7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2hvd0lTT1dlZWtOdW1iZXJzID0gdGhpcy5zaG93SVNPV2Vla051bWJlcnM7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2hvd0Ryb3Bkb3ducyA9IHRoaXMuc2hvd0Ryb3Bkb3ducztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zaG93Q2xlYXJCdXR0b24gPSB0aGlzLnNob3dDbGVhckJ1dHRvbjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jdXN0b21SYW5nZURpcmVjdGlvbiA9IHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UucmFuZ2VzID0gdGhpcy5yYW5nZXM7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmVtcHR5V2Vla1Jvd0NsYXNzID0gdGhpcy5lbXB0eVdlZWtSb3dDbGFzcztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5rZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlID0gdGhpcy5rZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dSYW5nZUxhYmVsT25JbnB1dCA9IHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0O1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNob3dDYW5jZWwgPSB0aGlzLnNob3dDYW5jZWw7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9ja1N0YXJ0RGF0ZSA9IHRoaXMubG9ja1N0YXJ0RGF0ZTtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS50aW1lUGlja2VyID0gdGhpcy50aW1lUGlja2VyO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnRpbWVQaWNrZXIyNEhvdXIgPSB0aGlzLnRpbWVQaWNrZXIyNEhvdXI7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudGltZVBpY2tlckluY3JlbWVudCA9IHRoaXMudGltZVBpY2tlckluY3JlbWVudDtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS50aW1lWm9uZSA9IHRoaXMudGltZVpvbmU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UudGltZVBpY2tlclNlY29uZHMgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNsb3NlT25BdXRvQXBwbHkgPSB0aGlzLmNsb3NlT25BdXRvQXBwbHk7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9jYWxlID0gdGhpcy5sb2NhbGU7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmlzSW52YWxpZERhdGUgPSB0aGlzLmlzSW52YWxpZERhdGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuaXNDdXN0b21EYXRlID0gdGhpcy5pc0N1c3RvbURhdGU7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuaXNUb29sdGlwRGF0ZSA9IHRoaXMuaXNUb29sdGlwRGF0ZTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZVxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcclxuICAgICAgICBpZiAobG9jYWxlRGlmZmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZXMgPSBsb2NhbGVEaWZmZXIuZGlmZih0aGlzLmxvY2FsZSk7XHJcbiAgICAgICAgICAgIGlmIChjaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS51cGRhdGVMb2NhbGUodGhpcy5sb2NhbGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gYWxsIG91dHB1dHNcclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zdGFydERhdGVDaGFuZ2VkXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiB7IHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuZW5kRGF0ZUNoYW5nZWRcclxuICAgICAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5yYW5nZUNsaWNrZWRcclxuICAgICAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgocmFuZ2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuZGF0ZXNVcGRhdGVkXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHJhbmdlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNob3NlbkRhdGVcclxuICAgICAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXHJcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgoY2hvc2VuRGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNob3NlbkRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGVuZERhdGUsIHN0YXJ0RGF0ZSB9ID0gY2hvc2VuRGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0ge1t0aGlzLl9zdGFydEtleV06IHN0YXJ0RGF0ZSwgW3RoaXMuX2VuZEtleV06IGVuZERhdGV9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjaG9zZW5EYXRlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNob3NlbkRhdGUuY2hvc2VuTGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLmNsb3NlRGF0ZVJhbmdlUGlja2VyXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDbG9zZSB0aGUgRGF0ZVJhbmdlUGlja2VyIHdoZW4gdGhlIGJhY2tkcm9wIGlzIGNsaWNrZWRcclxuICAgICAgICB0aGlzLm92ZXJsYXlSZWZcclxuICAgICAgICAgICAgLmJhY2tkcm9wQ2xpY2soKVxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheVJlZikge1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXlSZWYgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vdmVybGF5UmVmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKF9tb21lbnQuaXNNb21lbnQodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB7IFt0aGlzLl9zdGFydEtleV06IHZhbHVlIH07XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0geyBbdGhpcy5fc3RhcnRLZXldOiBtb21lbnQodmFsdWVbdGhpcy5fc3RhcnRLZXldKSwgW3RoaXMuX2VuZEtleV06IG1vbWVudCh2YWx1ZVt0aGlzLl9lbmRLZXldKSB9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNldFN0YXJ0RGF0ZSh2YWx1ZVt0aGlzLl9zdGFydEtleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlW3RoaXMuX2VuZEtleV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zZXRFbmREYXRlKHZhbHVlW3RoaXMuX2VuZEtleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jaG9zZW5MYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuY2hvc2VuTGFiZWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZSA9IHZhbHVlID8gdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCh2YWx1ZVt0aGlzLl9zdGFydEtleV0sIHZhbHVlW3RoaXMuX2VuZEtleV0pIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dENoYW5nZWQoZSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5sb2NhbGUuc2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gbnVsbCxcclxuICAgICAgICAgICAgICAgIGVuZCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBtb21lbnQoZGF0ZVN0cmluZ1sxXSwgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UubG9jYWxlLmZvcm1hdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlciB8fCBzdGFydCA9PT0gbnVsbCB8fCBlbmQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5sb2NhbGUuZm9ybWF0KTtcclxuICAgICAgICAgICAgICAgIGVuZCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2V0U3RhcnREYXRlKHN0YXJ0KTtcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2Uuc2V0RW5kRGF0ZShlbmQpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS51cGRhdGVWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZUNob3NlbkxhYmVsKHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQsIGVuZERhdGU6IF9tb21lbnQuTW9tZW50KTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBmb3JtYXQgPSB0aGlzLmxvY2FsZS5kaXNwbGF5Rm9ybWF0ID8gdGhpcy5sb2NhbGUuZGlzcGxheUZvcm1hdCA6IHRoaXMubG9jYWxlLmZvcm1hdDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSAmJiBlbmREYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgKyB0aGlzLmxvY2FsZS5zZXBhcmF0b3IgKyBlbmREYXRlLmZvcm1hdChmb3JtYXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAgYnVpbGQgdGhlIGxvY2FsZSBjb25maWdcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfYnVpbGRMb2NhbGUoKSB7XHJcbiAgICAgICAgdGhpcy5sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi50aGlzLmxvY2FsZSB9O1xyXG4gICAgICAgIGlmICghdGhpcy5sb2NhbGUuZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IF9tb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdsbGwnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IF9tb21lbnQubG9jYWxlRGF0YSgpLmxvbmdEYXRlRm9ybWF0KCdMJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19