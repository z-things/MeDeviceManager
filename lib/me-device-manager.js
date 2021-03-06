/**
 * Created by jacky on 2017/2/4.
 */
'use strict';
var _ = require('lodash');
var util = require('util');
var async = require('async');
var tzWhere = require('tzwhere');
var VirtualDevice = require('./virtual-device').VirtualDevice;
var logger = require('./mlogger/mlogger');
const USER_TYPE_ID = '060A08000000';
const EMPLOYEE_TYPE_ID = '10010004';
const SMART_BOX_TYPE_ID = '10010006';
const DEFAULT_BUILDING_SITE_SAAS_UUID = "e144ad6c-e8ba-4bf9-8157-80e38af529e7";
const HL_TYPE_ID = '050608070001';
const MEBOX_TYPE_ID = '030B08000004';
const MEPANEL1_TYPE_ID = '040B09051001';
const MEPANEL1_ASSOCIATED = [
  {
    "rocker": "B",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  }
];

const MEPANEL2_TYPE_ID = '040B09051002';
const MEPANEL2_ASSOCIATED = [
  {
    "rocker": "B",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "A",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  }];
const MEPANEL3_TYPE_ID = '040B09051113';
const MEPANEL3_ASSOCIATED = [
  {
    "rocker": "C",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "B",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "A",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  }];
const MEPANEL4_TYPE_ID = '040B09051114';
const MEPANEL4_ASSOCIATED = [
  {
    "rocker": "BI",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "BO",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "AI",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  },
  {
    "rocker": "AO",
    "action": "press",
    "deviceId": [],
    "command": {
      "name": "",
      "option": "",
      "parameters": []
    }
  }];
var OPERATION_SCHEMAS = {
  "addDevice": {
    "type": "object",
    "properties": {
      "uuid": {"type": "string"},
      "userId": {"type": "string"},
      "token": {"type": "string"},
      "online": {"type": "boolean"},
      "timestamp": {"type": "string"},
      "ipAddress": {"type": "string"},
      "name": {"type": "string"},
      "description": {"type": "string"},
      "location": {
        "type": "object",
        "properties": {
          "locationId": {"type": "string"},
          "locationType": {"type": "string"},
          "locationName": {"type": "string"}
        }
      },
      "icon": {"type": "string"},
      "enable": {"type": "boolean"},
      "owner": {"type": "string"},
      "geo": {
        "type": "object",
        "properties": {
          "range": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "country": {"type": "string"},
          "region": {"type": "string"},
          "city": {"type": "string"},
          "ll": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "metro": {"type": "number"}
        }
      },
      "sendWhitelist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "receiveWhitelist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "configureWhitelist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "discoverWhitelist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "sendBlacklist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "receiveBlacklist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "configureBlacklist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "discoverBlacklist": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "type": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "icon": {"type": "string"}
        }
      },
      "protocol": {
        "type": "object",
        "properties": {
          "protocolId": {"type": "string"},
          "protocolName": {"type": "string"}
        }
      },
      "extra": {"type": "object"}
    },
    "required": ["type", "name", "extra"]
  },
  "deleteDevice": {
    "type": "object",
    "properties": {
      "uuid": {"type": "string"}
    },
    "required": ["uuid"]
  },
  "getDevice": {
    "type": "object",
    "properties": {
      "uuid": {"type": "string"},
      "userId": {"type": "string"},
      "online": {"type": "boolean"},
      "timestamp": {"type": "string"},
      "ipAddress": {"type": "string"},
      "name": {"type": "string"},
      "description": {"type": "string"},
      "location": {
        "type": "object",
        "properties": {
          "locationId": {"type": "string"},
          "locationType": {"type": "string"},
          "locationName": {"type": "string"}
        }
      },
      "icon": {"type": "string"},
      "enable": {"type": "boolean"},
      "owner": {"type": "string"},
      "geo": {
        "type": "object",
        "properties": {
          "range": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "country": {"type": "string"},
          "region": {"type": "string"},
          "city": {"type": "string"},
          "ll": {
            "type": "array",
            "items": {
              "type": "number"
            }
          },
          "metro": {"type": "number"}
        }
      },
      "type": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "icon": {"type": "string"}
        }
      },
      "protocol": {
        "type": "object",
        "properties": {
          "protocolId": {"type": "string"},
          "protocolName": {"type": "string"}
        }
      }
    }
  },
  "deviceUpdate": {
    "type": "object",
    "properties": {
      "uuid": {"type": "string"}
    },
    "required": ["uuid"]
  }
};

