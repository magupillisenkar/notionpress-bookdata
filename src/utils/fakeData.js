export const generateFakeBooks = () => {
  const books = []
  for (let i = 0; i < 100; i++) {
    books.push({
      Title: `Book Title ${i + 1}`,
      Author: `Author ${i + 1}`,
      Genre: ['Fiction', 'Sci-Fi', 'Fantasy', 'Non-fiction'][i % 4],
      PublishedYear: 2000 + (i % 20),
      ISBN: `978-3-16-${1000000 + i}`,
    })
  }
  return books
}
