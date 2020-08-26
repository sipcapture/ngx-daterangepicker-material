import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let TimePipe = class TimePipe {
    transform(value) {
        if (value < 10) {
            value = '0' + value;
        }
        return value;
    }
};
TimePipe = __decorate([
    Pipe({ name: 'time' })
], TimePipe);
export { TimePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC8iLCJzb3VyY2VzIjpbInRpbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFHcEQsSUFBYSxRQUFRLEdBQXJCLE1BQWEsUUFBUTtJQUNuQixTQUFTLENBQUMsS0FBSztRQUNiLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBQztZQUNiLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0YsQ0FBQTtBQVBZLFFBQVE7SUFEcEIsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDO0dBQ1IsUUFBUSxDQU9wQjtTQVBZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7bmFtZTogJ3RpbWUnfSlcclxuZXhwb3J0IGNsYXNzIFRpbWVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgdHJhbnNmb3JtKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPCAxMCl7XHJcbiAgICAgIHZhbHVlID0gJzAnICsgdmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbiAgfVxyXG59XHJcbiJdfQ==