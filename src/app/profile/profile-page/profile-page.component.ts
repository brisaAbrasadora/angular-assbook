import { Component, Input, OnInit, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../../auth/interfaces/user";
import { BmMapDirective } from "../../bingmaps/bm-map.directive";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { BmMarkerDirective } from "../../bingmaps/bm-marker.directive";

@Component({
    selector: "profile-page",
    standalone: true,
    imports: [BmMapDirective, BmMarkerDirective],
    templateUrl: "./profile-page.component.html",
    styleUrl: "./profile-page.component.css",
})
export class ProfilePageComponent implements OnInit {
    @Input() user!: User;
    // coordinates: Coordinates = { latitude: 38.3245, longitude: -0.5 };
    // coordinates: Coordinates = {
    //     latitude: this.user.lat,
    //     longitude: this.user.lng,
    // };
    coordinates: Coordinates = {
        latitude: 0,
        longitude: 0,
    };

    ngOnInit(): void {
        console.log(this.user);
        this.coordinates = {
            latitude: this.user.lat,
            longitude: this.user.lng,
        };
    }
}
