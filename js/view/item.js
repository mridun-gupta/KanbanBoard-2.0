import DropZone from "./dropzone.js";
import KanbanAPI from "../api/kanbanAPI.js";

export default class Item {
    constructor(id, content) {
        const bottomDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;
        this.elements.root.appendChild(bottomDropZone);

        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            if (newContent == this.content) {
                return;
            }

            this.content = newContent;

            KanbanAPI.updateItem(id, {
                content: this.content
            });
        };

        this.elements.input.addEventListener("blur", onBlur);
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete this item?");

            if (check) {
                KanbanAPI.deleteItem(id);

                this.elements.input.removeEventListener("blur", onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });

        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
            this.elements.root.classList.add("dragging");
        });

        this.elements.root.addEventListener("dragend", () => {
            this.elements.root.classList.remove("dragging");
        });

        this.elements.input.addEventListener("drop", e => {
            e.preventDefault();
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="items" draggable="true">
                <div contenteditable class="item-input"></div>
            </div>
        `).children[0];
    }
}