class QueueWorker {
    constructor(messageQueue, ISC) {
        this.messageQueue = messageQueue;
        this.ISC = ISC;

        this.messageQueue.on('taskCompleted', this.onTaskCompleted.bind(this));
        this.messageQueue.on('taskFailed', this.onTaskFailed.bind(this));
    }

    async processQueue(networkName) {
        try {
            await this.messageQueue.runAllQueuesConcurrently(1, 3);
            console.log('Queue processing completed successfully');
            await this.messageQueue.clearQueue();
            await this.clearISC(networkName);
        } catch (error) {
            console.error('Queue processing encountered an error:', error.message);
        }
    };
    onTaskCompleted(task) {
        console.log(`Task completed: ${task.service.name}`, {
            serviceCallback: task.service.name,
            params: task.serviceParameters
        });
    };
    onTaskFailed(task, error) {
        console.error(`Task failed: ${task.service.name}`, {
            serviceCallback: task.service.name,
            params: task.serviceParameters,
            error: error.message
        });
    };
    clearISC = async (networkName = "") => {
        switch (networkName) {
            case "postNetwork":
                this.ISC.removeServiceAddress('processHashtag');
                this.ISC.removeServiceAddress('processMention');
                this.ISC.removeServiceAddress('getByUsername');
                this.ISC.removeServiceAddress('getCommentIdList');
                this.ISC.removeServiceAddress('getReplyIdList');
                this.ISC.removeServiceAddress('deleteCommentService');
                this.ISC.removeServiceAddress('deleteReplyService');
                break;
            case "commentNetwork":
                this.ISC.removeServiceAddress('processHashtag');
                this.ISC.removeServiceAddress('processMention');
                this.ISC.removeServiceAddress('getByUsername');
                this.ISC.removeServiceAddress('getReplyIdList');
                this.ISC.removeServiceAddress('deleteReplyService');
                break;
            default:
                throw new Error("Wrong Network Selected!");
        }
    }
}

module.exports = QueueWorker;