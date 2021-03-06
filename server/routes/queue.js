const { Center } = require("../models/Center");
const { User } = require("../models/User");
const verify = require("../verify");

const verify = async (req) => {
  const token = req.header("auth-token");
  if (!token) res.status(401).json({ mssg: "no token found", status: 1 });
  try {
    const verify = await jwt.verify(token, config.jwt_secret);
    return verify;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const addToQ = async (token, center_name, time) => {
  const userid = await verify(token);
  const user = await User.findOne({ _id: userid, center: center_name });
  if (!user)
    return { error: 1, mssg: `Not this center, your center is ${user.center}` };
  const center = await Center.findOne({ name: center_name });
  if (time.getHours() > user.slot.getHours() + 1)
    return { error: 1, mssg: `Missed your slot` };

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        queue_no: center.queue.length + 1,
        entry_time: time,
      },
    },
    { new: true }
  );
  return updatedUser;
};

// ,
//         estimated_time: new Date(
//           time.getTime() + center.queue.length * 5 * 60000
//         ),

const calculateEstimatedTime = async (center_name) => {
  const users = await User.find({ center: center_name });
  const center = await Center.find({ name: center_name });
};

const updateQ = async (center_name) => {
  const users = await User.find({ center: center_name });
  const center = await Center.find({ name: center_name });
};

const notify = async (notify_id, title, mssg) => {
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization:
        "key=AAAA17rD_-Q:APA91bE92fSSSJZO9LmGtShC8v43wiAUldddG-Dt572cP9nciVmDJ4CmHJiM5yGMsQOdC-EXKAm5C8FjDLrnd4eG62NX0RDnTzXJ5MJDOAW6p8vrnjqj0aqpKmrKpfCN9SlTD1NtYH3J",
    },
  };
  axios
    .post(
      "https://fcm.googleapis.com/fcm/send",
      {
        registration_ids: [notify_id],
        notification: {
          sound: "default",
          body: mssg,
          title: title,
          image: url,
          icon:
            "https://res.cloudinary.com/sankarkvs/image/upload/v1613555633/manager_prv1ox.png",
          content_available: true,
          priority: "high",
        },
        data: {
          sound: "default",
          body: mssg,
          title: title,
          image: url,
          icon:
            "https://res.cloudinary.com/sankarkvs/image/upload/v1613555633/manager_prv1ox.png",
          content_available: true,
          priority: "high",
        },
      },
      config
    )
    .then((res) => {
      document.location.reload();
    })
    .catch((err) => {
      alert("Something went wrong");
    });
};

const dischargeQ = async (user_id) => {
  const user = await User.findByIdAndUpdate(user_id, {
    $set: { queue_no: -2, estimated_time: null },
  });
  const center = await Center.findOneAndUpdate(
    { name: user.center },
    { $pull: { queue: user_id } },
    { new: true }
  );
  for (var i = 0; i < center.queue.length; i++) {
    let user = await User.findByIdAndUpdate(center.queue[i], {
      $inc: { queue_no: -1 },
    });
    if (user.queue_no >= 15) {
      notify(user.notify_id);
    }
  }
};

module.exports = { addToQ };

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="https://www.gstatic.com/firebasejs/8.4.2/firebase-analytics.js"></script>

// <script>
//   // Your web app's Firebase configuration
//   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
//   var firebaseConfig = {
//     apiKey: "AIzaSyCgdoGOesEWA9xf4SYbfTm9m1TOH4WgpJ4",
//     authDomain: "vacciq-90b12.firebaseapp.com",
//     projectId: "vacciq-90b12",
//     storageBucket: "vacciq-90b12.appspot.com",
//     messagingSenderId: "926551375844",
//     appId: "1:926551375844:web:2fd80e0af934a7cdad11f1",
//     measurementId: "G-Y2DX6SPSJ7"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
// </script>
