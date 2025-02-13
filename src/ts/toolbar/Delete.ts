import { exportHTML, exportMarkdown, exportPDF } from "../export"
import { getEventName } from "../util/compatibility"
import { MenuItem } from "./MenuItem"
import { hidePanel, toggleSubMenu } from "./setToolbar"

export class Delete extends MenuItem {
    public element: HTMLElement

    constructor(
        vditor: IVditor,
        menuItem: IMenuItem
    ) {
        super(vditor, menuItem)
        const actionBtn = this.element.children[0] as HTMLElement
        const panelElement = document.createElement("div")
        panelElement.className = `vditor-hint${
            menuItem.level === 2 ? "" : " vditor-panel--arrow"
        }`
        panelElement.innerHTML = `<button data-type="confirm">确认删除当前文件？</button>`
        panelElement.addEventListener(
            getEventName(),
            (event: MouseEvent & { target: HTMLElement }) => {
                const btnElement = event.target
                if (btnElement.tagName === "BUTTON") {
                    switch (btnElement.getAttribute("data-type")) {
                        case "confirm":
                            // @ts-ignore
                            menuItem?.confirm()
                            break
                        default:
                            break
                    }
                    hidePanel(vditor, ["subToolbar"])
                    event.preventDefault()
                    event.stopPropagation()
                }
            }
        )
        this.element.appendChild(panelElement)
        toggleSubMenu(vditor, panelElement, actionBtn, menuItem.level)
    }
}
