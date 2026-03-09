const initTitle = 'ZHANGDX的博客后台管理'

export function setTitle(title: string | undefined) {
    if (title) {
        document.title = title + '-' + initTitle
    }
}