import { PacketType } from "@/types";

/** @see net.nocpiun.chatty.server.Packet class */
export default class Packet<D> {
    public type: PacketType;
    public data: D;

    public constructor(type: PacketType, data: D) {
        this.type = type;
        this.data = data;
    }

    public toString(): string {
        return JSON.stringify({ type: this.type, data: this.data });
    }

    public static create<D = any>(type: PacketType, data: D): string {
        return new Packet<D>(type, data).toString();
    }

    public static from<D = any>(message: string): Packet<D> {
        return JSON.parse(message) as Packet<D>;
    }
}
