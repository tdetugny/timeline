import BaseEvent, { IBaseEvent } from './base-event';
export interface IRootEvent extends IBaseEvent {
    dateAtLeftPosition(position: number): Date;
    dateAtProportion(proportion: number): Date;
    leftPositionAtDate(date: Date): number;
    width: number;
}
declare class RootEvent extends BaseEvent implements IRootEvent {
    private pixelsPerDay;
    width: number;
    constructor(data: any, width: number);
    leftPositionAtDate(date: Date): number;
    dateAtLeftPosition(position: number): Date;
    dateAtProportion(proportion: number): Date;
}
export default RootEvent;