export enum TimeEnum {
    veryNear = 12,
    near = 22,
    far = 35,
    old = 60
}
export class TimeEnumHelper {

    static next(currentEnum: TimeEnum): TimeEnum {
        switch (currentEnum) {
            case TimeEnum.near:
                return TimeEnum.far;
            case TimeEnum.far:
                return TimeEnum.old;
            case TimeEnum.veryNear:
                return TimeEnum.near;
            default:
                return currentEnum;
        }
    }
    static previous(currentEnum: TimeEnum): TimeEnum {
        switch (currentEnum) {
            case TimeEnum.near:
                return TimeEnum.veryNear;
            case TimeEnum.far:
                return TimeEnum.near;
            case TimeEnum.old:
                return TimeEnum.far;
            default:
                return currentEnum;
        }
    }
}