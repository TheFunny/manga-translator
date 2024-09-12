import {mdiAlertCircleOutline, mdiCheckCircleOutline, mdiCircleOutline, mdiHelpCircleOutline} from "@mdi/js";

export class Translation {
    constructor(
        area,
        original = '',
        translation = '',
        status = TranslationStatus.PENDING,
    ) {
        this.area = area instanceof TranslationArea ? area : new TranslationArea(area);
        this.original = original;
        this.translation = translation;
        this.status = status;
    }
}

export class TranslationArea {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

const iconMapping = {};
iconMapping[mdiCircleOutline] = 1;
iconMapping[mdiCheckCircleOutline] = 2;
iconMapping[mdiAlertCircleOutline] = 3;
iconMapping[mdiHelpCircleOutline] = 4;

const iconReverseMapping = {
    1: mdiCircleOutline,
    2: mdiCheckCircleOutline,
    3: mdiAlertCircleOutline,
    4: mdiHelpCircleOutline
};

export class TranslationStatus {
    static PENDING = new TranslationStatus("Pending", mdiCircleOutline);
    static APPROVED = new TranslationStatus("Approved", mdiCheckCircleOutline);
    static REJECTED = new TranslationStatus("Rejected", mdiAlertCircleOutline);
    static UNCERTAIN = new TranslationStatus("Uncertain", mdiHelpCircleOutline);
    static ALL = [TranslationStatus.PENDING, TranslationStatus.APPROVED, TranslationStatus.REJECTED, TranslationStatus.UNCERTAIN];

    constructor(name, icon) {
        this.name = name;
        this.iconNum = this.iconToNum(icon);
    }

    iconToNum(icon) {
        return iconMapping[icon];
    }

    static numToIcon(num) {
        return iconReverseMapping[num];
    }

    static icon(translationStatus) {
        return TranslationStatus.numToIcon(translationStatus.iconNum);
    }
}
