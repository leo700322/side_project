// Built-in curriculum trees, sample quests, and initial tracking data for EasyLearn
// Supports Elementary, Junior High (Kang Hsuan, Han Lin, Nan I), Senior High, and Adult/University

window.EASYLEARN_DATA = {
  // Default user profile and polygon stats
  defaultProfile: {
    currentStage: "adult", // "elem", "junior", "senior", "adult"
    xp: 320,
    coins: 85,
    streakDays: 4,
    bestCombo: 7,
    // 6-axis Brain Learning Power (0-100)
    brainStats: {
      comprehension: 72, // Stage 1: Chunking & understanding
      recall: 68,        // Stage 2: Active recall accuracy
      teaching: 64,      // Stage 3: Feynman teaching & error spotting
      retention: 58,     // Stage 4: 1/3/7/14 day spaced retention
      application: 62,   // Stage 5: Real-world transfer
      resilience: 78     // ADHD focus & bounce-back from mistakes
    },
    // Baseline stats to show polygon growth animation
    brainStatsBaseline: {
      comprehension: 55,
      recall: 48,
      teaching: 45,
      retention: 40,
      application: 45,
      resilience: 52
    },
    // 6-axis Subject Power (0-100)
    subjectStats: {
      engListening: 76,
      engReading: 65,
      math: 62,
      science: 70,
      mandarin: 68,
      coding: 60
    }
  },

  // Stage metadata for audience switcher
  stages: [
    {
      id: "adult",
      label: "成人／大學／研究所",
      badge: "MVP 主力・自學與證照",
      desc: "實用英文聽說（reservation 等）、程式邏輯、論文與專業筆記轉闖關卡"
    },
    {
      id: "junior",
      label: "國中（康軒・翰林・南一）",
      badge: "108 課綱三大版本",
      desc: "國七～國九：數學、英文、自然、國文三大出版社章節骨架與核心觀念闖關"
    },
    {
      id: "elem",
      label: "國小（康軒・翰林・南一）",
      badge: "ADHD 友善闖關",
      desc: "小三～小六：短時間、高回饋、零紅叉挫敗感的基礎觀念養成"
    },
    {
      id: "senior",
      label: "高中（108 課綱部定必修）",
      badge: "學測核心骨架",
      desc: "高一～高三：部定必修章節骨架、核心英單 4500/7000 與跨科理解"
    }
  ],

  // One-click curriculum skeletons for Elementary, Junior High (3 publishers), Senior High, and Adult/Uni
  curriculumCatalog: [
    // Junior High - Kang Hsuan / Han Lin / Nan I
    {
      id: "jh-hanlin-math-7a",
      stage: "junior",
      publisher: "翰林版",
      grade: "七年級上",
      subject: "數學",
      units: [
        {
          unitId: "u-jh-math-1",
          unitTitle: "第 1 單元：整數的運算與科學記號",
          chapters: [
            { chapId: "q-jh-math-neg", title: "1-1 正負數與絕對值", hasBuiltInQuest: true },
            { chapId: "q-jh-math-add", title: "1-2 正負數的加減（欠錢還錢法）", hasBuiltInQuest: false }
          ]
        },
        {
          unitId: "u-jh-math-2",
          unitTitle: "第 2 單元：因數分解與分數運算",
          chapters: [
            { chapId: "q-jh-math-gcd", title: "2-1 質因數分解與最大公因數", hasBuiltInQuest: true }
          ]
        },
        {
          unitId: "u-jh-math-3",
          unitTitle: "第 3 單元：一元一次方程式",
          chapters: [
            { chapId: "q-jh-math-eq", title: "3-2 等量公理與移項法則", hasBuiltInQuest: true }
          ]
        }
      ]
    },
    {
      id: "jh-kanghsuan-eng-8a",
      stage: "junior",
      publisher: "康軒版",
      grade: "八年級上",
      subject: "英文（讀寫／聽說）",
      units: [
        {
          unitId: "u-jh-eng-1",
          unitTitle: "Unit 1–2：過去進行式與連接詞 when/while",
          chapters: [
            { chapId: "q-jh-eng-when", title: "L2：when 與 while 的長短動作搭配", hasBuiltInQuest: true }
          ]
        },
        {
          unitId: "u-jh-eng-2",
          unitTitle: "Unit 3–4：不定詞與動名詞 (to V vs. V-ing)",
          chapters: [
            { chapId: "q-jh-eng-gerund", title: "L3：哪些動詞後面只能接 V-ing？", hasBuiltInQuest: false }
          ]
        }
      ]
    },
    {
      id: "jh-nani-sci-8a",
      stage: "junior",
      publisher: "南一版",
      grade: "八年級下",
      subject: "自然科學（理化）",
      units: [
        {
          unitId: "u-jh-sci-1",
          unitTitle: "第 3 單元：電解質與酸鹼反應",
          chapters: [
            { chapId: "q-jh-sci-acid", title: "3-2 酸鹼濃度與 pH 值核心觀念", hasBuiltInQuest: true }
          ]
        },
        {
          unitId: "u-jh-sci-2",
          unitTitle: "第 6 單元：力與壓力",
          chapters: [
            { chapId: "q-jh-sci-force", title: "6-1 摩擦力與壓力面積關係", hasBuiltInQuest: true }
          ]
        }
      ]
    },
    // Elementary - 3 Publishers
    {
      id: "el-hanlin-math-5a",
      stage: "elem",
      publisher: "翰林／康軒／南一共通",
      grade: "五年級上",
      subject: "數學",
      units: [
        {
          unitId: "u-el-math-fraction",
          unitTitle: "第 4 單元：擴分、約分與異分母分數加減",
          chapters: [
            { chapId: "q-el-math-frac", title: "4-2 通分：把披薩切成一樣大塊再加", hasBuiltInQuest: true }
          ]
        }
      ]
    },
    // Senior High - 108 Curriculum
    {
      id: "sh-108-eng-core",
      stage: "senior",
      publisher: "教育部 108 課綱必修",
      grade: "高一～高二",
      subject: "英文（核心單字與句型）",
      units: [
        {
          unitId: "u-sh-eng-vocab",
          unitTitle: "學測高頻核心字彙 Level 3–4",
          chapters: [
            { chapId: "q-adult-eng-reservation", title: "字彙組塊：reservation /预约與保留", hasBuiltInQuest: true }
          ]
        }
      ]
    },
    // Adult / University / Graduate
    {
      id: "adult-eng-survival",
      stage: "adult",
      publisher: "成人實戰模組（MVP 預設）",
      grade: "成人／通用",
      subject: "英文（聽說）",
      units: [
        {
          unitId: "u-adult-eng-travel",
          unitTitle: "單元 1：餐廳訂位與飯店入住聽說",
          chapters: [
            { chapId: "q-adult-eng-reservation", title: "核心單字與句型：reservation（訂位／預約）", hasBuiltInQuest: true },
            { chapId: "q-adult-eng-reschedule", title: "核心單字與句型：reschedule（改期／重排時間）", hasBuiltInQuest: true }
          ]
        }
      ]
    },
    {
      id: "adult-python-core",
      stage: "adult",
      publisher: "成人／大學資訊模組",
      grade: "初學～進階",
      subject: "程式語言（Python）",
      units: [
        {
          unitId: "u-adult-py-loop",
          unitTitle: "單元 1：清單與迴圈自動化",
          chapters: [
            { chapId: "q-adult-py-dict", title: "核心觀念：Dictionary 字典查詢（不用從頭翻到尾）", hasBuiltInQuest: true }
          ]
        }
      ]
    }
  ],

  // Full playable quests following the 5-stage + Barbara Oakley framework
  quests: [
    // 1. MVP Core Quest from Jay's Excel: English "reservation"
    {
      id: "q-adult-eng-reservation",
      stage: "adult",
      subject: "英文（聽說）",
      subjectKey: "engListening",
      publisher: "成人實戰／Excel MVP 範例",
      unitId: "u-adult-eng-travel",
      unitTitle: "單元 1：餐廳訂位與飯店入住聽說",
      title: "單字與句型：reservation（預約／訂位）",
      estimatedMinutes: 5,
      // Step 0: 10-second icebreaker to trigger instant dopamine
      icebreaker: {
        question: "【10秒無痛破冰】走進客滿的熱門餐廳，服務生第一句常問你有沒有先做什麼？",
        options: [
          "有沒有先訂位 (Reservation)",
          "有沒有先洗碗",
          "有沒有帶睡袋"
        ],
        correctIndex: 0,
        encouragement: "太棒了！大腦已經開機完成，先領 +10 金幣！"
      },
      // Step 1: Learn (Chunking + Real-life Metaphor + TTS audio)
      learn: {
        corePoint: "reservation (名詞 /ˌrez.ɚˈveɪ.ʃən/) ＝ 先請店家幫你「保留 (reserve)」位置。常用搭配：make a reservation（訂位）、have a reservation（有訂位）。",
        speakText: "I have a reservation under the name Jay.",
        speakMeaning: "我有訂位，名字是 Jay。",
        metaphor: "💡 大腦記憶組塊比喻：把 re-serv-ation 想成「先把座位 (seat) 鎖進保險箱保留 (serve) 起來」，注意動詞用 make 或 have，不說 do a reservation！",
        keyTakeaways: [
          "聽音辨義：聽到 /rez-er-VAY-shun/ 就是問「訂位／預約」",
          "開口必用句：I'd like to make a reservation for two.（我想訂兩位）",
          "報到必用句：I have a reservation under [名字]."
        ]
      },
      // Step 2: 3-step Scaffolded Practice (Example -> Half-prompt -> Independent)
      practices: [
        {
          level: "Step 1/3 看範例跟練（低負荷）",
          type: "choice",
          exampleBox: "範例：I'd like to **make a reservation** for tonight.（我想訂今晚的位置 → 搭配動詞 make）",
          prompt: "看上方範例，如果你想跟餐廳說「我想訂兩位」，空格該填哪個動詞？\nI'd like to ____ a reservation for two.",
          options: ["make", "do", "play"],
          correctIndex: 0,
          hint: "想想看剛剛的範例：訂位是「創造一筆預約」，用 m 開頭的字喔！"
        },
        {
          level: "Step 2/3 半提示回想（挖空提取）",
          type: "choice",
          exampleBox: "提示：字根 serv 是保留，字尾 -ation 是名詞。",
          prompt: "當你抵達飯店櫃檯，想說「我有訂房，名字是 Jay」：\nI have a r _ s _ r v a t i o n under Jay.",
          options: ["reservation", "conversation", "station"],
          correctIndex: 0,
          hint: "把座位「保留 (reserve)」下來的名詞是哪一個呢？"
        },
        {
          level: "Step 3/3 獨立聽說挑戰（不看提示）",
          type: "choice",
          exampleBox: "",
          prompt: "服務生問你：\"Do you have a reservation?\" 最自然且正確的回答是？",
          options: [
            "Yes, I have a reservation for two at 7 PM.",
            "Yes, I do a reservation yesterday.",
            "No, I am reservation."
          ],
          correctIndex: 0,
          hint: "記得「有訂位」是 have a reservation，而且 reservation 是名詞不是形容詞喔！"
        }
      ],
      // Step 3: Teach AI Buddy (Gate >= 80% accuracy)
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡說：「太好了！那我今天晚上去餐廳，就跟店員大聲說：**I do a reservation for 4 people!** 而且 reservation 是動詞對吧？」",
        taskPrompt: "小泡犯了兩個典型錯誤！請當小老師幫他挑出正確的糾正方式：",
        options: [
          "小泡，reservation 是「名詞」喔！而且搭配的動詞要用 make a reservation 或 have a reservation，不能用 do！",
          "小泡講得完全正確，直接去餐廳這樣講就可以了！",
          "reservation 是形容詞，應該說 I am very reservation。"
        ],
        correctIndex: 0,
        buddySuccessReply: "哇！原來 reservation 是名詞，而且要配 make 或 have！你講得超清楚，我一下子就記住了！🎉",
        aiSystemContext: "你是一位呆萌但好學的 AI 學生小泡，正在學英文單字 reservation。你剛才誤以為可以說 'I do a reservation'。請讓使用者用他自己的話教你為什麼錯、正確該怎麼說。如果使用者解釋對了，請熱情稱讚他並總結自己學到了什麼；如果他講錯了，請溫柔追問。"
      },
      // Step 4 & 5: Spaced Repetition Variant & Real-world Application
      reviewVariant: {
        prompt: "【間隔複習變化題＋情境應用】你在東京的餐廳想跟店員確認「我昨晚有在網路上訂位」，哪句話最道地？",
        options: [
          "I made a reservation online last night.",
          "I did a reserve on internet night.",
          "I have a conversation for table."
        ],
        correctIndex: 0,
        explanation: "過去已經完成「訂位」這個動作，把 make a reservation 變成過去式 made a reservation 就對了！"
      }
    },

    // 2. Adult English #2: reschedule
    {
      id: "q-adult-eng-reschedule",
      stage: "adult",
      subject: "英文（聽說）",
      subjectKey: "engListening",
      publisher: "成人實戰模組",
      unitId: "u-adult-eng-travel",
      unitTitle: "單元 1：餐廳訂位與飯店入住聽說",
      title: "單字與句型：reschedule（改期／重排時間）",
      estimatedMinutes: 5,
      icebreaker: {
        question: "【10秒無痛破冰】原本約好下午開會，突然有急事想「改時間」，英文字首加哪兩個字母代表「重新」？",
        options: [
          "re-（例如 replay 重播、restart 重開）",
          "un-（代表否定）",
          "pre-（代表預先）"
        ],
        correctIndex: 0,
        encouragement: "沒錯！re- 就是「再一次、重新」，你已經掌握一半了！"
      },
      learn: {
        corePoint: "reschedule (動詞 /ˌriːˈskedʒ.uːl/) ＝ re（重新）＋ schedule（行程表）＝ 改期、重新安排時間。",
        speakText: "Can we reschedule our meeting for tomorrow?",
        speakMeaning: "我們可以把會議改到明天嗎？",
        metaphor: "💡 大腦記憶組塊比喻：不用背新單字！把熟悉的 schedule（時間表）前面貼上一張「re-（重來貼紙）」，就變成動詞「改期」。",
        keyTakeaways: [
          "拆字秒記：re (重新) + schedule (時間表) = 改期",
          "禮貌詢問句型：Can we reschedule [事情] for [新時間]?",
          "比說 change the time 更專業自然"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練",
          type: "choice",
          exampleBox: "範例：Can we **reschedule** our appointment **for** Friday?（改到週五用介系詞 for 或 to）",
          prompt: "你想把牙醫預約改到下週一：Can we ____ the appointment for next Monday?",
          options: ["reschedule", "reservation", "repeat"],
          correctIndex: 0,
          hint: "「重新 (re) 排時間表 (schedule)」合起來是哪個字？"
        },
        {
          level: "Step 2/3 半提示回想",
          type: "choice",
          exampleBox: "提示：re- + schedule",
          prompt: "客戶臨時不能來，寫信說：I need to r e _ c h e d u l e our call.",
          options: ["reschedule", "remember", "research"],
          correctIndex: 0,
          hint: "中間是 schedule（行程表）喔！"
        },
        {
          level: "Step 3/3 獨立挑戰",
          type: "choice",
          exampleBox: "",
          prompt: "想跟外國同事說「抱歉，我們可以把會議改到週四嗎？」，哪句最自然？",
          options: [
            "Sorry, could we reschedule the meeting for Thursday?",
            "Sorry, could we replay the meeting on Thursday?",
            "Sorry, could we schedule again the meeting?"
          ],
          correctIndex: 0,
          hint: "直接用 reschedule 一個字就能取代 schedule again！"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡說：「reschedule 看起來好長喔！我死背 r-e-s-c-h-e-d-u-l-e 背了十遍還是忘記怎麼拼，而且它跟 reservation 一樣都是名詞對吧？」",
        taskPrompt: "請用「記憶組塊法」教小泡怎麼不靠死背記住 reschedule，並糾正它的詞性：",
        options: [
          "不用死背字母！把它拆成「re（重新）＋ schedule（行程表）」兩塊就記住了；而且它是「動詞（改期）」，可以直接放在 Can we 後面！",
          "真的只能從第一個字母硬背到最後一個字母，沒有別的方法。",
          "reschedule 的意思是取消會議永遠不開了。"
        ],
        correctIndex: 0,
        buddySuccessReply: "太神啦！拆成 re + schedule 兩塊我一秒就記住了，再也不用從頭死背到尾！🔥",
        aiSystemContext: "你是呆萌學伴小泡，覺得 reschedule 單字太長背不起來。請讓使用者教你怎麼拆字記憶以及怎麼造句。"
      },
      reviewVariant: {
        prompt: "【間隔複習變化題】班機因為大雨延誤，航空公司幫你「改簽到明早的班機」，新聞或廣播會用哪個字？",
        options: [
          "reschedule your flight",
          "reservation your flight",
          "retire your flight"
        ],
        correctIndex: 0,
        explanation: "reschedule a flight 就是把班機改期／改時間！"
      }
    },

    // 3. Junior High Math (Han Lin / Kang Hsuan / Nan I): Linear Equations (等量公理與移項法則)
    {
      id: "q-jh-math-eq",
      stage: "junior",
      subject: "數學",
      subjectKey: "math",
      publisher: "翰林／康軒／南一（七上第 3 單元）",
      unitId: "u-jh-math-3",
      unitTitle: "第 3 單元：一元一次方程式",
      title: "3-2 等量公理與移項法則（天平平衡法）",
      estimatedMinutes: 6,
      icebreaker: {
        question: "【10秒無痛破冰】天平左邊放「1 袋神祕蘋果 ＋ 3 顆散裝蘋果」，右邊放「10 顆蘋果」剛好平衡。如果兩邊同時拿走 3 顆，天平還會平嗎？",
        options: [
          "還是平衡的！（這就是等量公理）",
          "會歪掉",
          "蘋果會不見"
        ],
        correctIndex: 0,
        encouragement: "完全正確！你已經懂「等量公理」的靈魂了，根本不用死背公式！"
      },
      learn: {
        corePoint: "解方程式 x + 3 = 10，目標是讓 x 單獨留在左邊。把「+ 3」跨過等號搬到右邊變成「- 3」，就叫【移項法則】（本質就是天平兩邊同減 3）。",
        speakText: "移項法則：跨過等號這座橋，加變減、減變加、乘變除、除變乘。",
        speakMeaning: "先搬加減（外圍小兵），再處理乘除（貼身保鑣）。",
        metaphor: "💡 大腦記憶組塊比喻：把「＝（等號）」想像成海關大橋！數字只要跨過等號大橋到對岸，就要「換相反的衣服」（＋變－，×變÷）。而且拯救 x 國王時，要先趕走離他比較遠的「加減小兵」，最後才趕走黏在他身上的「乘除保鑣」！",
        keyTakeaways: [
          "口訣 1：跨過等號橋，符號變相反（＋⇄－，×⇄÷）",
          "口訣 2：先搬加減（遠的），後搬乘除（黏著 x 的）",
          "算完代回原式檢查，100% 穩拿分"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練（搬加減）",
          type: "choice",
          exampleBox: "範例：x + 5 = 12 → 把 +5 跨過等號變 -5 → x = 12 - 5 = 7",
          prompt: "試試看：x - 4 = 9，把「- 4」跨過等號橋到右邊，會變成什麼？",
          options: [
            "x = 9 + 4（所以 x = 13）",
            "x = 9 - 4（所以 x = 5）",
            "x = 9 ÷ 4"
          ],
          correctIndex: 0,
          hint: "跨過等號橋要換相反的衣服：「減 4」過橋會變成「加 4」喔！"
        },
        {
          level: "Step 2/3 半提示回想（先搬加減、再搬乘除）",
          type: "choice",
          exampleBox: "提示：2x + 3 = 11，先趕走外圍的 +3，再處理黏著 x 的 2。",
          prompt: "解 2x + 3 = 11 的第一步，應該先把誰搬去右邊？",
          options: [
            "先把 +3 搬過去變成 2x = 11 - 3",
            "先把 ×2 搬過去變成 x + 3 = 11 ÷ 2",
            "把 x 擦掉"
          ],
          correctIndex: 0,
          hint: "記得「拯救 x 國王」的順序：先趕走離他較遠的加減小兵（+3）！"
        },
        {
          level: "Step 3/3 獨立解題挑戰",
          type: "choice",
          exampleBox: "",
          prompt: "請獨立解出：3x - 2 = 10，請問 x 等於多少？",
          options: [
            "x = 4（因為 3x = 10 + 2 = 12，x = 12 ÷ 3 = 4）",
            "x = 8/3（因為 3x = 10 - 2 = 8）",
            "x = 9"
          ],
          correctIndex: 0,
          hint: "第一步：-2 過橋變 +2，所以 3x = 12；第二步：×3 過橋變 ÷3！"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡算了一題：『2x - 6 = 10，我把 -6 搬過去右邊，寫成 2x = 10 - 6 = 4，所以 x = 2！我怎麼覺得怪怪的？』",
        taskPrompt: "小泡在「過橋」的時候忘記做哪件事了？請幫他抓出來：",
        options: [
          "小泡，「- 6」跨過等號大橋到右邊，要變號成「+ 6」才對！應該是 2x = 10 + 6 = 16，所以 x = 8！",
          "小泡沒算錯，2 乘以 2 減 6 確實等於 10。",
          "應該先把 2 搬過去減掉才對。"
        ],
        correctIndex: 0,
        buddySuccessReply: "啊！！我忘記過等號橋要「換相反衣服（-6 變 +6）」了！把 x=8 代回去 2×8-6=10 真的對了，謝謝小老師！🏆",
        aiSystemContext: "你是呆萌國中學伴小泡，在解 2x - 6 = 10 時忘記移項要變號，算成 2x = 10 - 6。請讓使用者教你為什麼錯。"
      },
      reviewVariant: {
        prompt: "【間隔複習變化題】買 4 杯珍奶，用了一張折價 10 元的酷碰券，總共付了 150 元（4x - 10 = 150）。請問 1 杯珍奶 (x) 幾元？",
        options: [
          "40 元（4x = 160 → x = 40）",
          "35 元（4x = 140 → x = 35）",
          "50 元"
        ],
        correctIndex: 0,
        explanation: "4x - 10 = 150 → 把 -10 移項變 +10 得到 4x = 160 → x = 40 元！"
      }
    },

    // 4. Junior High Science (Nan I / Han Lin / Kang Hsuan): Acid & pH (酸鹼與 pH 值)
    {
      id: "q-jh-sci-acid",
      stage: "junior",
      subject: "自然科學",
      subjectKey: "science",
      publisher: "南一／翰林／康軒（八下第 3 單元）",
      unitId: "u-jh-sci-1",
      unitTitle: "第 3 單元：電解質與酸鹼反應",
      title: "3-2 酸鹼性與 pH 值（翹翹板記憶法）",
      estimatedMinutes: 5,
      icebreaker: {
        question: "【10秒無痛破冰】檸檬汁喝起來酸酸的，你覺得它的 pH 值跟純水（pH = 7）比起來，是比 7 大還是比 7 小？",
        options: [
          "比 7 小（pH < 7 是酸性）",
          "比 7 大",
          "剛好等於 100"
        ],
        correctIndex: 0,
        encouragement: "答對了！生活常識就是最強的理化基礎！"
      },
      learn: {
        corePoint: "25°C 時，中性純水 pH = 7。酸性 pH < 7（數字越小越酸，H+ 越多）；鹼性 pH > 7（數字越大越鹼，OH- 越多）。",
        speakText: "pH 值以 7 為中間點：小於 7 是酸性，大於 7 是鹼性。",
        speakMeaning: "pH 數字越往 0 走，酸性越強！",
        metaphor: "💡 大腦記憶組塊比喻：把 pH 0～14 想成一把尺，正中間 7 是和平的中性水。往左邊（小於 7）是「小酸酸（數字越小越酸）」；往右邊（大於 7）是「大鹼鹼（數字越大越鹼）」！",
        keyTakeaways: [
          "pH < 7：酸性（數字越小越酸，如胃酸 pH 約 1~2）",
          "pH = 7：中性（25°C 純水、食鹽水）",
          "pH > 7：鹼性（數字越大越鹼，如肥皂水、氨水）"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練",
          type: "choice",
          exampleBox: "範例：口訣「小酸酸、大鹼鹼」→ pH = 2 比 pH = 5 數字更小，所以 pH = 2 更酸！",
          prompt: "胃酸的 pH 值大約是 1.5，檸檬汁大約是 2.5，請問誰的酸性比較強？",
          options: [
            "胃酸（pH 1.5 數字比 2.5 更小，所以更酸）",
            "檸檬汁",
            "兩者都是鹼性"
          ],
          correctIndex: 0,
          hint: "記得「小酸酸」：在小於 7 的範圍裡，pH 數字越小，酸性越強喔！"
        },
        {
          level: "Step 2/3 半提示回想",
          type: "choice",
          exampleBox: "提示：在酸性溶液中加入大量純水稀釋，它會越來越接近純水（pH = 7），但不會越過 7 變成鹼性。",
          prompt: "把 pH = 3 的醋酸加入大量純水稀釋後，pH 值會怎麼變化？",
          options: [
            "pH 值會上升並接近 7（但仍小於 7）",
            "pH 值會下降變成 1",
            "pH 值會衝破 7 變成 12（變強鹼）"
          ],
          correctIndex: 0,
          hint: "酸加水會變淡（沒那麼酸），所以 pH 數字會從 3 往中性 7 靠近，但酸加水不會變成鹼喔！"
        },
        {
          level: "Step 3/3 獨立挑戰",
          type: "choice",
          exampleBox: "",
          prompt: "甲杯 pH = 3、乙杯 pH = 7、丙杯 pH = 11，哪一杯摸起來有滑膩感（鹼性特徵）？",
          options: [
            "丙杯（pH = 11 > 7，為鹼性）",
            "甲杯（pH = 3）",
            "乙杯（pH = 7）"
          ],
          correctIndex: 0,
          hint: "「大鹼鹼」：大於 7 的就是鹼性水溶液！"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡說：「老師說酸的東西 H+ 比較多，所以 pH 數字越大代表越酸對不對？那 pH = 6 一定比 pH = 1 還要酸囉！」",
        taskPrompt: "很多同學都跟小泡一樣搞反了！請用口訣幫他導正：",
        options: [
          "剛好相反喔！pH 值是「小酸酸、大鹼鹼」，pH 數字越小代表 H+ 濃度越高、酸性越強，所以 pH = 1 比 pH = 6 酸非常多！",
          "對，pH 6 比 pH 1 酸六倍。",
          "pH 1 跟 pH 6 都是鹼性的。"
        ],
        correctIndex: 0,
        buddySuccessReply: "原來「小酸酸」是指 pH 數字越小越酸！這樣我就不會被『濃度高＝數字大』騙到了！✨",
        aiSystemContext: "你是呆萌國中生小泡，誤以為 pH 數字越大越酸（以為 pH 6 比 pH 1 酸）。請讓使用者教你正確觀念。"
      },
      reviewVariant: {
        prompt: "【間隔複習變化題】將 pH = 12 的強鹼清潔劑加水稀釋 100 倍，它的 pH 值會怎麼動？",
        options: [
          "從 12 往下降，接近 7（但仍大於 7）",
          "從 12 往上升變成 14",
          "直接變成 pH = 2 的強酸"
        ],
        correctIndex: 0,
        explanation: "不管是酸還是鹼，加水稀釋都會往中間的「pH = 7（純水）」靠近，但不會跨過 7 變性！"
      }
    },

    // 5. Elementary Math: Common Denominator (異分母分數通分)
    {
      id: "q-el-math-frac",
      stage: "elem",
      subject: "數學",
      subjectKey: "math",
      publisher: "康軒／翰林／南一（五上第 4 單元）",
      unitId: "u-el-math-fraction",
      unitTitle: "第 4 單元：擴分、約分與異分母分數加減",
      title: "4-2 異分母分數相加（切披薩通分法）",
      estimatedMinutes: 5,
      icebreaker: {
        question: "【10秒無痛破冰】大披薩切 2 大片（1/2），跟同一個披薩切 4 小片（1/4），「1 大片」跟「1 小片」一樣大嗎？",
        options: [
          "不一樣大！要把那 1 大片再對切成 2 小片（變 2/4）才能一起算！",
          "一樣大，直接加起來變 2/6",
          "披薩不能切"
        ],
        correctIndex: 0,
        encouragement: "超棒！你已經突破國小分數最常錯的陷阱了！"
      },
      learn: {
        corePoint: "分母不同（每片大小不同）不能直接相加！要先【通分】（把分母變成一樣大，分子也要跟著乘相同倍數），最後只加分子、分母不變。",
        speakText: "異分母相加，先通分把分母變一樣，再把分子加起來。",
        speakMeaning: "1/2 + 1/4 = 2/4 + 1/4 = 3/4。",
        metaphor: "💡 大腦記憶組塊比喻：分母是「披薩切成幾塊（尺寸名稱）」，分子是「你有幾塊」。尺寸不同不能硬加！把 1/2 披薩多切一刀變成 2/4（上下同乘 2），尺寸都是「四分之一片」了，2 片加 1 片就是 3/4！",
        keyTakeaways: [
          "絕對不可以「分母加分母、分子加分子」",
          "通分：上下同乘一個數，把分母變成一樣",
          "分母一樣後：分母照抄，分子相加"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練",
          type: "choice",
          exampleBox: "範例：1/2 + 1/4 → 把 1/2 上下同乘 2 變成 2/4 → 2/4 + 1/4 = 3/4",
          prompt: "想算 1/3 + 1/6，先把 1/3 上下同乘 2（通分），會變成六分之幾？",
          options: ["2/6", "1/6", "3/6"],
          correctIndex: 0,
          hint: "分子 1 乘以 2 = 2，分母 3 乘以 2 = 6，所以是 2/6 喔！"
        },
        {
          level: "Step 2/3 半提示回想",
          type: "choice",
          exampleBox: "提示：1/3 已經變成 2/6 了，接著算 2/6 + 1/6。",
          prompt: "接續上題，2/6 + 1/6 等於多少？（記得：分母是尺寸名稱不相加，只加分子！）",
          options: ["3/6（約分後是 1/2）", "3/12", "2/12"],
          correctIndex: 0,
          hint: "分母維持 6，分子 2 + 1 = 3，所以是 3/6！"
        },
        {
          level: "Step 3/3 獨立挑戰",
          type: "choice",
          exampleBox: "",
          prompt: "請問 1/2 + 1/6 等於多少？",
          options: [
            "4/6（也就是 2/3）",
            "2/8",
            "1/8"
          ],
          correctIndex: 0,
          hint: "先把 1/2 上下同乘 3 變成 3/6，再加 1/6 就會得到 4/6！"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡開心地說：「分數加法超簡單！1/2 + 1/3，我把上面 1+1=2，下面 2+3=5，答案就是 2/5！我1秒就算完了！」",
        taskPrompt: "小泡掉進最經典的陷阱了！請用「披薩比喻」教會他：",
        options: [
          "小泡，分母是披薩切的大小，大小不同不能直接把分母加起來！要先通分變成 3/6 + 2/6 = 5/6 才對！（不然半個披薩加 1/3 個怎麼會變比半個還小的 2/5 呢？）",
          "小泡太聰明了，上下直接加最快！",
          "應該把分子跟分母全部乘起來。"
        ],
        correctIndex: 0,
        buddySuccessReply: "對耶！1/2 個披薩再多加一點，怎麼可能變成比一半還小的 2/5！先切一樣大塊（通分變六分之幾）再加就完全合理了！🍕",
        aiSystemContext: "你是呆萌小學生小泡，算 1/2 + 1/3 時直接把分子加分子、分母加分母算成 2/5。請讓使用者教你為什麼錯。"
      },
      reviewVariant: {
        prompt: "【間隔複習變化題】喝了 1/4 瓶牛奶，弟弟又喝了 1/2 瓶，兩人共喝了幾瓶？",
        options: [
          "3/4 瓶（1/4 + 2/4 = 3/4）",
          "2/6 瓶",
          "2/4 瓶"
        ],
        correctIndex: 0,
        explanation: "把 1/2 通分成 2/4，加上 1/4 就是 3/4 瓶！"
      }
    },

    // 6. Adult / University Python Coding Quest
    {
      id: "q-adult-py-dict",
      stage: "adult",
      subject: "程式語言（Python）",
      subjectKey: "coding",
      publisher: "成人／大學資訊模組",
      unitId: "u-adult-py-loop",
      unitTitle: "單元 1：清單與迴圈自動化",
      title: "Python Dictionary 字典：1 秒查資料不從頭翻",
      estimatedMinutes: 5,
      icebreaker: {
        question: "【10秒無痛破冰】想找手機通訊錄裡「Jay」的電話，你是從第 1 個人名往下滑 500 人，還是直接搜尋「Jay」？",
        options: [
          "直接打名字「Jay」一秒跳出電話！（這就是 Python 字典 key -> value）",
          "從第 1 個慢慢滑到第 500 個",
          "把手機重開機"
        ],
        correctIndex: 0,
        encouragement: "完全正確！這就是為什麼寫 Python 用 Dictionary 比從頭翻 List 快超多！"
      },
      learn: {
        corePoint: "Python 的 dict（字典）用大括號 `{ \"鍵(key)\": 值(value) }` 儲存配對資料。用 `scores[\"Jay\"]` 就能直接拿分數，不用寫迴圈從頭找。",
        speakText: "scores equals open brace Jay colon 95 close brace.",
        speakMeaning: "scores = {\"Jay\": 95}，透過 key 直接查 value。",
        metaphor: "💡 大腦記憶組塊比喻：List `[]` 像沒有標籤的排隊隊伍（只能數第 0 個、第 1 個）；Dict `{}` 像貼了名字標籤的置物櫃，喊名字 `櫃子[\"Jay\"]` 門就打開！",
        keyTakeaways: [
          "建立字典用大括號：`scores = {\"Jay\": 95, \"Amy\": 88}`",
          "取值用中括號加 key：`scores[\"Jay\"]` 會得到 `95`",
          "安全取值怕當機用 `.get(\"名字\", 預設值)`"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練",
          type: "choice",
          exampleBox: "範例：`price = {\"apple\": 30, \"milk\": 65}` → 查牛奶價格寫 `price[\"milk\"]`",
          prompt: "如果有一個字典 `user = {\"name\": \"Jay\", \"role\": \"QA\"}`，想取出 `\"QA\"` 要怎麼寫？",
          options: [
            "user[\"role\"]",
            "user[\"QA\"]",
            "user(1)"
          ],
          correctIndex: 0,
          hint: "要喊置物櫃上的「標籤名字 (key)」，也就是 \"role\"，才能拿到裡面的 \"QA\" 喔！"
        },
        {
          level: "Step 2/3 半提示回想",
          type: "choice",
          exampleBox: "提示：新增或修改字典資料，直接寫 `字典[新標籤] = 新數值`。",
          prompt: "想在 `scores = {\"Jay\": 95}` 裡面新增一筆 `\"Leo\": 90`，怎麼寫最簡單？",
          options: [
            "scores[\"Leo\"] = 90",
            "scores.append(\"Leo\", 90)",
            "scores + {\"Leo\": 90}"
          ],
          correctIndex: 0,
          hint: "直接指定標籤 `scores[\"Leo\"]` 等於 `90` 就放進置物櫃囉！"
        },
        {
          level: "Step 3/3 獨立除錯挑戰",
          type: "choice",
          exampleBox: "",
          prompt: "當字典裡沒有 `\"Tom\"` 時，直接寫 `scores[\"Tom\"]` 會噴 `KeyError` 錯誤。改用哪個寫法找不到時會回傳 `0` 而不當機？",
          options: [
            "scores.get(\"Tom\", 0)",
            "scores.find(\"Tom\", 0)",
            "scores[\"Tom\" or 0]"
          ],
          correctIndex: 0,
          hint: "還記得重點卡第 3 條的「安全取值」方法 `.get()` 嗎？"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: "小泡寫了一行 Python：`menu = {\"burger\": 80}`，然後寫 `print(menu[80])` 想印出漢堡的名字，結果程式報錯 KeyError: 80！",
        taskPrompt: "請跟小泡解釋為什麼 `menu[80]` 會失敗：",
        options: [
          "因為字典只能用左邊的「標籤 (Key，也就是 \"burger\")」去查右邊的「值 (Value，80)」，不能反過來拿 80 當標籤查喔！應該寫 `menu[\"burger\"]`。",
          "因為字典要用小括號 `menu(80)`。",
          "因為 Python 不能印出數字 80。"
        ],
        correctIndex: 0,
        buddySuccessReply: "秒懂！置物櫃只能用門上的「名字標籤 (Key)」開門拿裡面的東西 (Value)，不能拿裡面的東西去開門！💻🎉",
        aiSystemContext: "你是初學 Python 的呆萌學伴小泡，把字典的 key 跟 value 搞反了，寫出 menu[80]。請讓使用者教你為什麼錯。"
      },
      reviewVariant: {
        prompt: "【間隔複習變化題】在做 QA 測試結果統計時，`result = {\"pass\": 12, \"fail\": 1}`，想把 `\"fail\"` 的數量加 1，哪行程式碼正確？",
        options: [
          "result[\"fail\"] = result[\"fail\"] + 1",
          "result[1] = result[1] + \"fail\"",
          "result.add(\"fail\", 1)"
        ],
        correctIndex: 0,
        explanation: "先用 `result[\"fail\"]` 取出原本的 1，加 1 之後再存回 `result[\"fail\"]`！"
      }
    }
  ],

  // Initial Spaced Repetition & 3-Level Dashboard Tracking Table
  // Matches Jay's Excel structure: 項目, 科目, 首次學習日, 當天回想, 第1天, 第3天, 第7天, 第14天, 通過次數, 狀態
  // Plus unit/chapter hierarchy for 3-level drill-down diagnosis
  initialTrackingRecords: [
    {
      id: "tr-1",
      questId: "q-adult-eng-reservation",
      itemTitle: "單字：reservation（訂位／預約）",
      stage: "adult",
      publisher: "成人實戰／Excel MVP",
      subject: "英文（聽說）",
      unitTitle: "單元 1：餐廳訂位與飯店入住聽說",
      chapterTitle: "核心單字與句型：reservation",
      firstDate: "2026-10-08",
      day0: true,
      day1: true,
      day3: true,
      day7: null,
      day14: null,
      accuracy: 92,
      weakStageNote: "階段 1–3 已穩固，待完成第 7 天與第 14 天延遲測驗即可獲頒「已精通」徽章"
    },
    {
      id: "tr-2",
      questId: "q-adult-eng-reschedule",
      itemTitle: "單字：reschedule（改期／重排時間）",
      stage: "adult",
      publisher: "成人實戰模組",
      subject: "英文（聽說）",
      unitTitle: "單元 1：餐廳訂位與飯店入住聽說",
      chapterTitle: "核心單字與句型：reschedule",
      firstDate: "2026-10-20",
      day0: true,
      day1: true,
      day3: true,
      day7: true,
      day14: true,
      accuracy: 96,
      weakStageNote: "第 7、14 天延遲測驗皆通過！長期記憶已穩固"
    },
    {
      id: "tr-3",
      questId: "q-jh-math-eq",
      itemTitle: "觀念：一元一次方程式移項法則",
      stage: "junior",
      publisher: "翰林／康軒／南一（七上）",
      subject: "數學",
      unitTitle: "第 3 單元：一元一次方程式",
      chapterTitle: "3-2 等量公理與移項法則",
      firstDate: "2026-10-28",
      day0: true,
      day1: false,
      day3: null,
      day7: null,
      day14: null,
      accuracy: 65,
      weakStageNote: "需加強：負號跨過等號時常忘記變正號（階段 2 獨立解題正確率 65%，建議花 3 分鐘重練）"
    },
    {
      id: "tr-4",
      questId: "q-jh-sci-acid",
      itemTitle: "觀念：酸鹼稀釋與 pH 值變化",
      stage: "junior",
      publisher: "南一／翰林／康軒（八下）",
      subject: "自然科學",
      unitTitle: "第 3 單元：電解質與酸鹼反應",
      chapterTitle: "3-2 酸鹼濃度與 pH 值核心觀念",
      firstDate: "2026-10-25",
      day0: true,
      day1: true,
      day3: false,
      day7: null,
      day14: null,
      accuracy: 74,
      weakStageNote: "需注意：第 3 天複習時搞混「酸加水稀釋 pH 會接近 7 但不超過 7」"
    },
    {
      id: "tr-5",
      questId: "q-el-math-frac",
      itemTitle: "觀念：異分母分數通分相加",
      stage: "elem",
      publisher: "三大版共通（五上）",
      subject: "數學",
      unitTitle: "第 4 單元：擴分、約分與異分母分數加減",
      chapterTitle: "4-2 通分：把披薩切成一樣大塊再加",
      firstDate: "2026-10-30",
      day0: true,
      day1: true,
      day3: null,
      day7: null,
      day14: null,
      accuracy: 85,
      weakStageNote: "進度良好：已通過教學閘門（85%），等待第 3 天間隔複習充能"
    },
    {
      id: "tr-6",
      questId: "q-adult-py-dict",
      itemTitle: "語法：Python Dictionary 键值查詢與 .get()",
      stage: "adult",
      publisher: "成人／大學資訊模組",
      subject: "程式語言（Python）",
      unitTitle: "單元 1：清單與迴圈自動化",
      chapterTitle: "核心觀念：Dictionary 字典查詢",
      firstDate: "2026-11-01",
      day0: true,
      day1: false,
      day3: null,
      day7: null,
      day14: null,
      accuracy: 70,
      weakStageNote: "需加強：容易把 Key 與 Value 方向寫反，建議補強「教 AI 學伴」關卡"
    }
  ]
};

