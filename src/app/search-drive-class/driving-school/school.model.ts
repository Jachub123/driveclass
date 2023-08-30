export class School {
  automat: boolean;
  email: string;
  handgeschaltet: boolean;
  name: string;
  img: string;
  infoText: string;
  postalCode: number;
  rating: number;
  nothelferkurs: boolean;
  preisLektionen: number;
  preisVerkehrskunde: number;
  preisNothelferKurs: number;
  sprache: string;
  stadt: string;
  kanton: string;
  vorwahl: string;
  telefon: string;
  verkehrskunde: boolean;
  webseite: string;
  abo: number;
  schule: string;

  constructor(
    automat: boolean,
    email: string,
    handgeschaltet: boolean,
    name: string,
    img: string,
    infoText: string,
    postalCode: number,
    rating: number,
    nothelferkurs: boolean,
    preisLektionen: number,
    preisVerkehrskunde: number,
    preisNothelferKurs: number,
    sprache: string,
    stadt: string,
    kanton: string,
    vorwahl: string,
    telefon: string,
    verkehrskunde: boolean,
    webseite: string,
    abo: number,
    schule: string,
  ) {
    this.automat = automat;
    this.email = email;
    this.handgeschaltet = handgeschaltet;
    this.name = name;
    this.img = img;
    this.infoText = infoText;
    this.postalCode = postalCode;
    this.rating = rating;
    this.nothelferkurs = nothelferkurs;
    this.preisLektionen = preisLektionen;
    this.preisVerkehrskunde = preisVerkehrskunde;
    this.preisNothelferKurs = preisNothelferKurs;
    this.sprache = sprache;
    this.stadt = stadt;
    this.kanton = kanton;
    this.vorwahl = vorwahl;
    this.telefon = telefon;
    this.verkehrskunde = verkehrskunde;
    this.webseite = webseite;
    this.abo = abo;
    this.schule = schule;
  }
}
