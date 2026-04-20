import type { ChannelState } from './lib/constants';
import type RealtimeClient from './RealtimeClient';
import RealtimePresence, { REALTIME_PRESENCE_LISTEN_EVENTS } from './RealtimePresence';
import type { RealtimePresenceJoinPayload, RealtimePresenceLeavePayload, RealtimePresenceState } from './RealtimePresence';
import { ChannelBindingCallback } from './phoenix/types';
type ReplayOption = {
    since: number;
    limit?: number;
};
export type RealtimeChannelOptions = {
    config: {
        /**
         * self option enables client to receive message it broadcast
         * ack option instructs server to acknowledge that broadcast message was received
         * replay option instructs server to replay broadcast messages
         */
        broadcast?: {
            self?: boolean;
            ack?: boolean;
            replay?: ReplayOption;
        };
        /**
         * key option is used to track presence payload across clients
         */
        presence?: {
            key?: string;
            enabled?: boolean;
        };
        /**
         * defines if the channel is private or not and if RLS policies will be used to check data
         */
        private?: boolean;
    };
};
type RealtimeChangesPayloadBase = {
    schema: string;
    table: string;
};
type RealtimeBroadcastChangesPayloadBase = RealtimeChangesPayloadBase & {
    id: string;
};
export type RealtimeBroadcastInsertPayload<T extends {
    [key: string]: any;
}> = RealtimeBroadcastChangesPayloadBase & {
    operation: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`;
    record: T;
    old_record: null;
};
export type RealtimeBroadcastUpdatePayload<T extends {
    [key: string]: any;
}> = RealtimeBroadcastChangesPayloadBase & {
    operation: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`;
    record: T;
    old_record: T;
};
export type RealtimeBroadcastDeletePayload<T extends {
    [key: string]: any;
}> = RealtimeBroadcastChangesPayloadBase & {
    operation: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`;
    record: null;
    old_record: T;
};
export type RealtimeBroadcastPayload<T extends {
    [key: string]: any;
}> = RealtimeBroadcastInsertPayload<T> | RealtimeBroadcastUpdatePayload<T> | RealtimeBroadcastDeletePayload<T>;
type RealtimePostgresChangesPayloadBase = {
    schema: string;
    table: string;
    commit_timestamp: string;
    errors: string[];
};
export type RealtimePostgresInsertPayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`;
    new: T;
    old: {};
};
export type RealtimePostgresUpdatePayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`;
    new: T;
    old: Partial<T>;
};
export type RealtimePostgresDeletePayload<T extends {
    [key: string]: any;
}> = RealtimePostgresChangesPayloadBase & {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`;
    new: {};
    old: Partial<T>;
};
export type RealtimePostgresChangesPayload<T extends {
    [key: string]: any;
}> = RealtimePostgresInsertPayload<T> | RealtimePostgresUpdatePayload<T> | RealtimePostgresDeletePayload<T>;
export type RealtimePostgresChangesFilter<T extends `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`> = {
    /**
     * The type of database change to listen to.
     */
    event: T;
    /**
     * The database schema to listen to.
     */
    schema: string;
    /**
     * The database table to listen to.
     */
    table?: string;
    /**
     * Receive database changes when filter is matched.
     */
    filter?: string;
};
export type RealtimeChannelSendResponse = 'ok' | 'timed out' | 'error';
export declare enum REALTIME_POSTGRES_CHANGES_LISTEN_EVENT {
    ALL = "*",
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}
export declare enum REALTIME_LISTEN_TYPES {
    BROADCAST = "broadcast",
    PRESENCE = "presence",
    POSTGRES_CHANGES = "postgres_changes",
    SYSTEM = "system"
}
export declare enum REALTIME_SUBSCRIBE_STATES {
    SUBSCRIBED = "SUBSCRIBED",
    TIMED_OUT = "TIMED_OUT",
    CLOSED = "CLOSED",
    CHANNEL_ERROR = "CHANNEL_ERROR"
}
export declare const REALTIME_CHANNEL_STATES: {
    readonly closed: "closed";
    readonly errored: "errored";
    readonly joined: "joined";
    readonly joining: "joining";
    readonly leaving: "leaving";
};
type Binding = {
    type: string;
    filter: {
        [key: string]: any;
    };
    callback: ChannelBindingCallback;
    ref: number;
    id?: string;
};
/** A channel is the basic building block of Realtime
 * and narrows the scope of data flow to subscribed clients.
 * You can think of a channel as a chatroom where participants are able to see who's online
 * and send and receive messages.
 */
