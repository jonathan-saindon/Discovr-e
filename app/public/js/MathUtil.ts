module MathUtil {

    export function arePointsCloserThan(lat1: number, lng1: number, lat2: number, lng2: number, distance: number) : boolean {
        return getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) < distance;
    }

    export function getDistanceFromLatLonInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lng2 - lng1);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function deg2rad(deg: number): number {
        return deg * (Math.PI / 180)
    }

}