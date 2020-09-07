import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
var TimePipe = /** @class */ (function () {
    function TimePipe() {
    }
    TimePipe.prototype.transform = function (value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    };
    TimePipe = __decorate([
        Pipe({ name: 'time' })
    ], TimePipe);
    return TimePipe;
}());
export { TimePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbInRpbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFHcEQ7SUFBQTtJQU9BLENBQUM7SUFOQyw0QkFBUyxHQUFULFVBQVUsS0FBSztRQUNiLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRTtZQUNkLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBTlUsUUFBUTtRQURwQixJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7T0FDUixRQUFRLENBT3BCO0lBQUQsZUFBQztDQUFBLEFBUEQsSUFPQztTQVBZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7bmFtZTogJ3RpbWUnfSlcclxuZXhwb3J0IGNsYXNzIFRpbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgdHJhbnNmb3JtKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPCAxMCkge1xyXG4gICAgICB2YWx1ZSA9ICcwJyArIHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH1cclxufVxyXG4iXX0=