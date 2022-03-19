// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
var store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers: ", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		}

		// Podracer form field
		if (target.matches('.card.podracer')) {
			handleSelectPodRacer(target)
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate()
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {


	// TODO - Get player_id and track_id from the store
	const player_id = store.player_id;
	const track_id = store.track_id;

	// const race = TODO - invoke the API call to create the race, then save the result
	// Improvement 01 - use try catch
	try {
		const race = await createRace(player_id, track_id)

		// TODO - update the store with the race id
		// Needs to be -1 since it is an array...
		console.log("Race ID: ", race.ID);
		store.race_id = race.ID - 1;

		// render starting UI
		// There was no TODO, but this also needs to be updated says the debugger...
		renderAt('#race', renderRaceStartView(track_id));

		// For the API to work properly, the race id should be race id - 1
		// I found out, but reading also helps...

		// The race has been created, now start the countdown
		// TODO - call the async function runCountdown
		await runCountdown();

		// TODO - call the async function startRace
		await startRace(store.race_id);

		// TODO - call the async function runRace
		await runRace(store.race_id);
	} catch (error) {console.log(`There was an error in creating the race: ${error}`)}

}

function runRace(raceID) {
	return new Promise(resolve => {
	// TODO - use Javascript's built in setInterval method to get race info every 500ms
	// I am so... tried to start with the promise again...
		const raceInterval = setInterval(async () => {

			try {
				// Without autocomplete from visual studio I would have never made this - thanks MS
				console.log("RaceID: ", raceID)
				const res = await getRace(raceID)

				// TODO - if the race info status property is "in-progress", update the leaderboard by calling:
				// renderAt('#leaderBoard', raceProgress(res.positions))
				// ?? I am coding in the wild - I have no intel on the API and guessing status does exist and "in-progress" and "finished", too
				// Now, I found it on the interwebs - it is at the instructions...
				// That was easy, but it also works with postman...

				if (res.status === "in-progress") {
					// this means race will be renamed to res...
					renderAt('#leaderBoard', raceProgress(res.positions));
				}

				// TODO - if the race info status property is "finished", run the following:
				// clearInterval(raceInterval) // to stop the interval from repeating
				// renderAt('#race', resultsView(res.positions)) // to render the results view
				// reslove(res) // resolve the promise => guess this means resolve(res)...
				if (res.status === "finished") {
					// this means race will be renamed to res...
					renderAt('#leaderBoard', raceProgress(res.positions));
					// This means I have to rename my countDown to raceInterval
					clearInterval(raceInterval);
					renderAt('#race', resultsView(res.positions));
					resolve(res);
				}
				if (res.status !== "in-progress" && res.status !== "finished") {
					clearInterval(raceInterval);
					resolve(res);
				}	
			} 
			// remember to add error handling for the Promise
			// Sure thing...
			catch (error) {console.log('Houston we have a problem: ', error)}
		}, 500)

	})

}

async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(1000)
		let timer = 3

		return new Promise(resolve => {
			// TODO - use Javascript's built in setInterval method to count down once per second

			const countDown = setInterval(() => {
				// Greater 0 makes the most sense otherwise you could have negative values
				if (timer > 0){

					// run this DOM manipulation to decrement the countdown for the user
					document.getElementById('big-numbers').innerHTML = --timer
					console.log(timer);

				} else {

					// TODO - if the countdown is done, clear the interval, resolve the promise, and return
					clearInterval(countDown);
					resolve();
				}
			}, 1000) 

		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected racer to the store
	// Easy - I know this from the last
	store.player_id = parseInt(target.id);
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// TODO - save the selected track id to the store
	// Since it says up there target.id in the console log, this must be it
	// And by the way I love the autocomplete from visual studio, it automatically basically selects everything itself
	// Easy if you have visual studio and the info from the console.log
	store.track_id = parseInt(target.id);
	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// TODO - Invoke the API call to accelerate
	// This is so embarrasing - I am doing it from bottom up and to find out about the store you have to read from upside down...
	// And it also seems to be race_id and not just id...
	accelerate(store.race_id)
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === store.player_id)
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	// Easy - method GET is explicitly selected but not necessary

	return fetch(`${SERVER}/api/tracks`)
	.then(res => res.json())
	.catch(err => console.log('Error getting the tracks: ', err))
}

function getRacers() {
	// GET request to `${SERVER}/api/cars`

	return fetch(`${SERVER}/api/cars`)
	.then(res => res.json())
	.catch(err => console.log('Error getting racers: ', err))
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	console.log("JSON", JSON.stringify(body));
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request: ", err))
}

function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`

	return fetch(`${SERVER}/api/races/${id}`)
	.then(res => res.json())
	.catch(err => console.log('Error with fetching race id: ', err))
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`,{
		method: 'POST',
		...defaultFetchOpts()
	})
	.catch(err => console.log("Problem with getRace request::", err))
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	// options parameter provided as defaultFetchOpts
	// no body or datatype needed for this request
	//Easy

	return fetch(`${SERVER}/api/races/${id}/accelerate`,{
		method: 'POST',
		...defaultFetchOpts()
	})
	.catch(err => console.log('Problem with the acceleration: ', err))
}
