var Injector // = require('async-di');

describe("Test Badges", function() {
    it('Test Thumps up Badge',function(done) {
        var event = new Event('gameWon','userId');
        var executor = new EventExecutor(event);
        var badgeId ;
        executor.execute(function(badgeId) {
            badgeId=badgeId;
            badgeId.should.be.exactly('thumsUp');
            done();
        });
    });
});
