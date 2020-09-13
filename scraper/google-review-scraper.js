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

	while (countReviews < metadata.totalReviews) {

		let prevHeight = await reviewPage.evaluate(() => {
			return document.querySelector(".section-scrollbox.scrollable-y.scrollable-show").scrollHeight;
		});
		await reviewPage.evaluate(() => {
			let scrollArea = document.querySelector(".section-scrollbox.scrollable-y.scrollable-show");
			scrollArea.scrollTo(0, scrollArea.scrollHeight);
		});
		await reviewPage.waitForFunction(`document.querySelector('.section-scrollbox.scrollable-y.scrollable-show').scrollHeight>${prevHeight}`);
		await reviewPage.waitForTimeout(100);
		countReviews = await reviewPage.evaluate(() => {
			return document.querySelectorAll(".section-review-content").length;
		});
	}

	// Scrape
	const reviews = await reviewPage.evaluate(() => {
		let countReviews = Number(document.querySelectorAll(".section-review-content").length);
		// Fetch all reviews
		let fullNameElements = document.getElementsByClassName('section-review-title');
		let fullNames = [];
		for (let elements of fullNameElements) {
			fullNames.push(elements.innerText);
		}
		let postDateElements = document.getElementsByClassName('section-review-publish-date');
		let postDates = [];
		for (let elements of postDateElements) {
			postDates.push(elements.innerText);
		}

		let starRatingElements = document.getElementsByClassName('section-review-stars');
		let starRatings = [];
		for (let elements of starRatingElements) {
			starRatings.push(elements.getAttribute('aria-label').charAt(1));
		}

		let postReviewElements = document.getElementsByClassName('section-review-text');
		let postReviews = [];
		for (let elements of postReviewElements) {
			postReviews.push(elements.innerText);
		}

		return {
			countReviews,
			fullNames,
			postDates,
			starRatings,
			postReviews
		}
	});

	// TODO: Export to csv for analysis
	let data = [];
	for (var i=0; i<countReviews; i++) {
		data.push({
			'fullNames': reviews.fullNames[i],
			'postDates': reviews.postDates[i],
			'starRatings': reviews.starRatings[i],
			'postReviews': reviews.postReviews[i]
		});
	};

	browser.close();

	return {
		metadata,
		countReviews,
		data
	};
};

exports.scrape = scrape;
