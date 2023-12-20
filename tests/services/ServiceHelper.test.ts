import { dateToString, stringToDate } from "../../src/services/ServiceHelper";


test("test dateToString",  () => {
    const now = new Date();
    const nowString = dateToString(now);
    expect(nowString).toBe(`${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()}`);
});


test("test stringToDate", () => {
    const todayString = "12.10.2023";
    const [day, month, year] = todayString.split(".");
    const todayDate = stringToDate(todayString);
    expect(todayDate).toBeInstanceOf(Date);
    expect(todayDate).toEqual(new Date(`${year}-${parseInt(month)}-${day}Z`));
});