var syncEmployees = function (self, employees, callback) {
  logger.debug("syncEmployees");
  logger.debug(employees);
  self.message({
    devices: DEFAULT_BUILDING_SITE_SAAS_UUID,
    payload: {
      cmdName: "sync_employees",
      cmdCode: "0001",
      parameters: {
        employees: employees
      }
    }
  }, function (response) {
    if (response.retCode !== 200) {
      callback({errorId: response.retCode, errorMsg: response.description})
    }
    else {
      callback(null);
    }
  });
};

function DeviceManager(conx, uuid, token, configurator) {
  this.employees = [];//智慧工地定向处理
  this.init = function () {
    tzWhere.init();
    //智慧工地定向处理，定时同步未成功数据
    setInterval(function (self) {
      if (self.employees && self.employees.length > 0) {
        syncEmployees(self, self.employees, function (error) {
          if (error) {
            logger.error(error.errorId, error.errorMsg);
          }
          else {
            self.employees = [];
          }
        });
      }
    }, 5 * 60 * 1000, this)
  };
  VirtualDevice.call(this, conx, uuid, token, configurator);
}

util.inherits(DeviceManager, VirtualDevice);

/**
 * 远程RPC回调函数
 * @callback onMessage~addDevice
 * @param {object} response:
 * {
 *      "payload":
 *      {
 *          "retCode":{string},
 *          "description":{string},
 *          "data":{object}
 *      }
 * }
 */
/**
 * 设备添加
 * @param {object} message:输入消息
 * @param {onMessage~addDevice} peerCallback: 远程RPC回调
 * */
