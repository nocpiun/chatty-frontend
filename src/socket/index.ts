import { URL } from "@/global";
import { PacketType } from "@/types";
import Packet from "@/socket/Packet";

export default class Socket {
    private static instance: Socket;

    private url: string;
    private ws?: WebSocket;
    private connectionId?: string;

    private constructor() {
        this.url = URL +"/";
    }

    public connect<D = any>(
        path: string,
        handlers: {
            onOpen?: () => void
            onMessage?: (packet: Packet<D>) => void
            onError?: (reason: string) => void
        }
    ): void {
        this.path = path;

        if(this.ws) this.closeCurrentConnection();
        this.ws = new WebSocket(this.url);
        this.ws.addEventListener("message", (e) => {
            const packet = Packet.from(e.data);

            switch(packet.type) {
                case PacketType.HANDSHAKE:
                    if(this.connectionId) return;

                    this.connectionId = packet.data as string;
                    handlers.onOpen && handlers.onOpen();
                    break;
                case PacketType.ERROR:
                    handlers.onError && handlers.onError(packet.data as string);
                    break;
                default:
                    handlers.onMessage && handlers.onMessage(packet);
                    break;
            }
        });
        this.ws.addEventListener("error", (e) => {
            handlers.onError && handlers.onError("WebSocket connection error");
        });
    }

    public closeCurrentConnection(): void {
        if(!this.ws || !this.connectionId) return;

        this.send(PacketType.CLOSE, this.connectionId);
        this.ws.close();
    }

    public send<D>(type: PacketType, data: D): void {
        if(this.ws?.readyState !== WebSocket.OPEN) return;
        if(this.ws) this.ws.send(Packet.create(type, data));
    }

    public get path(): string {
        return this.url.replace(URL, "");
    }

    public set path(newPath: string) {
        this.url = URL + newPath;
    }

    public static get(): Socket {
        if(!this.instance) this.instance = new Socket();
        return this.instance;
    }
}
