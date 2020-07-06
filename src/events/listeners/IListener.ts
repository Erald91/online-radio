import {IEvent} from '../emitters/IEvent';

export type IContext = {
  sinkId?: string;
};

export type IEventListenerMap = {
  event: IEvent;
  listeners: Array<(context?: IContext) => void>
};