DeviceManager.prototype.addDevice = function (message, peerCallback) {
  var self = this;
  logger.debug(message);
  var responseMessage = {retCode: 200, description: "Success.", data: {}};
  self.messageValidate(message, OPERATION_SCHEMAS.addDevice, function (error) {
    if (error) {
      peerCallback(error);
      return;
    }
    var deviceInfo = message;
    deviceInfo.configureWhitelist = [self.deviceUuid];
    if (deviceInfo.owner) {
      if (deviceInfo.discoverWhitelist) {
        deviceInfo.discoverWhitelist.push(self.deviceUuid);
      }
      deviceInfo.discoverWhitelist = [deviceInfo.owner, self.deviceUuid];
    }
    else {
      deviceInfo.discoverWhitelist = [self.deviceUuid]
    }
    async.waterfall([
        function (innerCallback) {
          if (HL_TYPE_ID === deviceInfo.type.id && !util.isNullOrUndefined(deviceInfo.userId)) {
            var handled = false;
            var intervalId = setInterval(function (conx) {
              conx.devices({
                "type.id": HL_TYPE_ID,
                "extra.mac": deviceInfo.extra.mac
              }, function (data) {
                if (!data.error) {
                  handled = true;
                  clearInterval(intervalId);
                  if (util.isArray(data.devices)) {
                    deviceInfo.extra = data.devices[0].extra;
                    deviceInfo.status = data.devices[0].status;
                    _.forEach(data.devices, function (device) {
                      conx.unregister({"uuid": device.uuid});
                    });
                  }
                  else {
                    deviceInfo.extra = data.devices.extra;
                    deviceInfo.status = data.devices.status;
                  }
                  innerCallback(null);
                }
              });
            }, 2000, self.conx);
            setTimeout(function (intervalId) {
              if (!handled) {
                clearInterval(intervalId);
                innerCallback({errorId: 203001, errorMsg: "device not ready."});
              }
            }, 10 * 1000, intervalId)
          }
          else if (MEBOX_TYPE_ID === deviceInfo.type.id
            || SMART_BOX_TYPE_ID === deviceInfo.type.id) {
            var eventSources = self.configurator.getConf("services.event_source");
            if (!util.isNullOrUndefined(eventSources) && util.isArray(eventSources)) {
              var esUuids = "";
              eventSources.forEach(function (esItem, index) {
                if (esItem.online === "true") {
                  if (0 === index) {
                    esUuids = esItem.uuid;
                  }
                  else {
                    esUuids += "," + esItem.uuid;
                  }
                }
              });
              deviceInfo.extra.settings = [{
                name: "event_report",
                value: esUuids
              }];
            }
            innerCallback(null);
          }
          else if (MEPANEL1_TYPE_ID === deviceInfo.type.id) {
            deviceInfo.extra.associated = MEPANEL1_ASSOCIATED;
            innerCallback(null);
          }
          else if (MEPANEL2_TYPE_ID === deviceInfo.type.id) {
            deviceInfo.extra.associated = MEPANEL2_ASSOCIATED;
            innerCallback(null);
          }
          else if (MEPANEL3_TYPE_ID === deviceInfo.type.id) {
            deviceInfo.extra.associated = MEPANEL3_ASSOCIATED;
            innerCallback(null);
          }
          else if (MEPANEL4_TYPE_ID === deviceInfo.type.id) {
            deviceInfo.extra.associated = MEPANEL4_ASSOCIATED;
            innerCallback(null);
          }
          else if (MEPANEL4_TYPE_ID === deviceInfo.type.id) {

          }
          /*//check the key off user
           else if (deviceInfo.type.id === USER_TYPE_ID) {
           var condition = {
           //'name': deviceInfo.name,
           "extra.phoneNumber": deviceInfo.extra.phoneNumber
           };
           self.conx.devices(condition, function (data) {
           if (!data.error) {
           var logError = {
           errorId: 203002,
           errorMsg: "phone number [" + deviceInfo.extra.phoneNumber + "] has already registered"
           };
           innerCallback(logError);
           }
           else {
           innerCallback(null);
           }
           });
           }*/
          else {
            innerCallback(null);
          }
        },
        function (innerCallback) {
          deviceInfo.timestamp = new Date();
          logger.debug(deviceInfo);
          self.conx.register(deviceInfo, function (data) {
            if (data.error) {
              var logError = {
                errorId: 203003,
                errorMsg: "detail:=" + JSON.stringify(data.error)
              };
              innerCallback(logError);
            }
            else {
              var newDeviceInfo = data;
              newDeviceInfo.timeZone = {
                id: "Europe/London",
                offset: 0
              };
              if (!util.isNullOrUndefined(newDeviceInfo.geo)) {
                newDeviceInfo.timeZone = {
                  id: tzWhere.tzNameAt(newDeviceInfo.geo.ll[0], newDeviceInfo.geo.ll[1]),
                  offset: tzWhere.tzOffsetAt(newDeviceInfo.geo.ll[0], newDeviceInfo.geo.ll[1])
                };
              }
              //newDeviceInfo.deviceGeo = newDeviceInfo.geo;
              newDeviceInfo.myToken = newDeviceInfo.token;
              if (newDeviceInfo.type.id === HL_TYPE_ID && !util.isNullOrUndefined(newDeviceInfo.userId)) {
                var timers = newDeviceInfo.extra.timers;
                if (!util.isNullOrUndefined(timers) && util.isArray(timers)) {
                  for (var i = 0, len = timers.length; i < len; ++i) {
                    var cmds = timers[i].commands;
                    if (!util.isNullOrUndefined(cmds) && util.isArray(cmds)) {
                      for (var j = 0, lenCmds = cmds.length; j < lenCmds; ++j) {
                        cmds[j].uuid = newDeviceInfo.uuid;
                      }
                    }
                  }
                }
              }
              //==============================================
              newDeviceInfo.discoverWhitelist = ["*"];
              newDeviceInfo.configureWhitelist = ["*"];
              //==============================================
              self.conx.update(newDeviceInfo, function (data) {
                if (data.error) {
                  logger.error(203006, data.error);
                }
                else{
                  logger.debug(newDeviceInfo);
                }
              });
              /*self.deviceUpdate(newDeviceInfo, function (response) {
                if (response.retCode !== 200) {
                  logger.error(response.retCode, response.description);
                }
                else {
                  logger.debug(newDeviceInfo);
                }
              });*/
              innerCallback(null, newDeviceInfo);
            }
          });
        }
      ],
      function (error, deviceInfo) {
        if (error) {
          logger.error(error.errorId, error);
          responseMessage.retCode = error.errorId;
          responseMessage.description = error.errorMsg;
        }
        else {
          /*if(deviceInfo.type.id === USER_TYPE_ID){
           var msg = {
           devices:self.configurator.getConfRandom("services.flow_manager"),
           payload:{
           cmdName:"addSheet",
           cmdCode:"0007",
           parameters:{
           userUuid: deviceInfo.uuid
           }
           }
           };
           self.message(msg, function (response) {
           if(!response.error && response.retCode === 200){
           deviceInfo.extra.flowSheetId = response.data;
           self.deviceUpdate(deviceInfo, function(response){
           if(response.retCode !== 200){
           logger.error(response.retCode, response.description);
           }
           });
           }
           })
           }*/
          responseMessage.data = deviceInfo;
          //智慧工地定向处理，同步数据
          if (EMPLOYEE_TYPE_ID === deviceInfo.type.id) {
            var employee = deviceInfo.extra;
            employee.id = deviceInfo.uuid;
            employee.name = deviceInfo.name;
            syncEmployees(self, [employee], function (error) {
              if (error) {
                logger.error(error.errorId, error.errorMsg);
                self.employees.push(employee);
              }
            });
          }
          logger.info("Device add completed, device uuid:" + deviceInfo.uuid)
        }
        peerCallback(responseMessage);
      }
    );
  });
};

