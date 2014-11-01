
var nativeSetTimeout = window.setTimeout;

function setUp() {
  window.setTimeout = function(fn) {
    fn();
  };
}

function tearDown() {
  window.setTimeout = nativeSetTimeout;
}

function testOnPost() {
  var d; 
  message.on('test1', 'event1', function(data) {
    d = data;
  });
  message.post('test1', 'event1', 'data1');
  assertEquals(d, 'data1');

  message.post('test1', 'event1', 'data11');
  assertEquals(d, 'data11');
}

function testPostCache() {
  message.post('test2', 'event2', 'data2', true);
  var d; 
  message.on('test2', 'event2', function(data) {
    d = data;
  });
  assertEquals(d, 'data2');

  message.post('test2', 'event2', 'data21', true);
  message.on('test2', 'event2', function(data) {
    d = data;
  });
  assertEquals(d, 'data21');
}

function testOnOnce() {
  var d; 
  message.on('test3', 'event3', function(data) {
    d = data;
  }, true);
  message.post('test3', 'event3', 'data3');
  assertEquals(d, 'data3');

  message.post('test3', 'event3', 'data31');
  assertEquals(d, 'data3');
}

function testOff() {
  var d; 
  var fn = function(data) {
    d = data;
  };
  message.on('test4', 'event4', fn);
  message.off('test4', 'event4', fn); 
  message.post('test4', 'event4', 'data4');
  assertUndefined(d);
}
