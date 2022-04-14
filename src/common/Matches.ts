import { Allow, Entity, Field, Fields, getEntityRef, IdEntity, isBackend, ValueListFieldType } from "remult";
import { Family, Status } from "./families";

@Entity<Match>("matches", {
    allowApiCrud: Allow.authenticated,
    saving: async (match) => {
        if (isBackend()) {
            await match.status.apply(match);
        }
    }
})
export class Match extends IdEntity {
    @Field(() => Family)
    oldFamily!: Family;
    @Field(() => Family)
    newFamily !: Family;
    @Fields.string()
    user = '';
    @Field(() => MatchStatus)
    status = MatchStatus.callOldFamily;
    @Fields.date()
    lastAttempt = new Date();

    async setStatus(args: { oldFamily: Status, newFamily: Status }) {
        await Promise.all([
            this.oldFamily.assign({ status: args.oldFamily }).save(),
            this.newFamily.assign({ status: args.newFamily }).save()]
        );
    }
}

@ValueListFieldType()
export class MatchStatus {
    static callOldFamily = new MatchStatus("התקשר למשפחה מאמצת", true, async m => {
        await m.setStatus({
            oldFamily: Status.potentialMatchCreated,
            newFamily: Status.potentialMatchCreated
        })

    }, "התקשר למשפחה מאמצת", false);
    static oldFamilyAccept = new MatchStatus("משפחה מאמצת רוצה", true, async m => {

    }, "התקשר למשפחה חדשה");
    static oldFamilyDecline = new MatchStatus("משפחה מאמצת לא רוצה", false, async m => {
        await m.setStatus({
            oldFamily: Status.waitingForMatch,
            newFamily: Status.waitingForMatch
        })
    }, "");
    static oldFamilyAborted = new MatchStatus("משפחה מאמצת רוצה לפרוש מהפרוייקט", false, async m => {
        await m.setStatus({
            oldFamily: Status.aborted,
            newFamily: Status.waitingForMatch
        })

    }, "");
    static oldFamilyNotAnswer = new MatchStatus("משפחה מאמצת לא עונים", true, async m => {

    }, "התקשר למשפחה מאמצת", false);
    static newFamilyAccept = new MatchStatus("משפחה חדשה גם רוצה", false, async m => {

    }, "שלח פרטים לשתי המשפחות");
    static newFamilyDecline = new MatchStatus("משפחה חדשה לא רוצה", false, async m => {
        await m.setStatus({
            oldFamily: Status.waitingForMatch,
            newFamily: Status.waitingForMatch
        })

    }, "");
    static newFamilyAborted = new MatchStatus("משפחה חדשה רוצה לפרוש מהפרוייקט", false, async m => {
        await m.setStatus({
            oldFamily: Status.waitingForMatch,
            newFamily: Status.aborted
        })
    }, "");
    static newFamilyNotAnswer = new MatchStatus("משפחה חדשה לא עונים", true, async m => {

    }, "התקשר למשפחה חדשה");
    static done = new MatchStatus("שתי המשפחות קיבלו את פרטי הקשר", false, async m => {
        await m.setStatus({
            oldFamily: Status.matchConfirmed,
            newFamily: Status.matchConfirmed
        })
    }, "");


    constructor(public caption: string, public activeForCaller: boolean, public apply: (match: Match) => Promise<void>, public tip: string, public lockVolunteer = true) {

    }
    id!: string;


}