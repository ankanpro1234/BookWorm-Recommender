const fs = require('fs');
const path = require('path');

const adjectives = ["The Hidden", "Silent", "Lost", "Golden", "Dark", "Shattered", "Crimson", "Forgotten", "Midnight", "Broken", "Whispering", "Secret", "Fading", "Eternal", "Frozen"];
const nouns = ["City", "River", "Shadows", "Crown", "Throne", "Sands", "Sky", "Stars", "Forest", "Ocean", "Kingdom", "Echoes", "Light", "Dreams", "Secrets"];
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const categories = ["Fiction", "Mystery", "Sci-Fi", "Fantasy", "Romance", "Thriller", "Non-Fiction", "Biography", "History", "Self-Help"];
const covers = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1476275466078-4007374efac4?auto=format&fit=crop&q=80&w=400"
];

const descriptions = [
  "A breathtaking journey through uncharted territories.",
  "An in-depth look at a story that will change your perspective.",
  "A thrilling adventure that keeps you on the edge of your seat.",
  "Discover the secrets that have been hidden for centuries.",
  "A heartwarming tale of love, loss, and redemption.",
  "Dive into this masterpiece of modern literature.",
  "Uncover the truth behind the greatest mysteries.",
  "A compelling narrative that explores the human condition."
];

function getRandomItems(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const books = [];
for (let i = 1; i <= 1000; i++) {
  const title = `${getRandomItem(adjectives)} ${getRandomItem(nouns)}`;
  const author = `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`;
  const category = getRandomItem(categories);
  const cover = getRandomItem(covers);
  const description = getRandomItem(descriptions);
  const price = (Math.random() * 20 + 5).toFixed(2);
  const rating = (Math.random() * 2 + 3).toFixed(1);

  books.push({
    id: `book_${i}`,
    title,
    author,
    category,
    description,
    coverUrl: cover,
    price: parseFloat(price),
    averageRating: parseFloat(rating),
    reviewCount: Math.floor(Math.random() * 500)
  });
}

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'books.json'), JSON.stringify(books, null, 2));
console.log('Successfully generated 1000 books dataset.');
