import { code160to32 } from "../util/code160to32";
import { Constants } from "../constants";

let inited = false;
export const codeRender = (element: HTMLElement) => {
    element
        .querySelectorAll("pre > code")
        .forEach((e: HTMLElement, index: number) => {
            if (
                e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                e.parentElement.classList.contains("vditor-ir__marker--pre")
            ) {
                return
            }
            if (
                e.classList.contains("language-mermaid") ||
                e.classList.contains("language-flowchart") ||
                e.classList.contains("language-echarts") ||
                e.classList.contains("language-mindmap") ||
                e.classList.contains("language-plantuml") ||
                e.classList.contains("language-markmap") ||
                e.classList.contains("language-abc") ||
                e.classList.contains("language-graphviz") ||
                e.classList.contains("language-math")
            ) {
                return
            }

            if (e.style.maxHeight.indexOf("px") > -1) {
                return
            }

            // 避免预览区在渲染后由于代码块过多产生性能问题 https://github.com/b3log/vditor/issues/67
            if (element.classList.contains("vditor-preview") && index > 5) {
                return
            }

            let codeText = e.innerText
            if (e.classList.contains("highlight-chroma")) {
                const codeElement = document.createElement("code")
                codeElement.innerHTML = e.innerHTML
                codeElement
                    .querySelectorAll(".highlight-ln")
                    .forEach((item: HTMLElement) => {
                        item.remove()
                    })
                codeText = codeElement.innerText
            } else if (codeText.endsWith("\n")) {
                codeText = codeText.substr(0, codeText.length - 1)
            }
            let iconHTML =
                '<svg class="copy-icon"><use xlink:href="#vditor-icon-copy"></use></svg>'
            if (!document.getElementById("vditorIconScript")) {
                iconHTML =
                    '<svg viewBox="0 0 32 32"><path d="M22.545-0h-17.455c-1.6 0-2.909 1.309-2.909 2.909v20.364h2.909v-20.364h17.455v-2.909zM26.909 5.818h-16c-1.6 0-2.909 1.309-2.909 2.909v20.364c0 1.6 1.309 2.909 2.909 2.909h16c1.6 0 2.909-1.309 2.909-2.909v-20.364c0-1.6-1.309-2.909-2.909-2.909zM26.909 29.091h-16v-20.364h16v20.364z"></path></svg>'
            }

            const divElement = document.createElement("div")
            divElement.className = "vditor-copy"
            divElement.innerHTML = `<span aria-label="${
                window.VditorI18n?.copy || "复制"
            }"
            class="vditor-tooltipped vditor-tooltipped__w">${iconHTML}</span>`
            const textarea = document.createElement("textarea")
            textarea.value = code160to32(codeText)
            divElement.insertAdjacentElement("afterbegin", textarea)

            e.before(divElement)
            e.style.maxHeight = window.outerHeight - 40 + "px"
            // https://github.com/Vanessa219/vditor/issues/1356
            e.insertAdjacentHTML(
                "afterend",
                `<span style="position: absolute">${Constants.ZWSP}</span>`
            )
        })

    if (!inited) {
        inited = true
        listenCopy()
    }
    function listenCopy() {
        // 事件委托，监听
        const previewDom = document.querySelector(".vditor-preview")
        if (!previewDom) return
        previewDom.addEventListener("click", function (event: any) {
            try {
                if (
                    event.target.className &&
                    event.target.className.animVal === "copy-icon"
                ) {
                    //
                    console.warn("点击了复制")

                    const parentNode = event.target.parentElement
                    parentNode.previousElementSibling.select()
                    document.execCommand("copy")
                    parentNode.setAttribute(
                        "aria-label",
                        window.VditorI18n?.copied || "已复制"
                    )
                    setTimeout(() => {
                        parentNode.setAttribute(
                            "aria-label",
                            window.VditorI18n?.copy || "复制"
                        )
                    }, 1000)
                }
            } catch {
                //
            }
        })
    }
}
