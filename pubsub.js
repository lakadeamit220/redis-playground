const { Redis } = require('ioredis');

// Create Redis connections
const publisher = new Redis(); // Redis connection for publishing messages
const subscriber1 = new Redis(); // Subscriber 1: Listens to the 'events' channel
const subscriber2 = new Redis(); // Subscriber 2: Listens to the 'notifications' channel
const subscriber3 = new Redis(); // Subscriber 3: Listens to the 'alerts' channel
const subscriber4 = new Redis(); // Subscriber 4: Listens to the 'updates' channel
const commandClient = new Redis(); // Separate client for administrative commands like listing active channels

// Object to track message statistics for each channel
const messageStats = {
  events: 0,
  notifications: 0,
  alerts: 0,
  updates: 0,
};

// Subscriber 1: Subscribe to the 'events' channel
subscriber1.subscribe('events', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to events:', err); // Log errors if subscription fails
    return;
  }
  console.log(`[Subscriber 1] Subscribed to ${count} channel(s) at ${new Date().toISOString()}`);
});

// Handle messages received by Subscriber 1
subscriber1.on('message', (channel, message) => {
  console.log(`[Subscriber 1] Received message from ${channel}: ${message}`);
  messageStats[channel]++; // Increment message count for the channel
});

// Subscriber 2: Subscribe to the 'notifications' channel
subscriber2.subscribe('notifications', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to notifications:', err);
    return;
  }
  console.log(`[Subscriber 2] Subscribed to ${count} channel(s) at ${new Date().toISOString()}`);
});

// Handle messages received by Subscriber 2
subscriber2.on('message', (channel, message) => {
  console.log(`[Subscriber 2] Received message from ${channel}: ${message}`);
  messageStats[channel]++;
});

// Subscriber 3: Subscribe to the 'alerts' channel
subscriber3.subscribe('alerts', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to alerts:', err);
    return;
  }
  console.log(`[Subscriber 3] Subscribed to ${count} channel(s) at ${new Date().toISOString()}`);
});

// Handle messages received by Subscriber 3
subscriber3.on('message', (channel, message) => {
  console.log(`[Subscriber 3] Received message from ${channel}: ${message}`);
  messageStats[channel]++;
});

// Subscriber 4: Subscribe to the 'updates' channel
subscriber4.subscribe('updates', (err, count) => {
  if (err) {
    console.error('Failed to subscribe to updates:', err);
    return;
  }
  console.log(`[Subscriber 4] Subscribed to ${count} channel(s) at ${new Date().toISOString()}`);
});

// Handle messages received by Subscriber 4
subscriber4.on('message', (channel, message) => {
  console.log(`[Subscriber 4] Received message from ${channel}: ${message}`);
  messageStats[channel]++;
});

// Function to publish a single message to a channel
async function publishMessage(channel, message) {
  try {
    await publisher.publish(channel, message); // Publish the message to the specified channel
    console.log(`[Publisher] Message published to ${channel}: ${message}`);
  } catch (err) {
    console.error(`[Publisher] Failed to publish message to ${channel}:`, err); // Log any errors during publishing
  }
}

// Function to list active subscriptions using the PUBSUB CHANNELS command
async function listSubscriptions(client, name) {
  try {
    const subscriptions = await client.pubsub('channels'); // Get a list of all active channels
    console.log(`[${name}] Active subscriptions:`, subscriptions);
  } catch (err) {
    console.error(`[${name}] Failed to list subscriptions:`, err);
  }
}

// Function to dynamically subscribe a new subscriber to a given channel
function dynamicSubscribe(channel) {
  const newSubscriber = new Redis(); // Create a new Redis connection for the subscriber
  newSubscriber.subscribe(channel, (err, count) => {
    if (err) {
      console.error(`Failed to subscribe to ${channel}:`, err);
      return;
    }
    console.log(`[Dynamic Subscriber] Subscribed to ${count} channel(s) on ${channel}`);
  });

  // Handle messages received by the dynamic subscriber
  newSubscriber.on('message', (ch, message) => {
    console.log(`[Dynamic Subscriber] Received message from ${ch}: ${message}`);
  });
}

// Function to publish multiple messages in bulk to a channel
async function bulkPublish(channel, messages) {
  for (const message of messages) {
    await publishMessage(channel, message); // Publish each message sequentially
  }
}

// Scheduled message publishing
setTimeout(() => {
  publishMessage('events', `Hello from events channel at ${Date.now()}`); // Publish a message to the 'events' channel
}, 3000); // Wait 3 seconds before publishing

setTimeout(() => {
  publishMessage('notifications', `Alert from notifications channel at ${Date.now()}`);
}, 6000); // Wait 6 seconds before publishing

setTimeout(() => {
  publishMessage('alerts', `Warning from alerts channel at ${Date.now()}`);
}, 9000); // Wait 9 seconds before publishing

setTimeout(() => {
  publishMessage('updates', `Update message from updates channel at ${Date.now()}`);
}, 12000); // Wait 12 seconds before publishing

// Bulk publishing to channels
setTimeout(() => {
  bulkPublish('alerts', [
    'Bulk alert 1',
    'Bulk alert 2',
    'Bulk alert 3',
  ]);
}, 15000); // Wait 15 seconds before bulk publishing

setTimeout(() => {
  bulkPublish('updates', [
    'Bulk update 1',
    'Bulk update 2',
    'Bulk update 3',
  ]);
}, 18000); // Wait 18 seconds before bulk publishing

// List all active channels
setTimeout(() => {
  listSubscriptions(commandClient, 'Command Client'); // List all active subscriptions
}, 20000); // Wait 20 seconds before listing channels

// Dynamically subscribe to a new channel and publish messages
setTimeout(() => {
  dynamicSubscribe('dynamic_channel'); // Dynamically subscribe to the 'dynamic_channel'
  setTimeout(() => {
    publishMessage('dynamic_channel', `Dynamic message at ${Date.now()}`); // Publish a message to 'dynamic_channel'
  }, 5000); // Publish a message after 5 seconds
}, 22000); // Wait 22 seconds before dynamic subscription

// Log message statistics
setTimeout(() => {
  console.log('[Statistics] Total messages received by subscribers:', messageStats); // Log total messages received
}, 25000); // Wait 25 seconds before logging statistics

// Unsubscribe subscribers after all tasks
setTimeout(() => {
  subscriber1.unsubscribe('events', () => {
    console.log('Subscriber 1 unsubscribed from events channel.');
  });
}, 27000); // Wait 27 seconds before unsubscribing

setTimeout(() => {
  subscriber2.unsubscribe('notifications', () => {
    console.log('Subscriber 2 unsubscribed from notifications channel.');
  });
}, 30000); // Wait 30 seconds before unsubscribing

setTimeout(() => {
  subscriber3.unsubscribe('alerts', () => {
    console.log('Subscriber 3 unsubscribed from alerts channel.');
  });
}, 33000); // Wait 33 seconds before unsubscribing

setTimeout(() => {
  subscriber4.unsubscribe('updates', () => {
    console.log('Subscriber 4 unsubscribed from updates channel.');
  });
}, 36000); // Wait 36 seconds before unsubscribing
