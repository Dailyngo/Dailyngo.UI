import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as signalR from "@microsoft/signalr";
import { useStore } from "@/store";
import { getToken } from "@/utils/helpers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class SignalRHelper {
    private connection: signalR.HubConnection;
    
    constructor(hubUrl: string) {
        const token = getToken()
        console.log("Token:", token);
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_PRO_MODE}/${hubUrl}?access_token=${token}`)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }

    /**
     * Starts the SignalR connection.
     */
    public async startConnection(): Promise<void> {
        try {
            await this.connection.start();
            console.log("SignalR connection established.");
        } catch (err) {
            console.error("Error while starting SignalR connection:", err);
            setTimeout(() => this.startConnection(), 5000); // Retry connection
        }
    }

    /**
     * Stops the SignalR connection.
     */
    public async stopConnection(): Promise<void> {
        try {
            await this.connection.stop();
            console.log("SignalR connection stopped.");
        } catch (err) {
            console.error("Error while stopping SignalR connection:", err);
        }
    }

    /**
     * Registers a listener for a specific SignalR method.
     * @param methodName The name of the SignalR method to listen for.
     * @param callback The callback function to execute when the method is invoked.
     */
    public on(methodName: string, callback: (...args: any[]) => void): void {
        this.connection.on(methodName, callback);
    }

    /**
     * Invokes a method on the SignalR hub.
     * @param methodName The name of the method to invoke.
     * @param args Arguments to pass to the method.
     */
    public async invoke(methodName: string, ...args: any[]): Promise<void> {
        try {
            await this.connection.invoke(methodName, ...args);
        } catch (err) {
            console.error(`Error while invoking method '${methodName}':`, err);
        }
    }
}

// Example usage:
// const signalRHelper = new SignalRHelper("/notification-hub");
// signalRHelper.startConnection();
// signalRHelper.on("ReceiveNotification", (notificationCount) => {
//     console.log("Notification count:", notificationCount);
// });
