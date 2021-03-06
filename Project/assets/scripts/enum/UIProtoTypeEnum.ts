/** 
 * UI与ECS交互使用的协议类型枚举
 * 以REQ开头的协议是UI向ECS发送的
 * 以RLT开头的协议是ECS向UI发送的
 */
export enum UIProtoTypeEnum{
    REQ_LOGIN = 0,
    RLT_ROLES = 1,
    REQ_CREATE_ROLE = 2,
    REQ_CHOOSE_ROLE = 3,
    RLT_ERROR_EVENT = 4,
}