import { FLEX_RESERVATION_EVENTS } from './../constants'
import { sendMessageToCRM } from '../helper'

export let timeout = false;

export function registerWorkClientExtensions(manager) {


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