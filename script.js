const list = document.querySelector(".js-list");
// const load = document.querySelector(".js-load");
const guard = document.querySelector(".js-guard");

const KEY = "w3kHq_TfVkoA4iwhrcqa";
const BASE_URL = "https://the-one-api.dev/v2";
const options = {
	root: null,
	rootMargin: "300px",
	threshhold: 1.0,
};

const observer = new IntersectionObserver(onInfinityLoad, options);

let page = 1;

// load.addEventListener("click", onLoad);

function ringsApi(page = 1) {
	const options = {
		headers: {
			Authorization: `Bearer ${KEY}`,
		},
	};
	const resp = fetch(`${BASE_URL}/character?limit=50&page=${page}`, options)
		.then((resp) => {
			if (!resp.ok) {
				throw new Error(resp.statusText);
			}
			return resp.json();
		})
		.catch((err) => console.log(err));

	return resp;
}

ringsApi()
	.then((data) => {
		createMarkup(data.docs);
		// load.hidden = false;
		observer.observe(guard);
	})
	.catch((err) => console.log(err));

function createMarkup(arr) {
	const markup = arr
		.map(
			({ name, race }) => `<li class="item">
                <h2>Name: ${name}</h2>
                <h3>Race: ${race}</h3>
            </li>`
		)
		.join("");

	list.insertAdjacentHTML("beforeend", markup);
}

// function onLoad() {
// 	page += 1;
// 	ringsApi(page)
// 		.then((data) => {
// 			createMarkup(data.docs);
// 			if (data.page === data.pages) {
// 				load.hidden = true;
// 			}
// 		})
// 		.catch((err) => console.log(err));
// }
function onInfinityLoad(entries, observer) {
	console.log(entries);
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			page += 1;
			ringsApi(page).then((data) => {
				createMarkup(data.docs);
				if (data.page === data.pages) {
					observer.unobserve(guard);
				}
			});
		}
	});
}
