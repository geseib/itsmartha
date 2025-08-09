// Art and Poetry data
// Martha's art collection with complementary poetry

export const artCollection = [
  {
    id: 1,
    image: '/img/IMG_4353.png',
    orientation: 'portrait',
    poetry: 'The world is but a canvas to our imagination.',
    author: 'Henry David Thoreau'
  },
  {
    id: 2,
    image: '/img/IMG_4354.png',
    orientation: 'portrait',
    poetry: 'Art washes away from the soul the dust of everyday life.',
    author: 'Pablo Picasso'
  },
  {
    id: 3,
    image: '/img/IMG_4355.png',
    orientation: 'portrait',
    poetry: 'Every artist dips his brush in his own soul, and paints his own nature into his pictures.',
    author: 'Henry Ward Beecher'
  },
  {
    id: 4,
    image: '/img/IMG_4356.png',
    orientation: 'portrait',
    poetry: 'Art is not what you see, but what you make others see.',
    author: 'Edgar Degas'
  },
  {
    id: 5,
    image: '/img/IMG_4357.png',
    orientation: 'portrait',
    poetry: 'The purpose of art is washing the dust of daily life off our souls.',
    author: 'Pablo Picasso'
  },
  {
    id: 6,
    image: '/img/IMG_4358.png',
    orientation: 'portrait',
    poetry: 'Life beats down and crushes the soul and art reminds you that you have one.',
    author: 'Stella Adler'
  },
  {
    id: 7,
    image: '/img/IMG_4359.png',
    orientation: 'portrait',
    poetry: 'Art enables us to find ourselves and lose ourselves at the same time.',
    author: 'Thomas Merton'
  },
  {
    id: 8,
    image: '/img/IMG_4360.png',
    orientation: 'portrait',
    poetry: 'Color is my daylong obsession, joy, and torment.',
    author: 'Claude Monet'
  },
  {
    id: 9,
    image: '/img/IMG_4361.png',
    orientation: 'portrait',
    poetry: 'I dream my painting and I paint my dream.',
    author: 'Vincent van Gogh'
  },
  {
    id: 10,
    image: '/img/IMG_4362.png',
    orientation: 'portrait',
    poetry: 'Art is the lie that enables us to realize the truth.',
    author: 'Pablo Picasso'
  },
  {
    id: 11,
    image: '/img/IMG_4363.png',
    orientation: 'portrait',
    poetry: 'Painting is poetry that is seen rather than felt.',
    author: 'Leonardo da Vinci'
  },
  {
    id: 12,
    image: '/img/IMG_4364.png',
    orientation: 'portrait',
    poetry: 'Art should comfort the disturbed and disturb the comfortable.',
    author: 'Cesar A. Cruz'
  },
  {
    id: 13,
    image: '/img/IMG_4365.png',
    orientation: 'portrait',
    poetry: 'The artist is nothing without the gift, but the gift is nothing without work.',
    author: 'Emile Zola'
  },
  {
    id: 14,
    image: '/img/IMG_4366.png',
    orientation: 'portrait',
    poetry: 'Art is the most intense mode of individualism that the world has known.',
    author: 'Oscar Wilde'
  },
  {
    id: 15,
    image: '/img/IMG_4367.png',
    orientation: 'portrait',
    poetry: 'The aim of art is to represent not the outward appearance of things, but their inward significance.',
    author: 'Aristotle'
  },
  {
    id: 16,
    image: '/img/IMG_4368.png',
    orientation: 'portrait',
    poetry: 'Art is not freedom from discipline, but disciplined freedom.',
    author: 'John F. Kennedy'
  },
  {
    id: 17,
    image: '/img/IMG_4369.png',
    orientation: 'portrait',
    poetry: 'Every child is an artist. The problem is how to remain an artist once we grow up.',
    author: 'Pablo Picasso'
  },
  {
    id: 18,
    image: '/img/IMG_4370.png',
    orientation: 'portrait',
    poetry: 'Art is the stored honey of the human soul.',
    author: 'Theodore Dreiser'
  },
  {
    id: 19,
    image: '/img/IMG_4371.png',
    orientation: 'portrait',
    poetry: 'The earth without art is just "eh".',
    author: 'Unknown'
  },
  {
    id: 20,
    image: '/img/IMG_4372.png',
    orientation: 'portrait',
    poetry: 'Art speaks where words are unable to explain.',
    author: 'Unknown'
  },
  {
    id: 21,
    image: '/img/IMG_4373.png',
    orientation: 'portrait',
    poetry: 'Creativity takes courage.',
    author: 'Henri Matisse'
  },
  {
    id: 22,
    image: '/img/IMG_4374.png',
    orientation: 'portrait',
    poetry: 'Art is the journey of a free soul.',
    author: 'Alev Oguz'
  },
  {
    id: 23,
    image: '/img/IMG_4375.png',
    orientation: 'portrait',
    poetry: 'The purpose of art is not the release of a momentary ejection of adrenaline but is, rather, the gradual, lifelong construction of a state of wonder and serenity.',
    author: 'Glenn Gould'
  },
  {
    id: 24,
    image: '/img/IMG_4376.png',
    orientation: 'portrait',
    poetry: 'Art is the only way to run away without leaving home.',
    author: 'Twyla Tharp'
  },
  {
    id: 25,
    image: '/img/IMG_4377.png',
    orientation: 'portrait',
    poetry: 'Great art picks up where nature ends.',
    author: 'Marc Chagall'
  },
  {
    id: 26,
    image: '/img/IMG_4378.png',
    orientation: 'portrait',
    poetry: 'Art is the signature of civilizations.',
    author: 'Beverly Sills'
  },
  {
    id: 27,
    image: '/img/IMG_4379.png',
    orientation: 'portrait',
    poetry: 'The artist sees what others only catch a glimpse of.',
    author: 'Leonardo da Vinci'
  },
  {
    id: 28,
    image: '/img/IMG_4380.png',
    orientation: 'portrait',
    poetry: 'Art is a harmony parallel with nature.',
    author: 'Paul Cezanne'
  },
  {
    id: 29,
    image: '/img/IMG_4381.png',
    orientation: 'portrait',
    poetry: 'Painting is just another way of keeping a diary.',
    author: 'Pablo Picasso'
  },
  {
    id: 30,
    image: '/img/IMG_4382.png',
    orientation: 'portrait',
    poetry: 'Art is the child of nature; yes, her darling child, in whom we trace the features of the mother\'s face.',
    author: 'Henry Wadsworth Longfellow'
  }
];

export const getRandomArt = () => {
  const randomIndex = Math.floor(Math.random() * artCollection.length);
  return artCollection[randomIndex];
};