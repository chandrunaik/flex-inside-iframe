export function registerVoiceClientExtensions(manager) {

    manager.voiceClient.on("incoming", (connection) => {
        connection.on("disconnect", (disConnection) => {
            const { parameters } = disConnection;
            const { CallSid } = parameters;
        });
    });

}