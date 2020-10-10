import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'
import { MatTabsModule } from '@angular/material/tabs';
import { DaterangepickerComponent } from './daterangepicker.component';
import { LocaleConfig, LOCALE_CONFIG } from './daterangepicker.config';
import { DaterangepickerDirective } from './daterangepicker.directive';
import { LocaleService } from './locale.service';
import { TimeZonePipe } from './timezone.pipe';

@NgModule({
    declarations: [DaterangepickerComponent, DaterangepickerDirective, TimeZonePipe],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSelectModule, MatTabsModule, OverlayModule,
      MatInputModule],
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
