import { __decorate, __param } from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from './daterangepicker.config';
let LocaleService = class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        if (!this._config) {
            return DefaultLocaleConfig;
        }
        return Object.assign(Object.assign({}, DefaultLocaleConfig), this._config);
    }
};
LocaleService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
];
LocaleService = __decorate([
    Injectable(),
    __param(0, Inject(LOCALE_CONFIG))
], LocaleService);
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsibG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sMEJBQTBCLENBQUM7QUFHNUYsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN0QixZQUEyQyxPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBQUcsQ0FBQztJQUVwRSxJQUFJLE1BQU07UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNmLE9BQU8sbUJBQW1CLENBQUM7U0FDOUI7UUFFRCx1Q0FBWSxtQkFBbUIsR0FBSyxJQUFJLENBQUMsT0FBTyxFQUFHO0lBQ3ZELENBQUM7Q0FDSixDQUFBOzs0Q0FUZ0IsTUFBTSxTQUFDLGFBQWE7O0FBRHhCLGFBQWE7SUFEekIsVUFBVSxFQUFFO0lBRUksV0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7R0FEekIsYUFBYSxDQVV6QjtTQVZZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTE9DQUxFX0NPTkZJRywgRGVmYXVsdExvY2FsZUNvbmZpZywgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi9kYXRlcmFuZ2VwaWNrZXIuY29uZmlnJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvY2FsZVNlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExvY2FsZUNvbmZpZykge31cclxuXHJcbiAgICBnZXQgY29uZmlnKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY29uZmlnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBEZWZhdWx0TG9jYWxlQ29uZmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHsgLi4uRGVmYXVsdExvY2FsZUNvbmZpZywgLi4udGhpcy5fY29uZmlnIH07XHJcbiAgICB9XHJcbn1cclxuIl19