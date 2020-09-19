const puppeteer = require('puppeteer');

let scrape = async(url) => {
	const browser = await puppeteer.launch({
		waitUntil: 'load',
		timeout: 0,
		args: ['--no-sandbox', '--disabled-setuid-sandbox']});
	const reviewPage = await browser.newPage();

	await reviewPage.goto(url, {waitUntil: 'networkidle2'});
	await reviewPage.waitForSelector('.widget-pane-visible');

	const metadata = await reviewPage.evaluate(() => {
		let aggregateRating = document.querySelector('div.gm2-display-2').innerText;
		let totalReviews = Number(document.querySelector('div.gm2-caption').innerText.split(" ")[0]);
		return {
			aggregateRating,
			totalReviews,
		}
	});

	// NOTE: need to wrap this in a loop, to get all reviews
	/*const reviews = await reviewPage.evaluate(() => {
		let fullName = document.querySelector('.section-review-title').innerText;
		let postDate = document.querySelector('.section-review-publish-date').innerText;
		let starRating = document.querySelector('.section-review-stars').getAttribute('aria-label');
		let postReview = document.querySelector('.section-review-text').innerText;

		return {
			fullName,
			postDate,
			starRating,
			postReview
		}
	});*/

	// Scroll till all reviews loaded
	let countReviews = await reviewPage.evaluate(() => {
		return Number(document.querySelectorAll(".section-review-content").length);
	});

	// TODO: Fix loop
	while (countReviews < metadata.totalReviews) {
		let prevHeight = await reviewPage.evaluate(() => {
			return document.querySelector(".section-scrollbox.scrollable-y.scrollable-show").scrollHeight;
		});
		await reviewPage.evaluate(() => {
			let scrollArea = document.querySelector(".section-scrollbox.scrollable-y.scrollable-show");
			scrollArea.scrollTo(0, scrollArea.scrollHeight);
		});
		await reviewPage.waitForFunction(`document.querySelector('.section-scrollbox.scrollable-y.scrollable-show').scrollHeight>${prevHeight}`, { timeout:0});
		await reviewPage.waitForTimeout(100);
		countReviews = await reviewPage.evaluate(() => {
			return Number(document.querySelectorAll(".section-review-content").length);
		});
	}

	// Scrape
	const reviews = await reviewPage.evaluate(() => {
		// Fetch all reviews
		let fullNameElements = document.getElementsByClassName('section-review-title');
		let fullNames = [];
		for (let element of fullNameElements) {
			fullNames.push(element.innerText);
		}
		let postDateElements = document.getElementsByClassName('section-review-publish-date');
		let postDates = [];
		for (let element of postDateElements) {
			postDates.push(element.innerText);
		}

		let starRatingElements = document.getElementsByClassName('section-review-stars');
		let starRatings = [];
		for (let element of starRatingElements) {
			starRatings.push(element.getAttribute('aria-label').charAt(1));
		}

		let postReviewElements = document.getElementsByClassName('section-review-text');
		let postReviews = [];
		for (let element of postReviewElements) {
			if (element.tagName.toLowerCase()==='span') {
				postReviews.push(element.innerText);
			}
		}

		return {
			// countReviews,
			fullNames,
			postDates,
			starRatings,
			postReviews
		}
	});

	// Restructure data for easy csv conversion
	let data = [];
	for (let i=0; i<countReviews; i++) {
		data.push({
			'fullNames': reviews.fullNames[i],
			'postDates': reviews.postDates[i],
			'starRatings': reviews.starRatings[i],
			'postReviews': reviews.postReviews[i],
			'totalReviews': metadata.totalReviews,
			'aggregateRating': metadata.aggregateRating
		});
	}

	browser.close();

	return {
		metadata,
		countReviews,
		data
	};
};

// scrape('https://www.google.com/maps/place/Enhanze+Medical+Aesthetics+%26+Laser+Clinic/@3.126224,101.6415473,17z/data=!4m7!3m6!1s0x31cc49695e894d4d:0xdd00855b10491174!8m2!3d3.126224!4d101.643736!9m1!1b1')
// 	.then(result=> {console.log(result)});

exports.scrape = scrape;