/**
 * 远程RPC回调函数
 * @callback onMessage~deleteDevice
 * @param {object} response:
 * {
 *      "payload":
 *      {
 *          "retCode":{string},
 *          "description":{string},
 *          "data":{object}
 *      }
 * }
 */
/**
 * 设备删除
 * @param {object} message:输入消息
 * @param {onMessage~deleteDevice} peerCallback: 远程RPC回调
 * */
DeviceManager.prototype.deleteDevice = function (message, peerCallback) {
  var self = this;
  logger.info("deleteDevice", message);
  var responseMessage = {retCode: 200, description: "Success.", data: {}};
  self.messageValidate(message, OPERATION_SCHEMAS.deleteDevice, function (error) {
    if (error) {
      responseMessage = error;
      peerCallback(error);
    }
    else {
      var deviceUuid = message.uuid;
      var condition = {uuid: deviceUuid};
      if (!util.isNullOrUndefined(message.userId)) {
        condition.userId = message.userId;
      }
      self.conx.devices(condition, function (data) {
        if (data.error) {
          var logError = {errorId: 203004, errorMsg: " device id=" + deviceUuid};
          logger.error(203004, "device id=" + deviceUuid);
          responseMessage.retCode = logError.errorId;
          responseMessage.description = logError.errorMsg;
          peerCallback(responseMessage);
        }
        else {
          //var deviceInfo = data.devices[0];
          //删除设备的流
          /*if (deviceInfo.actionPolicies) {
           deviceInfo.actionPolicies.forEach(function (policy) {
           if (policy.flows) {
           logger.debug("Delete flows:" + JSON.stringify(policy.flows));
           policy.flows.forEach(function (flow) {
           var deleteFlowMessage = {
           devices: self.configurator.getConfRandom("services.flow_manager"),
           payload: {
           method: "deleteFlow",
           parameters: {
           userUuid: deviceInfo.userId,
           flowId: flow
           }
           }
           };
           var handle = false;
           self.message(deleteFlowMessage, function (respMsg) {
           if (!handle) {
           handle = true;
           if (respMsg.error) {
           logger.error(200008, respMsg.error);
           }
           else if (respMsg.payload.retCode !== 200) {
           logger.error(respMsg.payload.retCode, respMsg.payload.description);
           }
           else {
           logger.debug("Delete flow[" + flow + "] SUCCESS.")
           }
           }
           });
           });
           }
           });
           }*/

          async.waterfall([
              function (innerCallback) {  //for test
                var device = data.devices[0];
                if ("040B08040004" === device.type.id) {
                  self.message({
                    devices: "5c2624b2-aad3-42af-bc59-9aedbbd2c84b",
                    payload: {
                      cmdName: "reset",
                      cmdCode: "000a",
                      parameters: {}
                    }
                  });
                }
                else if (EMPLOYEE_TYPE_ID === device.type.id) {
                  self.message({
                    devices: DEFAULT_BUILDING_SITE_SAAS_UUID,
                    payload: {
                      cmdName: "del_employees",
                      cmdCode: "0003",
                      parameters: {
                        employees: [device.uuid]
                      }
                    }
                  }, function (response) {
                    if(response.retCode !== 200){
                      logger.error(response.retCode, response.description);
                    }
                  });
                }
                innerCallback(null);
              },
              function (innerCallback) {
                logger.debug("Delete device timers:");
                var device = data.devices[0];
                if (!util.isNullOrUndefined(device.extra.timers) && util.isArray(device.extra.timers)) {
                  var timerIds = [];
                  _.forEach(device.extra.timers, function (timer) {
                    timerIds.push(timer.timerId)
                  });
                  var msg = {
                    devices: self.configurator.getConfRandom("services.timer"),
                    payload: {
                      cmdName: "delete",
                      cmdCode: "0003",
                      parameters: {
                        userId: device.userId,
                        deviceId: device.uuid,
                        timerId: timerIds
                      }
                    }
                  };
                  self.message(msg, function (response) {
                    if (response.retCode !== 200) {
                      logger.error(response.retCode, response.description);
                    }
                    innerCallback(null);
                  });
                }
                else {
                  innerCallback(null);
                }
              },
              function (innerCallback) {
                logger.debug("Unregister device:" + deviceUuid);
                self.conx.unregister({uuid: deviceUuid}, function (result) {
                  if (result.error) {
                    var error = result.error;
                    logger.error(203005, error.message + "\n device uuid=" + deviceUuid);
                    innerCallback({
                      errorId: 203005,
                      errorMsg: error.message + "\n device uuid=" + deviceUuid
                    });
                  }
                  else {
                    innerCallback(null, deviceUuid);
                  }
                });
              }
            ],
            function (error, result) {
              if (error) {
                responseMessage.retCode = error.errorId;
                responseMessage.description = error.errorMsg;
              }
              else {
                responseMessage.data = {uuid: result};
              }
              peerCallback(responseMessage);
            });
        }
      });
    }
  });
};

