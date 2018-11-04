const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firestore);
/*
function findToken(userid){
	const userRef = db.collection('New_Users');
		query = userRef.where('uid', '==', userid).get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					console.log(doc.id, '=>', doc.data());
					const token = doc.data().TOKEN;
					return sendNotification(token);
				});
				return true;
			})
			.catch(err => {
				console.log('Error getting documents', err);
				return true;
			});
}

function sendNotification(token){
	// the form is sending to individual device
	// See documentation on defining a message payload.
	const payload = {
		notification: {
			title: 'up 1.43% on the day',
			body: 'gained 11.80 points to close at 835.67, up 1.43% on the day.'
		  },
		};

	// Send a message to the device corresponding to the provided
	// registration token.
	return admin.messaging().sendToDevice(payload, token)
		.then((response) => {
		// Response is a message ID string.
			console.log('Successfully sent message:', response);
			return true;
		})
		.catch((error) => {
			console.log('Error sending message:', error);
			return true;
		});
}
*/
	// * Lisentening on the status on parking slot changed
	exports.createUser = functions.firestore
    .document('Parking_Areas/{slotId}')
    .onUpdate(event => {
		// Get an current object representing the document 
        // e.g. {'status': 'no', 'Car_parked': 'กก 109'}
        const newValue = event.data.data();

        // access a particular field as you would any JS property
        const car = newValue.Car_parked;

		const CarQuery = db.collection('Cars').where('License_Plate_Number', '==', car).get();
			.then(snapshot => {
				snapshot.forEach(doc => {
					console.log(doc.id, '=>', doc.data());
					const userid = doc.data().UID;
				});
				return userid;
			})
			.catch(err => {
				console.log('Error getting documents', err);
				return true;
			});
		
		return Premise.all([userid]).then((results) => {
			const uid = results[0];

			const UserQuery = db.collection('New_Users').where('uid', '==', uid).get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						console.log(doc.id, '=>', doc.data());
						const token = doc.data().TOKEN;
					});
					return token;
				})
				.catch(err => {
					console.log('Error getting documents', err);
					return true;
				});

			return Premise.all([token]).then((results) => {
				const tokenSnapshot = results[0];

				// the form is sending to individual device
				// See documentation on defining a message payload.
				const payload = {
					notification: {
						title: 'up 1.43% on the day',
						body: 'gained 11.80 points to close at 835.67, up 1.43% on the day.'
					  },
					};

				// Send a message to the device corresponding to the provided
				// registration token.
				return admin.messaging().sendToDevice(payload, tokenSnapshot)
					.then((response) => {
					// Response is a message ID string.
						console.log('Successfully sent message:', response);
						return true;
					})
					.catch((error) => {
						console.log('Error sending message:', error);
						return true;
					});
			});
		});


        // This registration token comes from the client FCM SDKs.
		//const registrationToken = "f4rJaZjQklQ:APA91bGKvLwZl8JO03Et8GUQ_yNXd_2RYTkhZMWEZv5dHtUAF5Bw8fBydCvsK08kDcrq8KUaEgOi9fGwoYEJFKFbMSl6dvJAwj8mUpkYKh4i7dFGB1iZIKJXzmGJOy8ET-sn6YWaLhfA";
	});
