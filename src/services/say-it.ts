import Say from "say";
import { ConstraintError } from "@app/data/util";

export interface SayIt {
  message?: string;
  play?: boolean;
  speed?: number;
  voice?: Voice;
}

export enum Voice {
  "Alex       en_US" = "Alex",
  "Alice      it_IT" = "Alice",
  "Alva       sv_SE" = "Alva",
  "Amelie     fr_CA" = "Amelie",
  "Anna       de_DE" = "Anna",
  "Bad News   en_US" = "Bad News",
  "Bahh       en_US" = "Bahh",
  "Bells      en_US" = "Bells",
  "Boing      en_US" = "Boing",
  "Bruce      en_US" = "Bruce",
  "Bubbles    en_US" = "Bubbles",
  "Carmit     he_IL" = "Carmit",
  "Damayanti  id_ID" = "Damayanti",
  "Daniel     en_GB" = "Daniel",
  "Deranged   en_US" = "Deranged",
  "Diego      es_AR" = "Diego",
  "Ellen      nl_BE" = "Ellen",
  "Fiona      en-scot" = "Fiona",
  "Fred       en_US" = "Fred",
  "Good News  en_US" = "Good News",
  "Hysterical en_US" = "Hysterica",
  "Ioana      ro_RO" = "Ioana",
  "Joana      pt_PT" = "Joana",
  "Junior     en_US" = "Junior",
  "Kanya      th_TH" = "Kanya",
  "Karen      en_AU" = "Karen",
  "Kathy      en_US" = "Kathy",
  "Kyoko      ja_JP" = "Kyoko",
  "Laura      sk_SK" = "Laura",
  "Lekha      hi_IN" = "Lekha",
  "Luciana    pt_BR" = "Luciana",
  "Mariska    hu_HU" = "Mariska",
  "Mei-Jia    zh_TW" = "Mei-Jia",
  "Melina     el_GR" = "Melina",
  "Milena     ru_RU" = "Milena",
  "Moira      en_IE" = "Moira",
  "Monica     es_ES" = "Monica",
  "Nora       nb_NO" = "Nora",
  "Paulina    es_MX" = "Paulina",
  "Pipe Organ en_US" = "Pipe Orga",
  "Princess   en_US" = "Princess",
  "Ralph      en_US" = "Ralph",
  "Samantha   en_US" = "Samantha",
  "Sara       da_DK" = "Sara",
  "Satu       fi_FI" = "Satu",
  "Sin-ji     zh_HK" = "Sin-ji",
  "Tarik      ar_SA" = "Tarik",
  "Tessa      en_ZA" = "Tessa",
  "Thomas     fr_FR" = "Thomas",
  "Ting-Ting  zh_CN" = "Ting-Ting",
  "Trinoids   en_US" = "Trinoids",
  "Veena      en_IN" = "Veena",
  "Vicki      en_US" = "Vicki",
  "Victoria   en_US" = "Victoria",
  "Whisper    en_US" = "Whisper",
  "Xander     nl_NL" = "Xander",
  "Yelda      tr_TR" = "Yelda",
  "Yuna       ko_KR" = "Yuna",
  "Zarvox     en_US" = "Zarvox",
  "Zosia      pl_PL" = "Zosia",
  "Zuzana     cs_CZ" = "Zuzana"
}

export const sayIt = async (say: SayIt) => {
  return say.play ? Say.speak(say.message, say.voice, say.speed) : Say.stop();
};

export const exportSayIt = async (say: SayIt) => {
  return Say.export(say.message, say.voice, say.speed, "/mooyi-voice.wav", (error) => {
    if (error) {
      throw new ConstraintError(error);
    }
  });
};
