import firebase from './firebase';
import SimplePeer from 'simple-peer';

let user = false;

const initiate = ()=> {
  console.log('initiate !!!', user);

  var isAnonymous = user.isAnonymous;
  var uid = user.uid;

  console.log('onAuthStateChanged', isAnonymous, uid);

  var peer1 = new SimplePeer({initiator: true});

  firebase.database().ref(`join/${uid}`).on('value', snap=> {
    const v = snap.val();

    if (!v) {
      console.log('NO VALUE', v);
      return;
    }


    console.log('got value from other peer', v);

    const timeAgo = ((new Date()).getTime() - v.time) / 1000;
    if (timeAgo > 4000) {
      console.log('too long ago ignore');
    }
    else {
      v.signals.forEach(signal=>peer1.signal(signal));
    }
  });

  const signals = [];
  peer1.on('signal', data => {

    signals.push(data);

    if (signals.length === 2) {
      firebase.database().ref('init/' + uid).set(signals);
    }
  });

  peer1.on('connect', ()=> {
    console.log('hey peer2, how is it going?');
    peer1.send('hey peer2, how is it going?');
  });

  peer1.on('data', function (data) {
    console.log('got a message from peer2: ' + data)
  });

};

const joinClient = async token=> {
  const signal = await firebase.database().ref('init/' + token).once('value');
  console.log(signal.val(), signal.key);


  var peer2 = new SimplePeer({initiator: false});

  signal.val().forEach(signal=>peer2.signal(signal));

  const signals = [];
  peer2.on('signal', (data) => {
    signals.push(data);

    if (signals.length === 2)
      firebase.database().ref('join/' + token).set({time: (new Date()).getTime(), signals});
  });

  peer2.on('connect', function () {
    // wait for 'connect' event before using the data channel
    console.log('Per2 send hey per1 how go it?');
    peer2.send('hey peer1, how is it going?')
  });

  peer2.on('data', function (data) {
    console.log('got a message from peer1: ' + data)
  });


};

firebase.auth().onAuthStateChanged(u => {
  if (u) {
    user = u;

    const path = window.location.pathname.substring(1);

    const join = path.startsWith('join');

    if (!join) {
      console.log(`${window.location.origin}/join/${user.uid}`);
      initiate();
    }
    else {
      joinClient(path.replace('join/', ''));
    }


  } else {
    console.log('user signed out ..........');
  }
});


window.setTimeout(()=> {
  console.log('AUTH CCC');
  if (!user) {
    console.log('no user so sign in anonymously');
    firebase.auth().signInAnonymously().catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(error);
    });
  }
}, 5000);


export default {

  initiate(){


  }
}