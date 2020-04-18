const functions = require('firebase-functions');
const Twitter = require('twitter')
const axios = require('axios')

const getRandomInt = (max) => {
  if (max < 2) {
    // 0 or 1
    return Math.random() >= 0.5 ? 1 : 0
  } else {
    // 2, 3, 4, ...
    return Math.floor(Math.random() * Math.floor(max))
  }
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
      const res = await axiosBase.post("/parse",{"sentence":this.sentence})
      //await fs.writeFile("./output/parse.json",JSON.stringify(res.data,null,"\t"));
      const result = res.data.result;
      this.parseArr = result
      return result
    }catch(e){
      return e
    }
  }

  /* sentiment(arg){
    return new Promise((resolve,reject)=>{
      const sentence = arg!==undefined ? arg : this.sentence
      const axiosBase = this.client();
      axiosBase.post("/sentiment",{"sentence":sentence}).then(res=>{
        const result = res.data.result
        resolve(result)
      }).catch(e=>{
        reject(e)
      })
    })
  } */
  async unique(arg){
    const sentence = arg !== undefined ? arg : this.sentence
    const axiosBase = await this.client();
    try{
      const res = await axiosBase.post("/ne",{"sentence":sentence})
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
    const sentence = arg !== undefined ? arg : this.sentence
    const axiosBase = await this.client();
    const res = await axiosBase.post("/sentence_type",{
      "sentence":sentence,
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
    if(this.parseArr.length !== cutPoint.slice(-1)[0]){
      //cutPoint配列の最後の値がparseArrの長さと一致していないと、結果が途中で切れてしまう。
      cutPoint.push(this.parseArr.length)
    }

    //console.log(cutPoint)
    //console.log("separateSentence midium")
    //終助詞があるタイミングで配列を切り分けている。
    for (let i = 0; i < cutPoint.length; i++) {
      parseChunk[i] = []
      for (let n = cutPoint[i-1] === undefined ? 0 : cutPoint[i-1]+1; n < this.parseArr.length; n++) {
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
          return
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
          return
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
      Name:'チャン',
      Name_Other:'クン',
      Person:'',
      God:'',
      Organization:'',
      Organization_Other:'',
      International_Organization:'🌍',
      Show_Organization:'🎪',
      Family:'👨',
      Ethnic_Group:'',
      Ethnic_Group_Other:'',
      Nationality:'',
      Sports_Organization:'🏟',
      Sports_Organization_Other:'🏟',
      Pro_Sports_Organization:'🏟',
      Sports_League:'🏟',
      Corporation:'🏢',
      Corporation_Other:'🏢',
      Company:'🏢',
      Company_Group:'🏢',
      Political_Organization:'🏢',
      Political_Organization_Other:'🏢',
      Government:'',
      Political_Party:'',
      Cabinet:'',
      Military:'',
      Location:'',
      Location_Other:'',
      Spa:'♨',
      GPE:'🏙',
      GPE_Other:'🏙',
      City:'🏙',
      County:'🏙',
      Province:'🏙',
      Country:'',
      Region:'',
      Region_Other:'',
      Continental_Region:'🗺',
      Domestic_Region:'🗾',
      Geological_Region:'',
      Geological_Region_Other:'',
      Mountain:'⛰',
      Island:'🏝',
      River:'',
      Lake:'',
      Sea:'',
      Bay:'',
      Astral_Body:'🌍',
      Astral_Body_Other:'🌍',
      Star:'⭐',
      Planet:'',
      Constellation:'',
      Address:'📫',
      Address_Other:'📫',
      Postal_Address:'',
      Phone_Number:'📳',
      Email:'📧',
      URL:'',
      Facility:'',
      Facility_Other:'',
      Facility_Part:'',
      Archaeological_Place:'🏛',
      Archaeological_Place_Other:'🏛',
      Tumulus:'🏛',
      GOE:'',
      GOE_Other:'',
      Public_Institution:'',
      School:'🏫',
      Research_Institution:'',
      Market:'',
      Park:'',
      Sports_Facility:'🏟',
      Museum:'',
      Zoo:'',
      Amusement_Park:'🎡',
      Theater:'',
      Worship_Place:'⛩',
      Car_Stop:'🚗',
      Station:'🚃',
      Airport:'✈',
      Port:'',
      Line:'🚃',
      Line_Other:'🚃',
      Railroad:'',
      Road:'',
      Canal:'🚢',
      Water_Route:'🚢',
      Tunnel:'',
      Bridge:'🌉',
      Product:'',
      Product_Other:'',
      Material:'',
      Clothing:'👕',
      Money_Form:'💰',
      Drug:'💊',
      Weapon:'',
      Stock:'',
      Award:'',
      Decoration:'',
      Offence:'',
      Service:'',
      Character:'',
      ID_Number:'',
      Vehicle:'',
      Vehicle_Other:'',
      Car:'🚗',
      Train:'🚆',
      Aircraft:'✈',
      Spaceship:'🚢',
      Ship:'🚢',
      Food:'🍚',
      Food_Other:'🍚',
      Dish:'🍴',
      Art:'🎨',
      Art_Other:'🎨',
      Picture:'',
      Broadcast_Program:'📺',
      Movie:'🎥',
      Show:'',
      Music:'🎵',
      Book:'📖',
      Printing:'',
      Printing_Other:'',
      Newspaper:'📰',
      Magazine:'',
      Doctrine_Method:'',
      Doctrine_Method_Other:'',
      Culture:'',
      Religion:'',
      Academic:'',
      Style:'',
      Sport:'',
      Movement:'',
      Theory:'',
      Plan:'',
      Rule:'',
      Rule_Other:'',
      Treaty:'',
      Law:'',
      Title:'',
      Title_Other:'',
      Position_Vocation:'',
      Language:'',
      Language_Other:'',
      National_Language:'🇺',
      Unit:'',
      Unit_Other:'',
      Currency:'💰',
      Event:'🎉',
      Event_Other:'🎉',
      Occasion:'🎉',
      Occasion_Other:'🎉',
      Religional_Festival:'',
      Game:'',
      Conference:'',
      Incident:'',
      Incident_Other:'',
      War:'',
      Natural_Phenomenon:'',
      Natural_Phenomenon_Other:'',
      Natural_Disaster:'',
      Earthquake:'',
      Natural_Object:'',
      Natural_Object_Other:'',
      Element:'',
      Compound:'',
      Mineral:'',
      Living_Thing:'',
      Living_Thing_Other:'',
      Fungus:'',
      Mollusc_Arthropod:'',
      Insect:'',
      Fish:'',
      Amphibia:'',
      Reptile:'',
      Bird:'🕊',
      Mammal:'',
      Flora:'',
      Living_Thing_Part:'',
      Living_Thing_Part_Other:'',
      Animal_Part:'',
      Flora_Part:'',
      Disease:'',
      Disease_Other:'',
      Animal_Disease:'',
      Color:'',
      Color_Other:'',
      Nature_Other:'',
      Time_Top:'🕛',
      Time_Top_Other:'🕛',
      Timex:'🕛',
      Timex_Other:'🕛',
      Time:'🕛',
      Date:'',
      Day_Of_Week:'',
      Era:'',
      Periodx:'',
      Periodx_Other:'',
      Period_Time:'',
      Period_Day:'',
      Period_Week:'',
      Period_Month:'',
      Period_Year:'',
      Numex:'',
      Numex_Other:'',
      Money:'💰',
      Stock_Index:'',
      Point:'',
      Percent:'',
      Multiplication:'',
      Frequency:'',
      Age:'',
      School_Age:'',
      Ordinal_Number:'',
      Rank:'',
      Latitude_Longtitude:'',
      Mesurement:'',
      Mesurement_Other:'',
      Physical_Extent:'',
      Space:'',
      Volume:'',
      Weight:'',
      Speed:'',
      Intensity:'',
      Tempareture:'',
      Calorie:'',
      Seismic_Intensity:'',
      Seismic_Magnitude:'',
      Countx:'',
      Countx_Other:'',
      N_Person:'',
      N_Organization:'',
      N_Location:'',
      N_Location_Other:'',
      N_Country:'',
      N_Facility:'',
      N_Product:'',
      N_Event:'',
      N_Natural_Object:'',
      N_Natural_Object_Other:'',
      N_Animal:'',
      N_Flora:''
    }
    let shapedSentence = sentence
    uniqueArr.forEach((obj) => {
      const form = obj.form
      const regex = new RegExp(form,'gu')
      const extended_class = obj.extended_class
      const emoji = emojiObj[extended_class] !== null ? emojiObj[extended_class] : ''
      shapedSentence = sentence.replace(regex,form+emoji)
    });
    return shapedSentence
  }
  makeOji () {
    //data set
    const typeToEmoji = {
      greeting:'😘',
      'information-providing':'❗❗',
      feedback:'😓',
      'information-seeking':'🤔',
      agreement:'🥰',
      feedbackElicitation:'😏',
      commissive:'😘',
      acceptOffer:'🤩',
      selfCorrection:'😁',
      thanking:'😘 💕',
      apology:'🥺',
      stalling:'😧',
      directive:'😤',
      goodbye:'😚',
      declineOffer:'😦',
      turnAssign:'😄',
      pausing:'✋',
      acceptApology:'😍',
      acceptThanking:'🥰'
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
      if(endPoint === "," || endPoint === "、" || endPoint === "." || endPoint === "。" || endPoint === '!'){
        sentence = sentence.slice(0,-1)
      }
      ojiSentence = ojiSentence + sentence + endEmoji
    });

    return ojiSentence
  }
}

const ojisanCompiler = async (inputText) => {
  const token = 'EjwdvUmRcVHXaaT8V4ZOKG0MPddY'
  const cotoha = new Cotoha(inputText, token)
  await cotoha.parse()
  await cotoha.separateSentence()
  await cotoha.createAnalysis()

  const result = await cotoha.makeOji()
  return result
}

const main = () => {
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
    const status = targetUser.status
    const statusUrl = `https://twitter.com/${targetUser.screen_name}/status/${status.id_str}`
    const ojiText = await ojisanCompiler(status.text)

    client.post('statuses/update', {status: ojiText, attachment_url: statusUrl},  (error, tweet, res) => {
      if(error) console.log(error)
    })

  })

  return null;
}

// test environment
main()

// production environment
//'every 30 minutes' => 30分おきの定期実行。ただし終了してから30分カウントするので、少しずつずれる。改善したほうがいいかも
exports.ojioji_bot = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
  main()
  return null
});
