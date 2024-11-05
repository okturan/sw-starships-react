export const fetchStarships = async () => {
  const starships = [];
  let url = "https://swapi.dev/api/starships/";

  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    starships.push(...data.results);
    url = data.next;
  }

  return starships;
};
