const fs = require("fs"),
  express = require("express"),
  https = require("https"),
  { createProxyMiddleware } = require("http-proxy-middleware"),
  cmd = require("node-cmd");

module.exports = {
  ls: async (path) => {
    const dir = await fs.promises.opendir(path);
    let names = [];
    for await (const dirent of dir) {
      names.push(dirent.name);
    }
    return names;
  },

  generateLocalServices: async (httpPort, wsPort) => {
    const services = {
      http: [],
      ws: [],
    };
    const http = await module.exports
      .ls("services/http")
      .catch((e) => console.error(e));
    // const ws = await module.exports.ls('services/ws').catch(console.error);
    const ws = ["ws"];
    // loop through all services except for socket
    // for socket make lambda port base off of wsPort
    for (let x = 0; x < http.length; x++) {
      let httpLambdaPortNumber = parseInt(httpPort) + (x + 1);
      let httpApiPortNumber = httpLambdaPortNumber + 50;
      let httpservice = {
        name: http[x],
        lambdaPort: httpLambdaPortNumber,
        apiPort: httpApiPortNumber,
      };
      services.http.push(httpservice);
    }
    for (let x = 0; x < ws.length; x++) {
      let wsLambdaPortNumber = parseInt(wsPort) + (x + 1);
      // let wsApiPortNumber = wsLambdaPortNumber + 50;
      let wsApiPortNumber = parseInt(wsPort) + 50;
      let wsservice = {
        name: ws[x],
        lambdaPort: wsLambdaPortNumber,
        apiPort: wsApiPortNumber,
      };
      services.ws.push(wsservice);
    }
    return services;
  },

  runServicesLocally: (type, services) => {
    for (let x = 0; x < services.length; x++) {
      if (type == "http") {
        console.log(
          `cd ./services/${type}/${services[x].name} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
        );
        module.exports.runAsyncTerminalCommand(
          `cd ./services/${type}/${services[x].name} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
        );
      } else {
        console.log(
          `cd ./services/${type} && npm install && serverless offline --httpPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
        );
        module.exports.runAsyncTerminalCommand(
          `cd ./services/${type} && npm install && serverless offline --websocketPort ${services[x].apiPort} --lambdaPort ${services[x].lambdaPort}`
        );
      }
    }
  },
  deployServices: (service, type) => {
    if (type == "http") {
      for (let x = 0; x < service.length; x++) {
        console.log(`Deploying ${service[x]} service endpoints.`);
        module.exports.runSyncTerminalCommand(
          `cd ./services/${type}/${service[x]} && npm install && npm run deploy`
        );
        console.log(`Deployed ${service[x]} service endpoints.`);
      }
    } else {
      console.log(`Deploying ${service[0]} service endpoints.`);
      module.exports.runSyncTerminalCommand(
        `cd ./services/${type} && npm install && npm run deploy`
      );
      console.log(`Deployed ${type} service endpoints.`);
    }
  },
  removeServices: (service, type) => {
    if (type == "http") {
      for (let x = 0; x < service.length; x++) {
        console.log(`Removing ${service[x]} service endpoints.`);

        module.exports.runSyncTerminalCommand(
          `cd ./services/${type}/${service[x]} && npm install && npm run remove`
        );
        console.log(`Removed ${service[x]} service endpoints.`);
      }
    } else {
      module.exports.runSyncTerminalCommand(
        `cd ./services/${type} && npm install && npm run remove`
      );
      console.log(`Removed ${type} service endpoints.`);
    }
  },
  // dev: async () => {
  //   // https://github.com/AnomalyInnovations/serverless-stack-demo-ext-api/blob/master/startServer
  //   // for each folder in services
  //   // run the serverless offline command (incrementing from 4001 upwards)
  //   // create a proxy server on port 4000 for all endpoints

  //   const httpPort = require("./serverless.env.json").local_api_rest_port;
  //   // const lambdaHttpPort = httpPortNumber - 50;

  //   const wsPort = require("./serverless.env.json").local_api_ws_port;
  //   const services = await module.exports.generateLocalServices(
  //     httpPort,
  //     wsPort
  //   );

  //   if (services.http.length > 0) {
  //     module.exports.runServicesLocally("http", services.http);
  //   }

  //   if (services.ws.length > 0) {
  //     module.exports.runServicesLocally("ws", services.ws);
  //   }

  //   const localIpAddress =
  //     require("./serverless.env.json").api_local_ip_address;

  //   const app = express();
  //   for (let x = 0; x < services.http.length; x++) {
  //     app.use(
  //       "/*",
  //       createProxyMiddleware({
  //         target: `https://${localIpAddress}:${services.http[x].apiPort}`,
  //         changeOrigin: true,
  //         pathRewrite: {
  //           [`^/*`]: "",
  //         },
  //       })
  //     );
  //   }
  //   app.listen(httpPort, localIpAddress, () => {
  //     console.log(`Starting Proxy at ${localIpAddress}:${httpPort}`);
  //   });
  // },
  dev: async () => {
    // https://github.com/AnomalyInnovations/serverless-stack-demo-ext-api/blob/master/startServer
    // for each folder in services
    // run the serverless offline command (incrementing from 4001 upwards)
    // create a proxy server on port 4000 for all endpoints

    const httpPort = require("./serverless.env.json").local_api_rest_port;
    // const lambdaHttpPort = httpPortNumber - 50;

    const wsPort = require("./serverless.env.json").local_api_ws_port;
    const services = await module.exports.generateLocalServices(
      httpPort,
      wsPort
    );

    if (services.http.length > 0) {
      module.exports.runServicesLocally("http", services.http);
    }

    if (services.ws.length > 0) {
      module.exports.runServicesLocally("ws", services.ws);
    }

    const localIpAddress =
      require("./serverless.env.json").api_local_ip_address;

    const options = {
      key: fs.readFileSync("./cert/key.pem"),
      cert: fs.readFileSync("./cert/cert.pem"),
    };
    const app = express();
    const httpserver = https.createServer(options, app);
    const wsserver = https.createServer(options, app);
    let wsProxy;

    for (let x = 0; x < services.http.length; x++) {
      app.use(
        "/*",
        createProxyMiddleware({
          target: `https://${localIpAddress}:${services.http[x].apiPort}`,
          changeOrigin: true,
          ssl: options,
          secure: false,
          changeOrigin: true,
        })
      );
      wsProxy = createProxyMiddleware({
        target: `wss://${localIpAddress}:${services.ws[x].apiPort}`,
        changeOrigin: true,
        ssl: options,
        secure: false,
        ws: true,
        changeOrigin: true,
      });
      app.use("/*", wsProxy);
    }
    httpserver.listen(httpPort, localIpAddress, () => {
      console.log(`Starting Proxy at ${localIpAddress}:${httpPort}`);
    });

    const websocketsServer = wsserver.listen(wsPort, localIpAddress, () => {
      console.log(`Starting Proxy at ${localIpAddress}:${wsPort}`);
    });

    websocketsServer.on("upgrade", wsProxy);
  },
  deploy: async () => {
    const httpPort = require("./serverless.env.json").local_api_rest_port;
    // const lambdaHttpPort = httpPortNumber - 50;

    const wsPort = require("./serverless.env.json").local_api_ws_port;
    const http = await module.exports
      .ls("services/http")
      .catch(() => console.warning("no http services to deploy"));
    // const ws = await module.exports.ls('services/ws').catch(console.warning('no websocket services to deploy'));
    const services = await module.exports.generateLocalServices(
      httpPort,
      wsPort
    );
    if (services.http.length > 0) {
      module.exports.deployServices(http, "http");
    }
    if (services.ws.length > 0) {
      module.exports.deployServices(["ws"], "ws");
    }
  },

  remove: async () => {
    const httpPort = require("./serverless.env.json").local_api_rest_port;
    // const lambdaHttpPort = httpPortNumber - 50;

    const wsPort = require("./serverless.env.json").local_api_ws_port;
    const http = await module.exports
      .ls("services/http")
      .catch(() => console.warning("no http services to remove"));
    // const ws = await module.exports.ls('services/ws').catch(console.warning('no websocket services to remove'));
    const services = await module.exports.generateLocalServices(
      httpPort,
      wsPort
    );
    if (services.http.length > 0) {
      module.exports.removeServices(http, "http");
    }
    if (services.ws.length > 0) {
      module.exports.removeServices(["ws"], "ws");
    }
  },
  // Function to run syncronous terminal commands
  runSyncTerminalCommand: (terminalCommand) => {
    let command = cmd.runSync(terminalCommand);
    // console.log(`Beginning ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
    console.log("Started running a command");
    console.log(terminalCommand);
    if (command.err) {
      console.log(`Sync Err ${command.err}`);
      throw new Error(command.err);
    } else if (command.stderr) {
      console.log(`Sync stderr: ${command.stderr}`);
      throw new Error(command.stderr);
    }

    console.log(command.data);
  },
  // Function to run asyncronous terminal commands
  runAsyncTerminalCommand: async (terminalCommand) => {
    let command = cmd.run(terminalCommand, function (err, data, stderr) {
      // console.log(`Start ${action} a ${environment} app for the ${project} project on behalf of ${client}...`);
      if (err) {
        console.log(err);
        // throw new Error(err);
      }
      if (stderr) {
        console.log(stderr);
        // throw new Error(stderr);
      }
    });

    // stream terminal output
    command.stdout.on("data", function (data) {
      console.log(data);
    });

    await command;
  },
};
