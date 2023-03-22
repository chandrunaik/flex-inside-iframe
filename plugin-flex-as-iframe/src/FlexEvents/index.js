import { sendMessageToCRM } from "../helper";


export function registerFlexEvents(manager) {

    manager.events.addListener("pluginsInitialized", () => {
        sendMessageToCRM("pluginsInitialized");
    });

    manager.events.addListener("connectionStateChanged", () => { });

    manager.events.addListener("flexError", () => { });

    manager.events.addListener("userLoggedIn", () => { });

    manager.events.addListener("tokenExpired", () => { });

    manager.events.addListener("taskReceived", (task) => { });

}