import { __decorate } from "tslib";
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LOCALE_CONFIG } from './daterangepicker.config';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleService } from './locale.service';
import { TimePipe } from './time.pipe';
import { TimeZonePipe } from './timezone.pipe';
var NgxDaterangepickerMd = /** @class */ (function () {
    function NgxDaterangepickerMd() {
    }
    NgxDaterangepickerMd_1 = NgxDaterangepickerMd;
    NgxDaterangepickerMd.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: NgxDaterangepickerMd_1,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] },
            ],
        };
    };
    var NgxDaterangepickerMd_1;
    NgxDaterangepickerMd = NgxDaterangepickerMd_1 = __decorate([
        NgModule({
            declarations: [DaterangepickerComponent, DaterangepickerDirective, TimePipe, TimeZonePipe],
            imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatTabsModule, OverlayModule,
                MatInputModule],
            exports: [DaterangepickerComponent, DaterangepickerDirective],
        })
    ], NgxDaterangepickerMd);
    return NgxDaterangepickerMd;
}());
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQTtBQUN4RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDdkUsT0FBTyxFQUFnQixhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFRL0M7SUFBQTtJQVVBLENBQUM7NkJBVlksb0JBQW9CO0lBQ3RCLDRCQUFPLEdBQWQsVUFBZSxNQUF5QjtRQUF6Qix1QkFBQSxFQUFBLFdBQXlCO1FBQ3BDLE9BQU87WUFDSCxRQUFRLEVBQUUsc0JBQW9CO1lBQzlCLFNBQVMsRUFBRTtnQkFDUCxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDNUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7YUFDN0U7U0FDSixDQUFDO0lBQ04sQ0FBQzs7SUFUUSxvQkFBb0I7UUFOaEMsUUFBUSxDQUFDO1lBQ04sWUFBWSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQztZQUMxRixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGFBQWE7Z0JBQ3RILGNBQWMsQ0FBQztZQUNqQixPQUFPLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQztTQUNoRSxDQUFDO09BQ1csb0JBQW9CLENBVWhDO0lBQUQsMkJBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcclxuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcclxuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCdcclxuaW1wb3J0IHsgTWF0VGFic01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xyXG5pbXBvcnQgeyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMb2NhbGVDb25maWcsIExPQ0FMRV9DT05GSUcgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb25maWcnO1xyXG5pbXBvcnQgeyBEYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGUuc2VydmljZSc7XHJcbmltcG9ydCB7IFRpbWVQaXBlIH0gZnJvbSAnLi90aW1lLnBpcGUnO1xyXG5pbXBvcnQgeyBUaW1lWm9uZVBpcGUgfSBmcm9tICcuL3RpbWV6b25lLnBpcGUnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGRlY2xhcmF0aW9uczogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudCwgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlLCBUaW1lUGlwZSwgVGltZVpvbmVQaXBlXSxcclxuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlLCBNYXRCdXR0b25Nb2R1bGUsIE1hdFNlbGVjdE1vZHVsZSwgTWF0VGFic01vZHVsZSwgT3ZlcmxheU1vZHVsZSxcclxuICAgICAgTWF0SW5wdXRNb2R1bGVdLFxyXG4gICAgZXhwb3J0czogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudCwgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neERhdGVyYW5nZXBpY2tlck1kIHtcclxuICAgIHN0YXRpYyBmb3JSb290KGNvbmZpZzogTG9jYWxlQ29uZmlnID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE5neERhdGVyYW5nZXBpY2tlck1kPiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmdNb2R1bGU6IE5neERhdGVyYW5nZXBpY2tlck1kLFxyXG4gICAgICAgICAgICBwcm92aWRlcnM6IFtcclxuICAgICAgICAgICAgICAgIHsgcHJvdmlkZTogTE9DQUxFX0NPTkZJRywgdXNlVmFsdWU6IGNvbmZpZyB9LFxyXG4gICAgICAgICAgICAgICAgeyBwcm92aWRlOiBMb2NhbGVTZXJ2aWNlLCB1c2VDbGFzczogTG9jYWxlU2VydmljZSwgZGVwczogW0xPQ0FMRV9DT05GSUddIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iXX0=