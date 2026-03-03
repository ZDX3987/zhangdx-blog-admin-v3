export class SysUser {
    id: number;
    username: string;
    nickname: string;
    tel: string;
    email: string;
    avatar: string;
    introduce: string;
    createTime: Date;
    status: boolean;
    socialUserVos: SocialUser[];
}

class SocialUser {
    id: number;
    username: string;
    nickname: string;
    source: string;
    avatar: string;
    sysUserId: number;
}
