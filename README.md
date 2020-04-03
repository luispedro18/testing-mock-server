# testing-mock-server

### Motivation

As a developer I had to fix some issues in stateful situations where most of the cases involves user credentials. To be able to debug this issues I asked users to export HAR files from browser so I can observe the responses and triage the problem. Most of the times it's difficult to debug only seeing HAR files so I'd like to have a way to use them alongside my app/UI. With this I would be able to see exactly what user is seeing.

Taking into account the above, I found out [MockServer](https://www.mock-server.com/), an open source mocking framework for HTTP and HTTPS.

### Project Description

This project integrates Mockserver and a JSON/HAR file parser to create expectations (map of request / mock response). 
To run the MockServer it is used a fully encapsulated Docker container, defined in docker-compose file. There is a initial script that reads the file with the list of expectations and decide to either use JSON or HAR parser depending on mock file's extension.
After having the expectations in the required shape they are sent to MockServer instance using [mockserver-client](https://www.npmjs.com/package/mockserver-client) npm package.

### File Structure

```
project
│   docker-compose.yml
│   ...
│
└───certs
│   
└───env
│   
└───data
│   
└───mocks
│   
└───src
```

##### `/docker-compose.yml`:
- File defining mockserver container options.

##### `/certs`:
- Directory used to save the dynamically generated Certificate Authority X.509 Certificate and Private Key.

##### `/env`:
- Directory used to save the env files used by mockserver docker container.

##### `/data`:
- Directory used to save the lists of expectations.

##### `/mocks`:
- Directory used to save the mocks defined in expectations.

##### `/src`:
- Directory used to save source code.


### Basic Usage

1. create a file with the same structure as `sample_expectations.yml`
The first 2 entries on that file correspond to HAR files descriptors and the last one to a JSON file. 
**Note:** The `name` field is the only one that is optional
<br>

2. start mockserver container - `docker-compose up`
<br>

3. run the script to read the expectations' list file, parse and send to mockserver instance - `yarn mock <filename>` 
**Note:** the default filename is sample_expectations. This field should include the file's extension

The last step will create (if not present already) a .pem file that is used by mockserver-client to communicate with Mockserver instance.


### Browser Preparation

For this to work you need to tell the browser to proxy every request through Mockserver that will be listening on `localhost:1080`.
If you're using Firefox you can do this in Preferences. [How to do it?](https://support.mozilla.org/en-US/kb/connection-settings-firefox)
For every other browser you need to define it in your OS settings.

On first request you might find some errors if your trying to do HTTPS requests. If so, 2 files will be created and stored at `/certs` forlder. One of them will be a CA Certificate that you need to add into your OS. You might have to do the same in your browser.

Then, you can make requests to your app in the way you usually do. If the request match an expectation you'll get the mock response otherwise the browser will make the request to origin. 

<br>
### Contacts

Luís Almeida - [@luispedro18](https://twitter.com/luis___almeida) / [Email](mailto:almeida.lpm@gmail.com)