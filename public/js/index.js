const fetch = require("node-fetch");

console.log('\n\nhello\n\n');

$("#signin").on("click", async function(name, password) {
  console.log(`sign in: ${name}, ${password}`);
  await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, password})
  });
});
