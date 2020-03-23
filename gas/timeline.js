

const main = () => {
  const Twitter = require('twitter')
  const client = new Twitter({
    consumer_key: 'AS1uM2wpspUTCrG3Vfc2kOe3H',
    consumer_secret: 'RrzMUSbsqN1ATiErUfMxQyUPzoqkse7IMmQYfHLAwVxWNFm8v1',
    access_token_key: '1241290833409634304-TjbbWHN3n7U1ThmP4Ef3fkeUCPKA2V',
    access_token_secret: 'S5i0yFwRyxig3TOehQzdHG5OHM2vBLjQal7c71Na3sPgg'
  })
  const param = {screen_name: 'ojioji_bot'};
  client.get('statuses/user_timeline',param, (error, tweets, response) => {
  if (!error) {
    //console.log(tweets);
    const fs = require('fs')
    const json = JSON.stringify(tweets,null,4)
    fs.writeFileSync('timeline.json',json,()=>{
      console.log('fs wrote')
    })
    tweets.forEach((item, i) => {
      console.log(`${i} : ${item.created_at}`)
    });

  }
})
}
main()