/**
 * 远程RPC回调
 * @callback onMessage~getDevice
 * @param {object} response:
 * {
 *      "payload":
 *      {
 *          "retCode":{string},
 *          "description":{string},
 *          "data":{object[]}
 *      }
 * }
 */
/**
 * 设备查询
 * @param {object} message:输入消息
 * @param {onMessage~getDevice} peerCallback: 远程RPC回调
 * */
DeviceManager.prototype.getDevice = function (message, peerCallback) {
  var self = this;
  var responseMessage = {retCode: 200, description: 'Success.', data: []};
  self.messageValidate(message, OPERATION_SCHEMAS.getDevice, function (error) {
    if (error) {
      responseMessage = error;
      peerCallback(error);
    }
    else {
      self.conx.devices(message, function (data) {
        if (!util.isNullOrUndefined(data.error)) {
          responseMessage.retCode = 203004;
          responseMessage.description = logger.getErrorInfo(203004);
          //logger.debug(responseMessage);
        }
        else if (!util.isNullOrUndefined(data.devices)) {
          responseMessage.data = data.devices;
        }
        peerCallback(responseMessage);
      });
    }
  });
};

/**
 * 远程RPC回调函数
 * @callback onMessage~deviceUpdate
 * @param {object} response:
 * {
 *      "payload":
 *      {
 *          "retCode":{string},
 *          "description":{string},
 *          "data":{object}
 *      }
 * }
 */
