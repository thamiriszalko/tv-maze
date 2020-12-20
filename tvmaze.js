/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let showsList = [];
  for (let data of response.data) {
    const img = data.show.image ? data.show.image.medium : "https://tinyurl.com/tv-missing";
    const showData = {
      id: data.show.id,
      name: data.show.name,
      summary: data.show.summary,
      image: img,
    }
    showsList.push(showData);
  }

  return showsList;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
            <div class="card" data-show-id="${show.id}">
                <img class="card-img-top" src="${show.image}">
                <div class="card-body">
                    <h5 class="card-title">${show.name}</h5>
                    <p class="card-text">${show.summary}</p>
                    <button data-target="#exampleModal" data-show-id="${show.id}" data-toggle="modal" class="btn btn-primary btn-block">Episodes</button>
                </div>
            </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodeList = [];
  for (let data of response.data) {
    const episodeData = {
      id: data.id,
      name: data.name,
      season: data.season,
      number: data.number,
    }
    episodeList.push(episodeData);
  }
  return episodeList;
}

$("#shows-list").on("click","button", async function handleSearch (e) {
  const $button = $(e.target);
  const showId = $button.data('show-id');
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});

function populateEpisodes(episodes) {
  $("#episodes-area").show();
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li>${episode.name} (Season ${episode.season}, episode ${episode.number})</li>
      `);

    $episodesList.append($item);
  }
}