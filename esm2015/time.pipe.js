import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let TimePipe = class TimePipe {
    transform(value, type, is24h) {
        if (is24h) {
            type = 'HH';
        }
        /* if (moment(value, type).isValid) {
          console.log(value)
            value = moment(value, type).format(type);
        } else {
            value = moment(0, type).format(type);
        } */
        return value;
    }
};
TimePipe = __decorate([
    Pipe({ name: 'time' })
], TimePipe);
export { TimePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbInRpbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFJcEQsSUFBYSxRQUFRLEdBQXJCLE1BQWEsUUFBUTtJQUNqQixTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFNO1FBQ3pCLElBQUksS0FBSyxFQUFFO1lBQ1AsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNmO1FBQ0Q7Ozs7O1lBS0k7UUFDUixPQUFPLEtBQUssQ0FBQztJQUNiLENBQUM7Q0FDSixDQUFBO0FBYlksUUFBUTtJQURwQixJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7R0FDUixRQUFRLENBYXBCO1NBYlksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudC10aW1lem9uZSc7XHJcblxyXG5AUGlwZSh7bmFtZTogJ3RpbWUnfSlcclxuZXhwb3J0IGNsYXNzIFRpbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgICB0cmFuc2Zvcm0odmFsdWUsIHR5cGUsIGlzMjRoPykge1xyXG4gICAgICAgIGlmIChpczI0aCkge1xyXG4gICAgICAgICAgICB0eXBlID0gJ0hIJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaWYgKG1vbWVudCh2YWx1ZSwgdHlwZSkuaXNWYWxpZCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codmFsdWUpXHJcbiAgICAgICAgICAgIHZhbHVlID0gbW9tZW50KHZhbHVlLCB0eXBlKS5mb3JtYXQodHlwZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBtb21lbnQoMCwgdHlwZSkuZm9ybWF0KHR5cGUpO1xyXG4gICAgICAgIH0gKi9cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=