let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database.ref('/AnswerofSurveys/{userid}/{surveyname}/Answers/{sendid}')
    .onCreate((snap, context) => {
                   
        const receiverUid = context.params.userid;
       const surveyname = context.params.surveyname;
        console.log('alan id',receiverUid);
     
     
  
       const getInstanceIdPromise = admin.database().ref(`/users/${receiverUid}/instanceId`).once('value');
        const getReceiverUidPromise = admin.auth().getUser(receiverUid);

        return Promise.all([getInstanceIdPromise, getReceiverUidPromise]).then(results => {
            const instanceId = results[0].val();
            const receiver = results[1];
          

            const payload = {
                notification: {
                   
                    body: surveyname,
                   
                }
            };

            admin.messaging().sendToDevice(instanceId, payload)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });
        });


    }); 
