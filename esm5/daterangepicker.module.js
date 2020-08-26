import { __decorate } from "tslib";
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LOCALE_CONFIG } from './daterangepicker.config';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleService } from './locale.service';
import { TimePipe } from './time.pipe';
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
            declarations: [DaterangepickerComponent, DaterangepickerDirective, TimePipe],
            imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatTabsModule, OverlayModule],
            exports: [DaterangepickerComponent, DaterangepickerDirective],
        })
    ], NgxDaterangepickerMd);
    return NgxDaterangepickerMd;
}());
export { NgxDaterangepickerMd };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN2RSxPQUFPLEVBQWdCLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBT3ZDO0lBQUE7SUFVQSxDQUFDOzZCQVZZLG9CQUFvQjtJQUN0Qiw0QkFBTyxHQUFkLFVBQWUsTUFBeUI7UUFBekIsdUJBQUEsRUFBQSxXQUF5QjtRQUNwQyxPQUFPO1lBQ0gsUUFBUSxFQUFFLHNCQUFvQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1AsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7Z0JBQzVDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2FBQzdFO1NBQ0osQ0FBQztJQUNOLENBQUM7O0lBVFEsb0JBQW9CO1FBTGhDLFFBQVEsQ0FBQztZQUNOLFlBQVksRUFBRSxDQUFDLHdCQUF3QixFQUFFLHdCQUF3QixFQUFFLFFBQVEsQ0FBQztZQUM1RSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLGFBQWEsQ0FBQztZQUN6SCxPQUFPLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSx3QkFBd0IsQ0FBQztTQUNoRSxDQUFDO09BQ1csb0JBQW9CLENBVWhDO0lBQUQsMkJBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTWF0QnV0dG9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJztcclxuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcclxuaW1wb3J0IHtNYXRUYWJzTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJzJztcclxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTG9jYWxlQ29uZmlnLCBMT0NBTEVfQ09ORklHIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4vbG9jYWxlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBUaW1lUGlwZSB9IGZyb20gJy4vdGltZS5waXBlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBkZWNsYXJhdGlvbnM6IFtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSwgVGltZVBpcGVdLFxyXG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUsIE1hdEJ1dHRvbk1vZHVsZSwgTWF0U2VsZWN0TW9kdWxlLCBNYXRUYWJzTW9kdWxlLCBPdmVybGF5TW9kdWxlXSxcclxuICAgIGV4cG9ydHM6IFtEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQsIERhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hEYXRlcmFuZ2VwaWNrZXJNZCB7XHJcbiAgICBzdGF0aWMgZm9yUm9vdChjb25maWc6IExvY2FsZUNvbmZpZyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxOZ3hEYXRlcmFuZ2VwaWNrZXJNZD4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5nTW9kdWxlOiBOZ3hEYXRlcmFuZ2VwaWNrZXJNZCxcclxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICB7IHByb3ZpZGU6IExPQ0FMRV9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcclxuICAgICAgICAgICAgICAgIHsgcHJvdmlkZTogTG9jYWxlU2VydmljZSwgdXNlQ2xhc3M6IExvY2FsZVNlcnZpY2UsIGRlcHM6IFtMT0NBTEVfQ09ORklHXSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIl19