const functions = require('firebase-functions');
const Twitter = require('twitter')

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

class Cotoha{
  constructor(sentence,cotoha_token){
    this.sentence = sentence;
    this.cotoha_token = cotoha_token
    this.sentenceArr = []
    this.parseArr = ""
    this.analysisArr = []
  }
  client(){
    const axiosConfig = axios.create({
      headers:{
        "Authorization": `Bearer ${this.cotoha_token}`,
        "Content-Type": "application/json"
      },
      baseURL:"https://api.ce-cotoha.com/api/dev/nlp/v1",
    });
    return axiosConfig;
  }
  async parse(){
    const axiosBase = await this.client();
    try{
      const res = await axiosBase.post("/parse",{
        "sentence":this.sentence,
        'type':'kuzure'
      })
      //await fs.writeFile("./output/parse.json",JSON.stringify(res.data,null,"\t"));
      const result = res.data.result;
      this.parseArr = result
      return result
    }catch(e){
      return e
    }
  }
  /*sentiment(arg){
    return new Promise((resolve,reject)=>{
      const sentence = arg!=null ? arg : this.sentence
      const axiosBase = this.client();
      axiosBase.post("/sentiment",{"sentence":sentence}).then(res=>{
        const result = res.data.result
        //console.log(result)
        resolve(result)
      }).catch(e=>{
        reject(e)
      })
    })
  }*/
  async unique(arg){
    const sentence = arg !== null ? arg : this.sentence
    const axiosBase = await this.client();
    try{
      const res = await axiosBase.post("/ne",{
        "sentence":sentence,
        'type': 'kuzure'
      })
      //await fs.writeFile("./output/unique.json",JSON.stringify(res.data,null,"\t"));
      const result = res.data.result;
      //console.log(result)
      return result
    }catch(e){
      return e
    }
  }
  /*async similarity(s2){
    const axiosBase = await this.client();
    const res = await axiosBase.post("/similarity",{
      "s1":this.sentence,
      "s2":s2
    });
    //await fs.writeFile("./output/similarity.json",JSON.stringify(res.data,null,"\t"));
    return res.data;
  }*/
  async sentenceType(arg){
    const sentence = arg !== null ? arg : this.sentence
    const axiosBase = await this.client();
    const res = await axiosBase.post("/sentence_type",{
      "sentence":sentence,
      'type':'kuzure'
    });
    //await fs.writeFile("./output/sentenceType.json",JSON.stringify(res.data,null,"\t"));
    //console.log(res.data.result);
    return res.data.result;
  }
  async separateSentence () {
    //console.log("separateSentence start")
    const cutPoint = []
    const parseChunk = []
    this.parseArr.forEach((item, n) => {
      item.tokens.forEach((obj) => {
        //console.log(obj)
        if(obj.pos==="終助詞"){
          cutPoint.push(n)
          //console.log(n)
        }
      });
    });
    if(this.parseArr.length!==cutPoint.slice(-1)[0]){
      //cutPoint配列の最後の値がparseArrの長さと一致していないと、結果が途中で切れてしまう。
      cutPoint.push(this.parseArr.length)
    }

    //console.log(cutPoint)
    //console.log("separateSentence midium")
    //終助詞があるタイミングで配列を切り分けている。
    for (let i = 0; i < cutPoint.length; i++) {
      parseChunk[i] = []
      for (let n = cutPoint[i-1]===null ? 0 : cutPoint[i-1]+1; n < this.parseArr.length; n++) {
        //console.log("debug")
        //console.log("i : "+i)
        //console.log("n : "+n)
        parseChunk[i].push(this.parseArr[n])
        if(n===cutPoint[i]){
          break
        }

      }
    }

    //終助詞で切り分けられた平文の配列で戻す。
    parseChunk.forEach((chunkArr,n) => {
      let sentence = ""
      chunkArr.forEach((obj) => {
        obj.tokens.forEach((token) => {
          sentence = sentence + token.form
          //console.log(token.form)
        });
      });
      this.sentenceArr[n] = sentence
      //console.log(n + " : " + sentence)
    });
    //console.log("separateSentence end")
    return this.sentenceArr
  }
  async createAnalysis () {
    this.sentenceArr.forEach((text,i) => {
      const obj = {
        id: i,
        sentence : text,
        sentiment : {},
        unique : [],
        sentenceType : {}
      }
      this.analysisArr.push(obj)
    });

    const p1 = this.sentenceArr.map((text,i)=>{
      return new Promise((resolve,reject)=>{
        this.unique(text).then(obj=>{
          this.analysisArr[i].unique = obj
          resolve(1)
          return 1
        }).catch(e=>{
          reject(e)
        })
      })
    })
    const p2 = this.sentenceArr.map((text,i)=>{
      return new Promise((resolve,reject)=>{
        this.sentenceType(text).then(obj=>{
          this.analysisArr[i].sentenceType = obj
          resolve(1)
          return 1
        }).catch(e=>{
          reject(e)
        })
      })
    })
    await Promise.all(p1.concat(p2))
    return this.analysisArr
  }
  ShapedUniqueEmoji (sentence,uniqueArr) {
    const emojiObj = {
      "Name": "チャン",
      "Name_Other": "クン",
      "Person": "",
      "God": "",
      "Organization": "",
      "Organization_Other": "",
      "International_Organization": "&#x1f30d;",
      "Show_Organization": "&#x1f3aa;",
      "Family": "&#x1f468;",
      "Ethnic_Group": "",
      "Ethnic_Group_Other": "",
      "Nationality": "",
      "Sports_Organization": "&#x1f3df;",
      "Sports_Organization_Other": "&#x1f3df;",
      "Pro_Sports_Organization": "&#x1f3df;",
      "Sports_League": "&#x1f3df;",
      "Corporation": "&#x1f3e2;",
      "Corporation_Other": "&#x1f3e2;",
      "Company": "&#x1f3e2;",
      "Company_Group": "&#x1f3e2;",
      "Political_Organization": "&#x1f3e2;",
      "Political_Organization_Other": "&#x1f3e2;",
      "Government": "",
      "Political_Party": "",
      "Cabinet": "",
      "Military": "",
      "Location": "",
      "Location_Other": "",
      "Spa": "&#x2668;",
      "GPE": "&#x1f3d9;",
      "GPE_Other": "&#x1f3d9;",
      "City": "&#x1f3d9;",
      "County": "&#x1f3d9;",
      "Province": "&#x1f3d9;",
      "Country": "",
      "Region": "",
      "Region_Other": "",
      "Continental_Region": "&#x1f5fa;",
      "Domestic_Region": "&#x1f5fe;",
      "Geological_Region": "",
      "Geological_Region_Other": "",
      "Mountain": "&#x26f0;",
      "Island": "&#x1f3dd;",//2020/03/15 asd commit
      "River": "",
      "Lake": "",
      "Sea": "",
      "Bay": "",
      "Astral_Body": "&#x1f30d;",
      "Astral_Body_Other": "&#x1f30d;",
      "Star": "&#x2b50;",
      "Planet": "",
      "Constellation": "",
      "Address": "&#x1f4eb;",
      "Address_Other": "&#x1f4eb;",
      "Postal_Address": "",
      "Phone_Number": "&#x1f4f3;",
      "Email": "&#x1f4e7;",
      "URL": "",
      "Facility": "",
      "Facility_Other": "",
      "Facility_Part": "",
      "Archaeological_Place": "&#x1f3db;",
      "Archaeological_Place_Other": "&#x1f3db;",
      "Tumulus": "&#x1f3db;",
      "GOE": "",
      "GOE_Other": "",
      "Public_Institution": "",
      "School": "&#x1f3eb;",
      "Research_Institution": "",
      "Market": "",
      "Park": "",
      "Sports_Facility": "&#x1f3df;",
      "Museum": "",
      "Zoo": "",
      "Amusement_Park": "&#x1f3a1;",
      "Theater": "",
      "Worship_Place": "&#x26e9;",
      "Car_Stop": "&#x1f697;",
      "Station": "&#x1f683;",
      "Airport": "&#x2708;",
      "Port": "",
      "Line": "&#x1f683;",
      "Line_Other": "&#x1f683;",
      "Railroad": "",
      "Road": "",
      "Canal": "&#x1f6a2;",
      "Water_Route": "&#x1f6a2;",
      "Tunnel": "",
      "Bridge": "&#x1f309;",
      "Product": "",
      "Product_Other": "",
      "Material": "",
      "Clothing": "&#x1f455;",
      "Money_Form": "&#x1f4b0;",
      "Drug": "&#x1f48a;",
      "Weapon": "",
      "Stock": "",
      "Award": "",
      "Decoration": "",
      "Offence": "",
      "Service": "",
      "Character": "",
      "ID_Number": "",
      "Vehicle": "",
      "Vehicle_Other": "",
      "Car": "&#x1f697;",
      "Train": "&#x1f686;",
      "Aircraft": "&#x2708;",
      "Spaceship": "&#x1f6a2;",
      "Ship": "&#x1f6a2;",
      "Food": "&#x1f35a;",
      "Food_Other": "&#x1f35a;",
      "Dish": "&#x1f374;",//20190315 asd commit
      "Art": "&#x1f3a8;",
      "Art_Other": "&#x1f3a8;",
      "Picture": "",
      "Broadcast_Program": "&#x1f4fa;",
      "Movie": "&#x1f3a5;",
      "Show": "",
      "Music": "&#x1f3b5;",
      "Book": "&#x1f4d6;",
      "Printing": "",
      "Printing_Other": "",
      "Newspaper": "&#x1f4f0;",
      "Magazine": "",
      "Doctrine_Method": "",
      "Doctrine_Method_Other": "",
      "Culture": "",
      "Religion": "",
      "Academic": "",
      "Style": "",
      "Sport": "",
      "Movement": "",
      "Theory": "",
      "Plan": "",
      "Rule": "",
      "Rule_Other": "",
      "Treaty": "",
      "Law": "",
      "Title": "",
      "Title_Other": "",
      "Position_Vocation": "",
      "Language": "",
      "Language_Other": "",
      "National_Language": "&#x1f1fa;",
      "Unit": "",
      "Unit_Other": "",
      "Currency": "&#x1f4b0;",
      "Event": "&#x1f389;",
      "Event_Other": "&#x1f389;",
      "Occasion": "&#x1f389;",
      "Occasion_Other": "&#x1f389;",
      "Religional_Festival": "",
      "Game": "",
      "Conference": "",
      "Incident": "",
      "Incident_Other": "",
      "War": "",
      "Natural_Phenomenon": "",
      "Natural_Phenomenon_Other": "",
      "Natural_Disaster": "",
      "Earthquake": "",
      "Natural_Object": "",
      "Natural_Object_Other": "",
      "Element": "",
      "Compound": "",
      "Mineral": "",
      "Living_Thing": "",
      "Living_Thing_Other": "",
      "Fungus": "",
      "Mollusc_Arthropod": "",
      "Insect": "",
      "Fish": "",
      "Amphibia": "",
      "Reptile": "",
      "Bird": "&#x1f54a;",
      "Mammal": "",
      "Flora": "",
      "Living_Thing_Part": "",
      "Living_Thing_Part_Other": "",
      "Animal_Part": "",
      "Flora_Part": "",
      "Disease": "",
      "Disease_Other": "",
      "Animal_Disease": "",
      "Color": "",
      "Color_Other": "",
      "Nature_Other": "",
      "Time_Top": "&#x1f55b;",
      "Time_Top_Other": "&#x1f55b;",
      "Timex": "&#x1f55b;",
      "Timex_Other": "&#x1f55b;",
      "Time": "&#x1f55b;",
      "Date": "",
      "Day_Of_Week": "",
      "Era": "",
      "Periodx": "",
      "Periodx_Other": "",
      "Period_Time": "",
      "Period_Day": "",
      "Period_Week": "",
      "Period_Month": "",
      "Period_Year": "",
      "Numex": "",
      "Numex_Other": "",
      "Money": "&#x1f4b0;",
      "Stock_Index": "",
      "Point": "",
      "Percent": "",
      "Multiplication": "",
      "Frequency": "",
      "Age": "",
      "School_Age": "",
      "Ordinal_Number": "",
      "Rank": "",
      "Latitude_Longtitude": "",
      "Mesurement": "",
      "Mesurement_Other": "",
      "Physical_Extent": "",
      "Space": "",
      "Volume": "",
      "Weight": "",
      "Speed": "",
      "Intensity": "",
      "Tempareture": "",
      "Calorie": "",
      "Seismic_Intensity": "",
      "Seismic_Magnitude": "",
      "Countx": "",
      "Countx_Other": "",
      "N_Person": "",
      "N_Organization": "",
      "N_Location": "",
      "N_Location_Other": "",
      "N_Country": "",
      "N_Facility": "",
      "N_Product": "",
      "N_Event": "",
      "N_Natural_Object": "",
      "N_Natural_Object_Other": "",
      "N_Animal": "",
      "N_Flora": ""//20200319 asd commit
    }
    let shapedSentence = sentence
    uniqueArr.forEach((obj) => {
      const form = obj.form
      const regex = new RegExp(form,'gu')
      const extended_class = obj.extended_class
      const emoji = emojiObj[extended_class] !== null ? emojiObj[extended_class] : ""
      shapedSentence = sentence.replace(regex,form+emoji)
    });
    return shapedSentence
  }
  makeOji () {
    //data set
    const typeToEmoji = {
      "greeting":"&#128536;",
      "information-providing":"&#x2757;&#x2757;",
      "feedback":"&#128531;",
      "information-seeking":"&#x1f914;",
      "agreement":"&#x1f970;",
      "feedbackElicitation":"&#x1f60f;",
      "commissive":"&#x1f618;",
      "acceptOffer":"&#x1f929;",
      "selfCorrection":"&#x1f601;",
      "thanking":"&#x1f618; &#128149;",
      "apology":"&#x1f97a;",
      "stalling":"&#x1f627;",
      "directive":"&#x1f624;",
      "goodbye":"&#x1f61a;",
      "declineOffer":"&#x1f626;",
      "turnAssign":"&#x1f604;",
      "pausing":"&#x270b;",
      "acceptApology":"&#x1f60d;",
      "acceptThanking":"&#x1f970;"
    }

    let ojiSentence = ""
    let sentence
    this.analysisArr.forEach((obj) => {
      const type = obj.sentenceType.dialog_act[0]
      const uniqueArr = obj.unique
      const endEmoji = typeToEmoji[type]
      sentence = obj.sentence
      sentence = this.ShapedUniqueEmoji(sentence,uniqueArr)
      const endPoint = sentence.slice(-1)
      if(endPoint === "," || endPoint === "、" || endPoint === "." || endPoint === "。"){
        sentence = sentence.slice(0,-1)
      }
      ojiSentence = ojiSentence + sentence + endEmoji
    });

    return ojiSentence
  }
}

