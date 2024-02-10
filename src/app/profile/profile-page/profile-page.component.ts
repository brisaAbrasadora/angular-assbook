import { Component, Input, OnInit } from "@angular/core";
import { User } from "../../auth/interfaces/user";
import { BmMapDirective } from "../../bingmaps/bm-map.directive";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { BmMarkerDirective } from "../../bingmaps/bm-marker.directive";
import { RouterLink } from "@angular/router";

@Component({
    selector: "profile-page",
    standalone: true,
    imports: [BmMapDirective, BmMarkerDirective, RouterLink],
    templateUrl: "./profile-page.component.html",
    styleUrl: "./profile-page.component.css",
})
export class ProfilePageComponent implements OnInit {
    @Input() user!: User;
    coordinates: Coordinates = {
        latitude: 0,
        longitude: 0,
    };

    ngOnInit(): void {
        this.coordinates = {
            latitude: this.user.lat,
            longitude: this.user.lng,
        };
    }
}
