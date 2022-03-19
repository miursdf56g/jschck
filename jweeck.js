(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /* general helpers */
    function GetAuthHeaders(bearer) {
        var headers = {
            "Authorization": "Bearer " + bearer,
        };
        return headers;
    }
    function GetBridgePath(path, bearer) {
        if (bearer === void 0) { bearer = ''; }
        var controller = new AbortController();
        setTimeout(function () { return controller.abort(); }, 5000);
        return fetch(path, { method: 'GET', headers: GetAuthHeaders(bearer), signal: controller.signal });
    }

    /* display helpers */
    function AddClassToElement(className, id) {
        var element = document.getElementById(id);
        if (element == null) {
            console.log("warn: failed to add class, element doesn't exist: " + id);
            return;
        }
        element.classList.add(className);
    }
    function RemoveClassFromElement(className, id) {
        var element = document.getElementById(id);
        if (element == null) {
            console.log("warn: failed to remove class, element doesn't exist: " + id);
            return;
        }
        element.classList.remove(className);
    }
    function SetTextForElement(text, id) {
        var element = document.getElementById(id);
        if (element == null) {
            console.log("warn: failed to set text, element doesn't exist: " + id);
            return;
        }
        element.innerText = text;
    }

    function formatComponentReport(cr) {
        var time = cr.time == null ? Date.now() : cr.time;
        return cr.state + " \nas of " + time;
    }
    var determineHealth = function (report, source) {
        switch (report.state) {
            case "healthy":
                AddClassToElement("checked", source + "-healthy");
                break;
            case "unknown":
                AddClassToElement("checked", source + "-unknown");
                break;
            case "unhealthy":
                AddClassToElement("checked", source + "-unhealth");
                break;
            default:
                AddClassToElement("checked", source + "-unknown");
        }
    };
    function StateStatusError() {
        AddClassToElement("checked", "connection-unhealthy");
        SetTextForElement("Error", "connection-report");
        AddClassToElement("checked", "auth-unhealthy");
        SetTextForElement("Error", "auth-report");
    }
    function StateHealthError() {
        AddClassToElement("checked", "scim-unhealthy");
        SetTextForElement("Error", "health-scim-report");
        AddClassToElement("checked", "provision-unhealthy");
        SetTextForElement("Error", "health-provision-report");
        AddClassToElement("checked", "redis-unhealthy");
        SetTextForElement("Error", "health-redis-report");
        RemoveClassFromElement("hidden", "log-files-fail");
    }
    function StateHealth(report) {
        report.reports.map(function (report) {
            if (report.source === "SCIMServer") {
                RemoveClassFromElement("hidden", "health-scim");
                determineHealth(report, "scim");
                SetTextForElement(formatComponentReport(report), "health-scim-report");
            }
            if (report.source === "ProvisionWatcher") {
                RemoveClassFromElement("hidden", "health-provision");
                determineHealth(report, "provision");
                SetTextForElement(formatComponentReport(report), "health-provision-report");
            }
            if (report.source === "RedisCache") {
                RemoveClassFromElement("hidden", "health-redis");
                determineHealth(report, "redis");
                SetTextForElement(formatComponentReport(report), "health-redis-report");
            }
        });
    }
    function StateStatus(status) {
        switch (status.connection) {
            case true:
                AddClassToElement("checked", "connection-healthy");
                SetTextForElement("Connection to 1Password successful.", "connection-report");
                break;
            case false:
                AddClassToElement("checked", "connection-unhealthy");
                if (status.reason) {
                    SetTextForElement(status.reason, "connection-report");
                }
                else {
                    SetTextForElement("Couldn't connect to 1Password. Confirm the SCIM bridge network settings and try again.", "connection-report");
                }
                break;
            default:
                AddClassToElement("checked", "connection-unknown");
                SetTextForElement("Getting connection status...", "connection-report");
        }
        switch (status.session) {
            case true:
                AddClassToElement("checked", "auth-healthy");
                SetTextForElement("Authentication successful.", "auth-report");
                break;
            case false:
                AddClassToElement("checked", "auth-unhealthy");
                SetTextForElement("Couldn't authenticate. Make sure the Provision Manager account is an active user. If the Provision Manager's credentials have changed, generate a new 'scimsession' file and Bearer Token.", "auth-report");
                break;
            default:
                AddClassToElement("checked", "auth-unknown");
                SetTextForElement("Getting connection status...", "auth-report");
        }
    }
    function StateDeployment(report) {
        switch (report.bearer) {
            case true:
                AddClassToElement("checked", "deployment-healthy");
                SetTextForElement("Deployment successful.", "deployment-report");
                break;
            case false:
                AddClassToElement("checked", "deployment-unhealthy");
                SetTextForElement("Bearer Token missing. Check that your input is correct.", "deployment-report");
                break;
            default:
                AddClassToElement("checked", "deployment-unknown");
                SetTextForElement("Generating deployment report...", "deployment-report");
        }
    }

    var LogRetrieval = /** @class */ (function () {
        function LogRetrieval(sessionToken) {
            var _this = this;
            this.downLoadLogFile = function (evt, log) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    //return
                    GetBridgePath("/status/logs/" + log, this.sessionToken)
                        .then(function (convert) {
                        if (!convert.ok) {
                            throw convert;
                        }
                        return convert.blob();
                    }).then(function (content) {
                        var blob = new Blob([content], { type: "text/plain" });
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = log;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }).catch(function (err) {
                        console.log("could not get log files");
                        if (err.status == 401) {
                            window.location.href = "/";
                        }
                        else if (err.status == 500) {
                            SetTextForElement("Unable to retrieve log file(s)", "log-files-fail");
                            RemoveClassFromElement("hidden", "log-files-fail");
                        }
                    });
                    return [2 /*return*/];
                });
            }); };
            this.clearLogs = function () {
                var logsList = document.getElementById("log-files-list");
                if (logsList == null) {
                    console.log("warn: failed to clear logs, element doesn't exist: log-files-list");
                    return;
                }
                while (logsList.firstChild) {
                    logsList.removeChild(logsList.firstChild);
                }
            };
            this.generateLogList = function (logs) {
                var logsList = document.getElementById("log-files-list");
                if (logsList == null) {
                    console.log("warn: failed to generate logs, element doesn't exist: log-files-list");
                    return;
                }
                if (logs == null || logs.length == 0) {
                    var p = document.getElementById("scim-logs-success");
                    if (p == null) {
                        console.log("warn: failed to change paragraph text, element id doesn't exist: scim-logs-success");
                        return;
                    }
                    p.textContent = "No Logs Available";
                }
                else {
                    // reverse-sort the log list
                    logs.sort(function (a, b) { return b.localeCompare(a); });
                    var _loop_1 = function (log) {
                        var listItem = document.createElement("li");
                        var link = document.createElement("button");
                        link.setAttribute('name', log);
                        link.setAttribute('type', 'submit');
                        link.addEventListener("click", function (evt) { return _this.downLoadLogFile(evt, log); }, false);
                        link.textContent = log;
                        listItem.appendChild(link);
                        logsList.appendChild(listItem);
                    };
                    for (var _i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
                        var log = logs_1[_i];
                        _loop_1(log);
                    }
                }
            };
            this.sessionToken = sessionToken;
        }
        return LogRetrieval;
    }());

    var statusChecker = /** @class */ (function () {
        function statusChecker() {
            var _this = this;
            this.checkSessionToken = function () {
                if (_this.sessionToken == "") {
                    console.log("failed to get session token");
                    StateDeployment({ bearer: false });
                    StateStatusError();
                    StateHealthError();
                    return false;
                }
                StateDeployment({ bearer: true });
                return true;
            };
            this.getHealthReport = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    GetBridgePath("/status/health", this.sessionToken)
                        .then(function (report) {
                        if (!report.ok) {
                            throw report;
                        }
                        return report.json();
                    }).then(function (json) {
                        StateHealth(json);
                    }).catch(function (err) {
                        console.log("scim health error");
                        if (err.status == 401) {
                            window.location.href = "/";
                        }
                        else if (err.status == 500) { // this will be returned if b5 auth failed
                            console.log("unable to retrieve report");
                        }
                    });
                    return [2 /*return*/];
                });
            }); };
            this.addToElement = function (name) {
                var logoutButton = document.getElementById(name);
                if (logoutButton != null) {
                    logoutButton.addEventListener("submit", _this.submitHandler);
                }
            };
            this.getStatusReport = function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    GetBridgePath("/status/info", this.sessionToken)
                        .then(function (response) {
                        if (!response.ok) {
                            throw response;
                        }
                        return response.json();
                    })
                        .then(function (json) {
                        StateStatus(json);
                    }).catch(function (err) {
                        console.log("scim status error");
                        StateHealthError();
                        if (err.status == 401) {
                            window.location.href = "/";
                        }
                        else if (err.status == 403) { // for 403 errors like Firewall
                            return err.json().then(function (message) { return message; }).then(function (res) { StateStatus({ connection: false, session: false, reason: res.detail }); });
                        }
                        else if (err.status == 500) { // this will be returned if b5 auth failed
                            StateStatus({ connection: true, session: false });
                        }
                        else {
                            StateStatus({ connection: false, session: false });
                        }
                        return;
                    });
                    return [2 /*return*/];
                });
            }); };
            this.generateLogList = function () { return __awaiter(_this, void 0, void 0, function () {
                var logR;
                return __generator(this, function (_a) {
                    logR = new LogRetrieval(this.sessionToken);
                    GetBridgePath("/status/logs", this.sessionToken)
                        .then(function (logs) {
                        if (!logs.ok) {
                            throw logs;
                        }
                        return logs.json();
                    })
                        .then(function (json) {
                        logR.generateLogList(json);
                    }).catch(function (err) {
                        console.log("could not retrieve logs");
                        logR.clearLogs();
                        if (err.status == 401) {
                            window.location.href = "/";
                        }
                    });
                    return [2 /*return*/];
                });
            }); };
            this.submitHandler = function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
                console.log('clearing session token');
                // clears the session token from memory
                sessionStorage.removeItem("session-token");
                window.location.href = "/";
            };
            this.GetBridgeHealth = function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    console.log("getting reports");
                    if (this.checkSessionToken()) {
                        setTimeout(function () {
                            _this.getStatusReport();
                            _this.getHealthReport();
                            _this.generateLogList();
                        }, 2000);
                    }
                    return [2 /*return*/];
                });
            }); };
            this.sessionToken = (sessionStorage.getItem("session-token") || "");
        }
        return statusChecker;
    }());
    var checker = new statusChecker();
    checker.GetBridgeHealth();
    checker.addToElement("logout");

}());
