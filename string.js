const client = require('./client');

async function init() {
  const result = await client.get('user:3');
  console.log("User_3: ", result);

  await client.set('msg:3', 'I am working on YuKa Project!!');
  const msg3 = await client.get('msg:3');
  console.log("msg_3: ", msg3);

  await client.expire('msg:3', 10);
  const msg4 = await client.get('msg:3');
  console.log("msg_4: ", msg4);
}

init()