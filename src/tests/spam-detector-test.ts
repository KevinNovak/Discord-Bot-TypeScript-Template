import { SpamDetector, isSpam } from '../utils/spam-detector.js';

// Create an instance of the detector
const detector = new SpamDetector();

// Test phrases in different languages
const testPhrases = [
    // 1. Excessive uppercase - should trigger uppercase rule
    "HEY EVERYONE LOOK AT THIS AMAZING OFFER I FOUND TODAY!!! YOU WON'T BELIEVE IT!!!",
    
    // 2. Repeated characters - should trigger character repetition rules
    "Hellooooooooooooooo guyyyyyyyyyssssss whaaaaaaaaaaat's uppppppppp???????????",
    
    // 3. Zalgo text - should trigger zalgo detection
    "T̷̨̮̼̙̰̩̫̣̯̺̱̖̺͔̟̆̾̏̈́̃͐̀̔͂͘h̴̢̢̛̛̺̦̯̲̤͔̱̙̺͇̮͋̓̽̎̉̓̆̈́̚i̴̧̟̞̘̮̼̖̣̟̖̯̬̭̽̋̓͌́͋̔͒s̸̡͇̰̟̭͂̀̌͑̌̐͑̄̽͌̊̍̀̚ i̷̗̜̱̭̺̾̄s̷̢̛̩̱̖̦̦̙̠̺̐͂̓̈́͗͂́̃̑̓̑̋̚͠ͅ z̷̧͔̫̩̥͎̞͎͙̩̦̗̟̼͊̿̆a̸̤̫̰̳̯̭̮̻͒̎̐̄͛̾́͝l̵̞̞̞̯̫̩̮̦̪̺̑̆̊̋̚ģ̷̪̫̣͎̖̺́̀̉̎͆̾̽̈́̕̚͜o̵̱̣̞̳͕̯͗̾̄̈̍̅̂̑͊̊̌̎̕͜͝",
    
    // 4. Excessive special characters
    "!!! $$$ W!N FR33 M0N3Y N0W $$$ C@LL 1-800-N0T-R3@L !!! $$$ CL!CK H3R3 !!! $$$",
    
    // 5. Very long words (gibberish)
    "supercalifragilisticexpialidociousantidisestablishmentarianismfloccinaucinihilipilificationpneumonoultramicroscopicsilicovolcanoconiosis",
    
    // 6. Normal Chinese text - should NOT trigger spam detection
    "你好，我叫王小明。我今年25岁，来自中国北京。我喜欢读书和旅行。",
    
    // 7. Normal Japanese text - should NOT trigger spam detection
    "こんにちは、私の名前は田中です。東京に住んでいます。趣味は音楽を聴くことです。",
    
    // 8. Normal Korean text - should NOT trigger spam detection
    "안녕하세요, 저는 김민수입니다. 서울에 살고 있어요. 취미는 요리하는 것입니다.",
    
    // 9. Normal Russian text - should NOT trigger spam detection
    "Привет! Меня зовут Иван. Я живу в Москве и работаю программистом.",
    
    // 10. Normal Arabic text - should NOT trigger spam detection
    "مرحبا، اسمي أحمد. أنا أعيش في القاهرة وأعمل مهندسا."
];

// Test each phrase and log results
console.log("===== SPAM DETECTOR TEST =====\n");

testPhrases.forEach((phrase, index) => {
    console.log(`--- Test ${index + 1} ---`);
    console.log(`Phrase: ${phrase.substring(0, 50)}${phrase.length > 50 ? '...' : ''}`);
    
    const result = detector.detectSpam(phrase);
    
    console.log(`Is spam: ${result.isSpam ? 'YES' : 'NO'}`);
    
    if (result.isSpam) {
        console.log("Reasons:");
        result.reasons.forEach(reason => console.log(`- ${reason}`));
    }
    
    console.log("Statistics:");
    Object.entries(result.statistics).forEach(([key, value]) => {
        if (key === 'detectedLanguageScripts' && Array.isArray(value)) {
            console.log(`- ${key}: ${value.join(', ')}`);
        } else {
            console.log(`- ${key}: ${value}`);
        }
    });
    
    console.log("\n");
});