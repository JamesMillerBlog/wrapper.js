const utils = require('../utils.js'),
fs = require('fs'),
http = require("http"),
httpProxy = require("http-proxy");

module.exports = {
    ls: async(path) => {
            
        const dir = await fs.promises.opendir(path)
        let names = [];
        for await (const dirent of dir) {
            names.push(dirent.name);
        }
        return names;
    },

    generateLocalServices: async(httpPort, wsPort) => {
        const services = {
            http: [],
            ws: []
        };
        const http = await module.exports.ls('services/http').catch(console.error);
        // const ws = await module.exports.ls('services/ws').catch(console.error);
        const ws = ['ws'];
        // loop through all services except for socket
        // for socket make lambda port base off of wsPort
        for (let x=0; x<http.length; x++) {
            let httpLambdaPortNumber = parseInt(httpPort)+(x+1);
            let httpApiPortNumber = httpLambdaPortNumber + 50;
            let httpservice = {
                name: http[x],
                lambdaPort: httpLambdaPortNumber,
                apiPort: httpApiPortNumber
            }
            services.http.push(httpservice);       
        }
        for (let x =0; x < ws.length; x++) {
            let wsLambdaPortNumber = parseInt(wsPort)+(x+1);
            // let wsApiPortNumber = wsLambdaPortNumber + 50;
            let wsApiPortNumber = wsPort;
            let wsservice = {
                name: ws[x],
                lambdaPort: wsLambdaPortNumber,
                apiPort: wsApiPortNumber
            }
            services.ws.push(wsservice);
        }
        return services;
    },

    runServicesLocally: (type, services) => {
        for(let x = 0; x < services.length; x++) {
            if(type == 'http') {
                console.log(`cd ./services/${type}/${services[x].name} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`)
                utils.runAsyncTerminalCommand(
                    `cd ./services/${type}/${services[x].name} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
                );
            } else {
                console.log(`cd ./services/${type} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`)
                utils.runAsyncTerminalCommand(
                    `cd ./services/${type} && npm install && serverless offline --websocketPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
                )
            }
        }
    },
    deployServices: (service, type) => {
        if(type == 'http') {
            for (let x=0; x<service.length; x++) {
                console.log(`Deploying ${service[x]} service endpoints.`)
                utils.runSyncTerminalCommand(
                    `cd ./services/${type}/${service[x]} && npm install && npm run deploy`
                ); 
                console.log(`Deployed ${service[x]} service endpoints.`)   
            }
        } else {
            console.log(`Deploying ${service[0]} service endpoints.`)
            utils.runSyncTerminalCommand(
                `cd ./services/${type} && npm install && npm run deploy`
            );
            console.log(`Deployed ${type} service endpoints.`)   
        }
    },
    removeServices: (service, type) => {
        if(type == 'http') {
            for (let x=0; x<service.length; x++) {
                console.log(`Removing ${service[x]} service endpoints.`)
                
                utils.runSyncTerminalCommand(
                    `cd ./services/${type}/${service[x]} && npm install && npm run remove`
                );
                console.log(`Removed ${service[x]} service endpoints.`)   
            }
        } else {
            utils.runSyncTerminalCommand(
                `cd ./services/${type} && npm install && npm run remove`
            );
            console.log(`Removed ${type} service endpoints.`) 
        }
    },
    dev: async() => {
        // https://github.com/AnomalyInnovations/serverless-stack-demo-ext-api/blob/master/startServer
        // for each folder in services 
        // run the serverless offline command (incrementing from 4001 upwards)
        // create a proxy server on port 4000 for all endpoints
        
        const httpPort = require("./serverless.env.json").local_api_rest_port;
        // const lambdaHttpPort = httpPortNumber - 50;
        
        const wsPort = require("./serverless.env.json").local_api_ws_port;
        const services = await module.exports.generateLocalServices(httpPort, wsPort);
        
        module.exports.runServicesLocally('http', services.http);
        module.exports.runServicesLocally('ws', services.ws);        
        const localIpAddress = require("./serverless.env.json").api_local_ip_address;
        const httpproxy = httpProxy.createProxyServer({});
        const httpserver = http.createServer(function(req, res) {
            for(let x = 0; x<services.http.length; x++) {
                if(req.url.includes(services.http[x].name)) {
                    httpproxy.web(req, res, { 
                        target: `http://${localIpAddress}:${services.http[x].apiPort}`
                    });
                }
                
            }
        });
        // const wsproxy = httpProxy.createProxyServer({});
        // const wsserver = http.createServer(function(req, res) {
        //     for(let x = 0; x<services.ws.length; x++) {
        //         if(req.url.includes(services.ws[x].name)) {
        //             console.log('disney')
        //             console.log(`http://${localIpAddress}:${services.ws[x].apiPort}`)
        //             console.log(`${req.url}`)
        //             wsproxy.web(req, res, { 
        //                 target: `http://${localIpAddress}:${services.ws[x].lambdaPort}`,
        //                 ws: true
        //             });
        //         }
        //     }
        // });
        // wsserver.on('Upgrade', function (req, socket, head) {
        //     console.log('UNDERSTAND ME LOL')
        //     wsproxy.ws(req, socket, head);
        // });
        console.log(`http api listening on port ${httpPort}`)
        // console.log(`ws api listening on port ${wsPort}`)
        httpserver.listen(httpPort);

        // wsserver.listen(wsPort);
    },
    deploy: async() => {
        const http = await module.exports.ls('services/http').catch(console.error);
        // const ws = await module.exports.ls('services/ws').catch(console.error);;
        module.exports.deployServices(http, 'http');
        module.exports.deployServices(['ws'], 'ws');
    },

    remove: async() => {     
        const http = await module.exports.ls('services/http').catch(console.error);
        const ws = await module.exports.ls('services/ws').catch(console.error);
        
        module.exports.removeServices(http, 'http');
        module.exports.removeServices(ws, 'ws');
    }
};