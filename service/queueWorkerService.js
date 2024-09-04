class QueueWorker {
    constructor(messageQueue) {
        this.messageQueue = messageQueue;

        this.messageQueue.on('taskCompleted', this.onTaskCompleted.bind(this));
        this.messageQueue.on('taskFailed', this.onTaskFailed.bind(this));
    }

    async processQueue() {
        try {
            await this.messageQueue.runAllQueuesConcurrently(1, 3);
            console.log('Queue processing completed successfully');
            await this.messageQueue.clearQueue();
        } catch (error) {
            console.error('Queue processing encountered an error:', error.message);
        }
    }

    onTaskCompleted(task) {
        console.log(`Task completed: ${task.service.name}`, {
            serviceCallback: task.service.name,
            params: task.serviceParameters
        });
    }

    onTaskFailed(task, error) {
        console.error(`Task failed: ${task.service.name}`, {
            serviceCallback: task.service.name,
            params: task.serviceParameters,
            error: error.message
        });
    }
}

module.exports = QueueWorker;