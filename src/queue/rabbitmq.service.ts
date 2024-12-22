import amqp from 'amqplib';
import { logger } from '../logger/logger.js';

export class RabbitMQPublisher {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly queue: string;

  constructor(queue: string) {
    this.queue = queue;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
    }
  }

  async publish(message: object) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized. Call connect() first.');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(this.queue, messageBuffer, { persistent: true });
    logger.info('Mensagem publicada na fila:', this.queue, message);
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      this.channel = null;
    }
  }
}
