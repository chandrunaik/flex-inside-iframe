// import { registerAcceptTaskExtensions } from "./acceptTask";
import { registerHangupCallExtensions } from "./hangupCall";
import { registerListenerExtensions } from "./listeners";

export function registerActionExtensions(manager) {
    // registerAcceptTaskExtensions(manager);
    registerHangupCallExtensions(manager);
    registerListenerExtensions()
}