const ojisanCompiler = async (inputText) => {
  const token = 'SS5upeEAgdKGwPcvjI45iMWZAPge'
  const cotoha = new Cotoha(inputText, token)
  await cotoha.parse()
  await cotoha.separateSentence()
  await cotoha.createAnalysis()

  const result = await cotoha.makeOji()
  return result
}

//'every 30 minutes' => 30分おきの定期実行。ただし終了してから30分カウントするので、少しずつずれる。改善したほうがいいかも
exports.ojioji_bot = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
  const client = new Twitter({
    consumer_key: 'AS1uM2wpspUTCrG3Vfc2kOe3H',
    consumer_secret: 'RrzMUSbsqN1ATiErUfMxQyUPzoqkse7IMmQYfHLAwVxWNFm8v1',
    access_token_key: '1241290833409634304-TjbbWHN3n7U1ThmP4Ef3fkeUCPKA2V',
    access_token_secret: 'S5i0yFwRyxig3TOehQzdHG5OHM2vBLjQal7c71Na3sPgg'
  })

  client.get('followers/list',async (e,obj,res)=>{
    if(e) console.log(e)
    const userItems = obj.users//Array
    const targetNum = getRandomInt(userItems.length-1)
    const targetUser = userItems[targetNum]
    const screen_name = targetUser.screen_name
    const status = targetUser.status
    const statusId = status.id
    const statusText = status.text
    const ojiText = await ojisanCompiler(statusText)

    client.post('statuses/update', {status: ojiText},  (error, tweet, res) => {
      if(error) console.log(error);
      console.log(tweet)
    })
  })
  return null;
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/*
PS C:\Users\flat3\product\cotoha-oji> firebase deploy --only functions

=== Deploying to 'cotoha-oji'...

i  deploying functions
Running command: npm --prefix "$RESOURCE_DIR" run lint
npm WARN lifecycle The node binary used for scripts is C:\Program Files (x86)\Nodist\bin\node.exe but npm is using C:\Program Files (x86)\Nodist\v-x64\12.13.0\node.exe itself. Use the `--scripts-prepend-node-path` option to include the path for the node binary npm was executed with.

> functions@ lint C:\Users\flat3\product\cotoha-oji\functions
> eslint .

+  functions: Finished running predeploy script.
i  functions: ensuring necessary APIs are enabled...
+  functions: all necessary APIs are enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (47.01 KB) for uploading
+  functions: functions folder uploaded successfully
i  functions: creating Node.js 8 function ojioji_bot(us-central1)...
i  scheduler: ensuring necessary APIs are enabled...
i  pubsub: ensuring necessary APIs are enabled...
!  scheduler: missing necessary APIs. Enabling now...
+  pubsub: all necessary APIs are enabled
+  scheduler: all necessary APIs are enabled
+  functions: created scheduler job firebase-schedule-ojioji_bot-us-central1
+  functions[ojioji_bot(us-central1)]: Successful create operation.

+  Deploy complete!

Project Console: https://console.firebase.google.com/project/cotoha-oji/overview
*/