export default class RealtimeChannel {
    /** Topic name can be any string. */
    topic: string;
    params: RealtimeChannelOptions;
    socket: RealtimeClient;
    bindings: Record<string, Binding[]>;
    subTopic: string;
    broadcastEndpointURL: string;
    private: boolean;
    presence: RealtimePresence;
    get state(): ChannelState;
    set state(state: ChannelState);
    get joinedOnce(): boolean;
    get timeout(): number;
    get joinPush(): import("@supabase/phoenix").Push;
    get rejoinTimer(): import("@supabase/phoenix/priv/static/types/timer").default;
    /**
     * Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
     *
     * The topic determines which realtime stream you are subscribing to. Config options let you
     * enable acknowledgement for broadcasts, presence tracking, or private channels.
     *
     * @category Realtime
     *
     * @example Example for a public channel
     * ```ts
     * import RealtimeClient from '@supabase/realtime-js'
     *
     * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
     *   params: { apikey: 'public-anon-key' },
     * })
     * const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
     * ```
     */
    constructor(
    /** Topic name can be any string. */
    topic: string, params: RealtimeChannelOptions | undefined, socket: RealtimeClient);
    /**
     * Subscribe registers your client with the server
     * @category Realtime
     */
    subscribe(callback?: (status: REALTIME_SUBSCRIBE_STATES, err?: Error) => void, timeout?: number): RealtimeChannel;
    private _updatePostgresBindings;
    /**
     * Returns the current presence state for this channel.
     *
     * The shape is a map keyed by presence key (for example a user id) where each entry contains the
     * tracked metadata for that user.
     *
     * @category Realtime
     */
    presenceState<T extends {
        [key: string]: any;
    } = {}>(): RealtimePresenceState<T>;
    /**
     * Sends the supplied payload to the presence tracker so other subscribers can see that this
     * client is online. Use `untrack` to stop broadcasting presence for the same key.
     *
     * @category Realtime
     */
    track(payload: {
        [key: string]: any;
    }, opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    /**
     * Removes the current presence state for this client.
     *
     * @category Realtime
     */
    untrack(opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    /**
     * Creates an event handler that listens to changes.
     */
    on(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.SYNC}`;
    }, callback: () => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.JOIN}`;
    }, callback: (payload: RealtimePresenceJoinPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: `${REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE}`;
    }, callback: (payload: RealtimePresenceLeavePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.PRESENCE}`, filter: {
        event: '*';
    }, callback: (payload?: RealtimePresenceJoinPayload<T> | RealtimePresenceLeavePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>, callback: (payload: RealtimePostgresChangesPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`>, callback: (payload: RealtimePostgresInsertPayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`>, callback: (payload: RealtimePostgresUpdatePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`>, callback: (payload: RealtimePostgresDeletePayload<T>) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`, filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`>, callback: (payload: RealtimePostgresChangesPayload<T>) => void): RealtimeChannel;
    /**
     * The following is placed here to display on supabase.com/docs/reference/javascript/subscribe.
     * @param type One of "broadcast", "presence", or "postgres_changes".
     * @param filter Custom object specific to the Realtime feature detailing which payloads to receive.
     * @param callback Function to be invoked when event handler is triggered.
     */
    on(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: string;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        meta?: {
            replayed?: boolean;
            id: string;
        };
        [key: string]: any;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: string;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        meta?: {
            replayed?: boolean;
            id: string;
        };
        payload: T;
    }) => void): RealtimeChannel;
    on<T extends Record<string, unknown>>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL;
        payload: RealtimeBroadcastPayload<T>;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT;
        payload: RealtimeBroadcastInsertPayload<T>;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE;
        payload: RealtimeBroadcastUpdatePayload<T>;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.BROADCAST}`, filter: {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE;
    }, callback: (payload: {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE;
        payload: RealtimeBroadcastDeletePayload<T>;
    }) => void): RealtimeChannel;
    on<T extends {
        [key: string]: any;
    }>(type: `${REALTIME_LISTEN_TYPES.SYSTEM}`, filter: {}, callback: (payload: any) => void): RealtimeChannel;
    /**
     * Sends a broadcast message explicitly via REST API.
     *
     * This method always uses the REST API endpoint regardless of WebSocket connection state.
     * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
     *
     * @param event The name of the broadcast event
     * @param payload Payload to be sent (required)
     * @param opts Options including timeout
     * @returns Promise resolving to object with success status, and error details if failed
     *
     * @category Realtime
     */
    httpSend(event: string, payload: any, opts?: {
        timeout?: number;
    }): Promise<{
        success: true;
    } | {
        success: false;
        status: number;
        error: string;
    }>;
    /**
     * Sends a message into the channel.
     *
     * @param args Arguments to send to channel
     * @param args.type The type of event to send
     * @param args.event The name of the event being sent
     * @param args.payload Payload to be sent
     * @param opts Options to be used during the send process
     *
     * @category Realtime
     *
     * @remarks
     * - When using REST you don't need to subscribe to the channel
     * - REST calls are only available from 2.37.0 onwards
     *
     * @example Send a message via websocket
     * ```js
     * const channel = supabase.channel('room1')
     *
     * channel.subscribe((status) => {
     *   if (status === 'SUBSCRIBED') {
     *     channel.send({
     *       type: 'broadcast',
     *       event: 'cursor-pos',
     *       payload: { x: Math.random(), y: Math.random() },
     *     })
     *   }
     * })
     * ```
     *
     * @exampleResponse Send a message via websocket
     * ```js
     * ok | timed out | error
     * ```
     *
     * @example Send a message via REST
     * ```js
     * supabase
     *   .channel('room1')
     *   .httpSend('cursor-pos', { x: Math.random(), y: Math.random() })
     * ```
     */
    send(args: {
        type: 'broadcast' | 'presence' | 'postgres_changes';
        event: string;
        payload?: any;
        [key: string]: any;
    }, opts?: {
        [key: string]: any;
    }): Promise<RealtimeChannelSendResponse>;
    /**
     * Updates the payload that will be sent the next time the channel joins (reconnects).
     * Useful for rotating access tokens or updating config without re-creating the channel.
     *
     * @category Realtime
     */
    updateJoinPayload(payload: Record<string, any>): void;
    /**
     * Leaves the channel.
     *
     * Unsubscribes from server events, and instructs channel to terminate on server.
     * Triggers onClose() hooks.
     *
     * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
     * channel.unsubscribe().receive("ok", () => alert("left!") )
     *
     * @category Realtime
     */
    unsubscribe(timeout?: number): Promise<RealtimeChannelSendResponse>;
    /**
     * Destroys and stops related timers.
     *
     * @category Realtime
     */
    teardown(): void;
    copyBindings(other: RealtimeChannel): void;
}
export {};
//# sourceMappingURL=RealtimeChannel.d.ts.map