/**
 * 设备更新
 * @param {object} message :消息体
 * @param {onMessage~deviceUpdate} peerCallback: 远程RPC回调函数
 * */
DeviceManager.prototype.deviceUpdate = function (message, peerCallback) {
  var self = this;
  var responseMessage = {retCode: 200, description: "Success.", data: {}};
  self.messageValidate(message, OPERATION_SCHEMAS.deviceUpdate, function (error) {
    if (error) {
      responseMessage = error;
      peerCallback(responseMessage);
    }
    else {
      async.waterfall([
        /*核查改设备是否存在*/
        function (innerCallback) {
          var condition = {uuid: message.uuid};
          /*if (!util.isNullOrUndefined(message.userId)) {
            condition["userId"] = message.userId;
          }*/
          //logger.debug(condition);
          self.conx.devices(condition, function (data) {
            if (!util.isNullOrUndefined(data.error)) {
              logger.debug("===============================condition");
              innerCallback({errorId: 203004, errorMsg: "No device found."});
            }
            else {
              var device = data.devices[0];
              if (!util.isNullOrUndefined(device)) {
                if ("040B09051001" === device.type.id ||
                  "040B09051002" === device.type.id ||
                  "040B09051003" === device.type.id ||
                  "040B09051004" === device.type.id
                ) {
                  var associated = message["extra.associated"];
                  if (!util.isNullOrUndefined(associated)) {
                    var cmd = {
                      cmdName: "execute",
                      cmdCode: "0001",
                      parameters: {
                        userUuid: device.userId,
                        deviceUuid: device.owner,
                        cmd: {
                          cmdName: "set_panel_map",
                          cmdCode: "000c",
                          parameters: []
                        }
                      }
                    };
                    associated.forEach(function (key, index) {
                      cmd.parameters.cmd.parameters.push({
                        rocker: key.rocker,
                        action: key.action,
                        devices: key.deviceId,
                        panel: device.uuid,
                        command: [key.command]
                      });
                    });
                    self.message({
                      devices: self.configurator.getConfRandom("services.executor"),
                      payload: cmd
                    }, function (response) {
                      if (response.retCode === 200) {
                        innerCallback(null);
                      }
                      else {
                        innerCallback({
                          errorId: response.retCode,
                          errorMsg: response.description
                        })
                      }
                    });
                  }
                }
                else {
                  innerCallback(null);
                }
              }
              else {
                innerCallback(null);
              }
            }
          });
        }
      ], function (error) {
        if (error) {
          responseMessage.retCode = error.errorId;
          responseMessage.description = error.errorMsg;
          peerCallback(responseMessage);
        }
        else {
          self.conx.update(message, function (data) {
            if (data.error) {
              logger.error(203006, data.error);
              responseMessage.retCode = 203006;
              responseMessage.description = data.error;
            }
            else {
              if (data.fromUuid) {
                delete data.fromUuid;
              }
              if (data.from) {
                delete data.from;
              }
              responseMessage.data = data;
              //智慧工地定向处理
              var device = responseMessage.data;
              if (EMPLOYEE_TYPE_ID === device.type.id) {
                var employee = device.extra;
                employee.id = device.uuid;
                employee.name = device.name;
                self.message({
                  devices: DEFAULT_BUILDING_SITE_SAAS_UUID,
                  payload: {
                    cmdName: "update_employees",
                    cmdCode: "0004",
                    parameters: {
                      employees: [employee]
                    }
                  }
                }, function (response) {
                  if(response.retCode !== 200){
                    logger.error(response.retCode, response.description);
                  }
                });
              }
            }
            peerCallback(responseMessage);
          });
        }
      });
    }
  });
};

module.exports = {
  Service: DeviceManager,
  OperationSchemas: OPERATION_SCHEMAS
};