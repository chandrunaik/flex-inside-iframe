import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { registerFlexEvents } from "./FlexEvents";
import { registerActionExtensions } from "./Actions";
import { registerVoiceClientExtensions } from "./VoiceClient";
import { registerWorkClientExtensions } from "./WorkClient";

const PLUGIN_NAME = "FlexAsIframePlugin";

export default class FlexAsIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // run below code only if flex ui is opened inside iframe
    if (window.self === window.top) return;
    flex.AgentDesktopView.defaultProps.showPanel2 = false;

    const invokeAction = (event: any) => {
      let actionName = event.data.name;
      let payload = event.data.payload;

      console.log(">>> inside flex plugin invoking action: ", actionName);
      flex.Actions.invokeAction(actionName, payload);
    };

    window.addEventListener("message", invokeAction);

    registerFlexEvents(manager);
    registerActionExtensions(manager);
    registerVoiceClientExtensions(manager);
    registerWorkClientExtensions(manager);
  }
}

// await manager.store.getState().flex.worker.tasks.forEach((task) => {
//   console.log("-----task", task);
//   const pastAttributes = task.attributes;
//   task.setAttributes({ ...pastAttributes, name: "it worked" });
// });

// import { StateHelper } from "@twilio/flex-ui";
// const activeCall = StateHelper.getCurrentPhoneCallState();
