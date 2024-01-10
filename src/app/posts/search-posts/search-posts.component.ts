import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "search-posts",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./search-posts.component.html",
    styles: "",
})
export class SearchPostsComponent {
    @Output() search = new EventEmitter<string>();
    params = "";
    
    changeSearch() {
        this.search.emit(this.params);
    }
}
