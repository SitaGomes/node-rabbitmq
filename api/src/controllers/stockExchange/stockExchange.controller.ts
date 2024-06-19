import { sendToQueue } from "../../services/utils/rabbitMQ";

export const processOrder = (order: string) => {
    sendToQueue('BOLSADEVALORES', JSON.stringify(order));
};