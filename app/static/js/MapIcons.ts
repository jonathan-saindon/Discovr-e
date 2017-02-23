interface Icons {
    [key: string]: string;
}

module MapIcons {
    let basepath = "./static/img/map-icons/";

    let icons:Icons = {
        aeroport: "airport.png",
        batiment: "apartment-3.png",
        bibliotheque: "library.png",
        casino: "poker.png",
        caverne: "cave-2.png",
        centre: "ferriswheel.png",
        cinema: "cinema.png",
        citysquare: "citysquare.png",
        commercial: "mall.png",
        education: "university.png",
        ferme: "farm-2.png",
        foret: "forest-2.png",
        gouvernemental: "",
        hotel: "motel-2.png",
        hiking: "hiking.png",
        jardin: "flower.png",
        lac: "lake.png",
        maison: "",
        marina: "marina-2.png",
        medical: "firstaid.png",
        murale: "mural.png",
        musee: "artgallery.png",
        observatoire: "observatory.png",
        parc: "flower.png",
        peche: "fishing.png",
        piscine: "",
        plage: "beach.png",
        planetarium: "planetarium-2.png",
        public: "",
        racing: "karting.png",
        restaurant: "restaurant.png",
        river: "river-2.png",
        ski_alpin: "skiing.png",
        ski_fond: "skiing.png",
        spirituel: "chapel-2.png",
        sport: "stadium.png",
        theater: "theater.png",
        tourisme: "",
        unesco: "worldheritagesite.png",
        viewpoint: "binoculars.png",
        youarehere: "you-are-here-2.png",
        zoo: "zoo.png"
    };

    export function getIcon(category: string) : string {
        return basepath + icons[category];
    }

    export function getYouAreHereIcon() : string {
        return getIcon("youarehere");
    }
}