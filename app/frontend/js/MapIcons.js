var MapIcons;
(function (MapIcons) {
    var basepath = "./img/map-icons/";
    var icons = {
        aeroport: "airport.png",
        batiment: "ruins-2.png",
        bedbreakfast: "bed_breakfast1-2.png",
        bibliotheque: "library.png",
        camping: "camping-2.png",
        casino: "poker.png",
        caverne: "cave-2.png",
        chalet: "lodging_0star.png",
        centre: "ferriswheel.png",
        cinema: "cinema.png",
        citysquare: "citysquare.png",
        commercial: "mall.png",
        education: "university.png",
        eglise: "chapel-2.png",
        ferme: "farm-2.png",
        ferry: "ferry.png",
        foret: "forest-2.png",
        gouvernemental: "congress.png",
        hiking: "hiking.png",
        historic: "monument-historique-icon-white-22x22.png",
        hotel: "motel-2.png",
        jardin: "flower.png",
        lac: "lake.png",
        maison: "home-2.png",
        marina: "marina-2.png",
        medical: "firstaid.png",
        militaire: "military.png",
        monument: "arch.png",
        murale: "mural.png",
        musee: "art-museum-2.png",
        observatoire: "observatory.png",
        olympic: "olympicsite.png",
        panel: "memorial.png",
        parc: "tree.png",
        patin: "iceskating.png",
        peche: "fishing.png",
        piscine: "swimming.png",
        plage: "beach.png",
        planetarium: "planetarium-2.png",
        public_art: "museum_art.png",
        racing: "karting.png",
        restaurant: "restaurant.png",
        river: "river-2.png",
        ski: "skiing.png",
        spirituel: "prayer.png",
        sport: "usfootball.png",
        theater: "theater.png",
        tourisme: "notvisited.png",
        unesco: "worldheritagesite.png",
        viewpoint: "binoculars.png",
        youarehere: "you-are-here-2.png",
        zoo: "zoo.png"
    };
    function getIcon(category) {
        return basepath + icons[category];
    }
    MapIcons.getIcon = getIcon;
    function getYouAreHereIcon() {
        return getIcon("youarehere");
    }
    MapIcons.getYouAreHereIcon = getYouAreHereIcon;
})(MapIcons || (MapIcons = {}));
//# sourceMappingURL=MapIcons.js.map