import { Actions } from "@twilio/flex-ui";
import { sendMessageToCRM } from '../helper'

export function registerAcceptTaskExtensions() {

    Actions.replaceAction("AcceptTask", (payload, original) => {
        return new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            return original(payload)
        });
    });

}