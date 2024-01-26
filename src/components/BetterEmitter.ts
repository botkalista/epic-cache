
export type EventHandler<EventName> = { type: EventName, callback: (...args: any) => any }

export class BetterEmitter<EventsMap extends Record<string, (...args: any[]) => any>> {

    private handlers: EventHandler<keyof EventsMap>[] = [];

    protected emit<EventName extends keyof EventsMap>(event: EventName, ...data: Parameters<EventsMap[EventName]>) {
        this.handlers.filter(handler => handler.type == event).forEach(handler => {
            handler.callback(...data);
        });
        return this;
    }

    on<EventName extends keyof EventsMap>(event: EventName, callback: EventsMap[EventName]) {
        this.handlers.push({ type: event, callback });
        return this;
    }

}