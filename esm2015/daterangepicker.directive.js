import * as tslib_1 from "tslib";
var DaterangepickerDirective_1;
import { Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener, forwardRef, ChangeDetectorRef, Input, KeyValueDiffers, Output, EventEmitter, Renderer2 } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { LocaleService } from './locale.service';
const moment = _moment;
let DaterangepickerDirective = DaterangepickerDirective_1 = class DaterangepickerDirective {
    constructor(viewContainerRef, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
        this.viewContainerRef = viewContainerRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._el = _el;
        this._renderer = _renderer;
        this.differs = differs;
        this._localeService = _localeService;
        this.elementRef = elementRef;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.dateLimit = null;
        this.showCancel = false;
        this.lockStartDate = false;
        // timepicker variables
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
        this.notForChangesProperty = [
            'locale',
            'endKey',
            'startKey'
        ];
        this.onChange = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.drops = 'down';
        this.opens = 'auto';
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DaterangepickerComponent);
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        this.picker = componentRef.instance;
        this.picker.inline = false; // set inline to false for all directive usage
    }
    set locale(value) {
        this._locale = Object.assign({}, this._localeService.config, value);
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
        this.picker.startDateChanged.asObservable().subscribe((itemChanged) => {
            this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe((itemChanged) => {
            this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe((change) => {
            if (change) {
                const value = {};
                value[this._startKey] = change.startDate;
                value[this._endKey] = change.endDate;
                this.value = value;
                this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    this._el.nativeElement.value = change.chosenLabel;
                }
            }
        });
        this.picker.firstMonthDayClass = this.firstMonthDayClass;
        this.picker.lastMonthDayClass = this.lastMonthDayClass;
        this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
        this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
        this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
        this.picker.drops = this.drops;
        this.picker.opens = this.opens;
        this.localeDiffer = this.differs.find(this.locale).create();
        this.picker.closeOnAutoApply = this.closeOnAutoApply;
    }
    ngOnChanges(changes) {
        for (const change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    }
    ngDoCheck() {
        if (this.localeDiffer) {
            const changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    }
    onBlur() {
        this._onTouched();
    }
    open(event) {
        this.picker.show(event);
        setTimeout(() => {
            this.setPosition();
        });
    }
    hide(e) {
        this.picker.hide(e);
    }
    toggle(e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
            this.open(e);
        }
    }
    clear() {
        this.picker.clear();
    }
    writeValue(value) {
        this.setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setValue(val) {
        if (val) {
            this.value = val;
            if (val[this._startKey]) {
                this.picker.setStartDate(val[this._startKey]);
            }
            if (val[this._endKey]) {
                this.picker.setEndDate(val[this._endKey]);
            }
            this.picker.calculateChosenLabel();
            if (this.picker.chosenLabel) {
                this._el.nativeElement.value = this.picker.chosenLabel;
            }
        }
        else {
            this.picker.clear();
        }
    }
    /**
     * Set position of the calendar
     */
    setPosition() {
        let style;
        let containerTop;
        const container = this.picker.pickerContainer.nativeElement;
        const element = this._el.nativeElement;
        if (this.drops && this.drops === 'up') {
            containerTop = (element.offsetTop - container.clientHeight) + 'px';
        }
        else {
            containerTop = 'auto';
        }
        if (this.opens === 'left') {
            style = {
                top: containerTop,
                left: (element.offsetLeft - container.clientWidth + element.clientWidth) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'center') {
            style = {
                top: containerTop,
                left: (element.offsetLeft + element.clientWidth / 2
                    - container.clientWidth / 2) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'right') {
            style = {
                top: containerTop,
                left: element.offsetLeft + 'px',
                right: 'auto'
            };
        }
        else {
            const position = element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2;
            if (position < 0) {
                style = {
                    top: containerTop,
                    left: element.offsetLeft + 'px',
                    right: 'auto'
                };
            }
            else {
                style = {
                    top: containerTop,
                    left: position + 'px',
                    right: 'auto'
                };
            }
        }
        if (style) {
            this._renderer.setStyle(container, 'top', style.top);
            this._renderer.setStyle(container, 'left', style.left);
            this._renderer.setStyle(container, 'right', style.right);
        }
    }
    inputChanged(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        const dateString = e.target.value.split(this.picker.locale.separator);
        let start = null, end = null;
        if (dateString.length === 2) {
            start = moment(dateString[0], this.picker.locale.format);
            end = moment(dateString[1], this.picker.locale.format);
        }
        if (this.singleDatePicker || start === null || end === null) {
            start = moment(e.target.value, this.picker.locale.format);
            end = start;
        }
        if (!start.isValid() || !end.isValid()) {
            return;
        }
        this.picker.setStartDate(start);
        this.picker.setEndDate(end);
        this.picker.updateView();
    }
    /**
     * For click outside of the calendar's container
     * @param event event object
     */
    outsideClick(event) {
        if (!event.target) {
            return;
        }
        if (event.target.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hide();
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "timepickerTimezone", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "startDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "endDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "titleDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "minDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "maxDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "autoApply", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "alwaysShowCalendars", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showCustomRangeLabel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "linkedCalendars", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], DaterangepickerDirective.prototype, "dateLimit", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "singleDatePicker", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showWeekNumbers", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showISOWeekNumbers", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showDropdowns", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], DaterangepickerDirective.prototype, "isInvalidDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function)
], DaterangepickerDirective.prototype, "isCustomDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showClearButton", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "customRangeDirection", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "ranges", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "opens", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "drops", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "lastMonthDayClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "emptyWeekRowClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "firstDayOfNextMonthClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "lastDayOfPreviousMonthClass", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "keepCalendarOpeningWithRange", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showRangeLabelOnInput", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "showCancel", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "lockStartDate", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "timePicker", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "timePicker24Hour", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Number)
], DaterangepickerDirective.prototype, "timePickerIncrement", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Boolean)
], DaterangepickerDirective.prototype, "timePickerSeconds", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "timeInput", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "timeZone", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], DaterangepickerDirective.prototype, "closeOnAutoApply", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DaterangepickerDirective.prototype, "locale", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], DaterangepickerDirective.prototype, "_endKey", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DaterangepickerDirective.prototype, "startKey", null);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], DaterangepickerDirective.prototype, "endKey", null);
tslib_1.__decorate([
    Output('change'),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerDirective.prototype, "onChange", void 0);
tslib_1.__decorate([
    Output('rangeClicked'),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerDirective.prototype, "rangeClicked", void 0);
tslib_1.__decorate([
    Output('datesUpdated'),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerDirective.prototype, "datesUpdated", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerDirective.prototype, "startDateChanged", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], DaterangepickerDirective.prototype, "endDateChanged", void 0);
tslib_1.__decorate([
    HostListener('document:click', ['$event']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], DaterangepickerDirective.prototype, "outsideClick", null);
DaterangepickerDirective = DaterangepickerDirective_1 = tslib_1.__decorate([
    Directive({
        selector: 'input[ngxDaterangepickerMd]',
        host: {
            '(keyup.esc)': 'hide()',
            '(blur)': 'onBlur()',
            '(click)': 'open()',
            '(keyup)': 'inputChanged($event)'
        },
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DaterangepickerDirective_1), multi: true
            }
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [ViewContainerRef,
        ChangeDetectorRef,
        ComponentFactoryResolver,
        ElementRef,
        Renderer2,
        KeyValueDiffers,
        LocaleService,
        ElementRef])
], DaterangepickerDirective);
export { DaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsd0JBQXdCLEVBQ3hCLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLGlCQUFpQixFQUlqQixLQUFLLEVBR0wsZUFBZSxFQUNmLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0saUJBQWlCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQWlCdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBOEhuQyxZQUNTLGdCQUFrQyxFQUNsQyxrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVB2QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDcEMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FB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QUMsR0FBRyxFQUFFLENBQUMsMEJBQXdCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSTthQUNyRTtTQUNKO0tBQ0EsQ0FBQzs2Q0FnSTJCLGdCQUFnQjtRQUNkLGlCQUFpQjtRQUNULHdCQUF3QjtRQUM5QyxVQUFVO1FBQ0osU0FBUztRQUNYLGVBQWU7UUFDUixhQUFhO1FBQ2pCLFVBQVU7R0F0SXJCLHdCQUF3QixDQTZWcEM7U0E3Vlksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgZm9yd2FyZFJlZixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9uSW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbnB1dCxcbiAgRG9DaGVjayxcbiAgS2V5VmFsdWVEaWZmZXIsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIFJlbmRlcmVyMixcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25neERhdGVyYW5nZXBpY2tlck1kXScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdvcGVuKCknLFxuICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSksIG11bHRpOiB0cnVlXG4gICAgfVxuXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG4gIHB1YmxpYyBwaWNrZXI6IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudDtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICBwcml2YXRlIF92YWx1ZTogYW55O1xuICBwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICBcbiAgQElucHV0KClcbiAgdGltZXBpY2tlclRpbWV6b25lOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIGVuZERhdGU6IF9tb21lbnQuTW9tZW50O1xuICBASW5wdXQoKVxuICB0aXRsZURhdGU6IHN0cmluZztcbiAgQElucHV0KClcbiAgbWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xuICBASW5wdXQoKVxuICBhdXRvQXBwbHk6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGFsd2F5c1Nob3dDYWxlbmRhcnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcbiAgQElucHV0KClcbiAgc2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93SVNPV2Vla051bWJlcnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dEcm9wZG93bnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xuICBASW5wdXQoKVxuICBpc0N1c3RvbURhdGU6IEZ1bmN0aW9uO1xuICBASW5wdXQoKVxuICBzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xuICBASW5wdXQoKVxuICByYW5nZXM6IGFueTtcbiAgQElucHV0KClcbiAgb3BlbnM6IHN0cmluZztcbiAgQElucHV0KClcbiAgZHJvcHM6IHN0cmluZztcbiAgZmlyc3RNb250aERheUNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGxhc3RNb250aERheUNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAga2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZTogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd1JhbmdlTGFiZWxPbklucHV0OiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIGxvY2tTdGFydERhdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLy8gdGltZXBpY2tlciB2YXJpYWJsZXNcbiAgQElucHV0KClcbiAgdGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyMjRIb3VyOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXJJbmNyZW1lbnQ6IG51bWJlciA9IDE7XG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXJTZWNvbmRzOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHRpbWVJbnB1dCA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lWm9uZSA9IGZhbHNlO1xuICBASW5wdXQoKSBjbG9zZU9uQXV0b0FwcGx5ID0gdHJ1ZTtcbiAgX2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XG4gIEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcbiAgICB0aGlzLl9sb2NhbGUgPSB7Li4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlfTtcbiAgfVxuICBnZXQgbG9jYWxlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgfVxuICBASW5wdXQoKVxuICBwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcbiAgcHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuICBASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3N0YXJ0S2V5ID0gJ3N0YXJ0RGF0ZSc7XG4gICAgfVxuICB9XG4gIEBJbnB1dCgpIHNldCBlbmRLZXkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX2VuZEtleSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XG4gICAgfVxuICB9XG4gIG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnbG9jYWxlJyxcbiAgICAnZW5kS2V5JyxcbiAgICAnc3RhcnRLZXknXG4gIF07XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZSB8fCBudWxsO1xuICB9XG4gIHNldCB2YWx1ZSh2YWwpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbDtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWwpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIEBPdXRwdXQoJ2NoYW5nZScpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgncmFuZ2VDbGlja2VkJykgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgnZGF0ZXNVcGRhdGVkJykgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZW5kRGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcml2YXRlIF9lbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxuICAgIHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmXG4gICkge1xuICAgIHRoaXMuZHJvcHMgPSAnZG93bic7XG4gICAgdGhpcy5vcGVucyA9ICdhdXRvJztcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCk7XG4gICAgdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgIHRoaXMucGlja2VyID0gKDxEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQ+Y29tcG9uZW50UmVmLmluc3RhbmNlKTtcbiAgICB0aGlzLnBpY2tlci5pbmxpbmUgPSBmYWxzZTsgLy8gc2V0IGlubGluZSB0byBmYWxzZSBmb3IgYWxsIGRpcmVjdGl2ZSB1c2FnZVxuICB9XG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGlja2VyLnN0YXJ0RGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIuZW5kRGF0ZUNoYW5nZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChpdGVtQ2hhbmdlZDogYW55KSA9PiB7XG4gICAgICB0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLnJhbmdlQ2xpY2tlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLmRhdGVzVXBkYXRlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKHJhbmdlOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQocmFuZ2UpO1xuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLmNob29zZWREYXRlLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBhbnkpID0+IHtcbiAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB7fTtcbiAgICAgICAgdmFsdWVbdGhpcy5fc3RhcnRLZXldID0gY2hhbmdlLnN0YXJ0RGF0ZTtcbiAgICAgICAgdmFsdWVbdGhpcy5fZW5kS2V5XSA9IGNoYW5nZS5lbmREYXRlO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgY2hhbmdlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5maXJzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmZpcnN0TW9udGhEYXlDbGFzcztcbiAgICB0aGlzLnBpY2tlci5sYXN0TW9udGhEYXlDbGFzcyA9IHRoaXMubGFzdE1vbnRoRGF5Q2xhc3M7XG4gICAgdGhpcy5waWNrZXIuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xuICAgIHRoaXMucGlja2VyLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyA9IHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzO1xuICAgIHRoaXMucGlja2VyLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyA9IHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzO1xuICAgIHRoaXMucGlja2VyLmRyb3BzID0gdGhpcy5kcm9wcztcbiAgICB0aGlzLnBpY2tlci5vcGVucyA9IHRoaXMub3BlbnM7XG4gICAgdGhpcy5sb2NhbGVEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmxvY2FsZSkuY3JlYXRlKCk7XG4gICAgdGhpcy5waWNrZXIuY2xvc2VPbkF1dG9BcHBseSA9IHRoaXMuY2xvc2VPbkF1dG9BcHBseTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkICB7XG4gICAgZm9yIChjb25zdCBjaGFuZ2UgaW4gY2hhbmdlcykge1xuICAgICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoY2hhbmdlKSkge1xuICAgICAgICBpZiAodGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xuICAgICAgICAgIHRoaXMucGlja2VyW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLmxvY2FsZURpZmZlcikge1xuICAgICAgY29uc3QgY2hhbmdlcyA9IHRoaXMubG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xuICAgICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgICAgdGhpcy5waWNrZXIudXBkYXRlTG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gIH1cblxuICBvcGVuKGV2ZW50PzogYW55KSB7XG4gICAgdGhpcy5waWNrZXIuc2hvdyhldmVudCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBoaWRlKGU/KSB7XG4gICAgdGhpcy5waWNrZXIuaGlkZShlKTtcbiAgfVxuICB0b2dnbGUoZT8pIHtcbiAgICBpZiAodGhpcy5waWNrZXIuaXNTaG93bikge1xuICAgICAgdGhpcy5oaWRlKGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oZSk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5waWNrZXIuY2xlYXIoKTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgfVxuICByZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbikge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG4gIHByaXZhdGUgc2V0VmFsdWUodmFsOiBhbnkpIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgICAgaWYgKHZhbFt0aGlzLl9zdGFydEtleV0pIHtcbiAgICAgICAgdGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHZhbFt0aGlzLl9zdGFydEtleV0pO1xuICAgICAgfVxuICAgICAgaWYgKHZhbFt0aGlzLl9lbmRLZXldKSB7XG4gICAgICAgIHRoaXMucGlja2VyLnNldEVuZERhdGUodmFsW3RoaXMuX2VuZEtleV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5waWNrZXIuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgICAgIGlmICh0aGlzLnBpY2tlci5jaG9zZW5MYWJlbCkge1xuICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5waWNrZXIuY2hvc2VuTGFiZWw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGlja2VyLmNsZWFyKCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBTZXQgcG9zaXRpb24gb2YgdGhlIGNhbGVuZGFyXG4gICAqL1xuICBzZXRQb3NpdGlvbigpIHtcbiAgICBsZXQgc3R5bGU7XG4gICAgbGV0IGNvbnRhaW5lclRvcDtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLnBpY2tlci5waWNrZXJDb250YWluZXIubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWwubmF0aXZlRWxlbWVudDtcbiAgICBpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XG4gICAgICBjb250YWluZXJUb3AgPSAoZWxlbWVudC5vZmZzZXRUb3AgLSBjb250YWluZXIuY2xpZW50SGVpZ2h0KSArICdweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lclRvcCA9ICdhdXRvJztcbiAgICB9XG4gICAgaWYgKHRoaXMub3BlbnMgPT09ICdsZWZ0Jykge1xuICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgbGVmdDogKGVsZW1lbnQub2Zmc2V0TGVmdCAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCArIGVsZW1lbnQuY2xpZW50V2lkdGgpICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgbGVmdDogKGVsZW1lbnQub2Zmc2V0TGVmdCAgKyAgZWxlbWVudC5jbGllbnRXaWR0aCAvIDJcbiAgICAgICAgICAgICAgICAgIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMikgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdyaWdodCcpIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnQub2Zmc2V0TGVmdCAgKyAgZWxlbWVudC5jbGllbnRXaWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyO1xuICAgICAgaWYgKHBvc2l0aW9uIDwgMCkge1xuICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICBsZWZ0OiBlbGVtZW50Lm9mZnNldExlZnQgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgICAgbGVmdDogcG9zaXRpb24gKyAncHgnLFxuICAgICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHN0eWxlLnRvcCk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdsZWZ0Jywgc3R5bGUubGVmdCk7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdyaWdodCcsIHN0eWxlLnJpZ2h0KTtcbiAgICB9XG4gIH1cbiAgaW5wdXRDaGFuZ2VkKGUpIHtcbiAgICBpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLnBpY2tlci5sb2NhbGUuc2VwYXJhdG9yKTtcbiAgICBsZXQgc3RhcnQgPSBudWxsLCBlbmQgPSBudWxsO1xuICAgIGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xuICAgICAgc3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG4gICAgICBlbmQgPSBtb21lbnQoZGF0ZVN0cmluZ1sxXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XG4gICAgICBzdGFydCA9IG1vbWVudChlLnRhcmdldC52YWx1ZSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XG4gICAgICBlbmQgPSBzdGFydDtcbiAgICB9XG4gICAgaWYgKCFzdGFydC5pc1ZhbGlkKCkgfHwgIWVuZC5pc1ZhbGlkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHN0YXJ0KTtcbiAgICB0aGlzLnBpY2tlci5zZXRFbmREYXRlKGVuZCk7XG4gICAgdGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xuXG4gIH1cbiAgLyoqXG4gICAqIEZvciBjbGljayBvdXRzaWRlIG9mIHRoZSBjYWxlbmRhcidzIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZXZlbnQgZXZlbnQgb2JqZWN0XG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycsIFsnJGV2ZW50J10pXG4gIG91dHNpZGVDbGljayhldmVudCk6IHZvaWQge1xuICAgIGlmICghZXZlbnQudGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25neC1kYXRlcmFuZ2VwaWNrZXItYWN0aW9uJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxufVxuIl19