// This is a way to import another js file - strange
// forget importing for now
//import { arabic_chars_dict }  from "arabic_characters"


//arabic_characters.js
// a dictionary of arabic consonants
var consonant_dict = {
  "ب": "b",
  "ت": "t",
  "ث": "tẖ",
  "ج": "j",
  "ح": "ḥ",
  "خ": "kẖ",
  "د": "d",
  "ذ": "dẖ",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sẖ",
  "ص": "ṣ",
  "ض": "ḍ",
  "ط": "ṭ",
  "ظ": "ẓ",
  "ع": "ʿ",
  "غ": "gẖ",
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


// fix shadda positions incase the short vowel is inserted by the shadda in typing
function shadda_short_vowel_exchange(str) {
  for (i = 0; i < str.length; i++) {
    if ((str[i] == "\u0651") && (str[i-1] == "\u064E"
    || str[i-1] == "\u0650" || str[i-1] == "\u064F")) {
      str = str.substr(0,i) + str[i] + str[i-1] + str.substr(i)
    }
  }
  return str;
}

// this function isolates the al at-ta3reef with a hyphen
// the problem is that we aren't picking up on the tanwin
// we need to change the tanwin to another symbol
function definite_article_separator(str) {
  new_string = str

  for (i = 0; i < str.length; i++) {

    if (i == 0 && str[i] == "a") {
        try {
          if (str[i+1] == "l") {
            str = str.substr(0,i+2) + "-" + str.substr(i+2);
          }
        } catch {
          console.log("Something has gone wrong")
        }
    }
    else if (i != 0 && i != str.length-1) {
      if (str[i - 1] == " " && str[i + 1] == "l") {
        str = str.substr(0,i+2) + "-" + str.substr(i+2);
        //console.log("a hyphen was added.")
      }
    }
    console.log(i)
  }

    console.log("definite_article_separator" + new_string)
    return str;

}

// This function removes final alif after accusative tanwin alif
// and makes tanwin ñ into n
function normalize_tanwin(str) {
  for (i = 0; i < str.length; i++) {
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

function add_shadda(str) {
  for (i = 0; i < str.length; i++) {
    if (str[i] == "$") {
       switch (str[i-1]) {
         // this case is for the doubled letter consonants
         case "ẖ":
           try {
              str = str.substr(0,i) + str[i-2] + str[i-1] + str.substr(i+1);

           } catch {
             //console.log(i)
           }
            if (str[i-3] == "-") {
              str = str.substr(0,i-4) + str.substr(i-2,2) + "-" + str.substr(i);
            }

           break;
          //case :
          // This is for regular letters
          default:
           str = str.substr(0,i) + str[i-1] + str.substr(i+1);
           if (str[i-2] == "-") {
             str = str.substr(0,i-3) + str.substr(i-1, 1) + "-" + str.substr(i);
           break;
         }
        }
    }
    console.log(i)
  }
  // put the shadda into article shift here
  // or maybe in their respective areas

  // cleans up the h's by removing the underscore
  for (i = 0; i < str.length; i++) {
    if (str[i] == "ẖ") {
      str = str.substr(0,i) + "h" + str.substr(i+1);
    }
  }

    return str;
}

    // remove - and al


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
  output = shadda_short_vowel_exchange(arabicText);
  output = convert(output);
  // there needs to be a function that looks for regular words that start with "al" and replaces them
  // later
  output = definite_article_separator(output);
  // shadda function here

  output = normalize_tanwin(output);
  output = add_shadda(output);
  output = vowels_to_glides(output);
  output = add_shadda(output);
  output = create_long_vowels(output);

  // hamzatul wasl function here


  document.getElementById("englishText").value = output;
}

document.getElementById("button").addEventListener("click", transcribe)
