# Faisal — Quantum Observatory

এই ZIP সম্পূর্ণ static website। কোনো paid hosting, API key বা build command লাগে না।

## আগে নিজের computer-এ দেখুন

ZIP extract করে `index.html` browser-এ খুলুন। সব assets relative path-এ আছে। Font load না হলে readable fallback font দেখাবে।

## GitHub Pages-এ publish

1. বর্তমান website রাখতে চাইলে নতুন public repository তৈরি করুন, যেমন `portfolio-observatory-test`।
2. ZIP extract করুন। Extracted folder-এর ভেতরের `index.html`, `assets`, `files`, `.nojekyll` ও অন্যান্য files repository root-এ upload করুন। ZIP file সরাসরি upload করলে website হবে না।
3. Commit changes চাপুন।
4. Repository → Settings → Pages → Deploy from a branch নির্বাচন করুন।
5. `main` এবং `/(root)` নির্বাচন করে Save করুন।
6. Deployment শেষ হলে Pages settings-এ website URL পাবেন।

একই repository update করলে একই filename ও folder path ব্যবহার করুন। পুরোনো website বদলাতে না চাইলে পুরোনো repository-তে upload করবেন না।

## সহজে edit

- লেখা ও links: `index.html`
- রং, layout ও responsive styles: `assets/styles.css`
- transition, clocks, filters ও controls: `assets/app.js`
- educational QEC model: `assets/qec-model.js`
- Profile ও gallery: `assets` folder-এর ছবি; একই filename রাখলে নতুন ছবি বসবে।
- CV: `files/Faisal_Ahmed_Chowdhury_CV.pdf`

## পাঁচ ধাপের demo

Encode → Noise → Syndrome → Decode → Correct.

Guided tour pause/play করা যায়। প্রতিটি step click করা যায়। Data qubit click বা Inject error দিয়ে X error যোগ করুন, তারপর Syndrome, Decode ও Correct দেখুন। Keyboard-এ arrow keys দিয়ে step বদলানো যায়।

এটি distance-3 rotated surface code-এর X-error sector, ideal Z checks ও minimum-weight lookup-এর educational model। Full circuit-level, repeated-round বা real-time hardware benchmark নয়। Simulator injected error জানে; actual decoder শুধু syndrome দেখে। Zero syndrome হলেও logical error থাকতে পারে—demo সেটি সঠিকভাবে দেখায়।

## যাচাই

JavaScript syntax, local assets, anchors, HTML IDs, CSS brace balance, decoder-এর 512 pattern ও minimum-weight lookup, stabilizer commutation, single-error recovery এবং DOM control behavior পরীক্ষা করা হয়েছে। এই পরিবেশে visual browser QA উপলব্ধ ছিল না। Publish করার পরে desktop ও phone-এ একবার দেখুন।

Theme, publication filter, mobile navigation, copy-email ও reduced-motion support আছে। Gallery images static; পুরো ছবি same-size frame-এ থাকে।

## Compact landing update

প্রথম পাতায় Ph.D. opportunities badge, বড় profile identity, Lamar University, Beaumont, Texas, email ও live CT time সামনে আছে। Research-interest chips ও compact headline যোগ করা হয়েছে। আগের quantum background, পাঁচ-step animation, decoder model ও controls অপরিবর্তিত রাখা হয়েছে।

## Requested UI refinements

ছয়টি shortcut mint button, hero details বড় font, dark About ও চারটি focus card, compact project/publication/gallery spacing এবং same-size static gallery frames যোগ করা হয়েছে।

Modern flying saucer এসে canopy খুলে বড় clickable My Publications bubble release করে। প্রায় ২–৩ সেকেন্ডে bubble বের হয়, saucer চলে গিয়ে fade হয়, bubble ওপরে ওঠে, এবং ১২ সেকেন্ডের cycle আবার শুরু হয়। Hover/focus করলে link সহজে click করার জন্য animation pause হয়। Motion paused বা reduced-motion preference থাকলে circle স্থির অবস্থায় পাওয়া যায়।

Hatch refinement: bubble-এর centre saucer-এর SVG hatch (150,108)-এর সঙ্গে responsive ভাবে মিলে। Canopy আগে পাশের দিকে খোলে, bubble hatch থেকে বের হয়ে সম্পূর্ণ ওঠে, তারপর saucer departure শুরু করে। Project labels ও দ্বিতীয় project-এর muted-blue palette, slightly bolder project titles, gallery labels এবং Research & Industry / Education-এর নির্দিষ্ট full stop আপডেট করা হয়েছে।

Latest bubble polish: rectangular clipping সরানো হয়েছে; bubble ও keyboard focus ring গোল থাকে। ১২ সেকেন্ডের flight cycle ও hatch-release timing একই রেখে bubble-এর visible সময় ৭.৯২ থেকে ৬.৩৩৬ সেকেন্ড করা হয়েছে—২০% কম। Heading এখন Quantum Error-Correction Steps; heading ও conference labels সামান্য বড় ও bold।

Publication ও contact polish: Conference workshop, Conference paper, Best Poster Award এবং Journal manuscript একই বড় bold font ব্যবহার করে। Experience & Education label ও চারটি date বড় ও bold; contact availability ও description বড় bold। Contact email-এ envelope icon আছে; email ও View CV-এর arrow সরানো। Copy email এবং View CV প্রথম পাতার mint button style ব্যবহার করে।

Label polish: hero-এর Quantum computing · Lamar University ও gallery-এর BEYOND THE SIMULATIONS সরানো হয়েছে। Seeking Ph.D. Opportunities ও Papers & Preprints capitalization আপডেট। প্রথম দুই project caption, Best Poster badge, Inside the research, industrial-systems label এবং Current marker বড় করা হয়েছে। Hadi-এর ছবির display size একটু বড়, heading-এর শেষ dot সরানো; INQILAB ZINDABAD, clock units, since-time label এবং contact availability বড় ও bold। Live clock অপরিবর্তিত।

Landing ও link polish: পাঁচটি step name uppercase, stage tag একটু বড়; opportunity badge-এ Summer Internships যোগ। Header CV-এর arrow সরানো হয়েছে। Hero buttons ও ছয়টি shortcut-এর font সামান্য বড়; IEEE QCE ও Photonics badge bold। Selected work-এর চারটি link একই mint box-এ এবং arrow ছাড়া। Footer copyright ও Back to the top-এর font বড়।

Final type polish: প্রথম পাতায় Doctor of Engineering Student-এ বড় হাতের S; Aiming to design fast, reliable quantum decoders. লাইনটির font একটু বড়। Footer copyright ও Back to the top আরও একটু বড় এবং medium weight।

Ongoing Project dropdown-এ Project 1, 2 ও 3 আলাদা slot আছে। Project details না দেওয়া পর্যন্ত Details coming soon দেখাবে।

Schedule a meeting button Microsoft Teams-এর meeting scheduling dialog খোলে, Faisal-এর Lamar email attendee হিসেবে রাখে। Visitor নিজের Teams account-এ সময় নির্বাচন করে invitation পাঠাবে। এটি automatic booking বা availability calendar নয়। Microsoft-এর documented deep-link format ব্যবহার করা হয়েছে; Lamar account দিয়ে end-to-end scheduling যাচাই করা হয়নি।

Latest requested refinements: optional hint/illustration lines ও specified arrows সরানো, বড় portrait, full-name About signature, bold research direction, mint publication links, colorful toolkit chips এবং বড় equal-size gallery frames। Gallery frame পূর্ণ করতে edges crop করা হয়; original photo files অপরিবর্তিত আছে।
