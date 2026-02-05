import type Vditor from "vditor";
import {uploadArticleContentFile} from "../api/articelApi.ts";

export function handleCustomUpload(articleId: number, files: File[], vditor: Vditor) {
    if (articleId) {
        uploadArticleContentFile(files[0], articleId).then(res => {
            let path = res.data
            let fileName = files[0].name
            let fileText
            if (vditor && vditor.getCurrentMode() === 'wysiwyg') {
                fileText = `<img alt=${fileName} src="${path}">`
            } else {
                fileText = `![${fileName}](${path})`
            }
            vditor.insertValue(fileText)
            vditor.tip('上传成功')
        })
    } else {

    }
    return null
}

export function formatUploadResponse(files: File[], responseText: string): string {
    let responseParse = JSON.parse(responseText)
    let result = {
        "msg": responseParse.msg,
        "code": 0,
        "data": {
            "errFiles": [],
            "succMap": {
                [files[0].name]: responseParse.data
            }
        }
    }
    return JSON.stringify(result);
}