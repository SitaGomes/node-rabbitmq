import {connect} from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export const sendToQueue = async (queue: string, message: string) => {
    try {
        const connection = await connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error('Error in sendToQueue:', error);
    }
};

export const consumeFromQueue = async (queue: string, callback: (msg: string) => void) => {
    try {
        const connection = await connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error in consumeFromQueue:', error);
    }
};
