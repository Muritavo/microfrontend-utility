type MessageStructure<T> = {
    type: string,
    data: T
}
class EventEmitter {
    /**
     * 
     * @param {MessageStructure} message 
     */
    static sendMessage<D extends any>(message: MessageStructure<D>) {
        window.postMessage(message, window.location.origin);
    }

    /**
     * 
     * @param {string} type
     * @param {any} data 
     */
    static onMessage<T extends MessageStructure<any>>(type: T['type'], callback: (data: T['data']) => void) {
        window.addEventListener('message', event => {
            try {
                if (event.data && event.data.type && event.data.type === type) {
                    callback(event.data.data);
                }
            } catch (e) {
                console.error(e);
            }
        })
    }
}

export default EventEmitter;