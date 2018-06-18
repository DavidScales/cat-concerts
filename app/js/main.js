/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Register the service worker

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('Service worker registered! 😎');
      }).catch(err => {
        console.log('Service worker registration failed 😔', err);
      });
  });
}

// Add elements to the UI

const container = document.getElementById('container');
const appendCard = data => {
  const item =
    `<li class="card">
       <div class="card-text">
         <h2>${data.band}</h2>
         <h4>${data.date}</h4>
         <h4>${data.city}</h4>
         <p>${data.note}</p>
         <div class="flex">
           <p>Posted by: <strong>${data.user}</strong></p>
           <img src="/images/profiles/user-${data.user}.jpg"
                alt="User photo for ${data.user}"
                class="profile">
         </div>
       </div>
     </li>`;
  container.insertAdjacentHTML('beforeend', item);
};

// Use Firestore

const config = {
  apiKey: 'AIzaSyAR2eYF293c1klsZpr1zhuKx-k9E6u_lq8',
  authDomain: 'firestore-lab-c9a6a.firebaseapp.com',
  databaseURL: 'https://firestore-lab-c9a6a.firebaseio.com',
  projectId: 'firestore-lab-c9a6a',
  storageBucket: 'firestore-lab-c9a6a.appspot.com',
  messagingSenderId: '887760680815'
};
firebase.initializeApp(config);

let db;
firebase.auth().signInAnonymously()
.then(() => {
  firebase.firestore().enablePersistence()
    .then(() => {
      db = firebase.firestore();
      db.collection('concerts')
        .onSnapshot({includeQueryMetadataChanges: true}, snapshot => {
          snapshot.docChanges.forEach(change => {
            if (change.type === 'added') {
              appendCard(change.doc.data());
            }
          });
          if (snapshot.metadata.fromCache) {
            console.log('Retrieved data from local cache 😀');
          } else {
            console.log('Data is synced with the server! 💪');
          }
        });

    });
}).catch(err => {
  console.log('Something\'s wrong with our firebase code 😕', err);
});

// Add new cards to UI & Firestore

const scrollButton = document.getElementById('scroll-button');
const addButton = document.getElementById('add-button');
const addConcert = event => {
  event.preventDefault();
  const data = {
    band: document.getElementById('band').value,
    date: document.getElementById('date').value,
    city: document.getElementById('city').value,
    note: document.getElementById('note').value,
    user: 'anonymous'
  };
  db.collection('concerts').add(data)
    .then(docRef => {
      console.log('👍 Document written with ID: ', docRef.id);
      form.style.display = 'none';
      scrollButton.style.display = 'inline-block';
    }).catch(err => {
      console.error('Error adding document 😞', err);
    });
};
addButton.addEventListener('click', addConcert);

// Scroll to form

const form = document.getElementById('form');
const scrollToForm = () => {
  scrollButton.style.display = 'none';
  form.style.display = 'flex';
  form.scrollIntoView(true);
};
scrollButton.addEventListener('click', scrollToForm);
