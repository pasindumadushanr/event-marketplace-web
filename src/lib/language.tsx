"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "si" | "ta";
// Phase one: registration, saved-profile setup guidance, and enquiry forms only.
export const phrases: Record<string, readonly [string, string]> = {
  "Select district": ["දිස්ත්‍රික්කය තෝරන්න", "மாவட்டத்தைத் தேர்ந்தெடுக்கவும்"],
  "Create an account": ["ගිණුමක් සාදන්න", "கணக்கை உருவாக்கவும்"],
  "Create Vendor Account": [
    "සේවා සපයන්නෙකුගේ ගිණුමක් සාදන්න",
    "சேவை வழங்குநர் கணக்கை உருவாக்கவும்",
  ],
  "Enter your information to get started.": [
    "ආරම්භ කිරීමට ඔබගේ තොරතුරු ඇතුළත් කරන්න.",
    "தொடங்க உங்கள் தகவல்களை உள்ளிடவும்.",
  ],
  "Enter your details to start accepting premium bookings today.": [
    "ඔබගේ සේවාවන් හඳුන්වා දීමට ඔබගේ තොරතුරු ඇතුළත් කරන්න.",
    "உங்கள் சேவைகளை அறிமுகப்படுத்த உங்கள் விவரங்களை உள்ளிடவும்.",
  ],
  "First name": ["මුල් නම", "முதல் பெயர்"],
  "Last name": ["අවසන් නම", "குடும்பப் பெயர்"],
  Email: ["ඊමේල් ලිපිනය", "மின்னஞ்சல்"],
  "Business Email": ["ව්‍යාපාරයේ ඊමේල් ලිපිනය", "வணிக மின்னஞ்சல்"],
  "Phone Number": ["දුරකථන අංකය", "தொலைபேசி எண்"],
  Password: ["මුරපදය", "கடவுச்சொல்"],
  "Account Type": ["ගිණුම් වර්ගය", "கணக்கு வகை"],
  Customer: ["පාරිභෝගිකයා", "வாடிக்கையாளர்"],
  Vendor: ["සේවා සපයන්නා", "சேவை வழங்குநர்"],
  "Create account": ["ගිණුම සාදන්න", "கணக்கை உருவாக்கவும்"],
  "Creating account...": ["ගිණුම සාදමින්…", "கணக்கு உருவாக்கப்படுகிறது…"],
  "Continue to Onboarding": [
    "ව්‍යාපාර තොරතුරු ඇතුළත් කිරීමට යන්න",
    "வணிக விவரங்களைச் சேர்க்கத் தொடரவும்",
  ],
  "Already have an account?": [
    "දැනටමත් ගිණුමක් තිබේද?",
    "ஏற்கனவே கணக்கு உள்ளதா?",
  ],
  "Sign in": ["පිවිසෙන්න", "உள்நுழையவும்"],
  "Sign up with Google": [
    "Google හරහා ලියාපදිංචි වන්න",
    "Google மூலம் பதிவு செய்யவும்",
  ],
  "Or continue with": [
    "නැතහොත් පහත තොරතුරු ඇතුළත් කරන්න",
    "அல்லது கீழே உள்ள விவரங்களை உள்ளிடவும்",
  ],
  "First name is required": [
    "අවම වශයෙන් අක්ෂර 2ක් සහිත මුල් නම ඇතුළත් කරන්න",
    "குறைந்தது 2 எழுத்துகளுடன் முதல் பெயரை உள்ளிடவும்",
  ],
  "Last name is required": [
    "අවම වශයෙන් අක්ෂර 2ක් සහිත අවසන් නම ඇතුළත් කරන්න",
    "குறைந்தது 2 எழுத்துகளுடன் குடும்பப் பெயரை உள்ளிடவும்",
  ],
  "Please enter a valid email address": [
    "වලංගු ඊමේල් ලිපිනයක් ඇතුළත් කරන්න",
    "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
  ],
  "Valid phone number is required": [
    "අවම වශයෙන් ඉලක්කම් 10ක් සහිත දුරකථන අංකයක් ඇතුළත් කරන්න",
    "குறைந்தது 10 இலக்கங்களுடன் தொலைபேசி எண்ணை உள்ளிடவும்",
  ],
  "Password must be at least 6 characters": [
    "මුරපදයේ අවම වශයෙන් අක්ෂර 6ක් තිබිය යුතුය",
    "கடவுச்சொல்லில் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்",
  ],
  "Account created successfully!": [
    "ගිණුම සාර්ථකව සාදන ලදී!",
    "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!",
  ],
  "Account created! Please verify your email.": [
    "ගිණුම සාදන ලදී! ඔබගේ ඊමේල් ලිපිනය තහවුරු කරන්න.",
    "கணக்கு உருவாக்கப்பட்டது! உங்கள் மின்னஞ்சலை உறுதிப்படுத்தவும்.",
  ],
  "Failed to register": [
    "ලියාපදිංචිය අසාර්ථක විය. නැවත උත්සාහ කරන්න.",
    "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
  ],
  "Failed to create account": [
    "ගිණුම සෑදීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    "கணக்கை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  ],
  "By creating an account, you agree to our": [
    "ගිණුමක් සෑදීමෙන් ඔබ පහත කරුණු පිළිගනී:",
    "கணக்கை உருவாக்குவதன் மூலம் நீங்கள் ஏற்கிறீர்கள்:",
  ],
  "Terms of Service": ["සේවා කොන්දේසි", "சேவை விதிமுறைகள்"],
  "Privacy Policy": ["පෞද්ගලිකත්ව ප්‍රතිපත්තිය", "தனியுரிமைக் கொள்கை"],
  and: ["සහ", "மற்றும்"],
  "Join the celebration.": ["සැමරුමට එක්වන්න.", "கொண்டாட்டத்தில் இணையுங்கள்."],
  "Create an account to start planning your perfect event or offer your premium services to clients.":
    [
      "ඔබගේ උත්සවය සැලසුම් කිරීමට හෝ පාරිභෝගිකයන්ට සේවාවන් ලබා දීමට ගිණුමක් සාදන්න.",
      "உங்கள் நிகழ்வைத் திட்டமிட அல்லது வாடிக்கையாளர்களுக்கு சேவைகளை வழங்க கணக்கை உருவாக்கவும்.",
    ],
  "Join the most exclusive event marketplace.": [
    "උත්සව සේවා වෙළඳපොළට එක්වන්න.",
    "நிகழ்வு சேவை சந்தையில் இணையுங்கள்.",
  ],
  "Connect with premium clients, manage bookings seamlessly, and elevate your event business to the next level.":
    [
      "පාරිභෝගිකයන් සමඟ සම්බන්ධ වී ඔබගේ වෙන් කිරීම් සහ ව්‍යාපාරය කළමනාකරණය කරන්න.",
      "வாடிக்கையாளர்களுடன் தொடர்புகொண்டு உங்கள் முன்பதிவுகளையும் வணிகத்தையும் நிர்வகிக்கவும்.",
    ],
  "Tell us about your event": [
    "ඔබගේ උත්සවය ගැන කියන්න",
    "உங்கள் நிகழ்வைப் பற்றிக் கூறுங்கள்",
  ],
  "Send an enquiry to {vendor}": [
    "{vendor} වෙත විමසීමක් යවන්න",
    "{vendor} க்கு விசாரணை அனுப்பவும்",
  ],
  "this vendor": ["මෙම සේවා සපයන්නා", "இந்த சேவை வழங்குநர்"],
  "about {listing}": ["{listing} පිළිබඳව", "{listing} பற்றி"],
  "This does not make a booking or reserve your date.": [
    "මෙය වෙන් කිරීමක් නොවන අතර ඔබගේ දිනය වෙන් නොකරයි.",
    "இது முன்பதிவு அல்ல; உங்கள் தேதியை ஒதுக்காது.",
  ],
  "Event date": ["උත්සව දිනය", "நிகழ்வு தேதி"],
  "Guest count": ["අමුත්තන් ගණන", "விருந்தினர்களின் எண்ணிக்கை"],
  "Event location": ["උත්සව ස්ථානය", "நிகழ்வு நடைபெறும் இடம்"],
  "Your requirements": ["ඔබගේ අවශ්‍යතා", "உங்கள் தேவைகள்"],
  "Venue, city or area": [
    "උත්සව ශාලාව, නගරය හෝ ප්‍රදේශය",
    "மண்டபம், நகரம் அல்லது பகுதி",
  ],
  "Tell the vendor what you need, your preferences and any important details.":
    [
      "ඔබට අවශ්‍ය සේවා, කැමැත්ත සහ වැදගත් තොරතුරු සඳහන් කරන්න.",
      "தேவையான சேவைகள், விருப்பங்கள் மற்றும் முக்கிய விவரங்களைக் குறிப்பிடவும்.",
    ],
  "Add a future event date, location, guest count and at least 10 characters describing your requirements.":
    [
      "අද හෝ ඉදිරි උත්සව දිනයක්, ස්ථානයක්, අමුත්තන් ගණනක් සහ අවශ්‍යතා ගැන අවම වශයෙන් අක්ෂර 10ක් ඇතුළත් කරන්න.",
      "இன்று அல்லது எதிர்கால நிகழ்வு தேதி, இடம், விருந்தினர் எண்ணிக்கை மற்றும் தேவைகளை விளக்கும் குறைந்தது 10 எழுத்துகளை உள்ளிடவும்.",
    ],
  "Your enquiry wasn’t sent. Your details are still here; please try again.": [
    "විමසීම යැවීමට නොහැකි විය. ඔබගේ තොරතුරු මෙහි ඇත; නැවත උත්සාහ කරන්න.",
    "விசாரணை அனுப்பப்படவில்லை. உங்கள் விவரங்கள் இங்கே உள்ளன; மீண்டும் முயற்சிக்கவும்.",
  ],
  Cancel: ["අවලංගු කරන්න", "ரத்து செய்யவும்"],
  "Send enquiry": ["විමසීම යවන්න", "விசாரணையை அனுப்பவும்"],
  "Sending…": ["යවමින්…", "அனுப்பப்படுகிறது…"],
  "One step at a time": ["එක් පියවරක් බැගින්", "ஒவ்வொரு படியாக"],
  "Your page setup checklist": [
    "ඔබගේ පිටුව සැකසීමේ ලැයිස්තුව",
    "உங்கள் பக்க அமைப்பு பட்டியல்",
  ],
  "Start anywhere. Save each section, then check how your page looks to customers.":
    [
      "ඕනෑම කොටසකින් ආරම්භ කරන්න. සෑම කොටසක්ම සුරකින්න. ඉන්පසු පාරිභෝගිකයන්ට පිටුව පෙනෙන ආකාරය බලන්න.",
      "எந்தப் பகுதியிலிருந்தும் தொடங்கலாம். ஒவ்வொரு பகுதியையும் சேமித்து, வாடிக்கையாளர்களுக்கு பக்கம் எப்படி தெரிகிறது என்பதைப் பாருங்கள்.",
    ],
  "{count} of 6 steps complete": [
    "පියවර 6න් {count}ක් සම්පූර්ණයි",
    "6 படிகளில் {count} முடிந்தன",
  ],
  "Continue setup:": ["සැකසීම දිගටම කරගෙන යන්න:", "அமைப்பைத் தொடரவும்:"],
  Complete: ["සම්පූර්ණයි", "முடிந்தது"],
  "Step {number}": ["පියවර {number}", "படி {number}"],
  "What’s missing:": ["තවමත් අවශ්‍ය දේ:", "இன்னும் தேவைப்படுபவை:"],
  "Business details": ["ව්‍යාපාර තොරතුරු", "வணிக விவரங்கள்"],
  Photos: ["ඡායාරූප", "புகைப்படங்கள்"],
  Services: ["සේවාවන්", "சேவைகள்"],
  Contact: ["සම්බන්ධතා", "தொடர்பு"],
  Preview: ["පෙරදසුන", "முன்னோட்டம்"],
  Publish: ["ප්‍රකාශයට පත් කරන්න", "வெளியிடவும்"],
  "Review / edit": ["බලන්න / සංස්කරණය කරන්න", "பார்க்கவும் / திருத்தவும்"],
  "Open section": ["කොටස විවෘත කරන්න", "பகுதியைத் திறக்கவும்"],
  "Publish my page": [
    "මගේ පිටුව ප්‍රකාශයට පත් කරන්න",
    "என் பக்கத்தை வெளியிடவும்",
  ],
  "Publishing…": ["ප්‍රකාශයට පත් කරමින්…", "வெளியிடப்படுகிறது…"],
  "Checking your setup…": [
    "ඔබගේ සැකසුම පරීක්ෂා කරමින්…",
    "உங்கள் அமைப்பு சரிபார்க்கப்படுகிறது…",
  ],
  "Try again": ["නැවත උත්සාහ කරන්න", "மீண்டும் முயற்சிக்கவும்"],
  "We couldn’t check your setup. Your saved details haven’t changed.": [
    "ඔබගේ සැකසුම පරීක්ෂා කළ නොහැකි විය. සුරැකි තොරතුරු වෙනස් වී නැත.",
    "உங்கள் அமைப்பைச் சரிபார்க்க முடியவில்லை. சேமித்த விவரங்கள் மாறவில்லை.",
  ],
  "Could not publish your page. Please try again.": [
    "පිටුව ප්‍රකාශයට පත් කළ නොහැකි විය. නැවත උත්සාහ කරන්න.",
    "பக்கத்தை வெளியிட முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  ],
  "Progress is based on saved details. Extra settings and portfolio photos are optional. Saving does not publish your page.":
    [
      "ප්‍රගතිය සුරැකි තොරතුරු මත පදනම් වේ. අමතර සැකසුම් සහ ඡායාරූප විකල්ප වේ. සුරැකීමෙන් පිටුව ප්‍රකාශයට පත් නොවේ.",
      "முன்னேற்றம் சேமித்த விவரங்களின் அடிப்படையில் உள்ளது. கூடுதல் அமைப்புகளும் படத்தொகுப்பும் விருப்பமானவை. சேமிப்பது பக்கத்தை வெளியிடாது.",
    ],
  "Add your business name": [
    "ව්‍යාපාර නම එක් කරන්න",
    "வணிகப் பெயரைச் சேர்க்கவும்",
  ],
  "Choose a business category": [
    "ව්‍යාපාර කාණ්ඩයක් තෝරන්න",
    "வணிக வகையைத் தேர்ந்தெடுக்கவும்",
  ],
  "Describe what your business offers": [
    "ඔබගේ ව්‍යාපාරයේ සේවාවන් විස්තර කරන්න",
    "உங்கள் வணிகத்தின் சேவைகளை விவரிக்கவும்",
  ],
  "Add your business address": [
    "ව්‍යාපාර ලිපිනය එක් කරන්න",
    "வணிக முகவரியைச் சேர்க்கவும்",
  ],
  "Choose your city": [
    "ඔබගේ නගරය තෝරන්න",
    "உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்",
  ],
  "Upload your business logo": [
    "ව්‍යාපාර ලාංඡනය එක් කරන්න",
    "வணிகச் சின்னத்தைப் பதிவேற்றவும்",
  ],
  "Upload a cover photo": [
    "කවරයේ ඡායාරූපයක් එක් කරන්න",
    "அட்டைப் புகைப்படத்தைப் பதிவேற்றவும்",
  ],
  "Add a phone number": [
    "දුරකථන අංකයක් එක් කරන්න",
    "தொலைபேசி எண்ணைச் சேர்க்கவும்",
  ],
  "Add a business email address": [
    "ව්‍යාපාර ඊමේල් ලිපිනයක් එක් කරන්න",
    "வணிக மின்னஞ்சலைச் சேர்க்கவும்",
  ],
  "Explain your booking policy": [
    "ඔබගේ වෙන් කිරීමේ ප්‍රතිපත්තිය පැහැදිලි කරන්න",
    "உங்கள் முன்பதிவு விதிகளை விளக்கவும்",
  ],
  "Your vendor application needs approval": [
    "ඔබගේ අයදුම්පතට අනුමැතිය අවශ්‍යයි",
    "உங்கள் விண்ணப்பத்திற்கு ஒப்புதல் தேவை",
  ],
  "Check your account status — try loading again": [
    "ගිණුමේ තත්ත්වය පරීක්ෂා කරන්න — නැවත පූරණය කරන්න",
    "கணக்கின் நிலையைச் சரிபார்க்கவும் — மீண்டும் ஏற்றவும்",
  ],
  "Verify your account email before publishing": [
    "ප්‍රකාශයට පත් කිරීමට පෙර ගිණුමේ ඊමේල් තහවුරු කරන්න",
    "வெளியிடும் முன் கணக்கின் மின்னஞ்சலை உறுதிப்படுத்தவும்",
  ],
  "Review your saved page as a customer": [
    "සුරැකි පිටුව පාරිභෝගිකයෙකු ලෙස බලන්න",
    "சேமித்த பக்கத்தை வாடிக்கையாளராகப் பாருங்கள்",
  ],
  "Choose View as customer, then confirm you have checked the page": [
    "View as customer තෝරා පිටුව පරීක්ෂා කළ බව තහවුරු කරන්න",
    "View as customer என்பதைத் தேர்ந்தெடுத்து பக்கத்தைச் சரிபார்த்ததை உறுதிப்படுத்தவும்",
  ],
  "Add an active listing with a photo, title and description; price is optional (recommended)":
    [
      "ඡායාරූපයක්, නමක් සහ විස්තරයක් සහිත සේවාවක් එක් කරන්න; මිල විකල්පයි (නිර්දේශිතයි)",
      "புகைப்படம், தலைப்பு, விளக்கத்துடன் செயலில் உள்ள சேவையைச் சேர்க்கவும்; விலை விருப்பமானது (பரிந்துரைக்கப்படுகிறது)",
    ],
  "Introduce your business and tell customers where you work.": [
    "ව්‍යාපාරය හඳුන්වා දී ඔබ සේවා සපයන ප්‍රදේශය කියන්න.",
    "வணிகத்தை அறிமுகப்படுத்தி சேவை வழங்கும் இடத்தைக் கூறுங்கள்.",
  ],
  "Logo and cover added. Portfolio photos are a great optional extra.": [
    "ලාංඡනය සහ කවරය එක් කර ඇත. ඔබගේ වැඩවල ඡායාරූප ද එක් කළ හැකිය.",
    "சின்னமும் அட்டையும் சேர்க்கப்பட்டன. உங்கள் பணிகளின் புகைப்படங்களையும் சேர்க்கலாம்.",
  ],
  "Show customers what you offer. Service cards are recommended, not required to publish.":
    [
      "ඔබගේ සේවා පෙන්වන්න. සේවා කාඩ්පත් නිර්දේශිත නමුත් ප්‍රකාශයට පත් කිරීමට අනිවාර්ය නොවේ.",
      "உங்கள் சேவைகளைக் காட்டுங்கள். சேவை அட்டைகள் பரிந்துரைக்கப்படுகின்றன; வெளியிட கட்டாயமில்லை.",
    ],
  "Make it easy for customers to reach you.": [
    "පාරිභෝගිකයන්ට ඔබ සම්බන්ධ කර ගැනීම පහසු කරන්න.",
    "வாடிக்கையாளர்கள் உங்களை எளிதாகத் தொடர்புகொள்ள உதவுங்கள்.",
  ],
  "Your current saved page has been reviewed.": [
    "දැනට සුරැකි පිටුව පරීක්ෂා කර ඇත.",
    "தற்போது சேமித்த பக்கம் சரிபார்க்கப்பட்டது.",
  ],
  "Your page is visible to customers.": [
    "ඔබගේ පිටුව පාරිභෝගිකයන්ට පෙනේ.",
    "உங்கள் பக்கம் வாடிக்கையாளர்களுக்குத் தெரிகிறது.",
  ],
  "Finish these requirements to make your page visible.": [
    "පිටුව පෙන්වීමට මෙම අවශ්‍යතා සම්පූර්ණ කරන්න.",
    "பக்கத்தைக் காட்ட இந்தத் தேவைகளை முடிக்கவும்.",
  ],
  "Your page is ready. Publish when you are happy with it.": [
    "පිටුව සූදානම්. ඔබ සෑහීමකට පත් වූ විට ප්‍රකාශයට පත් කරන්න.",
    "பக்கம் தயார். திருப்தியானதும் வெளியிடவும்.",
  ],
  "Write a short business introduction": [
    "ව්‍යාපාරය ගැන කෙටි හැඳින්වීමක් ලියන්න",
    "வணிகத்தைப் பற்றிய சுருக்கமான அறிமுகத்தை எழுதவும்",
  ],
  "Partner Onboarding": ["ව්‍යාපාරය ලියාපදිංචි කිරීම", "வணிகப் பதிவு"],
  "Complete your profile to start accepting bookings.": [
    "පාරිභෝගිකයන්ට ඔබගේ සේවාවන් හඳුන්වා දීමට පැතිකඩ සම්පූර්ණ කරන්න.",
    "வாடிக்கையாளர்களுக்கு உங்கள் சேவைகளை அறிமுகப்படுத்த சுயவிவரத்தை முடிக்கவும்.",
  ],
  "Business Info": ["ව්‍යාපාර තොරතුරු", "வணிக விவரங்கள்"],
  Category: ["කාණ්ඩය", "வகை"],
  Location: ["ස්ථානය", "இடம்"],
  Media: ["ඡායාරූප", "புகைப்படங்கள்"],
  Review: ["පරීක්ෂා කිරීම", "சரிபார்ப்பு"],
  "Step 1: Business Information": [
    "පියවර 1: ව්‍යාපාර තොරතුරු",
    "படி 1: வணிக விவரங்கள்",
  ],
  "Step 2: Business Category": ["පියවර 2: ව්‍යාපාර කාණ්ඩය", "படி 2: வணிக வகை"],
  "Step 3: Location": ["පියවර 3: ස්ථානය", "படி 3: இடம்"],
  "Step 4: Branding (Optional for now)": [
    "පියවර 4: ලාංඡනය සහ කවරය (දැනට විකල්පයි)",
    "படி 4: சின்னமும் அட்டையும் (இப்போது விருப்பமானது)",
  ],
  "Step 5: Review & Submit": [
    "පියවර 5: පරීක්ෂා කර යවන්න",
    "படி 5: சரிபார்த்து அனுப்பவும்",
  ],
  "Business Name": ["ව්‍යාපාර නම", "வணிகப் பெயர்"],
  Description: ["විස්තරය", "விளக்கம்"],
  "Street Address": ["ලිපිනය", "முகவரி"],
  City: ["නගරය", "நகரம்"],
  District: ["දිස්ත්‍රික්කය", "மாவட்டம்"],
  Province: ["පළාත", "மாகாணம்"],
  "Zip Code": ["තැපැල් කේතය", "அஞ்சல் குறியீடு"],
  "Business Logo": ["ව්‍යාපාර ලාංඡනය", "வணிகச் சின்னம்"],
  "Cover Image": ["කවරයේ ඡායාරූපය", "அட்டைப் புகைப்படம்"],
  "Upload Logo": ["ලාංඡනය එක් කරන්න", "சின்னத்தைப் பதிவேற்றவும்"],
  "Upload Cover Image": [
    "කවරයේ ඡායාරූපය එක් කරන්න",
    "அட்டைப் புகைப்படத்தைப் பதிவேற்றவும்",
  ],
  "Ready to join Nakathata.lk?": [
    "Nakathata.lk සමඟ එක්වීමට සූදානම්ද?",
    "Nakathata.lk இல் இணையத் தயாரா?",
  ],
  "By submitting this application, our administrative team will review your business details. Once approved, you will gain full access to the vendor dashboard to manage packages, bookings, and your public gallery.":
    [
      "අයදුම්පත යැවූ පසු අපගේ කණ්ඩායම ඔබගේ ව්‍යාපාර තොරතුරු පරීක්ෂා කරයි. අනුමැතිය ලැබුණු විට සේවා, වෙන් කිරීම් සහ ඡායාරූප කළමනාකරණය කළ හැකිය.",
      "விண்ணப்பத்தை அனுப்பியதும் எங்கள் குழு உங்கள் வணிக விவரங்களைப் பரிசீலிக்கும். ஒப்புதல் கிடைத்ததும் சேவைகள், முன்பதிவுகள் மற்றும் புகைப்படங்களை நிர்வகிக்கலாம்.",
    ],
  Back: ["ආපසු", "பின்செல்லவும்"],
  Next: ["ඊළඟ", "அடுத்து"],
  "Submit Application": ["අයදුම්පත යවන්න", "விண்ணப்பத்தை அனுப்பவும்"],
  "Submitting...": ["යවමින්…", "அனுப்பப்படுகிறது…"],
  "Please select a Business Category in Step 2.": [
    "පියවර 2හි ව්‍යාපාර කාණ්ඩයක් තෝරන්න.",
    "படி 2 இல் வணிக வகையைத் தேர்ந்தெடுக்கவும்.",
  ],
  "Please fill in all required fields in Step 1.": [
    "පියවර 1හි අනිවාර්ය තොරතුරු සියල්ල ඇතුළත් කරන්න.",
    "படி 1 இல் தேவையான அனைத்து விவரங்களையும் உள்ளிடவும்.",
  ],
  "Application submitted successfully!": [
    "අයදුම්පත සාර්ථකව යවන ලදී!",
    "விண்ணப்பம் வெற்றிகரமாக அனுப்பப்பட்டது!",
  ],
  "Failed to submit application": [
    "අයදුම්පත යැවීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    "விண்ணப்பத்தை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  ],
  "Image size must be less than 5MB": [
    "ඡායාරූපය 5MBට වඩා කුඩා විය යුතුය",
    "படத்தின் அளவு 5MB க்கு குறைவாக இருக்க வேண்டும்",
  ],
  "Uploading photo…": [
    "ඡායාරූපය එක් කරමින්…",
    "புகைப்படம் பதிவேற்றப்படுகிறது…",
  ],
  "Upload complete": ["එක් කිරීම සම්පූර්ණයි", "பதிவேற்றம் முடிந்தது"],
  "Upload failed": ["එක් කිරීම අසාර්ථක විය", "பதிவேற்றம் தோல்வியடைந்தது"],
  "Verify your email": [
    "ඊමේල් ලිපිනය තහවුරු කරන්න",
    "மின்னஞ்சலை உறுதிப்படுத்தவும்",
  ],
  "We've sent a 6-digit verification code to your email address. Please enter it below to continue.":
    [
      "ඉලක්කම් 6ක කේතයක් ඔබගේ ඊමේල් ලිපිනයට යවා ඇත. ඉදිරියට යාමට එය පහතින් ඇතුළත් කරන්න.",
      "6 இலக்க உறுதிப்படுத்தல் குறியீடு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுள்ளது. தொடர அதைக் கீழே உள்ளிடவும்.",
    ],
  "Enter 6-digit code": [
    "ඉලක්කම් 6ක කේතය ඇතුළත් කරන්න",
    "6 இலக்க குறியீட்டை உள்ளிடவும்",
  ],
  "Verify Email": ["ඊමේල් තහවුරු කරන්න", "மின்னஞ்சலை உறுதிப்படுத்தவும்"],
  "Verifying...": ["තහවුරු කරමින්…", "உறுதிப்படுத்தப்படுகிறது…"],
  "Didn't receive the code?": [
    "කේතය ලැබුණේ නැද්ද?",
    "குறியீடு கிடைக்கவில்லையா?",
  ],
  "Resend Code": ["කේතය නැවත යවන්න", "குறியீட்டை மீண்டும் அனுப்பவும்"],
  "Sending...": ["යවමින්…", "அனுப்பப்படுகிறது…"],
  "Verification code sent to your email.": [
    "තහවුරු කිරීමේ කේතය ඊමේල් වෙත යවන ලදී.",
    "உறுதிப்படுத்தல் குறியீடு மின்னஞ்சலுக்கு அனுப்பப்பட்டது.",
  ],
  "Failed to send verification code.": [
    "කේතය යැවීමට නොහැකි විය. නැවත උත්සාහ කරන්න.",
    "குறியீட்டை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  ],
  "Please enter a valid 6-digit code.": [
    "වලංගු ඉලක්කම් 6ක කේතයක් ඇතුළත් කරන්න.",
    "சரியான 6 இலக்க குறியீட்டை உள்ளிடவும்.",
  ],
  "Email verified successfully!": [
    "ඊමේල් ලිපිනය තහවුරු කරන ලදී!",
    "மின்னஞ்சல் உறுதிப்படுத்தப்பட்டது!",
  ],
  "Failed to verify email.": [
    "ඊමේල් තහවුරු කළ නොහැකි විය. නැවත උත්සාහ කරන්න.",
    "மின்னஞ்சலை உறுதிப்படுத்த முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  ],
  "Language support is being added gradually. Other pages and category names may still be in English.":
    [
      "භාෂා සහාය ක්‍රමයෙන් එක් කරමින් පවතී. වෙනත් පිටු සහ කාණ්ඩ නාම තවමත් ඉංග්‍රීසියෙන් තිබිය හැකිය.",
      "மொழி ஆதரவு படிப்படியாகச் சேர்க்கப்படுகிறது. மற்ற பக்கங்களும் வகைப் பெயர்களும் இன்னும் ஆங்கிலத்தில் இருக்கலாம்.",
    ],
};

export function translate(
  language: Language,
  text: string,
  values: Record<string, string | number> = {},
) {
  const translated =
    language === "en"
      ? text
      : phrases[text]?.[language === "si" ? 0 : 1] || text;
  return translated.replace(/\{(\w+)\}/g, (match, key) =>
    String(values[key] ?? match),
  );
}
const Context = createContext<{
  language: Language;
  setLanguage: (value: Language) => void;
  t: (text: string, values?: Record<string, string | number>) => string;
} | null>(null);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, update] = useState<Language>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nakathata.language");
      if (saved === "si" || saved === "ta") update(saved);
    } catch {
      /* Storage is optional. */
    }
    function sync(event: StorageEvent) {
      if (event.key === "nakathata.language")
        update(
          event.newValue === "si" || event.newValue === "ta"
            ? event.newValue
            : "en",
        );
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return (
    <Context.Provider
      value={{
        language,
        setLanguage(value) {
          update(value);
          try {
            localStorage.setItem("nakathata.language", value);
          } catch {}
        },
        t: (text, values) => translate(language, text, values),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLanguage() {
  const context = useContext(Context);
  if (!context) throw new Error("LanguageProvider is required");
  return context;
}
export function LanguageSwitch({ disabled = false }: { disabled?: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="mb-4">
      <fieldset
        disabled={disabled}
        className="flex flex-wrap items-center gap-2"
        aria-label="Form language"
      >
        <legend className="sr-only">Form language</legend>
        {(
          [
            ["en", "English"],
            ["si", "සිංහල"],
            ["ta", "தமிழ்"],
          ] as const
        ).map(([code, label]) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={language === code}
            onClick={() => setLanguage(code)}
            className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium ${language === code ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"}`}
          >
            {label}
          </button>
        ))}
      </fieldset>
      {language !== "en" && (
        <p
          lang={language}
          className="mt-2 text-xs leading-relaxed text-slate-500"
        >
          {t(
            "Language support is being added gradually. Other pages and category names may still be in English.",
          )}
        </p>
      )}
    </div>
  );
}
