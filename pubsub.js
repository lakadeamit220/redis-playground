const { Redis } = require('ioredis');

const publisher = new Redis();
const subscriber = new Redis();
const subscriber2 = new Redis(); // Additional subscriber

// Subscribe to a channel
subscriber.subscribe('events', (err, count) => {
  if (err) {
    console.error('Failed to subscribe:', err);
    return;
  }
  console.log(`Subscriber 1: Subscribed to ${count} channel(s). Waiting for messages...`);
});

subscriber2.subscribe('notifications', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to notifications:', err);
    return;
  }
  console.log(`Subscriber 2: Subscribed to ${count} channel(s). Waiting for messages...`);
});

// Listen for messages on the subscribed channel
subscriber.on('message', (channel, message) => {
  console.log(`Subscriber 1 received message from ${channel}: ${message}`);
});

subscriber2.on('message', (channel, message) => {
  console.log(`Subscriber 2 received message from ${channel}: ${message}`);
});

// Publish a message to the channel
async function publishMessage(channel, message) {
  await publisher.publish(channel, message);
  console.log(`Message published to ${channel}: ${message}`);
}

// Trigger the publisher with multiple messages
setTimeout(() => {
  publishMessage('events', `Hello from events channel at ${Date.now()}`);
}, 3000);

setTimeout(() => {
  publishMessage('notifications', `Alert from notifications channel at ${Date.now()}`);
}, 5000);

// Unsubscribe functionality
setTimeout(() => {
  subscriber.unsubscribe('events', (err) => {
    if (err) {
      console.error('Failed to unsubscribe:', err);
      return;
    }
    console.log('Subscriber 1 unsubscribed from events channel.');
  });
}, 10000);

setTimeout(() => {
  subscriber2.unsubscribe('notifications', (err) => {
    if (err) {
      console.error('Failed to unsubscribe from notifications:', err);
      return;
    }
    console.log('Subscriber 2 unsubscribed from notifications channel.');
  });
}, 12000);