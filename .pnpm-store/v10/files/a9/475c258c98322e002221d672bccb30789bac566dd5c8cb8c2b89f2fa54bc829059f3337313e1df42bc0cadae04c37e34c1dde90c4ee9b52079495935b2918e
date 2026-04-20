"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const websocket_factory_1 = tslib_1.__importDefault(require("./lib/websocket-factory"));
const constants_1 = require("./lib/constants");
const serializer_1 = tslib_1.__importDefault(require("./lib/serializer"));
const transformers_1 = require("./lib/transformers");
const RealtimeChannel_1 = tslib_1.__importDefault(require("./RealtimeChannel"));
const socketAdapter_1 = tslib_1.__importDefault(require("./phoenix/socketAdapter"));
// Connection-related constants
const CONNECTION_TIMEOUTS = {
    HEARTBEAT_INTERVAL: 25000,
    RECONNECT_DELAY: 10,
    HEARTBEAT_TIMEOUT_FALLBACK: 100,
};
const RECONNECT_INTERVALS = [1000, 2000, 5000, 10000];
const DEFAULT_RECONNECT_FALLBACK = 10000;
const WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
class RealtimeClient {
    get endPoint() {
        return this.socketAdapter.endPoint;
    }
    get timeout() {
        return this.socketAdapter.timeout;
    }
    get transport() {
        return this.socketAdapter.transport;
    }
    get heartbeatCallback() {
        return this.socketAdapter.heartbeatCallback;
    }
    get heartbeatIntervalMs() {
        return this.socketAdapter.heartbeatIntervalMs;
    }
    get heartbeatTimer() {
        if (this.worker) {
            return this._workerHeartbeatTimer;
        }
        return this.socketAdapter.heartbeatTimer;
    }
    get pendingHeartbeatRef() {
        if (this.worker) {
            return this._pendingWorkerHeartbeatRef;
        }
        return this.socketAdapter.pendingHeartbeatRef;
    }
    get reconnectTimer() {
        return this.socketAdapter.reconnectTimer;
    }
    get vsn() {
        return this.socketAdapter.vsn;
    }
    get encode() {
        return this.socketAdapter.encode;
    }
    get decode() {
        return this.socketAdapter.decode;
    }
    get reconnectAfterMs() {
        return this.socketAdapter.reconnectAfterMs;
    }
    get sendBuffer() {
        return this.socketAdapter.sendBuffer;
    }
    get stateChangeCallbacks() {
        return this.socketAdapter.stateChangeCallbacks;
    }
    /**
     * Initializes the Socket.
     *
     * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
     * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
     * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
     * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
     * @param options.params The optional params to pass when connecting.
     * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
     * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
     * @param options.heartbeatCallback The optional function to handle heartbeat status and latency.
     * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
     * @param options.logLevel Sets the log level for Realtime
     * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
     * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
     * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
     * @param options.worker Use Web Worker to set a side flow. Defaults to false.
     * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
     * @param options.vsn The protocol version to use when connecting. Supported versions are "1.0.0" and "2.0.0". Defaults to "2.0.0".
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
     * client.connect()
     * ```
     */
    constructor(endPoint, options) {
        var _a;
        this.channels = new Array();
        this.accessTokenValue = null;
        this.accessToken = null;
        this.apiKey = null;
        this.httpEndpoint = '';
        /** @deprecated headers cannot be set on websocket connections */
        this.headers = {};
        this.params = {};
        this.ref = 0;
        this.serializer = new serializer_1.default();
        this._manuallySetToken = false;
        this._authPromise = null;
        this._workerHeartbeatTimer = undefined;
        this._pendingWorkerHeartbeatRef = null;
        /**
         * Use either custom fetch, if provided, or default fetch to make HTTP requests
         *
         * @internal
         */
        this._resolveFetch = (customFetch) => {
            if (customFetch) {
                return (...args) => customFetch(...args);
            }
            return (...args) => fetch(...args);
        };
        // Validate required parameters
        if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
            throw new Error('API key is required to connect to Realtime');
        }
        this.apiKey = options.params.apikey;
        const socketAdapterOptions = this._initializeOptions(options);
        this.socketAdapter = new socketAdapter_1.default(endPoint, socketAdapterOptions);
        this.httpEndpoint = (0, transformers_1.httpEndpointURL)(endPoint);
        this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
    }
    /**
     * Connects the socket, unless already connected.
     *
     * @category Realtime
     */
    connect() {
        // Skip if already connecting, disconnecting, or connected
        if (this.isConnecting() || this.isDisconnecting() || this.isConnected()) {
            return;
        }
        // Trigger auth if needed and not already in progress
        // This ensures auth is called for standalone RealtimeClient usage
        // while avoiding race conditions with SupabaseClient's immediate setAuth call
        if (this.accessToken && !this._authPromise) {
            this._setAuthSafely('connect');
        }
        this._setupConnectionHandlers();
        try {
            this.socketAdapter.connect();
        }
        catch (error) {
            const errorMessage = error.message;
            // Provide helpful error message based on environment
            if (errorMessage.includes('Node.js')) {
                throw new Error(`${errorMessage}\n\n` +
                    'To use Realtime in Node.js, you need to provide a WebSocket implementation:\n\n' +
                    'Option 1: Use Node.js 22+ which has native WebSocket support\n' +
                    'Option 2: Install and provide the "ws" package:\n\n' +
                    '  npm install ws\n\n' +
                    '  import ws from "ws"\n' +
                    '  const client = new RealtimeClient(url, {\n' +
                    '    ...options,\n' +
                    '    transport: ws\n' +
                    '  })');
            }
            throw new Error(`WebSocket not available: ${errorMessage}`);
        }
        this._handleNodeJsRaceCondition();
    }
    /**
     * Returns the URL of the websocket.
     * @returns string The URL of the websocket.
     *
     * @category Realtime
     */
    endpointURL() {
        return this.socketAdapter.endPointURL();
    }
    /**
     * Disconnects the socket.
     *
     * @param code A numeric status code to send on disconnect.
     * @param reason A custom reason for the disconnect.
     *
     * @category Realtime
     */
    async disconnect(code, reason) {
        if (this.isDisconnecting()) {
            return 'ok';
        }
        return await this.socketAdapter.disconnect(() => {
            clearInterval(this._workerHeartbeatTimer);
            this._terminateWorker();
        }, code, reason);
    }
    /**
     * Returns all created channels
     *
     * @category Realtime
     */
    getChannels() {
        return this.channels;
    }
    /**
     * Unsubscribes, removes and tears down a single channel
     * @param channel A RealtimeChannel instance
     *
     * @category Realtime
     */
    async removeChannel(channel) {
        const status = await channel.unsubscribe();
        if (status === 'ok') {
            channel.teardown();
        }
        if (this.channels.length === 0) {
            this.disconnect();
        }
        return status;
    }
    /**
     * Unsubscribes, removes and tears down all channels
     *
     * @category Realtime
     */
    async removeAllChannels() {
        const promises = this.channels.map(async (channel) => {
            const result = await channel.unsubscribe();
            channel.teardown();
            return result;
        });
        const result = await Promise.all(promises);
        this.disconnect();
        return result;
    }
    /**
     * Logs the message.
     *
     * For customized logging, `this.logger` can be overridden in Client constructor.
     *
     * @category Realtime
     */
    log(kind, msg, data) {
        this.socketAdapter.log(kind, msg, data);
    }
    /**
     * Returns the current state of the socket.
     *
     * @category Realtime
     */
    connectionState() {
        return this.socketAdapter.connectionState() || constants_1.CONNECTION_STATE.closed;
    }
    /**
     * Returns `true` is the connection is open.
     *
     * @category Realtime
     */
    isConnected() {
        return this.socketAdapter.isConnected();
    }
    /**
     * Returns `true` if the connection is currently connecting.
     *
     * @category Realtime
     */
    isConnecting() {
        return this.socketAdapter.isConnecting();
    }
    /**
     * Returns `true` if the connection is currently disconnecting.
     *
     * @category Realtime
     */
    isDisconnecting() {
        return this.socketAdapter.isDisconnecting();
    }
    /**
     * Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
     *
     * Topics are automatically prefixed with `realtime:` to match the Realtime service.
     * If a channel with the same topic already exists it will be returned instead of creating
     * a duplicate connection.
     *
     * @category Realtime
     */
    channel(topic, params = { config: {} }) {
        const realtimeTopic = `realtime:${topic}`;
        const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
        if (!exists) {
            const chan = new RealtimeChannel_1.default(`realtime:${topic}`, params, this);
            this.channels.push(chan);
            return chan;
        }
        else {
            return exists;
        }
    }
    /**
     * Push out a message if the socket is connected.
     *
     * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
     *
     * @category Realtime
     */
    push(data) {
        this.socketAdapter.push(data);
    }
    /**
     * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
     *
     * If param is null it will use the `accessToken` callback function or the token set on the client.
     *
     * On callback used, it will set the value of the token internal to the client.
     *
     * When a token is explicitly provided, it will be preserved across channel operations
     * (including removeChannel and resubscribe). The `accessToken` callback will not be
     * invoked until `setAuth()` is called without arguments.
     *
     * @param token A JWT string to override the token set on the client.
     *
     * @example Setting the authorization header
     * // Use a manual token (preserved across resubscribes, ignores accessToken callback)
     * client.realtime.setAuth('my-custom-jwt')
     *
     * // Switch back to using the accessToken callback
     * client.realtime.setAuth()
     *
     * @category Realtime
     */
    async setAuth(token = null) {
        this._authPromise = this._performAuth(token);
        try {
            await this._authPromise;
        }
        finally {
            this._authPromise = null;
        }
    }
    /**
     * Returns true if the current access token was explicitly set via setAuth(token),
     * false if it was obtained via the accessToken callback.
     * @internal
     */
    _isManualToken() {
        return this._manuallySetToken;
    }
    /**
     * Sends a heartbeat message if the socket is connected.
     *
     * @category Realtime
     */
    async sendHeartbeat() {
        this.socketAdapter.sendHeartbeat();
    }
    /**
     * Sets a callback that receives lifecycle events for internal heartbeat messages.
     * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
     *
     * @category Realtime
     */
    onHeartbeat(callback) {
        this.socketAdapter.heartbeatCallback = this._wrapHeartbeatCallback(callback);
    }
    /**
     * Return the next message ref, accounting for overflows
     *
     * @internal
     */
    _makeRef() {
        return this.socketAdapter.makeRef();
    }
    /**
     * Removes a channel from RealtimeClient
     *
     * @param channel An open subscription.
     *
     * @internal
     */
    _remove(channel) {
        this.channels = this.channels.filter((c) => c.topic !== channel.topic);
    }
    /**
     * Perform the actual auth operation
     * @internal
     */
    async _performAuth(token = null) {
        let tokenToSend;
        let isManualToken = false;
        if (token) {
            tokenToSend = token;
            // Track if this is a manually-provided token
            isManualToken = true;
        }
        else if (this.accessToken) {
            // Call the accessToken callback to get fresh token
            try {
                tokenToSend = await this.accessToken();
            }
            catch (e) {
                this.log('error', 'Error fetching access token from callback', e);
                // Fall back to cached value if callback fails
                tokenToSend = this.accessTokenValue;
            }
        }
        else {
            tokenToSend = this.accessTokenValue;
        }
        // Track whether this token was manually set or fetched via callback
        if (isManualToken) {
            this._manuallySetToken = true;
        }
        else if (this.accessToken) {
            // If we used the callback, clear the manual flag
            this._manuallySetToken = false;
        }
        if (this.accessTokenValue != tokenToSend) {
            this.accessTokenValue = tokenToSend;
            this.channels.forEach((channel) => {
                const payload = {
                    access_token: tokenToSend,
                    version: constants_1.DEFAULT_VERSION,
                };
                tokenToSend && channel.updateJoinPayload(payload);
                if (channel.joinedOnce && channel.channelAdapter.isJoined()) {
                    channel.channelAdapter.push(constants_1.CHANNEL_EVENTS.access_token, {
                        access_token: tokenToSend,
                    });
                }
            });
        }
    }
    /**
     * Wait for any in-flight auth operations to complete
     * @internal
     */
    async _waitForAuthIfNeeded() {
        if (this._authPromise) {
            await this._authPromise;
        }
    }
    /**
     * Safely call setAuth with standardized error handling
     * @internal
     */
    _setAuthSafely(context = 'general') {
        // Only refresh auth if using callback-based tokens
        if (!this._isManualToken()) {
            this.setAuth().catch((e) => {
                this.log('error', `Error setting auth in ${context}`, e);
            });
        }
    }
    /** @internal */
    _setupConnectionHandlers() {
        this.socketAdapter.onOpen(() => {
            const authPromise = this._authPromise ||
                (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve());
            authPromise.catch((e) => {
                this.log('error', 'error waiting for auth on connect', e);
            });
            if (this.worker && !this.workerRef) {
                this._startWorkerHeartbeat();
            }
        });
        this.socketAdapter.onClose(() => {
            if (this.worker && this.workerRef) {
                this._terminateWorker();
            }
        });
        this.socketAdapter.onMessage((message) => {
            if (message.ref && message.ref === this._pendingWorkerHeartbeatRef) {
                this._pendingWorkerHeartbeatRef = null;
            }
        });
    }
    /** @internal */
    _handleNodeJsRaceCondition() {
        if (this.socketAdapter.isConnected()) {
            // hack: ensure onConnOpen is called
            this.socketAdapter.getSocket().onConnOpen();
        }
    }
    /** @internal */
    _wrapHeartbeatCallback(heartbeatCallback) {
        return (status, latency) => {
            if (status == 'sent')
                this._setAuthSafely();
            if (heartbeatCallback)
                heartbeatCallback(status, latency);
        };
    }
    /** @internal */
    _startWorkerHeartbeat() {
        if (this.workerUrl) {
            this.log('worker', `starting worker for from ${this.workerUrl}`);
        }
        else {
            this.log('worker', `starting default worker`);
        }
        const objectUrl = this._workerObjectUrl(this.workerUrl);
        this.workerRef = new Worker(objectUrl);
        this.workerRef.onerror = (error) => {
            this.log('worker', 'worker error', error.message);
            this._terminateWorker();
            this.disconnect();
        };
        this.workerRef.onmessage = (event) => {
            if (event.data.event === 'keepAlive') {
                this.sendHeartbeat();
            }
        };
        this.workerRef.postMessage({
            event: 'start',
            interval: this.heartbeatIntervalMs,
        });
    }
    /**
     * Terminate the Web Worker and clear the reference
     * @internal
     */
    _terminateWorker() {
        if (this.workerRef) {
            this.log('worker', 'terminating worker');
            this.workerRef.terminate();
            this.workerRef = undefined;
        }
    }
    /** @internal */
    _workerObjectUrl(url) {
        let result_url;
        if (url) {
            result_url = url;
        }
        else {
            const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
            result_url = URL.createObjectURL(blob);
        }
        return result_url;
    }
    /**
     * Initialize socket options with defaults
     * @internal
     */
    _initializeOptions(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.worker = (_a = options === null || options === void 0 ? void 0 : options.worker) !== null && _a !== void 0 ? _a : false;
        this.accessToken = (_b = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _b !== void 0 ? _b : null;
        const result = {};
        result.timeout = (_c = options === null || options === void 0 ? void 0 : options.timeout) !== null && _c !== void 0 ? _c : constants_1.DEFAULT_TIMEOUT;
        result.heartbeatIntervalMs =
            (_d = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _d !== void 0 ? _d : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
        // @ts-ignore - mismatch between phoenix and supabase
        result.transport = (_e = options === null || options === void 0 ? void 0 : options.transport) !== null && _e !== void 0 ? _e : websocket_factory_1.default.getWebSocketConstructor();
        result.params = options === null || options === void 0 ? void 0 : options.params;
        result.logger = options === null || options === void 0 ? void 0 : options.logger;
        result.heartbeatCallback = this._wrapHeartbeatCallback(options === null || options === void 0 ? void 0 : options.heartbeatCallback);
        result.reconnectAfterMs =
            (_f = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _f !== void 0 ? _f : ((tries) => {
                return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
            });
        let defaultEncode;
        let defaultDecode;
        const vsn = (_g = options === null || options === void 0 ? void 0 : options.vsn) !== null && _g !== void 0 ? _g : constants_1.DEFAULT_VSN;
        switch (vsn) {
            case constants_1.VSN_1_0_0:
                defaultEncode = (payload, callback) => {
                    return callback(JSON.stringify(payload));
                };
                defaultDecode = (payload, callback) => {
                    return callback(JSON.parse(payload));
                };
                break;
            case constants_1.VSN_2_0_0:
                defaultEncode = this.serializer.encode.bind(this.serializer);
                defaultDecode = this.serializer.decode.bind(this.serializer);
                break;
            default:
                throw new Error(`Unsupported serializer version: ${result.vsn}`);
        }
        result.vsn = vsn;
        result.encode = (_h = options === null || options === void 0 ? void 0 : options.encode) !== null && _h !== void 0 ? _h : defaultEncode;
        result.decode = (_j = options === null || options === void 0 ? void 0 : options.decode) !== null && _j !== void 0 ? _j : defaultDecode;
        result.beforeReconnect = this._reconnectAuth.bind(this);
        if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
            this.logLevel = options.logLevel || options.log_level;
            result.params = Object.assign(Object.assign({}, result.params), { log_level: this.logLevel });
        }
        // Handle worker setup
        if (this.worker) {
            if (typeof window !== 'undefined' && !window.Worker) {
                throw new Error('Web Worker is not supported');
            }
            this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
            result.autoSendHeartbeat = !this.worker;
        }
        return result;
    }
    /** @internal */
    async _reconnectAuth() {
        await this._waitForAuthIfNeeded();
        if (!this.isConnected()) {
            this.connect();
        }
    }
}
exports.default = RealtimeClient;
//# sourceMappingURL=RealtimeClient.js.map