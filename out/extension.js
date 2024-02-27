var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// package.json
var require_package = __commonJS({
  "package.json"(exports, module2) {
    module2.exports = {
      name: "sqltools-driver-hive",
      displayName: "SQLTools Hive Driver",
      description: "SQLTools Hive Driver, provides for running Hive SQL and getting results, SQL formatting, generating SQL statements and SQL completion.",
      version: "0.0.8",
      engines: {
        vscode: "^1.72.0"
      },
      publisher: "dataworks",
      license: "MIT",
      private: true,
      repository: {
        type: "git",
        url: "https://github.com/datafe/sqltools-hive-vscode-extension.git"
      },
      bugs: {
        url: "https://github.com/datafe/sqltools-hive-vscode-extension"
      },
      keywords: [
        "sqltools-driver",
        "apache",
        "hive",
        "emr",
        "ecs",
        "bigdata",
        "aliyun",
        "alibaba",
        "cloud",
        "computing",
        "dataworks"
      ],
      galleryBanner: {
        theme: "light",
        color: "#fafafa"
      },
      icon: "icon.png",
      categories: [
        "Programming Languages",
        "Snippets",
        "Formatters",
        "Other"
      ],
      extensionDependencies: [
        "mtxr.sqltools"
      ],
      activationEvents: [
        "*",
        "onLanguage:sql",
        "onCommand:sqltools.*"
      ],
      main: "./out/extension.js",
      scripts: {
        format: "prettier --write .",
        "vscode:prepublish": "yarn run build",
        "vscode:package": "vsce package --allow-star-activation",
        build: "rimraf out && yarn run compile:ext && yarn run compile:ls",
        esbuild: "esbuild --platform=node --tsconfig=./tsconfig.json --external:vscode --log-level=error --color=true --format=cjs",
        "compile:ext": `yarn run esbuild --bundle ./src/extension.ts --outfile=./out/extension.js --target=es2020 --define:process.env.PRODUCT="'ext'"`,
        "compile:ls": `yarn run esbuild --bundle ./src/ls/plugin.ts --outfile=./out/ls/plugin.js --target=es2020 --define:process.env.PRODUCT="'ls'"`,
        compile: "tsc -p ./",
        watch: "tsc -watch -p ./"
      },
      dependencies: {
        "@sqltools/base-driver": "^0.1.11",
        "@sqltools/formatter": "^1.2.5",
        "compare-versions": "3.6.0",
        concurrently: "^5.2.0",
        "hive-driver": "^0.2.0",
        lodash: "^4.17.19",
        "strip-comments": "^2.0.1",
        uuid: "^7.0.2"
      },
      devDependencies: {
        "@babel/preset-env": "^7.5.5",
        "@sqltools/types": "^0.1.7",
        "@types/lodash": "^4.14.123",
        "@types/node": "^14.0.9",
        "@types/uuid": "^9.0.7",
        "@types/vscode": "^1.72.0",
        "@vscode/vsce": "^2.19.0",
        esbuild: "^0.15.7",
        prettier: "^3.1.1",
        rimraf: "^3.0.2",
        typescript: "~4.8.3"
      },
      packageManager: "yarn@1.22.21"
    };
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/constants.ts
var DRIVER_ALIASES = [
  { displayName: "Hive", value: "Hive" }
];

// src/extension.ts
var AUTHENTICATION_PROVIDER = "sqltools-driver-credentials";
var { publisher, name } = require_package();
var driverName = "Hive";
async function activate(extContext) {
  const sqltools = vscode.extensions.getExtension("mtxr.sqltools");
  if (!sqltools) {
    throw new Error("SQLTools not installed");
  }
  await sqltools.activate();
  const api = sqltools.exports;
  const extensionId = `${publisher}.${name}`;
  const plugin = {
    extensionId,
    name: `${driverName} Plugin`,
    type: "driver",
    async register(extension) {
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[0].value}/icons`, {
        active: extContext.asAbsolutePath("icons/hive/active.png"),
        default: extContext.asAbsolutePath("icons/hive/default.png"),
        inactive: extContext.asAbsolutePath("icons/hive/inactive.png")
      });
      DRIVER_ALIASES.forEach(({ value }) => {
        extension.resourcesMap().set(`driver/${value}/extension-id`, extensionId);
        extension.resourcesMap().set(`driver/${value}/connection-schema`, extContext.asAbsolutePath("connection.schema.json"));
        extension.resourcesMap().set(`driver/${value}/ui-schema`, extContext.asAbsolutePath("ui.schema.json"));
      });
      await extension.client.sendRequest("ls/RegisterPlugin", { path: extContext.asAbsolutePath("out/ls/plugin.js") });
    }
  };
  api.registerPlugin(plugin);
  return {
    driverName,
    parseBeforeSaveConnection: ({ connInfo }) => {
      const propsToRemove = ["connectionMethod", "id", "usePassword"];
      if (connInfo.usePassword) {
        if (connInfo.usePassword.toString().toLowerCase().includes("ask")) {
          connInfo.askForPassword = true;
          propsToRemove.push("password");
        } else if (connInfo.usePassword.toString().toLowerCase().includes("empty")) {
          connInfo.password = "";
          propsToRemove.push("askForPassword");
        } else if (connInfo.usePassword.toString().toLowerCase().includes("save")) {
          propsToRemove.push("askForPassword");
        } else if (connInfo.usePassword.toString().toLowerCase().includes("secure")) {
          propsToRemove.push("password");
          propsToRemove.push("askForPassword");
        }
      }
      if (connInfo.connectString) {
        propsToRemove.push("port");
        propsToRemove.push("askForPassword");
      }
      propsToRemove.forEach((p) => delete connInfo[p]);
      return connInfo;
    },
    parseBeforeEditConnection: ({ connInfo }) => {
      const formData = {
        ...connInfo,
        connectionMethod: "Server and Port"
      };
      if (connInfo.socketPath) {
        formData.connectionMethod = "Socket File";
      } else if (connInfo.connectString) {
        formData.connectionMethod = "Connection String";
      }
      if (connInfo.askForPassword) {
        formData.usePassword = "Ask on connect";
        delete formData.password;
      } else if (typeof connInfo.password === "string") {
        delete formData.askForPassword;
        formData.usePassword = connInfo.password ? "Save as plaintext in settings" : "Use empty password";
      } else {
        formData.usePassword = "SQLTools Driver Credentials";
      }
      return formData;
    },
    resolveConnection: async ({ connInfo }) => {
      if (connInfo.password === void 0 && !connInfo.askForPassword && !connInfo.connectString) {
        const scopes = [connInfo.name, connInfo.username || ""];
        let session = await vscode.authentication.getSession(
          AUTHENTICATION_PROVIDER,
          scopes,
          { silent: true }
        );
        if (!session) {
          session = await vscode.authentication.getSession(
            AUTHENTICATION_PROVIDER,
            scopes,
            { createIfNone: true }
          );
        }
        if (session) {
          connInfo.password = session.accessToken;
        }
      }
      return connInfo;
    },
    driverAliases: DRIVER_ALIASES
  };
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
