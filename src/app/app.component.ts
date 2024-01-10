import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuComponent } from "./menu/menu.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "root",
    standalone: true,
    imports: [CommonModule, MenuComponent, RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
}
