import { Actions } from "@twilio/flex-ui";
import { sendMessageToCRM } from '../helper'
import { timeout } from './../WorkClient'

export function registerHangupCallExtensions(manager) {

    Actions.replaceAction("HangupCall", (payload, original) => {
        return new Promise((resolve, reject) => {

            let data = {
                taskSid: payload.task.taskSid,
                workerSid: payload.task.workerSid,
                ...payload.task.attributes,
                duration: payload.task.age,
                agent: manager.user.identity,
            };

            payload.task.setAttributes({
                ...payload.task.attributes,
                hangupBy: timeout ? "timeout" : "agent",
            });

            sendMessageToCRM("hangupCall", data);

            resolve();
        }).then(() => {
            return original(payload)
        });
    });

}