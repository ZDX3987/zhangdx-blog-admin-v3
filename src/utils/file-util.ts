export function getFileNameByUrl(url: string) {
    if (!url) {
        return '';
    }
    return url.substring(url.lastIndexOf('/') + 1);
}

export function downloadMdFile(blob: BlobPart, fileName: string) {
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(new Blob([blob]))
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
}
