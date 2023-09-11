export type OnError = (id: string, message: string) => void;

export type Viewport = {
   x: number;
   y: number;
   zoom: number;
};

export interface Connection {
   source: string | null;
   target: string | null;
}

export type OnConnect = (connection: Connection) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type GridStep = [number, number];
