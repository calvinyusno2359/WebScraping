const puppeteer = require('puppeteer');

let scrape = async(url) => {
	const browser = await puppeteer.launch({
		waitUntil: 'load',
		timeout: 0,
		args: ['--no-sandbox', '--disabled-setuid-sandbox']});
	const reviewPage = await browser.newPage();

	await reviewPage.goto(url, {waitUntil: 'networkidle2'});
	await reviewPage.waitForSelector('.widget-pane-visible')

	const metadata = await reviewPage.evaluate(() => {
		let aggregateRating = document.querySelector('.gm2-display-2').innerText;
		let totalReviews = document.querySelector('.gm2-caption').innerText;

		return {
			aggregateRating,
			totalReviews,
		}
	})

	// NOTE: nned to wrap this in a loop, to get all reviews
	const reviews = await reviewPage.evaluate(() => {
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
	});

	browser.close();

	return {
		metadata,
		reviews
	};
};

exports.scrape = scrape;
