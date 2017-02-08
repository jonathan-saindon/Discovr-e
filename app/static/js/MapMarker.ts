/**
 * Created by Jonathan Saindon on 2017-02-07.
 */
class MapMarker {
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    imgUrl: string;

    constructor(name: string, latitude: number, longitude: number, description?: string, imgUrl?: string) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.imgUrl = imgUrl;
    }

    addToMap() : void {

    }
}