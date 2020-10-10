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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsd0JBQXdCLEVBQ3hCLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLGlCQUFpQixFQUlqQixLQUFLLEVBR0wsZUFBZSxFQUNmLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0saUJBQWlCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQWlCdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBMkhuQyxZQUNTLGdCQUFrQyxFQUNsQyxrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVB2QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDcEMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FB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QyxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQ3JFO1NBQ0o7S0FDQSxDQUFDOzZDQTZIMkIsZ0JBQWdCO1FBQ2QsaUJBQWlCO1FBQ1Qsd0JBQXdCO1FBQzlDLFVBQVU7UUFDSixTQUFTO1FBQ1gsZUFBZTtRQUNSLGFBQWE7UUFDakIsVUFBVTtHQW5JckIsd0JBQXdCLENBMFZwQztTQTFWWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBmb3J3YXJkUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIElucHV0LFxuICBEb0NoZWNrLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25neERhdGVyYW5nZXBpY2tlck1kXScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdvcGVuKCknLFxuICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSksIG11bHRpOiB0cnVlXG4gICAgfVxuXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG4gIHB1YmxpYyBwaWNrZXI6IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudDtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICBwcml2YXRlIF92YWx1ZTogYW55O1xuICBwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICBASW5wdXQoKVxuICB0aW1lcGlja2VyVGltZXpvbmU6IHN0cmluZztcbiAgQElucHV0KClcbiAgc3RhcnREYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgQElucHV0KClcbiAgZW5kRGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xuICBASW5wdXQoKVxuICBtYXhEYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgQElucHV0KClcbiAgYXV0b0FwcGx5OiBib29sZWFuO1xuICBASW5wdXQoKVxuICBhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgbGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIHNpbmdsZURhdGVQaWNrZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93RHJvcGRvd25zOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBpc0ludmFsaWREYXRlOiBGdW5jdGlvbjtcbiAgQElucHV0KClcbiAgaXNDdXN0b21EYXRlOiBGdW5jdGlvbjtcbiAgQElucHV0KClcbiAgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZURpcmVjdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgcmFuZ2VzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIG9wZW5zOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGRyb3BzOiBzdHJpbmc7XG4gIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgbGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XG4gIC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lSW5wdXQgPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVpvbmUgPSBmYWxzZTtcbiAgQElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG4gIF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuICBASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG4gICAgdGhpcy5fbG9jYWxlID0gey4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZX07XG4gIH1cbiAgZ2V0IGxvY2FsZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cbiAgQElucHV0KClcbiAgcHJpdmF0ZSBfZW5kS2V5OiBzdHJpbmcgPSAnZW5kRGF0ZSc7XG4gIHByaXZhdGUgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcbiAgQElucHV0KCkgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9ICdzdGFydERhdGUnO1xuICAgIH1cbiAgfVxuICBASW5wdXQoKSBzZXQgZW5kS2V5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW5kS2V5ID0gJ2VuZERhdGUnO1xuICAgIH1cbiAgfVxuICBub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbXG4gICAgJ2xvY2FsZScsXG4gICAgJ2VuZEtleScsXG4gICAgJ3N0YXJ0S2V5J1xuICBdO1xuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcbiAgfVxuICBzZXQgdmFsdWUodmFsKSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fb25DaGFuZ2UodmFsKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBAT3V0cHV0KCdjaGFuZ2UnKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ3JhbmdlQ2xpY2tlZCcpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2RhdGVzVXBkYXRlZCcpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICBwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgICB0aGlzLmRyb3BzID0gJ2Rvd24nO1xuICAgIHRoaXMub3BlbnMgPSAnYXV0byc7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQpO1xuICAgIHZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICB0aGlzLnBpY2tlciA9ICg8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PmNvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG4gICAgdGhpcy5waWNrZXIuaW5saW5lID0gZmFsc2U7IC8vIHNldCBpbmxpbmUgdG8gZmFsc2UgZm9yIGFsbCBkaXJlY3RpdmUgdXNhZ2VcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBpY2tlci5zdGFydERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLmVuZERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5yYW5nZUNsaWNrZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG4gICAgICB0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5kYXRlc1VwZGF0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5jaG9vc2VkRGF0ZS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiB7XG4gICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ge307XG4gICAgICAgIHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IGNoYW5nZS5zdGFydERhdGU7XG4gICAgICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgICAgICBpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hhbmdlLmNob3NlbkxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XG4gICAgdGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xuICAgIHRoaXMucGlja2VyLmVtcHR5V2Vla1Jvd0NsYXNzID0gdGhpcy5lbXB0eVdlZWtSb3dDbGFzcztcbiAgICB0aGlzLnBpY2tlci5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcbiAgICB0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcbiAgICB0aGlzLnBpY2tlci5kcm9wcyA9IHRoaXMuZHJvcHM7XG4gICAgdGhpcy5waWNrZXIub3BlbnMgPSB0aGlzLm9wZW5zO1xuICAgIHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xuICAgIHRoaXMucGlja2VyLmNsb3NlT25BdXRvQXBwbHkgPSB0aGlzLmNsb3NlT25BdXRvQXBwbHk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCAge1xuICAgIGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcbiAgICAgICAgaWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcbiAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgb3BlbihldmVudD86IGFueSkge1xuICAgIHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgaGlkZShlPykge1xuICAgIHRoaXMucGlja2VyLmhpZGUoZSk7XG4gIH1cbiAgdG9nZ2xlKGU/KSB7XG4gICAgaWYgKHRoaXMucGlja2VyLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuaGlkZShlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKGUpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucGlja2VyLmNsZWFyKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuICBwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgIGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XG4gICAgICAgIHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZSh2YWxbdGhpcy5fc3RhcnRLZXldKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xuICAgICAgICB0aGlzLnBpY2tlci5zZXRFbmREYXRlKHZhbFt0aGlzLl9lbmRLZXldKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgICBpZiAodGhpcy5waWNrZXIuY2hvc2VuTGFiZWwpIHtcbiAgICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBpY2tlci5jbGVhcigpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuICAgKi9cbiAgc2V0UG9zaXRpb24oKSB7XG4gICAgbGV0IHN0eWxlO1xuICAgIGxldCBjb250YWluZXJUb3A7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PT0gJ3VwJykge1xuICAgICAgY29udGFpbmVyVG9wID0gKGVsZW1lbnQub2Zmc2V0VG9wIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCkgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXJUb3AgPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcbiAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50LmNsaWVudFdpZHRoKSArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyXG4gICAgICAgICAgICAgICAgICAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAncmlnaHQnKSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IGVsZW1lbnQub2Zmc2V0TGVmdCAgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMjtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uICsgJ3B4JyxcbiAgICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCBzdHlsZS50b3ApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHN0eWxlLmxlZnQpO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XG4gICAgfVxuICB9XG4gIGlucHV0Q2hhbmdlZChlKSB7XG4gICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2lucHV0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWUudGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkYXRlU3RyaW5nID0gZS50YXJnZXQudmFsdWUuc3BsaXQodGhpcy5waWNrZXIubG9jYWxlLnNlcGFyYXRvcik7XG4gICAgbGV0IHN0YXJ0ID0gbnVsbCwgZW5kID0gbnVsbDtcbiAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHN0YXJ0ID0gbW9tZW50KGRhdGVTdHJpbmdbMF0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyIHx8IHN0YXJ0ID09PSBudWxsIHx8IGVuZCA9PT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBtb21lbnQoZS50YXJnZXQudmFsdWUsIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgfVxuICAgIGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZShzdGFydCk7XG4gICAgdGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xuICAgIHRoaXMucGlja2VyLnVwZGF0ZVZpZXcoKTtcblxuICB9XG4gIC8qKlxuICAgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcbiAgICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuICBvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWV2ZW50LnRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==