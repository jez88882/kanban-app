async function test() {
  console.log('Ready');
  let example = await fetch('http://httpbin.org/get');
  console.log('I will print second');
}

test();
console.log('I will print first');