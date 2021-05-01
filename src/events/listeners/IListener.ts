import {IEvent} from '../emitters/IEvent';

export type IEventListenerMap = {
  event: IEvent;
  listeners: Array<(context?: any) => void>
};
