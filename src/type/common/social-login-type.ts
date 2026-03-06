export enum SocialLoginTypeEnum {
    QQ = 'QQ',
    GITEE = 'GITEE',
    GITHUB = 'GITHUB',
    FEISHU = 'FEISHU',
}

export const socialLoginTypeBtnArray: SocialLoginBtn[] = [
    {type: SocialLoginTypeEnum.QQ, icon: 'iconfont iconQQ', color: 'rgb(94,164,210)', text: 'QQ'},
    {type: SocialLoginTypeEnum.GITEE, icon: 'iconfont iconmayun', color: 'rgb(178,53,37)', text: '码云'},
    {type: SocialLoginTypeEnum.GITHUB, icon: 'iconfont iconhuaban881', color: 'rgb(51,51,51)', text: 'Github'},
    {type: SocialLoginTypeEnum.FEISHU, icon: 'iconfont iconiconfeishuLOGO', color: 'rgb(76,114,252)', text: '飞书'}
]

type SocialLoginBtn = {
    type: string
    icon: string
    color: string
    text: string
}