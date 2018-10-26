// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MovementTest extends cc.Component {
    private pressing_w: boolean;
    private pressing_a: boolean;
    private pressing_s: boolean;
    private pressing_d: boolean;
    private speed: number = 1;
    private v :cc.Vec2 = cc.Vec2.ZERO;

    async start() {
        Logger.log("start", "MovementTest");
        this.pressing_w = false;
        this.pressing_a = false;
        this.pressing_s = false;
        this.pressing_d = false;
        let createRoleOption = new SimCivil.Contract.CreateRoleOption();
        createRoleOption.Gender = SimCivil.Contract.Gender.male;
        createRoleOption.Name = "jyk";
        createRoleOption.Race = SimCivil.Contract.Race.human;
        let success = await SimCivil.Contract.IRoleManager.CreateRole(createRoleOption);
        if (success == true) {
            Logger.log("CreateRole success！", "MovementTest");
        } else {
            Logger.log("CreateRole faild", "MovementTest");
        }
        success = await SimCivil.Contract.IRoleManager.UseRole((await SimCivil.Contract.IRoleManager.GetRoleList())[0].Id);
        if (success == true) {
            Logger.log("UseRole success！", "MovementTest");
            SimCivil.Contract.IViewSynchronizer.RegisterViewSync((viewChanged) => {
                viewChanged = <SimCivil.Contract.ViewChange>viewChanged;
                // Logger.info(viewChanged);
            });
        } else {
            Logger.log("UseRole faild", "MovementTest");
        }
        this.schedule(() => this.logicUpdate(), 0.5);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    logicUpdate() {
        let v = new cc.Vec2(0, 0);
        if (this.pressing_w) {
            v.addSelf(cc.Vec2.UP);
        }
        if (this.pressing_a) {
            v.subSelf(cc.Vec2.RIGHT);
        }
        if (this.pressing_s) {
            v.subSelf(cc.Vec2.UP);
        }
        if (this.pressing_d) {
            v.addSelf(cc.Vec2.RIGHT);
        }
        v.normalizeSelf();
        Logger.log(this.node.position, name);
        Logger.log(v, name);
        this.v = v;
        SimCivil.Contract.IPlayerController.MoveTo(new SimCivil.Contract.ValueTuple({Item1:this.node.position.x,Item2:this.node.position.y}), new Date());
    }

    update (dt) {
        this.node.position = this.node.position.add(this.v.mul(this.speed * dt * 100));
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.pressing_w = true;
                break;
            case cc.macro.KEY.a:
                this.pressing_a = true;
                break;
            case cc.macro.KEY.s:
                this.pressing_s = true;
                break;
            case cc.macro.KEY.d:
                this.pressing_d = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.pressing_w = false;
                break;
            case cc.macro.KEY.a:
                this.pressing_a = false;
                break;
            case cc.macro.KEY.s:
                this.pressing_s = false;
                break;
            case cc.macro.KEY.d:
                this.pressing_d = false;
                break;
        }
    }
}
