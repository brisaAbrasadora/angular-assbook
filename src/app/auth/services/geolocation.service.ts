import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GeolocationService {
    #locationSubject = new Subject<GeolocationCoordinates>();

    getLocation(): Observable<GeolocationCoordinates> {
        return new Observable<GeolocationCoordinates>((observer) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    observer.next(pos.coords);
                    observer.complete();
                },
                (error) => {
                    switch (error.code) {
                    case error.PERMISSION_DENIED: // User didn't allow the web page to retrieve location
                        observer.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE: // Couldn't get the location
                        observer.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT: // The maximum amount of time to get location information has passed
                        observer.error(
                            "The request to get user location timed out."
                        );
                        break;
                    default:
                        observer.error("An unknown error occurred.");
                        break;
                    }
                }
            );
        });
    }

    updateLocation(coords: GeolocationCoordinates): void {
        this.#locationSubject.next(coords);
    }
}
