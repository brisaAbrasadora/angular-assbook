import { Component, Input, OnInit, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../../auth/interfaces/user";

@Component({
    selector: "profile-page",
    standalone: true,
    imports: [],
    templateUrl: "./profile-page.component.html",
    styleUrl: "./profile-page.component.css",
})
export class ProfilePageComponent implements OnInit {
    @Input() user!: User;

    ngOnInit(): void {
        console.log(this.user);
    }

    #userService = inject(UserService);
}
