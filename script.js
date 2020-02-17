// grab DOM elments
const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');

const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) {
  // this is one way to do a promise
  // fetch(`${apiURL}/suggest/${term}`)
  //   .then(res => res.json())
  //   .then(data => console.log(data));

  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  // console.log(data);

  // call a function to work with the data
  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  // // this is one way to do it, map() is another
  // let output = '';

  // data.data.forEach(song => {
  //   output += `
  //   <li>
  //     <span><strong>${song.artist.name}</strong> - ${song.title}</span>
  //     <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
  //   </li>
  //   `;
  // });

  // result.innerHTML = `
  //   <ul class="songs">
  //     ${output}
  //   </ul>
  // `;

  // now doing it with a map()
  // this way doesn't reauire initializing a variable, looping through the songs and then append to the variable
  // here we are just directly settng the result and just mapping the data and using a join at the end
  result.innerHTML = `
  <ul class="songs">
    ${data.data.map(song =>
      `
    <li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>
    `
    ).join('')}
  </ul>
  `;

  // create paginations
  // if there is a previous or next
  // ternarary operator to check for prev and do something if so
  // ternarary operator to check for next and do something if so
  if(data.prev || data.next) {
    more.innerHTML = `
      ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
      ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
    `
  } else {
    more.innerHTML = '';
  }
}

// get prev and next songs
async function getMoreSongs(url) {
  // using herokuapp to get around cors error. This is a proxy
  // See: https://github.com/Rob--W/cors-anywhere
  // we add the proxy and then our url
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  // console.log(data);
  
  // clean up the returned lyrics
  // search for any combination caret return or new line
  // if we find that, replace with an html line break
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `
  <h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>
  `;

  more.innerHTML = '';
}


// Event Listeners
form.addEventListener('submit', e => {
  e.preventDefault();

  // get the value, trim extra space, assign to searchTerm variable
  const searchTerm = search.value.trim();
  // console.log(searchTerm);
  if (!searchTerm) {
    alert('Please type in a search search term.');
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});