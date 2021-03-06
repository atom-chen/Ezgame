import { EditableComponentContainerConfigure } from "./EditableComponentContainerConfigure";
import { ComponentUINameEnum } from "../../enum/ComponentUINameEnum";
import UIBase from "../UIBase";
import { LocalStorageEnum } from "../../enum/LocalStorageEnum";
import { EditableComponentUIManager } from "../../manager/EditableComponentUIManager";
import { UINameEnum } from "../../enum/UINameEnum";
import { GloableUtils } from "../../tools/GloableUtils";
import { EditableComponentUI } from "./EditableComponentUI";
/**
 * 可编辑UI组件的容器
 * 需要挂在包含有可编辑UI的父UI上面（用以初始化可编辑UI的初始数据）
 */
const { ccclass, property, requireComponent, disallowMultiple } = cc._decorator;

@ccclass
@disallowMultiple
@requireComponent(UIBase)
export class EditableComponentUIContainer extends cc.Component {
    private conf: EditableComponentContainerConfigure;
    /**
     * 初始化生成的可编辑组件UI数组(仅在第一次加载UI的时候生成一次，以后都从本地存储空间中读取)
     */
    @property([cc.Class(
        {
            name: 'ComponentUIStruct',
            properties: {
                name: {
                    default: ComponentUINameEnum.DEFAULT,
                    tooltip: '可编辑组件UI的名字（从ComponentUINameEnum里面取）'
                },
                fatherNode: {
                    type: cc.Node,
                    default: null,
                    tooltip: '可编辑组件UI需要挂载的节点'
                }
            }
        }
    )])
    private editableComponentUIArr = [];
    public subUIArr = [];

    start() {
        Logger.log('start', 'EditableComponentUIContainer');
        this.release();
        this.subUIArr = [];
        let baseUI = this.node.getComponent(UIBase);
        this.conf = LocalStorageUtils.loadStorageObject<EditableComponentContainerConfigure>(LocalStorageEnum.EDITABLE_CONTAINER_PREFIX.concat(this.node.name));
        if (this.conf == null) {
            this.conf = new EditableComponentContainerConfigure(LocalStorageEnum.EDITABLE_CONTAINER_PREFIX.concat(this.node.name));
            this.conf.keys = [];
            Logger.log(`${this.node.name} 本地配置读取失败，用prefab上的配置创建子UI`, "EditableComponentUIContainer");
            for (let i = 0; i < this.editableComponentUIArr.length; i++) {
                EditableComponentUIManager.Instance.CreateEditableComponentUI(this.node.name as UINameEnum, this.editableComponentUIArr[i].fatherNode, this.editableComponentUIArr[i].name, (ui) => {
                    this.subUIArr.push(ui);
                    this.conf.keys.push(ui.Key);
                    if (this.conf.keys.length == this.editableComponentUIArr.length) {
                        this.conf.Save();
                    }
                });
            }
        } else {
            Logger.log(`${this.node.name} 使用本地配置创建子UI`, `EditableComponentUIContainer`);
            Logger.info(this.conf);
            for (let i = 0; i < this.conf.keys.length; i++) {
                EditableComponentUIManager.Instance.LoadEditableComponentUI(this.conf.keys[i], (ui) => {
                    this.subUIArr.push(ui);
                });
            }
        }
    }

    public addSubUI(ui: EditableComponentUI) {
        if (this.conf != null && this.conf != undefined) {
            this.subUIArr.push(ui);
            this.conf.keys.push(ui.Key);
            this.conf.Save();
        }
    }

    private release() {
        if (this.subUIArr != null) {
            for (let i = 0; i < this.subUIArr.length; i++) {
                this.subUIArr[i].node.destroy();
            }
        }
    }

    onDestroy() {
        this.release();
    }
}