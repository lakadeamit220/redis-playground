const client = require('./client');

async function init() {
  try {
    // Adding geospatial data to Redis for locations in Maharashtra
    await client.geoadd('maharashtra:locations', 72.8777, 19.0760, 'Mumbai');
    await client.geoadd('maharashtra:locations', 73.8567, 18.5204, 'Pune');
    await client.geoadd('maharashtra:locations', 79.0882, 21.1458, 'Nagpur');
    await client.geoadd('maharashtra:locations', 73.8478, 19.2183, 'Thane');
    await client.geoadd('maharashtra:locations', 74.1232, 17.6599, 'Kolhapur');

    console.log("Locations added to Redis.");

    // Fetching geospatial data: Get the position of a specific location
    const mumbaiPosition = await client.geopos('maharashtra:locations', 'Mumbai');
    console.log("Position of Mumbai:", mumbaiPosition);

    // Calculating the distance between two locations
    const distance = await client.geodist('maharashtra:locations', 'Mumbai', 'Pune', 'km');
    console.log("Distance between Mumbai and Pune (km):", distance);

    // Finding locations within a radius of 200 km from Pune
    const nearbyLocations = await client.georadius('maharashtra:locations', 73.8567, 18.5204, 200, 'km', 'WITHDIST');
    console.log("Locations within 200 km of Pune:", nearbyLocations);

    // Get geohash of locations
    const geohash = await client.geohash('maharashtra:locations', 'Nagpur');
    console.log("Geohash of Nagpur:", geohash);

    // Fetching all locations stored in the geospatial index
    const allLocations = await client.zrange('maharashtra:locations', 0, -1);
    console.log("All locations in Maharashtra:", allLocations);

    // Finding the closest location to a specific point
    const closestLocations = await client.georadius('maharashtra:locations', 73.8567, 18.5204, 50, 'km', 'WITHDIST', 'ASC', 'COUNT', 1);
    console.log("Closest location to Pune within 50 km:", closestLocations);

    // Adding an event listener for geospatial updates
    client.on('message', (channel, message) => {
      console.log(`Received update on channel ${channel}: ${message}`);
    });

    // Subscribe to updates for geospatial data
    client.subscribe('maharashtra:geoUpdates', (err, count) => {
      if (err) {
        console.error("Failed to subscribe to geoUpdates channel: ", err);
      } else {
        console.log(`Subscribed to ${count} channel(s) for geospatial updates.`);
      }
    });

  } catch (error) {
    console.error("Error handling geospatial data:", error);
  } finally {
    client.quit();
  }
}

init();
