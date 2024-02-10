import { Component, Input, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "confirm-modal",
    standalone: true,
    imports: [],
    templateUrl: "./confirm-modal.component.html",
    styleUrl: "./confirm-modal.component.css",
})
export class ConfirmModalComponent {
    @Input() title!: string;
    @Input() body!: string;

    activeModal = inject(NgbActiveModal);
}
