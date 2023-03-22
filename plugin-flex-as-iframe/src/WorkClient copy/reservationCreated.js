import { sendMessageToCRM } from '../helper'

const RESERVATION_STATUS = [
    "pending",
    "accepted",
    "rejected",
    "timeout",
    "canceled",
    "rescinded",
    "wrapping",
    "completed",
];
const RESERVATION_EVENTS = ["accepted", "completed", "canceled", "rejected", "rescinded", "timeout", "wrapup"];
const FLEX_RESERVATION_EVENTS = ["accepted", "rejected", "timeout", "canceled", "rescinded", "completed", "wrapup"];

export function registerWorkerClientExtensions(manager) {


    const sendActiveCallStatus = (status) => {
        sendMessageToCRM("reservationCreated", { status });
    };


    manager.workerClient.on("reservationCreated", (reservation) => {
        sendActiveCallStatus("created");

        // setTimeout(() => {
        //   // reservation.task.setAttributes({
        //   //   ...reservation.task.attributes,
        //   //   hangupBy: "timeout",
        //   // });
        //   timeout = true;
        //   flex.Actions.invokeAction("HangupCall", {
        //     sid: reservation.sid,
        //   });
        // }, 10000);

        // reservation.task.setAttributes({
        //   ...reservation.task.attributes,
        //   status: "created",
        // });

        // listen for reservation status change
        FLEX_RESERVATION_EVENTS.forEach((status) => {
            reservation.on(status, (payload) => {
                // payload.task.setAttributes({
                //   ...payload.task.attributes,
                //   status: status,
                // });
                console.log(":::>>> inside flex plugin RESERVATION_STATUS change: ", {
                    reservationStatus: status,
                });

                sendActiveCallStatus(status);
            });
        });
    })
}