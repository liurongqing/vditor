export const addScriptSync = (path: string, id: string) => {
    if (document.getElementById(id)) {
        return false;
    }
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = path;
    scriptElement.id = id;
    document.head.appendChild(scriptElement);
};

export const addScript = (path: string, id: string) => {
    return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
            // 脚本加载后再次调用直接返回
            resolve(true);
            return false;
        }
        const scriptElement = document.createElement("script");
        scriptElement.src = path;
        scriptElement.async = true;
        // 循环调用时 Chrome 不会重复请求 js
        document.head.appendChild(scriptElement);
        scriptElement.onload = () => {
            if (document.getElementById(id)) {
                // 循环调用需清除 DOM 中的 script 标签
                scriptElement.remove();
                resolve(true);
                return false;
            }
            scriptElement.id = id;
            resolve(true);
        };
    });
};
