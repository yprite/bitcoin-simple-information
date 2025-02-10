import { updateAllData } from "./intervals.js"

// updateAllData();

new Sortable(document.getElementById('sortableContainer'), {
    animation: 150,
    delay: 300,
    delayOnTouchOnly: true,
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag"
});
