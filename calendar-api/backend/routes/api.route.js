const router = require('express').Router();
const { google } =   require('googleapis')

const GOOGLE_CLIENT_ID = '1021661647276-8n0ru3rbjvpak1pkvas7ilvrb8f8mn08.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const REFRESH_TOKEN = '1//0g9T7OPbm951wCgYIARAAGBASNwF-L9Ir8WIZo42nx57rszXCZf67v1IMyTnWCm6OWi5so4Os35VBZLJnnz-k5Cl5YOdzdWorp1U';

const oauth2Client = new google.auth.OAuth2(

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)
router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens',async(req,res,next)=>{

  try{

    const {code} = req.body;
    const {tokens} = await oauth2Client.getToken(code)
    res.send(tokens);

  }
  catch(error){

    next(error)
  }

 })

 router.post('/create-event',async(req,res,next)=>{

  try{

    const {summary,description,location,startDateTime,endDateTime} = req.body;
    oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN});
    const calendar = google.calendar('v3');
    const response  =await calendar.events.insert({
        auth:oauth2Client,
        calendarId:'primary',
        requestBody:{
          summary:summary,
          description:description,
          location:location,
          colorId:'7',
          start:{
            dateTime:new Date(startDateTime),
          },
          end:{
            dateTime:new Date(endDateTime),
          },

        },
    })

    res.send(response);
  }
  catch(error){
    next(error);
  }
 });

module.exports = router
