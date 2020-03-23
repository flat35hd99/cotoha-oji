const main = () => {
  const Twitter = require('twitter')
  const fs = require('fs')
  //@ojioji_bot
  const client = new Twitter({
    consumer_key: 'AS1uM2wpspUTCrG3Vfc2kOe3H',
    consumer_secret: 'RrzMUSbsqN1ATiErUfMxQyUPzoqkse7IMmQYfHLAwVxWNFm8v1',
    access_token_key: '1241290833409634304-TjbbWHN3n7U1ThmP4Ef3fkeUCPKA2V',
    access_token_secret: 'S5i0yFwRyxig3TOehQzdHG5OHM2vBLjQal7c71Na3sPgg'
  })
  const bot_id = '1241290833409634300'
  client.get('followers/list',(e,followers,res)=>{
    const json = JSON.stringify(followers,null,4)
    fs.writeFileSync('followers.json',json,()=>{
      console.log('fs wrote')
    })
  })
}
main()
