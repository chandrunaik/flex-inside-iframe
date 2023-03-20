import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

const PLUGIN_NAME = "FlexAsIframePlugin";
const TASK_CHANNEL = {
  VOICE: "voice",
};
const CALL_STATUS = ["accepted", "canceled", "completed", "rejected", "rescinded", "timeout", "wrapup"];

export default class FlexAsIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const sendMessageToCRM = (eventName: string, payload?: any) => {
      let data = {
        eventName,
        payload,
      };

      parent.postMessage(JSON.stringify(data), "*");
      console.log(">>> sending post message to crm: ", data);
    };

    if (window.self !== window.top) {
      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      const pluginsInitializedCallback = () => {
        sendMessageToCRM("pluginsInitialized");
      };

      const afterSetActivityCallback = (payload: any) => {
        sendMessageToCRM("afterSetActivity", { visibility: payload.activityName });
      };

      const sendActiveCallStatus = (status: string) => {
        sendMessageToCRM("reservationCreated", { status });
      };

      const reservationCreatedCallback = (reservation: any) => {
        // status "created" is used to indicate call is getting connected
        sendActiveCallStatus("created");

        reservation.task.setAttributes({
          ...reservation.task.attributes,
          status: "created",
        });

        CALL_STATUS.forEach((status) => {
          reservation.on(status, (payload: any) => {
            payload.task.setAttributes({
              ...payload.task.attributes,
              status: status,
            });
            console.log(">>> inside flex plugin onStatusChange event: ", { status, payload });
            sendActiveCallStatus(status);
          });
        });
      };

      const afterToggleMuteCallback = () => {
        sendMessageToCRM("toggleMute");
      };

      const receiveMessage = (event: any) => {
        let { name, payload = null } = event.data;
        console.log(">>> inside flex plugin invokeAction", name);
        flex.Actions.invokeAction(name, payload);
      };

      const voiceConnectedHandler = (connection: any) => {
        connection.on("disconnect", (disConnection: any) => {
          console.log(">>> inside flex plugin disconnect event: ", disConnection);
          const { parameters } = disConnection;
          const { CallSid } = parameters;
        });
      };

      const { voiceClient } = manager;
      voiceClient.on("incoming", voiceConnectedHandler);

      window.addEventListener("message", receiveMessage);

      flex.Actions.addListener("afterSetActivity", afterSetActivityCallback);
      flex.Actions.addListener("afterToggleMute", afterToggleMuteCallback);

      manager.events.addListener("pluginsInitialized", pluginsInitializedCallback);
      manager.events.addListener("connectionStateChanged", (payload: any) => {});
      manager.events.addListener("flexError", (error: any) => {});

      manager.workerClient && manager.workerClient.on("reservationCreated", reservationCreatedCallback);
    }

    const acceptTaskCallback = (payload: any, original: any) => {
      console.log(">>> inside flex plugin acceptTaskCallback: ", payload);
      return new Promise<void>((resolve, reject) => {
        if (payload.task.taskChannelUniqueName === TASK_CHANNEL.VOICE) {
          let data = {
            ...payload.task.attributes,
          };
          sendMessageToCRM("voice", data);
        }
        resolve();
      }).then(() => original(payload));
    };

    const hangupCallCallback = (payload: any, original: any) => {
      console.log(">>> inside flex plugin hangupCallCallback: ", payload);
      return new Promise<void>((resolve, reject) => {
        //for outbound calls, to will be undefined
        let data = {
          taskSid: payload.task.taskSid,
          workerSid: payload.task.workerSid,
          ...payload.task.attributes,
          duration: payload.task.age,
          agent: manager.user.identity,
        };
        sendMessageToCRM("hangupCall", data);
        resolve();
      }).then(() => original(payload));
    };

    flex.Actions.replaceAction("AcceptTask", acceptTaskCallback);
    flex.Actions.replaceAction("HangupCall", hangupCallCallback);
  }
}

// await manager.store.getState().flex.worker.tasks.forEach((task) => {
//   console.log("-----task", task);
//   const pastAttributes = task.attributes;
//   task.setAttributes({ ...pastAttributes, name: "it worked" });
// });
