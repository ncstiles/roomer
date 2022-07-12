export const BASE_API_URL = "http://localhost:3001";

//do not reorder - this is the order of keys in the form
export const keyToCollection = {
  firstName: "basic",
  lastName: "basic",
  // 'username':'auth',
  email: "basic",
  password: "auth",
  age: "basic",
  gender: "basic",
  occupation: "basic",
  profession: "preferences",
  insta: "extra",
  fb: "extra",
  bio: "extra",
  rentRange: "housing",
  addr: "housing",
  city: "housing",
  state: "housing",
  zip: "housing",
  agePref: "preferences",
  genderPref: "preferences",
  locRad: "preferences",
  ageWeight: "preferences",
  genderWeight: "preferences",
  locWeight: "preferences",
};

export const collectionCategories = [
  "auth",
  "basic",
  "housing",
  "preferences",
  "extra",
];
