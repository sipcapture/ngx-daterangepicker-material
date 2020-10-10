import * as tslib_1 from "tslib";
import { Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener, forwardRef, ChangeDetectorRef, Input, KeyValueDiffers, Output, EventEmitter, Renderer2 } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment-timezone';
import { LocaleService } from './locale.service';
var moment = _moment;
var DaterangepickerDirective = /** @class */ (function () {
    function DaterangepickerDirective(viewContainerRef, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
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
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(DaterangepickerComponent);
        viewContainerRef.clear();
        var componentRef = viewContainerRef.createComponent(componentFactory);
        this.picker = componentRef.instance;
        this.picker.inline = false; // set inline to false for all directive usage
    }
    DaterangepickerDirective_1 = DaterangepickerDirective;
    Object.defineProperty(DaterangepickerDirective.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        set: function (value) {
            this._locale = tslib_1.__assign({}, this._localeService.config, value);
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
        var _this = this;
        this.picker.startDateChanged.asObservable().subscribe(function (itemChanged) {
            _this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe(function (itemChanged) {
            _this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe(function (range) {
            _this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe(function (range) {
            _this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe(function (change) {
            if (change) {
                var value = {};
                value[_this._startKey] = change.startDate;
                value[_this._endKey] = change.endDate;
                _this.value = value;
                _this.onChange.emit(value);
                if (typeof change.chosenLabel === 'string') {
                    _this._el.nativeElement.value = change.chosenLabel;
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
    };
    DaterangepickerDirective.prototype.ngOnChanges = function (changes) {
        for (var change in changes) {
            if (changes.hasOwnProperty(change)) {
                if (this.notForChangesProperty.indexOf(change) === -1) {
                    this.picker[change] = changes[change].currentValue;
                }
            }
        }
    };
    DaterangepickerDirective.prototype.ngDoCheck = function () {
        if (this.localeDiffer) {
            var changes = this.localeDiffer.diff(this.locale);
            if (changes) {
                this.picker.updateLocale(this.locale);
            }
        }
    };
    DaterangepickerDirective.prototype.onBlur = function () {
        this._onTouched();
    };
    DaterangepickerDirective.prototype.open = function (event) {
        var _this = this;
        this.picker.show(event);
        setTimeout(function () {
            _this.setPosition();
        });
    };
    DaterangepickerDirective.prototype.hide = function (e) {
        this.picker.hide(e);
    };
    DaterangepickerDirective.prototype.toggle = function (e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
            this.open(e);
        }
    };
    DaterangepickerDirective.prototype.clear = function () {
        this.picker.clear();
    };
    DaterangepickerDirective.prototype.writeValue = function (value) {
        this.setValue(value);
    };
    DaterangepickerDirective.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    DaterangepickerDirective.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    DaterangepickerDirective.prototype.setValue = function (val) {
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
    };
    /**
     * Set position of the calendar
     */
    DaterangepickerDirective.prototype.setPosition = function () {
        var style;
        var containerTop;
        var container = this.picker.pickerContainer.nativeElement;
        var element = this._el.nativeElement;
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
            var position = element.offsetLeft + element.clientWidth / 2 - container.clientWidth / 2;
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
    };
    DaterangepickerDirective.prototype.inputChanged = function (e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            return;
        }
        if (!e.target.value.length) {
            return;
        }
        var dateString = e.target.value.split(this.picker.locale.separator);
        var start = null, end = null;
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
    };
    /**
     * For click outside of the calendar's container
     * @param event event object
     */
    DaterangepickerDirective.prototype.outsideClick = function (event) {
        if (!event.target) {
            return;
        }
        if (event.target.classList.contains('ngx-daterangepicker-action')) {
            return;
        }
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hide();
        }
    };
    var DaterangepickerDirective_1;
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
                    useExisting: forwardRef(function () { return DaterangepickerDirective_1; }), multi: true
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
    return DaterangepickerDirective;
}());
export { DaterangepickerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGdCQUFnQixFQUNoQix3QkFBd0IsRUFDeEIsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsaUJBQWlCLEVBSWpCLEtBQUssRUFHTCxlQUFlLEVBQ2YsTUFBTSxFQUNOLFlBQVksRUFDWixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxLQUFLLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBaUJ2QjtJQTJIRSxrQ0FDUyxnQkFBa0MsRUFDbEMsa0JBQXFDLEVBQ3BDLHlCQUFtRCxFQUNuRCxHQUFlLEVBQ2YsU0FBb0IsRUFDcEIsT0FBd0IsRUFDeEIsY0FBNkIsRUFDN0IsVUFBc0I7UUFQdkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3BDLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBMEI7UUFDbkQsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUNmLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQWpJeEIsY0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENB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Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQXdCLEVBQXhCLENBQXdCLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSTtpQkFDckU7YUFDSjtTQUNBLENBQUM7aURBNkgyQixnQkFBZ0I7WUFDZCxpQkFBaUI7WUFDVCx3QkFBd0I7WUFDOUMsVUFBVTtZQUNKLFNBQVM7WUFDWCxlQUFlO1lBQ1IsYUFBYTtZQUNqQixVQUFVO09BbklyQix3QkFBd0IsQ0EwVnBDO0lBQUQsK0JBQUM7Q0FBQSxBQTFWRCxJQTBWQztTQTFWWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRWxlbWVudFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBmb3J3YXJkUmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIElucHV0LFxuICBEb0NoZWNrLFxuICBLZXlWYWx1ZURpZmZlcixcbiAgS2V5VmFsdWVEaWZmZXJzLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgUmVuZGVyZXIyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQtdGltZXpvbmUnO1xuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcbmltcG9ydCB7IExvY2FsZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsZS5zZXJ2aWNlJztcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25neERhdGVyYW5nZXBpY2tlck1kXScsXG4gIGhvc3Q6IHtcbiAgICAnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnKGNsaWNrKSc6ICdvcGVuKCknLFxuICAgICcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSksIG11bHRpOiB0cnVlXG4gICAgfVxuXVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG4gIHB1YmxpYyBwaWNrZXI6IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudDtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICBwcml2YXRlIF92YWx1ZTogYW55O1xuICBwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xuICBASW5wdXQoKVxuICB0aW1lcGlja2VyVGltZXpvbmU6IHN0cmluZztcbiAgQElucHV0KClcbiAgc3RhcnREYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgQElucHV0KClcbiAgZW5kRGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xuICBASW5wdXQoKVxuICBtYXhEYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgQElucHV0KClcbiAgYXV0b0FwcGx5OiBib29sZWFuO1xuICBASW5wdXQoKVxuICBhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgbGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIHNpbmdsZURhdGVQaWNrZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93RHJvcGRvd25zOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBpc0ludmFsaWREYXRlOiBGdW5jdGlvbjtcbiAgQElucHV0KClcbiAgaXNDdXN0b21EYXRlOiBGdW5jdGlvbjtcbiAgQElucHV0KClcbiAgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZURpcmVjdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgcmFuZ2VzOiBhbnk7XG4gIEBJbnB1dCgpXG4gIG9wZW5zOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGRyb3BzOiBzdHJpbmc7XG4gIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKVxuICBmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KClcbiAgbGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpXG4gIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpXG4gIHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcbiAgQElucHV0KClcbiAgc2hvd0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XG4gIC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lSW5wdXQgPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVpvbmUgPSBmYWxzZTtcbiAgQElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XG4gIF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xuICBASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG4gICAgdGhpcy5fbG9jYWxlID0gey4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZX07XG4gIH1cbiAgZ2V0IGxvY2FsZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cbiAgQElucHV0KClcbiAgcHJpdmF0ZSBfZW5kS2V5OiBzdHJpbmcgPSAnZW5kRGF0ZSc7XG4gIHByaXZhdGUgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcbiAgQElucHV0KCkgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zdGFydEtleSA9ICdzdGFydERhdGUnO1xuICAgIH1cbiAgfVxuICBASW5wdXQoKSBzZXQgZW5kS2V5KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW5kS2V5ID0gJ2VuZERhdGUnO1xuICAgIH1cbiAgfVxuICBub3RGb3JDaGFuZ2VzUHJvcGVydHk6IEFycmF5PHN0cmluZz4gPSBbXG4gICAgJ2xvY2FsZScsXG4gICAgJ2VuZEtleScsXG4gICAgJ3N0YXJ0S2V5J1xuICBdO1xuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcbiAgfVxuICBzZXQgdmFsdWUodmFsKSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWw7XG4gICAgdGhpcy5fb25DaGFuZ2UodmFsKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBAT3V0cHV0KCdjaGFuZ2UnKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ3JhbmdlQ2xpY2tlZCcpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoJ2RhdGVzVXBkYXRlZCcpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzdGFydERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICBwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgICB0aGlzLmRyb3BzID0gJ2Rvd24nO1xuICAgIHRoaXMub3BlbnMgPSAnYXV0byc7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQpO1xuICAgIHZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICB0aGlzLnBpY2tlciA9ICg8RGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50PmNvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG4gICAgdGhpcy5waWNrZXIuaW5saW5lID0gZmFsc2U7IC8vIHNldCBpbmxpbmUgdG8gZmFsc2UgZm9yIGFsbCBkaXJlY3RpdmUgdXNhZ2VcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBpY2tlci5zdGFydERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xuICAgIH0pO1xuICAgIHRoaXMucGlja2VyLmVuZERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xuICAgICAgdGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5yYW5nZUNsaWNrZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG4gICAgICB0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5kYXRlc1VwZGF0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XG4gICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcbiAgICB9KTtcbiAgICB0aGlzLnBpY2tlci5jaG9vc2VkRGF0ZS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiB7XG4gICAgICBpZiAoY2hhbmdlKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ge307XG4gICAgICAgIHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IGNoYW5nZS5zdGFydERhdGU7XG4gICAgICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQodmFsdWUpO1xuICAgICAgICBpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hhbmdlLmNob3NlbkxhYmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5waWNrZXIuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XG4gICAgdGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xuICAgIHRoaXMucGlja2VyLmVtcHR5V2Vla1Jvd0NsYXNzID0gdGhpcy5lbXB0eVdlZWtSb3dDbGFzcztcbiAgICB0aGlzLnBpY2tlci5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcbiAgICB0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcbiAgICB0aGlzLnBpY2tlci5kcm9wcyA9IHRoaXMuZHJvcHM7XG4gICAgdGhpcy5waWNrZXIub3BlbnMgPSB0aGlzLm9wZW5zO1xuICAgIHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xuICAgIHRoaXMucGlja2VyLmNsb3NlT25BdXRvQXBwbHkgPSB0aGlzLmNsb3NlT25BdXRvQXBwbHk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCAge1xuICAgIGZvciAoY29uc3QgY2hhbmdlIGluIGNoYW5nZXMpIHtcbiAgICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcbiAgICAgICAgaWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcbiAgICAgICAgICB0aGlzLnBpY2tlcltjaGFuZ2VdID0gY2hhbmdlc1tjaGFuZ2VdLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcbiAgICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcbiAgICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICAgIHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25CbHVyKCkge1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgb3BlbihldmVudD86IGFueSkge1xuICAgIHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgaGlkZShlPykge1xuICAgIHRoaXMucGlja2VyLmhpZGUoZSk7XG4gIH1cbiAgdG9nZ2xlKGU/KSB7XG4gICAgaWYgKHRoaXMucGlja2VyLmlzU2hvd24pIHtcbiAgICAgIHRoaXMuaGlkZShlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKGUpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucGlja2VyLmNsZWFyKCk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbikge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuICBwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcbiAgICAgIGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XG4gICAgICAgIHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZSh2YWxbdGhpcy5fc3RhcnRLZXldKTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xuICAgICAgICB0aGlzLnBpY2tlci5zZXRFbmREYXRlKHZhbFt0aGlzLl9lbmRLZXldKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgICBpZiAodGhpcy5waWNrZXIuY2hvc2VuTGFiZWwpIHtcbiAgICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBpY2tlci5jbGVhcigpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxuICAgKi9cbiAgc2V0UG9zaXRpb24oKSB7XG4gICAgbGV0IHN0eWxlO1xuICAgIGxldCBjb250YWluZXJUb3A7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PT0gJ3VwJykge1xuICAgICAgY29udGFpbmVyVG9wID0gKGVsZW1lbnQub2Zmc2V0VG9wIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCkgKyAncHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250YWluZXJUb3AgPSAnYXV0byc7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcbiAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50LmNsaWVudFdpZHRoKSArICdweCcsXG4gICAgICAgICAgcmlnaHQ6ICdhdXRvJ1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IChlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyXG4gICAgICAgICAgICAgICAgICAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDIpICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAncmlnaHQnKSB7XG4gICAgICAgIHN0eWxlID0ge1xuICAgICAgICAgIHRvcDogY29udGFpbmVyVG9wLFxuICAgICAgICAgIGxlZnQ6IGVsZW1lbnQub2Zmc2V0TGVmdCAgKyAncHgnLFxuICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcG9zaXRpb24gPSBlbGVtZW50Lm9mZnNldExlZnQgICsgIGVsZW1lbnQuY2xpZW50V2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMjtcbiAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgdG9wOiBjb250YWluZXJUb3AsXG4gICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0ICsgJ3B4JyxcbiAgICAgICAgICByaWdodDogJ2F1dG8nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgc3R5bGUgPSB7XG4gICAgICAgICAgICB0b3A6IGNvbnRhaW5lclRvcCxcbiAgICAgICAgICAgIGxlZnQ6IHBvc2l0aW9uICsgJ3B4JyxcbiAgICAgICAgICAgIHJpZ2h0OiAnYXV0bydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICd0b3AnLCBzdHlsZS50b3ApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHN0eWxlLmxlZnQpO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XG4gICAgfVxuICB9XG4gIGlucHV0Q2hhbmdlZChlKSB7XG4gICAgaWYgKGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ2lucHV0Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWUudGFyZ2V0LnZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkYXRlU3RyaW5nID0gZS50YXJnZXQudmFsdWUuc3BsaXQodGhpcy5waWNrZXIubG9jYWxlLnNlcGFyYXRvcik7XG4gICAgbGV0IHN0YXJ0ID0gbnVsbCwgZW5kID0gbnVsbDtcbiAgICBpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHN0YXJ0ID0gbW9tZW50KGRhdGVTdHJpbmdbMF0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyIHx8IHN0YXJ0ID09PSBudWxsIHx8IGVuZCA9PT0gbnVsbCkge1xuICAgICAgc3RhcnQgPSBtb21lbnQoZS50YXJnZXQudmFsdWUsIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgZW5kID0gc3RhcnQ7XG4gICAgfVxuICAgIGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZShzdGFydCk7XG4gICAgdGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xuICAgIHRoaXMucGlja2VyLnVwZGF0ZVZpZXcoKTtcblxuICB9XG4gIC8qKlxuICAgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcbiAgICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuICBvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIWV2ZW50LnRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==