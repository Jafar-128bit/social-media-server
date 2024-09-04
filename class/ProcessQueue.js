const EventEmitter = require('events');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'queue.log'})
    ]
});

class QueueObject {
    constructor(serviceCallback, serviceParameters = [], priority = 0) {
        this.service = serviceCallback;
        this.serviceParameters = serviceParameters;
        this.priority = priority;
        this.status = 'pending'; // 'pending', 'in-progress', 'completed', 'failed'
        this.retryCount = 0;
    }
}

class Queue extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.deadLetterQueue = []; // To store tasks that fail after retries
    }

    // Add a task to the queue with optional priority
    enqueue(serviceCallback, serviceParameters = [], priority = 0) {
        const newQueueObject = new QueueObject(serviceCallback, serviceParameters, priority);
        this.queue.push(newQueueObject);
        this.queue.sort((a, b) => a.priority - b.priority); // Sort by priority
        logger.info('Task enqueued', {serviceCallback: serviceCallback.name, priority});
    }

    // Remove a task from the front of the queue
    dequeue() {
        if (this.queue.length > 0) return this.queue.shift();
        else throw new Error("Cannot dequeue from an empty queue!");
    }

    // Run all tasks concurrently with a limit on the number of simultaneous tasks
    async runAllQueuesConcurrently(concurrency = 5, retries = 3) {
        const results = [];
        const activeTasks = [];

        while (this.queue.length > 0) {
            while (activeTasks.length < concurrency && this.queue.length > 0) {
                const queueObject = this.dequeue();
                const taskPromise = this.runTaskWithRetry(queueObject, retries);
                activeTasks.push(taskPromise);
            }

            const finishedTask = await Promise.race(activeTasks);
            activeTasks.splice(activeTasks.indexOf(finishedTask), 1);
            results.push(finishedTask);
        }

        await Promise.all(activeTasks); // Ensure all tasks finish
        return results;
    }

    // Helper method to run a task with retries
    async runTaskWithRetry(queueObject, retries) {
        queueObject.status = 'in-progress';
        logger.info('Task started', {serviceCallback: queueObject.service.name});

        for (let i = 0; i < retries; i++) {
            try {
                const result = await Promise.all(queueObject.serviceParameters.map(param => queueObject.service(param)));
                queueObject.status = 'completed';
                this.emit('taskCompleted', queueObject);
                logger.info('Task completed', {serviceCallback: queueObject.service.name});
                return result;
            } catch (error) {
                queueObject.retryCount += 1;
                logger.warn(`Retrying task (${queueObject.retryCount}/${retries})`, {
                    serviceCallback: queueObject.service.name,
                    error
                });

                if (queueObject.retryCount >= retries) {
                    queueObject.status = 'failed';
                    this.deadLetterQueue.push(queueObject); // Move to DLQ
                    this.emit('taskFailed', queueObject, error);
                    logger.error('Task failed and moved to DLQ', {serviceCallback: queueObject.service.name, error});
                    return null; // Return null to indicate failure
                }
            }
        }
    }

    // Clear the entire queue
    clearQueue() {
        this.queue = [];
        logger.info('Queue cleared');
    }

    // Clear the Dead Letter Queue
    clearDeadLetterQueue() {
        this.deadLetterQueue = [];
        logger.info('Dead Letter Queue cleared');
    }

    // Get the current state of the queue
    getQueueStatus() {
        return this.queue.map(q => ({
            status: q.status,
            priority: q.priority,
            retries: q.retryCount
        }));
    }

    // Get the current state of the Dead Letter Queue
    getDeadLetterQueueStatus() {
        return this.deadLetterQueue.map(q => ({
            status: q.status,
            priority: q.priority,
            retries: q.retryCount,
            serviceCallback: q.service.name
        }));
    }
}

module.exports = Queue;