const date = new Date("1996-1-15");
const currentDate = new Date();
const birthyear = date.getFullYear();
const currentYear = currentDate.getFullYear();
let age = currentYear - birthyear;
console.log(age);
const haspassed =
  currentDate.getMonth() > date.getMonth() ||
  (currentDate.getMonth() === date.getMonth() &&
    currentDate.getDate() >= date.getDate());
if (!haspassed) {
  age--;
}
console.log(age);
