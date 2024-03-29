// a dictionary of arabic consonants
var consonant_dict = {
  "ب": "b",
  "ت": "t",
  "ث": "th",
  "ج": "j",
  "ح": "ḥ",
  "خ": "kh",
  "د": "d",
  "ذ": "dh",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "ṣ",
  "ض": "ḍ",
  "ط": "ṭ",
  "ظ": "ẓ",
  "ع": "ʿ",
  "غ": "gh",
  "ف": "f",
  "ق": "q",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",

  // the different forms of hamza
  "ء": "ʾ",
  "أ": "ʾ",
  "إ": "ʾ",
  "ئ": "ʾ",
  "ؤ": "ʾ",

  // ta marbuta
  "ة": "t"
}

// a dictionary of arabic vowels - long and short
var vowel_dict = {
  // long vowels
  "ا": "a",
  "ى": "a",
  "و": "u",
  "ي": "i",
  "آ": "ā",

  // short vowels
  "\u064E": "a",
  "\u0650": "i",
  "\u064F": "u",
  "\u064B": "an",
  "\u064D": "in",
  "\u064C": "un",
  "\u0652": "",
  "\u0651": "$" // shadda is shown as a $ sign
}

// handling other characters
var punctuation_dict = {
  " ": " ",
  ".": ".",
  "؟": "?"
}

// the assign method of object can merge dicts
var arabic_chars_dict = Object.assign({},
  consonant_dict,
  vowel_dict,
  punctuation_dict))

module.exports = {arabic_chars_dict}
