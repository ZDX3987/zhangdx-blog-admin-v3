import type {Role} from "./Role.ts";

export class AuthUserInfo {
    userId: number;
    username: string;
    nickname: string;
    avatar: string;
    email: string;
    tel: string;
    introduce: string;
    createTime: Date;
    roleList: Role[];
}