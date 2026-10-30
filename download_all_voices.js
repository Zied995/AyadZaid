const fs = require('fs');
const path = require('path');
const https = require('https');

const audioDir = path.join(__dirname, 'assets', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

function downloadTTS(text, lang, filename) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`;
    const dest = path.join(audioDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(); // already exists
    }

    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded: ${filename} ("${text}")`);
          setTimeout(resolve, 80); // gentle rate limit
        });
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err);
      resolve();
    });
  });
}

async function main() {
  console.log('Downloading Arabic & English voices...');

  // 1. Mickey Mouse Voice lines
  await downloadTTS('مرحباً بك يا إياد زيد! أنا صديقك ميكي ماوس، هيا بنا نتعلم ونلعب معاً يا بطل!', 'ar', 'mickey_welcome.mp3');
  await downloadTTS('أحسنت يا بطل إياد! إجابة صحيحة وممتازة!', 'ar', 'mickey_correct.mp3');
  await downloadTTS('حاول مرة أخرى يا إياد، عد الأشكال بهدوء!', 'ar', 'mickey_try.mp3');
  await downloadTTS('ألف مبروك يا إياد زيد! ميكي فخور بك جداً!', 'ar', 'mickey_congrats.mp3');

  // 2. Arabic Numbers 1 to 20
  const arNums = [
    'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'
  ];
  for (let i = 0; i < arNums.length; i++) {
    await downloadTTS(arNums[i], 'ar', `ar_num_${i + 1}.mp3`);
  }

  // 3. Arabic Alphabet 28 Letters
  const arLetters = [
    'ألف، أسد', 'باء، بطة', 'تاء، تفاحة', 'ثاء، ثعلب', 'جيم، جمل', 'حاء، حصان',
    'خاء، خروف', 'دال، دب', 'ذال، ذئب', 'راء، رمان', 'زاي، زرافة', 'سين، سمكة',
    'شين، شجرة', 'صاد، صقر', 'ضاد، ضفدع', 'طاء، طائرة', 'ظاء، ظبي', 'عين، عصفور',
    'غين، غزال', 'فاء، فيل', 'قاف، قرد', 'كاف، كلب', 'لام، ليمون', 'ميم، موز',
    'نون، نحلة', 'هاء، هدهد', 'واو، وردة', 'ياء، يمامة'
  ];
  for (let i = 0; i < arLetters.length; i++) {
    await downloadTTS(arLetters[i], 'ar', `ar_letter_${i}.mp3`);
  }

  // 4. English Alphabet (A to Z)
  const enLetters = [
    'A is for Apple', 'B is for Ball', 'C is for Cat', 'D is for Duck', 'E is for Elephant',
    'F is for Fish', 'G is for Giraffe', 'H is for Horse', 'I is for Ice Cream', 'J is for Juice',
    'K is for Kite', 'L is for Lion', 'M is for Monkey', 'N is for Nest', 'O is for Orange',
    'P is for Pencil', 'Q is for Queen', 'R is for Rainbow', 'S is for Star', 'T is for Train',
    'U is for Umbrella', 'V is for Van', 'W is for Watch', 'X is for Xylophone', 'Y is for Yo-Yo', 'Z is for Zebra'
  ];
  const alphaChars = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < enLetters.length; i++) {
    await downloadTTS(enLetters[i], 'en', `en_letter_${alphaChars[i]}.mp3`);
  }

  // 5. English Numbers 1 to 20
  const enNums = [
    'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
  ];
  for (let i = 0; i < enNums.length; i++) {
    await downloadTTS(enNums[i], 'en', `en_num_${i + 1}.mp3`);
  }

  console.log('All Arabic & English voices downloaded successfully!');
}

main();
