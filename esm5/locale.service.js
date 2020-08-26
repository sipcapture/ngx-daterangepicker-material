import { __assign, __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from './daterangepicker.config';
var LocaleService = /** @class */ (function () {
    function LocaleService(_config) {
        this._config = _config;
    }
    Object.defineProperty(LocaleService.prototype, "config", {
        get: function () {
            if (!this._config) {
                return DefaultLocaleConfig;
            }
            return __assign(__assign({}, DefaultLocaleConfig), this._config);
        },
        enumerable: true,
        configurable: true
    });
    LocaleService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
    ]; };
    LocaleService = __decorate([
        Injectable(),
        __param(0, Inject(LOCALE_CONFIG))
    ], LocaleService);
    return LocaleService;
}());
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsibG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMEJBQTBCLENBQUM7QUFHNUY7SUFDSSx1QkFBMkMsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztJQUFHLENBQUM7SUFFcEUsc0JBQUksaUNBQU07YUFBVjtZQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNmLE9BQU8sbUJBQW1CLENBQUM7YUFDOUI7WUFFRCw2QkFBWSxtQkFBbUIsR0FBSyxJQUFJLENBQUMsT0FBTyxFQUFHO1FBQ3ZELENBQUM7OztPQUFBOztnREFSWSxNQUFNLFNBQUMsYUFBYTs7SUFEeEIsYUFBYTtRQUR6QixVQUFVLEVBQUU7UUFFSSxXQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtPQUR6QixhQUFhLENBVXpCO0lBQUQsb0JBQUM7Q0FBQSxBQVZELElBVUM7U0FWWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExPQ0FMRV9DT05GSUcsIERlZmF1bHRMb2NhbGVDb25maWcsIExvY2FsZUNvbmZpZyB9IGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLmNvbmZpZyc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0NPTkZJRykgcHJpdmF0ZSBfY29uZmlnOiBMb2NhbGVDb25maWcpIHt9XHJcblxyXG4gICAgZ2V0IGNvbmZpZygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbmZpZykge1xyXG4gICAgICAgICAgICByZXR1cm4gRGVmYXVsdExvY2FsZUNvbmZpZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7IC4uLkRlZmF1bHRMb2NhbGVDb25maWcsIC4uLnRoaXMuX2NvbmZpZyB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==