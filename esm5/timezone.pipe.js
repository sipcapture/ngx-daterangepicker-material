import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
import * as moment from 'moment-timezone';
var TimeZonePipe = /** @class */ (function () {
    function TimeZonePipe() {
    }
    TimeZonePipe.prototype.transform = function (value, type) {
        if (type === 'region') {
            value = value.substr(0, value.indexOf('/'));
        }
        else if (type === 'location') {
            value = value.substr(value.indexOf('/') + 1);
        }
        else if (type === 'offset') {
            value = moment.tz(value).format('Z z');
        }
        return value;
    };
    TimeZonePipe = __decorate([
        Pipe({ name: 'timeZone' })
    ], TimeZonePipe);
    return TimeZonePipe;
}());
export { TimeZonePipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXpvbmUucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJ0aW1lem9uZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEtBQUssTUFBTSxNQUFNLGlCQUFpQixDQUFDO0FBRTFDO0lBQUE7SUFXQSxDQUFDO0lBVkMsZ0NBQVMsR0FBVCxVQUFVLEtBQUssRUFBRSxJQUFJO1FBQ25CLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNyQixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzdDO2FBQU0sSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFDO1lBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUM7YUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBVlUsWUFBWTtRQUR4QixJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUM7T0FDWixZQUFZLENBV3hCO0lBQUQsbUJBQUM7Q0FBQSxBQVhELElBV0M7U0FYWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50LXRpbWV6b25lJztcclxuQFBpcGUoe25hbWU6ICd0aW1lWm9uZSd9KVxyXG5leHBvcnQgY2xhc3MgVGltZVpvbmVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgdHJhbnNmb3JtKHZhbHVlLCB0eXBlKSB7XHJcbiAgICBpZiAodHlwZSA9PT0gJ3JlZ2lvbicpIHtcclxuICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHIoMCwgdmFsdWUuaW5kZXhPZignLycpKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2xvY2F0aW9uJyl7XHJcbiAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyKHZhbHVlLmluZGV4T2YoJy8nKSArIDEpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2Zmc2V0Jykge1xyXG4gICAgICB2YWx1ZSA9IG1vbWVudC50eih2YWx1ZSkuZm9ybWF0KCdaIHonKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxuICB9XHJcbn1cclxuIl19