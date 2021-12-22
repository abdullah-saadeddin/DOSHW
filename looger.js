const winston = require("winston");
const path = require("path");
const PROJECT_ROOT = path.join(__dirname, "..");


const logConfiguration = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(

                winston.format.colorize({
                    all:true
                })
            )
        }),
        new winston.transports.File({
            
            // Create the log directory if it does not exist
            filename: 'logs/main.log'
        })
    ],
    format: winston.format.combine(
      winston.format.errors({stack:true}),
        winston.format.label({
            label: `Label🏷️`
        }),
        winston.format.timestamp({
           format: 'DD-MM-YYYY HH:mm:ss:SSS'
       }),

        winston.format.printf(info => {
          if(info.level == "error")
          {
            return `---------------------------
[${info.level.toUpperCase()}] ${[info.timestamp]} ===> 
${info.message} 
--------------------------`
          }
          else
          {
            return `[${info.level.toUpperCase()}] ${[info.timestamp]} ===> ${info.message} `
          }
        }),

    ),
  
};
const logger = winston.createLogger(logConfiguration);
module.exports.info = function() {
    logger.info.apply(logger, formatLogArguments(arguments));
  };
  module.exports.log = function() {
    logger.info.apply(logger, formatLogArguments(arguments));
  };
  module.exports.warn = function() {
    logger.warn.apply(logger, formatLogArguments(arguments));
  };
  module.exports.debug = function() {
    logger.debug.apply(logger, formatLogArguments(arguments));
  };
  module.exports.verbose = function() {
    logger.verbose.apply(logger, formatLogArguments(arguments));
  };
  
  module.exports.error = function() {
    logger.error.apply(logger, formatLogArguments(arguments));
  };
function formatLogArguments  (args) {
  args = Array.prototype.slice.call(args);
  const stackInfo = getStackInfo(1);

  if (stackInfo) {
    const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`;
    
    args[0]=JSON.stringify(args[0], null, 2)
    if (typeof args[0] === "string") {
      args[0] = args[0] + "  ---  " + calleeStr;
    } else if(isJsonParsable(args[0])){
      args[0]=JSON.stringify(args[0], null, 2)
    } 
    else{
     
      args[0] = args[0] + "  ---  " + calleeStr;
    }
  }
  return args;
}

function getStackInfo(stackIndex) {
  const stacklist = new Error().stack.split("\n").slice(3);
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join("\n")
    };
  }
}

function stri(arg) {
  return `${arg}`;
}
var isJsonParsable = string => {
  try {
      JSON.parse(string);
  } catch (e) {
      return false;
  }
  return true;
}
logger.exitOnError = false;