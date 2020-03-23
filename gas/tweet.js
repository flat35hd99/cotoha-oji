const main = () => {
  const Twitter = require('twitter')
  //@ojioji_bot
  const client = new Twitter({
    consumer_key: 'AS1uM2wpspUTCrG3Vfc2kOe3H',
    consumer_secret: 'RrzMUSbsqN1ATiErUfMxQyUPzoqkse7IMmQYfHLAwVxWNFm8v1',
    access_token_key: '1241290833409634304-TjbbWHN3n7U1ThmP4Ef3fkeUCPKA2V',
    access_token_secret: 'S5i0yFwRyxig3TOehQzdHG5OHM2vBLjQal7c71Na3sPgg'
  })

  const msg = 'This is a test'
  client.post('statuses/update', {status: msg},  (error, tweet, response) => {
    if(error) console.log(error);
    console.log(tweet);  // Tweet body.
    console.log(response);  // Raw response object.
  });
}
main()
