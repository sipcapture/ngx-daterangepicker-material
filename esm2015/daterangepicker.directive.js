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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsd0JBQXdCLEVBQ3hCLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLGlCQUFpQixFQUlqQixLQUFLLEVBR0wsZUFBZSxFQUNmLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0saUJBQWlCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2pELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQWlCdkIsSUFBYSx3QkFBd0IsZ0NBQXJDLE1BQWEsd0JBQXdCO0lBNEhuQyxZQUNTLGdCQUFrQyxFQUNsQyxrQkFBcUMsRUFDcEMseUJBQW1ELEVBQ25ELEdBQWUsRUFDZixTQUFvQixFQUNwQixPQUF3QixFQUN4QixjQUE2QixFQUM3QixVQUFzQjtRQVB2QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDcEMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQUN4QixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FB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QyxFQUFFLEtBQUssRUFBRSxJQUFJO2FBQ3JFO1NBQ0o7S0FDQSxDQUFDOzZDQThIMkIsZ0JBQWdCO1FBQ2QsaUJBQWlCO1FBQ1Qsd0JBQXdCO1FBQzlDLFVBQVU7UUFDSixTQUFTO1FBQ1gsZUFBZTtRQUNSLGFBQWE7UUFDakIsVUFBVTtHQXBJckIsd0JBQXdCLENBMlZwQztTQTNWWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBmb3J3YXJkUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIElucHV0LFxuICBEb0NoZWNrLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25neERhdGVyYW5nZXBpY2tlck1kXScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdvcGVuKCknLFxuICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSksIG11bHRpOiB0cnVlXG4gICAgfVxuXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG4gIHB1YmxpYyBwaWNrZXI6IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudDtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICBwcml2YXRlIF92YWx1ZTogYW55O1xuICBwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICBcbiAgQElucHV0KClcbiAgdGltZXBpY2tlclRpbWV6b25lOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIHN0YXJ0RGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIGVuZERhdGU6IF9tb21lbnQuTW9tZW50O1xuICBASW5wdXQoKVxuICBtaW5EYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgQElucHV0KClcbiAgbWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIGF1dG9BcHBseTogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgYWx3YXlzU2hvd0NhbGVuZGFyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIGxpbmtlZENhbGVuZGFyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xuICBASW5wdXQoKVxuICBzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dJU09XZWVrTnVtYmVyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgaXNJbnZhbGlkRGF0ZTogRnVuY3Rpb247XG4gIEBJbnB1dCgpXG4gIGlzQ3VzdG9tRGF0ZTogRnVuY3Rpb247XG4gIEBJbnB1dCgpXG4gIHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgY3VzdG9tUmFuZ2VEaXJlY3Rpb246IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHJhbmdlczogYW55O1xuICBASW5wdXQoKVxuICBvcGVuczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBkcm9wczogc3RyaW5nO1xuICBmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgZW1wdHlXZWVrUm93Q2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgZmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgbG9ja1N0YXJ0RGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZUlucHV0ID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHRpbWVab25lID0gZmFsc2U7XG4gIEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xuICBfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcbiAgQElucHV0KCkgc2V0IGxvY2FsZSh2YWx1ZSkge1xuICAgIHRoaXMuX2xvY2FsZSA9IHsuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWV9O1xuICB9XG4gIGdldCBsb2NhbGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICB9XG4gIEBJbnB1dCgpXG4gIHByaXZhdGUgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xuICBwcml2YXRlIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XG4gIEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fc3RhcnRLZXkgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcbiAgICB9XG4gIH1cbiAgQElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZW5kS2V5ID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VuZEtleSA9ICdlbmREYXRlJztcbiAgICB9XG4gIH1cbiAgbm90Rm9yQ2hhbmdlc1Byb3BlcnR5OiBBcnJheTxzdHJpbmc+ID0gW1xuICAgICdsb2NhbGUnLFxuICAgICdlbmRLZXknLFxuICAgICdzdGFydEtleSdcbiAgXTtcblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlIHx8IG51bGw7XG4gIH1cbiAgc2V0IHZhbHVlKHZhbCkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgQE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdyYW5nZUNsaWNrZWQnKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCdkYXRlc1VwZGF0ZWQnKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgX2VsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXG4gICAgcHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgdGhpcy5kcm9wcyA9ICdkb3duJztcbiAgICB0aGlzLm9wZW5zID0gJ2F1dG8nO1xuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50KTtcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgdGhpcy5waWNrZXIgPSAoPERhdGVyYW5nZXBpY2tlckNvbXBvbmVudD5jb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuICAgIHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlOyAvLyBzZXQgaW5saW5lIHRvIGZhbHNlIGZvciBhbGwgZGlyZWN0aXZlIHVzYWdlXG4gIH1cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZW5kRGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuICAgICAgdGhpcy5yYW5nZUNsaWNrZWQuZW1pdChyYW5nZSk7XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xuICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdChyYW5nZSk7XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xuICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHt9O1xuICAgICAgICB2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xuICAgICAgICB2YWx1ZVt0aGlzLl9lbmRLZXldID0gY2hhbmdlLmVuZERhdGU7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGFuZ2UuY2hvc2VuTGFiZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNoYW5nZS5jaG9zZW5MYWJlbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xuICAgIHRoaXMucGlja2VyLmxhc3RNb250aERheUNsYXNzID0gdGhpcy5sYXN0TW9udGhEYXlDbGFzcztcbiAgICB0aGlzLnBpY2tlci5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XG4gICAgdGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XG4gICAgdGhpcy5waWNrZXIubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzID0gdGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M7XG4gICAgdGhpcy5waWNrZXIuZHJvcHMgPSB0aGlzLmRyb3BzO1xuICAgIHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcbiAgICB0aGlzLmxvY2FsZURpZmZlciA9IHRoaXMuZGlmZmVycy5maW5kKHRoaXMubG9jYWxlKS5jcmVhdGUoKTtcbiAgICB0aGlzLnBpY2tlci5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQgIHtcbiAgICBmb3IgKGNvbnN0IGNoYW5nZSBpbiBjaGFuZ2VzKSB7XG4gICAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShjaGFuZ2UpKSB7XG4gICAgICAgIGlmICh0aGlzLm5vdEZvckNoYW5nZXNQcm9wZXJ0eS5pbmRleE9mKGNoYW5nZSkgPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5waWNrZXJbY2hhbmdlXSA9IGNoYW5nZXNbY2hhbmdlXS5jdXJyZW50VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubG9jYWxlRGlmZmVyKSB7XG4gICAgICBjb25zdCBjaGFuZ2VzID0gdGhpcy5sb2NhbGVEaWZmZXIuZGlmZih0aGlzLmxvY2FsZSk7XG4gICAgICBpZiAoY2hhbmdlcykge1xuICAgICAgICB0aGlzLnBpY2tlci51cGRhdGVMb2NhbGUodGhpcy5sb2NhbGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQmx1cigpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgfVxuXG4gIG9wZW4oZXZlbnQ/OiBhbnkpIHtcbiAgICB0aGlzLnBpY2tlci5zaG93KGV2ZW50KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhpZGUoZT8pIHtcbiAgICB0aGlzLnBpY2tlci5oaWRlKGUpO1xuICB9XG4gIHRvZ2dsZShlPykge1xuICAgIGlmICh0aGlzLnBpY2tlci5pc1Nob3duKSB7XG4gICAgICB0aGlzLmhpZGUoZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbihlKTtcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnBpY2tlci5jbGVhcigpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICB9XG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm4pIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuKSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cbiAgcHJpdmF0ZSBzZXRWYWx1ZSh2YWw6IGFueSkge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG4gICAgICBpZiAodmFsW3RoaXMuX3N0YXJ0S2V5XSkge1xuICAgICAgICB0aGlzLnBpY2tlci5zZXRTdGFydERhdGUodmFsW3RoaXMuX3N0YXJ0S2V5XSk7XG4gICAgICB9XG4gICAgICBpZiAodmFsW3RoaXMuX2VuZEtleV0pIHtcbiAgICAgICAgdGhpcy5waWNrZXIuc2V0RW5kRGF0ZSh2YWxbdGhpcy5fZW5kS2V5XSk7XG4gICAgICB9XG4gICAgICB0aGlzLnBpY2tlci5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgaWYgKHRoaXMucGlja2VyLmNob3NlbkxhYmVsKSB7XG4gICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBpY2tlci5jaG9zZW5MYWJlbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5waWNrZXIuY2xlYXIoKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFNldCBwb3NpdGlvbiBvZiB0aGUgY2FsZW5kYXJcbiAgICovXG4gIHNldFBvc2l0aW9uKCkge1xuICAgIGxldCBzdHlsZTtcbiAgICBsZXQgY29udGFpbmVyVG9wO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMucGlja2VyLnBpY2tlckNvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50O1xuICAgIGlmICh0aGlzLmRyb3BzICYmIHRoaXMuZHJvcHMgPT09ICd1cCcpIHtcbiAgICAgIGNvbnRhaW5lclRvcCA9IChlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQpICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGFpbmVyVG9wID0gJ2F1dG8nO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcGVucyA9PT0gJ2xlZnQnKSB7XG4gICAgICBzdHlsZSA9IHtcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICBsZWZ0OiAoZWxlbWVudC5vZmZzZXRMZWZ0IC0gY29udGFpbmVyLmNsaWVudFdpZHRoICsgZWxlbWVudC5jbGllbnRXaWR0aCkgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAnY2VudGVyJykge1xuICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICBsZWZ0OiAoZWxlbWVudC5vZmZzZXRMZWZ0ICArICBlbGVtZW50LmNsaWVudFdpZHRoIC8gMlxuICAgICAgICAgICAgICAgICAgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyKSArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBzdHlsZSA9IHtcbiAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICBsZWZ0OiBlbGVtZW50Lm9mZnNldExlZnQgICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudC5vZmZzZXRMZWZ0ICArICBlbGVtZW50LmNsaWVudFdpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XG4gICAgICBpZiAocG9zaXRpb24gPCAwKSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IGVsZW1lbnQub2Zmc2V0TGVmdCArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgICBsZWZ0OiBwb3NpdGlvbiArICdweCcsXG4gICAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzdHlsZSkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3JpZ2h0Jywgc3R5bGUucmlnaHQpO1xuICAgIH1cbiAgfVxuICBpbnB1dENoYW5nZWQoZSkge1xuICAgIGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGF0ZVN0cmluZyA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KHRoaXMucGlja2VyLmxvY2FsZS5zZXBhcmF0b3IpO1xuICAgIGxldCBzdGFydCA9IG51bGwsIGVuZCA9IG51bGw7XG4gICAgaWYgKGRhdGVTdHJpbmcubGVuZ3RoID09PSAyKSB7XG4gICAgICBzdGFydCA9IG1vbWVudChkYXRlU3RyaW5nWzBdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcbiAgICAgIGVuZCA9IG1vbWVudChkYXRlU3RyaW5nWzFdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlciB8fCBzdGFydCA9PT0gbnVsbCB8fCBlbmQgPT09IG51bGwpIHtcbiAgICAgIHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcbiAgICAgIGVuZCA9IHN0YXJ0O1xuICAgIH1cbiAgICBpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBpY2tlci5zZXRTdGFydERhdGUoc3RhcnQpO1xuICAgIHRoaXMucGlja2VyLnNldEVuZERhdGUoZW5kKTtcbiAgICB0aGlzLnBpY2tlci51cGRhdGVWaWV3KCk7XG5cbiAgfVxuICAvKipcbiAgICogRm9yIGNsaWNrIG91dHNpZGUgb2YgdGhlIGNhbGVuZGFyJ3MgY29udGFpbmVyXG4gICAqIEBwYXJhbSBldmVudCBldmVudCBvYmplY3RcbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSlcbiAgb3V0c2lkZUNsaWNrKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFldmVudC50YXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnbmd4LWRhdGVyYW5nZXBpY2tlci1hY3Rpb24nKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=