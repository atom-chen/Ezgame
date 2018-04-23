var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var TimeManager = /** @class */ (function () {
    function TimeManager() {
        /**
         * 游戏第一个场景加载完成时到当前帧经过的帧时间
         */
        this._realTimeSinceStartScene = 0;
    }
    Object.defineProperty(TimeManager, "Instance", {
        get: function () {
            if (this.instance == null) {
                this.instance = new TimeManager();
            }
            return this.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TimeManager.prototype, "realTimeSinceStartScene", {
        get: function () {
            return this._realTimeSinceStartScene;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 需要每帧调用的update
     * @param dt 当前帧与上一帧的间隔时间
     */
    TimeManager.prototype.Update = function (dt) {
        this._realTimeSinceStartScene += dt;
    };
    /**
     * 单例模式声明
     */
    TimeManager.instance = null;
    return TimeManager;
}());
/// <reference path="../manager/TimeManager.ts" />
var Tools;
(function (Tools) {
    /**
     * 计时器
     */
    var Timer = /** @class */ (function () {
        function Timer() {
            this.Reset();
        }
        Object.defineProperty(Timer.prototype, "paused", {
            /**
             * 计时器是否处于暂停状态
             */
            get: function () {
                return this._paused;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "time", {
            /**
             * 获取计时器时间
             */
            get: function () {
                a: TimeManager;
                if (this._paused == false) {
                    return TimeManager.Instance.realTimeSinceStartScene - this.startTime;
                }
                else {
                    return TimeManager.Instance.realTimeSinceStartScene - this.lastPauseTime;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 计时器复位
         */
        Timer.prototype.Reset = function () {
            this._paused = false;
            this.startTime = TimeManager.Instance.realTimeSinceStartScene;
        };
        /**
         * 暂停计时器
         */
        Timer.prototype.Pause = function () {
            if (this._paused == true) {
                return;
            }
            this._paused = true;
            this.lastPauseTime = TimeManager.Instance.realTimeSinceStartScene;
        };
        /**
         * 恢复暂停中的计时器
         */
        Timer.prototype.Resume = function () {
            if (this._paused == false) {
                return;
            }
            this._paused = false;
            this.lastPauseTime = 0;
            this.startTime = this.startTime + TimeManager.Instance.realTimeSinceStartScene - this.lastPauseTime;
        };
        return Timer;
    }());
    Tools.Timer = Timer;
})(Tools || (Tools = {}));
var Tools;
(function (Tools) {
    /**
     * 构造器抽象类
     */
    var Builder = /** @class */ (function () {
        /**
         * 构造器构造方法(在需要构造对象的类中调用)
         * @param instance 构造对象实例
         */
        function Builder(instance) {
            this.instance = instance;
        }
        /**
         * 构造完成返回实例
         */
        Builder.prototype.build = function () {
            return this.instance;
        };
        return Builder;
    }());
    Tools.Builder = Builder;
})(Tools || (Tools = {}));
var Tools;
(function (Tools) {
    var Logger = /** @class */ (function () {
        function Logger() {
        }
        Logger.log = function (arg, tag) {
            if (tag != null && tag != undefined) {
                console.log("[" + tag + "] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg + " ");
            }
            else {
                console.log("[notag] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg);
            }
        };
        Logger.warn = function (arg, tag) {
            if (tag != null && tag != undefined) {
                console.warn("[" + tag + "] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg);
            }
            else {
                console.warn("[notag] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg);
            }
        };
        Logger.error = function (arg, tag) {
            if (tag != null && tag != undefined) {
                console.error("[" + tag + "] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg);
            }
            else {
                console.error("[notag] [" + TimeManager.Instance.realTimeSinceStartScene.toFixed(3) + "] " + arg);
            }
        };
        Logger.info = function (arg) {
            console.info(arg);
        };
        return Logger;
    }());
    Tools.Logger = Logger;
})(Tools || (Tools = {}));
/// <reference path="../tools/Timer.ts" />
/// <reference path="../tools/Builder.ts" />
/// <reference path="../tools/Logger.ts" />
var FSM;
(function (FSM) {
    var StateMachine = /** @class */ (function () {
        /**
         * 构造函数
         */
        function StateMachine() {
            /**
             * 状态机索引表
             * key : stateType
             * value : state
             */
            this.statesMap = new Array();
            /**
             * 当前状态
             */
            this.currentState = null;
            this.timer = new Tools.Timer();
        }
        /**
         * 往状态机里面添加状态
         * @param state 状态
         */
        StateMachine.prototype.AddState = function (state) {
            if (this.statesMap[state.stateType] != null && this.statesMap[state.stateType] != undefined) {
                Tools.Logger.error("attemp to add a same State into the StateMachine. StateMatchine:" + name + " State:" + state.stateType);
                return;
            }
            this.statesMap[state.stateType] = state;
        };
        /**
         * 获得构造器
         */
        StateMachine.GetBuilder = function () {
            /**
             * 实例化构造器
             */
            return new StateMachineBuilder(new StateMachine());
        };
        /**
         * 状态机切换状态
         * 状态会立即被切换，所以尽量不要在状态机的update里切换状态，即使切换了也尽量不要再处理别的逻辑了(容易出现错误)
         * 关于是否立即切换这一点有点想要改动orz，目前还是就这么先用着吧
         * @param nextStateType
         * @param args
         */
        StateMachine.prototype.ChangeState = function (nextStateType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.statesMap[nextStateType] == null || this.statesMap[nextStateType] == undefined) {
                Tools.Logger.error("attemp to change to the " + nextStateType + " which " + name + " not has!");
                return;
            }
            if (this.currentState != null) {
                this.currentState.StateEnd(this.timer.time);
            }
            this.timer.Reset();
            this.currentState = this.statesMap[nextStateType];
            this.currentState.StateEnter(args);
        };
        /**
         * 状态机更新
         */
        StateMachine.prototype.Update = function () {
            if (this.currentState != null && this.currentState.StateUpdate != undefined) {
                this.currentState.StateUpdate(this.timer.time);
            }
        };
        /**
         * 空状态
         * stateType 为 "0",这意味着自定义的状态的状态类型不能为"0"
         */
        StateMachine.NONE = {
            stateType: 0,
            StateEnter: function () {
            },
            StateEnd: function (time) {
            }
        };
        return StateMachine;
    }());
    FSM.StateMachine = StateMachine;
    /**
     * 声明状态机构造器
     */
    var StateMachineBuilder = /** @class */ (function (_super) {
        __extends(StateMachineBuilder, _super);
        function StateMachineBuilder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 通过构造器向状态机添加状态
         * @param state 需要添加的状态
         */
        StateMachineBuilder.prototype.AddState = function (state) {
            this.instance.AddState(state);
            return this;
        };
        return StateMachineBuilder;
    }(Tools.Builder));
})(FSM || (FSM = {}));
var NetWork;
(function (NetWork) {
    var SeverSession = /** @class */ (function () {
        /**
         * 构造函数
         * @param name 服务器会话名字
         * @param url 服务器url,需要使用'ws'或者'wss'开头
         */
        function SeverSession(name, url) {
            /**
             * 会话状态
             */
            this.sesionState = SessionState.DISCONNECTED;
            /**
             * 服务器链接成功时回调
             */
            this.OnConnect = function (event) { };
            /**
             * 服务器关闭链接过后回调
             */
            this.OnDisConnect = function (CloseEvent) { };
            /**
             * 服务器收到消息后回调
             */
            this.OnGetMessage = function (MessageEvent) { };
            /**
             * 服务器收到消息后回调
             */
            this.OnError = function (ErrorEvent) { };
            if (name == null || name == undefined) {
                Tools.Logger.error("session name can't be null or undefined");
                return;
            }
            var self = this;
            this.ws = new WebSocket("ws://" + url);
            this.name = name;
            this.sesionState = SessionState.CONNECTING;
            this.ws.onopen = function (event) {
                Tools.Logger.log("connect", self.name);
                self.sesionState = SessionState.CONNECTED;
                if (self.OnConnect != undefined) {
                    self.OnConnect(event);
                }
            };
            this.ws.onclose = function (event) {
                Tools.Logger.log("disconnect", self.name);
                self.sesionState = SessionState.DISCONNECTED;
                if (self.OnDisConnect != undefined) {
                    self.OnDisConnect(event);
                }
            };
            this.ws.onmessage = function (event) {
                Tools.Logger.log("getmessage:" + event.data, self.name);
                if (self.OnGetMessage != undefined) {
                    self.OnGetMessage(event);
                }
            };
            this.ws.onerror = function (event) {
                Tools.Logger.error("error:" + event.error, self.name);
                if (self.OnError != undefined) {
                    self.OnError(event);
                }
            };
        }
        Object.defineProperty(SeverSession.prototype, "state", {
            /**
             * 获取会话状态
             */
            get: function () {
                return this.sesionState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SeverSession.prototype, "connected", {
            /**
             * 判断会话是否处于链接状态
             */
            get: function () {
                return this.sesionState == SessionState.CONNECTED;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 主动断开会话
         */
        SeverSession.prototype.Close = function (code, reason) {
            if (this.sesionState == SessionState.DISCONNECTING || this.sesionState == SessionState.DISCONNECTED) {
                return;
            }
            Tools.Logger.log("Try close", this.name);
            this.sesionState = SessionState.DISCONNECTING;
            this.ws.close(code, reason);
        };
        return SeverSession;
    }());
    NetWork.SeverSession = SeverSession;
    var SessionState;
    (function (SessionState) {
        SessionState[SessionState["CONNECTED"] = 0] = "CONNECTED";
        SessionState[SessionState["CONNECTING"] = 1] = "CONNECTING";
        SessionState[SessionState["DISCONNECTED"] = 2] = "DISCONNECTED";
        SessionState[SessionState["DISCONNECTING"] = 3] = "DISCONNECTING";
    })(SessionState = NetWork.SessionState || (NetWork.SessionState = {}));
})(NetWork || (NetWork = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var CreateRoleOption = /** @class */ (function () {
            function CreateRoleOption() {
                // NAME
                this.name = null;
                // GENDER
                this.gender = null;
                // RACE
                this.race = null;
            }
            return CreateRoleOption;
        }());
        Contract.CreateRoleOption = CreateRoleOption;
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var Gender;
        (function (Gender) {
            Gender[Gender["male"] = 0] = "male";
            Gender[Gender["female"] = 1] = "female";
            Gender[Gender["other"] = 2] = "other";
            Gender[Gender["none"] = 3] = "none";
        })(Gender = Contract.Gender || (Contract.Gender = {}));
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var InteractionType;
        (function (InteractionType) {
        })(InteractionType = Contract.InteractionType || (Contract.InteractionType = {}));
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var ViewChange = /** @class */ (function () {
            function ViewChange() {
                // TICKCOUNT
                this.tickCount = 0;
                // TILECHANGE
                this.tileChange = [];
                // ENTITYCHANGE
                this.entityChange = [];
                // EVENTS
                this.events = [];
            }
            ViewChange.prototype.toString = function () {
                return null;
            };
            return ViewChange;
        }());
        Contract.ViewChange = ViewChange;
        var ViewEvent = /** @class */ (function () {
            function ViewEvent() {
                // EVENTTYPE
                this.eventType = null;
                // TARGETENTITYID
                this.targetEntityId = "00000000-0000-0000-0000-000000000000";
            }
            ViewEvent.prototype.toString = function () {
                return null;
            };
            return ViewEvent;
        }());
        Contract.ViewEvent = ViewEvent;
        var EntityDto = /** @class */ (function () {
            function EntityDto() {
                // ID
                this.id = "00000000-0000-0000-0000-000000000000";
                // NAME
                this.name = null;
                // POS
                this.pos = null;
            }
            EntityDto.prototype.toString = function () {
                return null;
            };
            return EntityDto;
        }());
        Contract.EntityDto = EntityDto;
        var TileDto = /** @class */ (function () {
            function TileDto() {
                // POSITION
                this.position = null;
                // SURFACE
                this.surface = null;
            }
            return TileDto;
        }());
        Contract.TileDto = TileDto;
        var ViewEventType;
        (function (ViewEventType) {
            ViewEventType[ViewEventType["entityLeave"] = 0] = "entityLeave";
        })(ViewEventType = Contract.ViewEventType || (Contract.ViewEventType = {}));
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var Race;
        (function (Race) {
            Race[Race["human"] = 0] = "human";
        })(Race = Contract.Race || (Contract.Race = {}));
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));
var SimCivil;
(function (SimCivil) {
    var Contract;
    (function (Contract) {
        // $Classes/Enums/Interfaces(filter)[template][separator]
        // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
        // template: The template to repeat for each matched item
        // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]
        // More info: http://frhagn.github.io/Typewriter/
        var RoleSummary = /** @class */ (function () {
            function RoleSummary() {
                // ID
                this.id = "00000000-0000-0000-0000-000000000000";
                // NAME
                this.name = null;
                // GENDER
                this.gender = null;
                // RACE
                this.race = null;
            }
            RoleSummary.prototype.toString = function () {
                return null;
            };
            return RoleSummary;
        }());
        Contract.RoleSummary = RoleSummary;
    })(Contract = SimCivil.Contract || (SimCivil.Contract = {}));
})(SimCivil || (SimCivil = {}));