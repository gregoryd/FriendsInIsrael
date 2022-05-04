import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, Remult, Validators, ValueListFieldType } from "remult";
import { Match } from "./Matches";

@Entity("families", {
    allowApiCrud: Allow.authenticated,
    dbName: 'טופס מאוחד'
})
export class Family extends IdEntity {
    @Fields.string({ dbName: 'Timestamp' })
    timestamp = '';
    @Field(() => Status, { dbName: 'סטטוס' })
    status = Status.waitingForMatch;
    @Fields.string({ dbName: 'Имя / Name /  שם' })
    name = '';
    @Fields.string({ dbName: 'Город в Израиле / City in Israel / עיר בישראל' })
    city = '';
    @Fields.string({ dbName: 'עיר בעברית' })
    cityInHebrew = '';
    @Fields.string({ dbName: 'אזור בישראל' })
    area = '';
    @Fields.string({ dbName: 'Откуда вы приехали? / Where did you arrive from? / מאיזו ארץ עלית?' })
    fromCountry = '';
    @Fields.string({ dbName: 'Вы / Are you / האם אתם' })
    lengthTimeInIsrael = '';
    @Fields.string({ dbName: 'מספר מבוגרים בגיל העבודה' })
    adults = '';
    @Fields.string({ dbName: 'מספר פנסיונרים' })
    seniors = '';
    @Fields.string({ dbName: 'הרכב ילדים (אם יש שני ילדים באותו גיל כרגע מראה רק את הבת)' })
    kids = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [18-29]' })
    adults_18_29 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [30-39]' })
    adults_30_39 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [40-49]' })
    adults_40_49 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [50-59]' })
    adults_50_59 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [60-69]' })
    adults_60_69 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [70-79]' })
    adults_70_79 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [80-89]' })
    adults_80_89 = '';
    @Fields.string({ dbName: 'Возраста взрослых членов семьи  / Age of the adult family members / מה הגילאים של המבוגרים במשפחה [90 - 120]' })
    adults_90_120 = '';
    @Fields.string({ dbName: 'Профессии взрослых / Professions of the adults / מקצועות המבוגרים' })
    professions = '';
    @Fields.string({ dbName: 'Соблюдаете ли вы еврейские религиозные заповеди? / Do you observe the laws of Judaism? / האם אתם שומרי מצוות?' })
    religiousAffiliation = '';
    @Fields.string({ dbName: 'Есть ли дети в вашей семье? / Are there children in your family? / האם יש ילדים במשפחה?' })
    hasKids = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [0-2]' })
    kids_0_2 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [2-4]' })
    kids_2_4 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [4-6]' })
    kids_4_6 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [6-8]' })
    kids_6_8 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [8-10]' })
    kids_8_10 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [10-12]' })
    kids_10_12 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [12-14]' })
    kids_12_14 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [14-16]' })
    kids_14_16 = '';
    @Fields.string({ dbName: 'Возраста детей / גילאי הילדים [16-18]' })
    kids_16_18 = '';
    @Fields.string({ dbName: 'Есть ли у вас дети с особыми нуждами? האם יש לכם ילדים עם צרכים מיוחדים' })
    hasSpecialNeeds = '';
    @Fields.string({ dbName: 'Дополнительные подробности о детях / פרטים נוספים על הילדים' })
    kidsNotes = '';
    @Fields.string({ dbName: 'Дата прибытия в Израиль / Date of arrival to Israel' })
    arrivalDateIsrael = '';
    @Fields.string({ dbName: 'Хотели ли бы вы помочь в организации этого проекта? / האם תהיו מעוניינים לעזור בתפעול הפרויקט הזה?' })
    willingToHelp = '';
    @Fields.string({ dbName: 'Номер телефона / Phone number / מספר טלפון' })
    phone = '';
    @Fields.string({ dbName: 'Email / דואר אלקטרוני' })
    email = '';
    @Fields.string({ dbName: 'Языки, на которых вы можете говорить / Languages you can speak /  שפות בהן אתם יכולים לדבר' })
    languages = '';
    @Fields.string({ dbName: 'Комментарии / Comments / הערות נוספות' })
    comments = '';
    @Fields.string()
    allocatedAssigner = '';
    @Fields.date({ allowNull: true })
    lastAssignAttempt = new Date();
    @Fields.string()
    note: string = '';


    @BackendMethod({ allowed: Allow.authenticated })
    static async findNextFamilyToMatch(excludeIds: string[], remult?: Remult) {
        if (!remult)
            return;
        const familyRepo = remult.repo(Family);
        let newFamily = await familyRepo.findFirst({
            allocatedAssigner: remult.user.id,
            lengthTimeInIsrael: shortTimeInIsrael,
            status: Status.waitingForMatch,
            id: { "!=": excludeIds }
        });

        if (!newFamily) {
            let newFamilies = await familyRepo.find({
                where:
                {
                    lengthTimeInIsrael: shortTimeInIsrael,
                    status: Status.waitingForMatch,
                    allocatedAssigner: "",
                    id: { "!=": excludeIds }
                },
                orderBy: {
                    lastAssignAttempt: "asc",
                }
            });
            if (newFamilies.length > 0) {
                newFamilies.sort((a, b) => (a.lastAssignAttempt?.valueOf() || 0 - b.lastAssignAttempt?.valueOf() || 0))
                newFamily = newFamilies[0];
                //console.table(newFamilies.map(f => ({ n: f.name, l: f.lastAssignAttempt })))
            }
        }

        if (newFamily) {
            let [oldFamilies, prevMatches] = await Promise.all([
                familyRepo.find({
                    where: {
                        lengthTimeInIsrael: longTimeInIsrael,
                        status: Status.waitingForMatch,
                        id: { "!=": excludeIds }
                    },
                }),
                remult.repo(Match).find({
                    where: {
                        newFamily,
                    },
                    load: () => []
                }),
                , newFamily.assign({ allocatedAssigner: remult.user.id }).save()]);
            oldFamilies = oldFamilies.filter(
                (f) => !prevMatches.find((p) => p.$.oldFamily.inputValue == f.id)
            );
            return {
                newFamily: newFamily._.toApiJson(),
                oldFamilies: oldFamilies.map(x => x._.toApiJson())
            }
        }
        return {}
    }

}

@ValueListFieldType()
export class Status {
    static waitingForMatch = new Status('',
        "ממתין לשידוך");
    static potentialMatchCreated = new Status('נמצא שידוך - ממתין לתיאום');
    static matchConfirmed = new Status('שודך ותואם');
    static clarification = new Status('נשלח מייל הבהרות');
    static frozen = new Status('חסום');
    static aborted = new Status('פרשו');
    constructor(public id: string, public caption?: string) {

    }
}
export const longTimeInIsrael = 'давно в Израиле / a long-time Israeli / חיים בישראל מזמן';
export const shortTimeInIsrael = 'недавно в Израиле / a new arrival to Israel / הגעתם לישראל לאחרונה';