const artistContainer = document.querySelector('.artist-list');

let artistData = [
  {
    id: 1,
    img: 'artist/singer2.jpg',
    name: 'Singer 1'
  },
  {
    id: 2,
    img: 'artist/singer3.jpg',
    name: 'Singer 2'
  },
  {
    id: 3,
    img: 'artist/SPB.jpg',
    name: 'SPB'
  },
];

artistData.forEach(artist => {
  const listItem = document.createElement('li');
  
  const image = document.createElement('img');
  image.src = artist.img;
  image.alt = artist.name;
  
  listItem.appendChild(image);
  artistContainer.appendChild(listItem);
});
