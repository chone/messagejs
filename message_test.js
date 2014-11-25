
var nativeSetTimeout = window.setTimeout;

function setUp() {
  window.setTimeout = function(fn) {
    fn();
  };
}

function tearDown() {
  window.setTimeout = nativeSetTimeout;
}

function testReceivePost() {
  var d; 
  message.receive('event1', 'test1', function(data) {
    d = data;
  });
  message.post('event1', 'test1', 'data1');
  assertEquals(d, 'data1');

  message.post('event1', 'test1', 'data11');
  assertEquals(d, 'data11');
}

function testPostCache() {
  message.post('event2', 'test2', 'data2', true);
  var d; 
  message.receive('event2', 'test2', function(data) {
    d = data;
  });
  assertEquals(d, 'data2');

  message.post('event2', 'test2', 'data21', true);
  message.receive('event2', 'test2', function(data) {
    d = data;
  });
  assertEquals(d, 'data21');
}

function testReceiveOnce() {
  var d; 
  message.receive('event3', 'test3', function(data) {
    d = data;
  }, true);
  message.post('event3', 'test3', 'data3');
  assertEquals(d, 'data3');

  message.post('event3', 'test3', 'data31');
  assertEquals(d, 'data3');
}

function testUnreceive() {
  var d; 
  var fn = function(data) {
    d = data;
  };
  message.receive('event4', 'test4', fn);
  message.unreceive('event4', 'test4', fn); 
  message.post('event4', 'test4', 'data4');
  assertUndefined(d);
}
