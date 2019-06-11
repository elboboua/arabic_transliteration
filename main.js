// This is a way to import another js file - strange
// forget importing for now
//import { arabic_chars_dict }  from "arabic_characters"


//arabic_characters.js
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
  // the tanwin are marked with ñ so they can be detected in a later function
  "\u064E": "a",
  "\u0650": "i",
  "\u064F": "u",
  "\u064B": "añ",
  "\u064D": "iñ",
  "\u064C": "uñ",
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
  punctuation_dict)

// this function isolates the al at-ta3reef with a hyphen
// the problem is that we aren't picking up on the tanwin
// we need to change the tanwin to another symbol
function definite_article_separator(str) {
  new_string = str

  for (i = 0; i < str.length; i++) {

    if (i == 0 && str[i] == "a") {
        try {
          if (str[i+1] == "l") {
            new_string = new_string.substr(0,i+2) + "-" + new_string.substr(i+2);
          }
        } catch {
          console.log("Something has gone wrong")
        }
    }
    else if (i != 0 && i != str.length-1) {
      if (str[i - 1] == " " && str[i + 1] == "l") {
        new_string = new_string.substr(0,i+2) + "-" + new_string.substr(i+2);
        //console.log("a hyphen was added.")
      }
    }
  }
    return new_string;

}

// This function removes final alif after accusative tanwin alif
// and makes tanwin ñ into n
function normalize_tanwin(str) {
  for (i = 0; i < str.length-1; i++) {
    if (str[i] == "ñ" && str[i+1] != " ") {
      str = str.substr(0,i) + "n" + str.substr(i+2);
    } else if (str[i] == "ñ") {
      str = str.substr(0,i) + "n" + str.substr(i+1)
    }
    }
    return str;
}

// this function changes vowels to glides in initial and final syllable positions
function vowels_to_glides(str) {
  for (i = 0; i < str.length; i++) {
    // intial position of the document
    if (i == 0) {
      switch(str[i]) {
        case "u":
          str = "w" + str.substr(i+1);
          break;
        case "i":
          str = "y" + str.substr(i+1);
          break;
        default:
          break;
      }
    } // if "i" is initial position before another vowel
    else if (str[i] == "i" && (str[i+1] == "a" || str[i+1] == "u")) {
      str = str.substr(0,i)+ "y" + str.substr(i+1);
    }// if "u" is initial position before another vowel
    else if (str[i] == "u" && (str[i+1] == "a" || str[i+1] == "i")) {
      str = str.substr(0,i)+ "w" + str.substr(i+1);
    } // this is for syllable final "i"
    else if (str[i] == "i" && str[i-1] == "a") {
      str = str.substr(0,i)+ "y" + str.substr(i+1);
    } // this is for syllable final "u"
    else if (str[i] == "u" && str[i-1] == "a") {
      str = str.substr(0,i)+ "w" + str.substr(i+1);
    }
  }

  return str;
}


// This function creates long vowels by finding two side by side vowels.
// A function that changes i&u to y&w in initial positions and after "a"
// should come before
// unfortunately there is no control for unmarked medial hamzatul wasl positions
// and it will print as a long "a"
function create_long_vowels(str) {
  for (i = 0; i < str.length-1; i++) {
    if (str[i] == "a" && str[i+1] == "a") {
      str = str.substr(0,i) + "ā" + str.substr(i+2);
    } else if (str[i] == "u" && str[i+1] == "u") {
      str = str.substr(0,i) + "ū" + str.substr(i+2);
    } else if (str[i] == "i" && str[i+1] == "i") {
      str = str.substr(0,i) + "ī" + str.substr(i+2);
    }
  }

  return str;
}


// this function takes the raw arabic script and converts to roman script from the dictionary
function convert(str) {
  new_string = ""

  for (i = 0; i < str.length; i++) {
    if (arabic_chars_dict[str[i]] != undefined) {
      new_string += (arabic_chars_dict[str[i]])
    }
  }

  return new_string;

}

function transcribe() {
  arabicText = document.getElementById("arabicText").value;
  output = convert(arabicText);
  // there needs to be a function that looks for regular words that start with "al" and replaces them
  output = definite_article_separator(output);
  // shadda function here
  output = normalize_tanwin(output);
  output = vowels_to_glides(output);
  output = create_long_vowels(output);
  // hamzatul wasl function here


  document.getElementById("englishText").value = output;
}

document.getElementById("button").addEventListener("click", transcribe)
