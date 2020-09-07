import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig, LOCALE_CONFIG } from './daterangepicker.config';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleService } from './locale.service';
import { TimePipe } from './time.pipe';
import { TimeZonePipe } from './timezone.pipe';

@NgModule({
    declarations: [DaterangepickerComponent, DaterangepickerDirective, TimePipe, TimeZonePipe],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatTabsModule, OverlayModule, ],
    exports: [DaterangepickerComponent, DaterangepickerDirective],
})
export class NgxDaterangepickerMd {
    static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDaterangepickerMd> {
        return {
            ngModule: NgxDaterangepickerMd,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] },
            ],
        };
    }
}
