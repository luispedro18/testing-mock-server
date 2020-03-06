const mockServerClient = require('mockserver-client').mockServerClient;

mockServerClient("localhost", 1080)
    .mockSimpleResponse('/somePath', { name: 'value' }, 203)
    .then(
        function(result) {
            console.log("expectation created");
        }, 
        function(error) {
            console.log(error);
        }
    );