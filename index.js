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

  } catch (error) {
    console.error("Error handling geospatial data:", error);
  } finally {
    client.quit();
  }
}

init();
